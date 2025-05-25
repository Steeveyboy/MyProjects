// Base Asset Class - Abstract class for all financial instruments
class BaseAsset {
    constructor(id, name, assetType, faceValue, minPurchase = 1000) {
        if (new.target === BaseAsset) {
            throw new TypeError("Cannot construct BaseAsset instances directly");
        }
        
        this.id = id;
        this.name = name;
        this.assetType = assetType;
        this.faceValue = faceValue;
        this.minPurchase = minPurchase;
        this.purchaseDate = null;
        this.quantity = 0;
    }

    // Abstract methods - must be implemented by subclasses
    calculateValue(gameTime, marketConditions) {
        throw new Error("calculateValue method must be implemented by subclass");
    }

    getYield(marketConditions) {
        throw new Error("getYield method must be implemented by subclass");
    }

    getMaturityDate() {
        throw new Error("getMaturityDate method must be implemented by subclass");
    }

    // Common methods for all assets
    getDisplayInfo() {
        return {
            id: this.id,
            name: this.name,
            type: this.assetType,
            faceValue: this.faceValue,
            minPurchase: this.minPurchase
        };
    }

    setQuantity(quantity) {
        this.quantity = Math.max(0, quantity);
    }

    getTimeToMaturity(currentDate) {
        const maturityDate = this.getMaturityDate();
        if (!maturityDate) return null;
        
        const timeDiff = maturityDate.getTime() - currentDate.getTime();
        return Math.max(0, timeDiff / (1000 * 60 * 60 * 24 * 365)); // Years
    }
}

// Government Bond Class
class GovernmentBond extends BaseAsset {
    constructor(id, name, faceValue, couponRate, maturityYears, rating = 'AAA') {
        super(id, name, 'GOVERNMENT_BOND', faceValue);
        
        this.couponRate = couponRate;
        this.maturityYears = maturityYears;
        this.creditRating = rating;
        this.creditSpread = 0; // Government bonds have no credit spread
        this.callable = false;
        this.liquidity = 'high';
        this.inflationProtected = false;
        
        // Issue date (current game time when first created)
        this.issueDate = new Date();
    }

    calculateValue(gameTime, marketConditions) {
        const requiredYield = this.calculateRequiredYield(marketConditions);
        return this.calculateBondPrice(requiredYield);
    }

    calculateRequiredYield(marketConditions) {
        let requiredYield = marketConditions.treasuryRate / 100;
        
        // VIX impact on government bonds (flight to quality)
        const vixImpact = Math.max(0, (marketConditions.vix - 20) * -0.0001);
        requiredYield += vixImpact;
        
        // Inflation impact for TIPS
        if (this.inflationProtected) {
            requiredYield += marketConditions.inflation / 100;
        }
        
        return Math.max(0.001, requiredYield); // Minimum 0.1% yield
    }

    calculateBondPrice(ytm) {
        const periodsPerYear = 2; // Semi-annual
        const totalPeriods = this.maturityYears * periodsPerYear;
        const periodRate = ytm / periodsPerYear;
        const couponPayment = (this.faceValue * this.couponRate) / periodsPerYear;

        let price = 0;
        
        // Present value of coupon payments
        for (let i = 1; i <= totalPeriods; i++) {
            price += couponPayment / Math.pow(1 + periodRate, i);
        }
        
        // Present value of principal
        price += this.faceValue / Math.pow(1 + periodRate, totalPeriods);
        
        return price;
    }

    getYield(marketConditions) {
        const price = this.calculateValue(null, marketConditions);
        const annualCoupon = this.faceValue * this.couponRate;
        return annualCoupon / price; // Current yield approximation
    }

    getMaturityDate() {
        const maturityDate = new Date(this.issueDate);
        maturityDate.setFullYear(maturityDate.getFullYear() + this.maturityYears);
        return maturityDate;
    }

    getDuration(marketConditions) {
        const yield_ = this.getYield(marketConditions);
        // Simplified modified duration calculation
        const macaulayDuration = this.maturityYears * 0.85; // Approximation
        return macaulayDuration / (1 + yield_ / 2);
    }

    // Get next coupon payment date
    getNextCouponDate() {
        const now = new Date();
        const nextCoupon = new Date(this.issueDate);
        
        // Find next 6-month anniversary
        while (nextCoupon <= now) {
            nextCoupon.setMonth(nextCoupon.getMonth() + 6);
        }
        
        return nextCoupon;
    }

    // Calculate accrued interest
    getAccruedInterest(currentDate = new Date()) {
        const daysSinceLastCoupon = this.getDaysSinceLastCoupon(currentDate);
        const couponPayment = (this.faceValue * this.couponRate) / 2; // Semi-annual
        return (daysSinceLastCoupon / 182.5) * couponPayment; // Approximate 6 months = 182.5 days
    }

    getDaysSinceLastCoupon(currentDate) {
        const lastCouponDate = new Date(this.issueDate);
        
        // Find the most recent coupon date
        while (lastCouponDate <= currentDate) {
            const nextDate = new Date(lastCouponDate);
            nextDate.setMonth(nextDate.getMonth() + 6);
            if (nextDate > currentDate) break;
            lastCouponDate.setTime(nextDate.getTime());
        }
        
        const timeDiff = currentDate.getTime() - lastCouponDate.getTime();
        return Math.max(0, timeDiff / (1000 * 60 * 60 * 24));
    }
}

// Corporate Bond Class
class CorporateBond extends BaseAsset {
    constructor(id, name, faceValue, couponRate, maturityYears, rating, sector, issuer) {
        super(id, name, 'CORPORATE_BOND', faceValue);
        
        this.couponRate = couponRate;
        this.maturityYears = maturityYears;
        this.creditRating = rating;
        this.sector = sector;
        this.issuer = issuer;
        this.callable = true; // Most corporate bonds are callable
        this.liquidity = 'medium';
        this.creditSpread = this.getCreditSpread(rating);
        
        this.issueDate = new Date();
    }

    getCreditSpread(rating) {
        // Credit spreads in basis points (0.01%)
        const spreads = {
            'AAA': 25,   // 0.25%
            'AA': 50,    // 0.50%
            'A': 75,     // 0.75%
            'BBB': 125,  // 1.25%
            'BB': 250,   // 2.50%
            'B': 400,    // 4.00%
            'CCC': 800   // 8.00%
        };
        return spreads[rating] || 500; // Default 5.00% for unrated
    }

    calculateValue(gameTime, marketConditions) {
        const requiredYield = this.calculateRequiredYield(marketConditions);
        return this.calculateBondPrice(requiredYield);
    }

    calculateRequiredYield(marketConditions) {
        let requiredYield = marketConditions.treasuryRate / 100;
        
        // Add credit spread
        requiredYield += this.creditSpread / 10000;
        
        // Add base market credit spread
        requiredYield += marketConditions.creditSpread / 10000;
        
        // VIX impact (risk aversion affects corporate bonds more)
        const vixPremium = Math.max(0, (marketConditions.vix - 15) * 0.002);
        requiredYield += vixPremium;
        
        // Callable bond adjustment
        if (this.callable) {
            requiredYield += 0.003; // 30 basis points for call risk
        }
        
        // Liquidity adjustment
        const liquidityPremiums = { 
            high: 0, 
            medium: 0.001, 
            low: 0.002 
        };
        requiredYield += liquidityPremiums[this.liquidity] || 0.001;

        // Sector-specific adjustments
        requiredYield += this.getSectorRiskPremium(marketConditions);

        return Math.max(0.01, requiredYield); // Minimum 1% yield for corporate
    }

    getSectorRiskPremium(marketConditions) {
        const sectorPremiums = {
            'technology': -0.0005,    // Lower risk
            'healthcare': -0.0003,    // Stable
            'utilities': -0.0002,     // Regulated, stable
            'financials': 0.0005,     // Cyclical
            'energy': 0.001,          // Volatile
            'retail': 0.0008,         // Consumer discretionary
            'industrials': 0.0003,    // Cyclical
            'telecommunications': 0.0002
        };
        
        return sectorPremiums[this.sector] || 0;
    }

    calculateBondPrice(ytm) {
        // Same calculation as government bonds but with different yield
        const periodsPerYear = 2;
        const totalPeriods = this.maturityYears * periodsPerYear;
        const periodRate = ytm / periodsPerYear;
        const couponPayment = (this.faceValue * this.couponRate) / periodsPerYear;

        let price = 0;
        
        for (let i = 1; i <= totalPeriods; i++) {
            price += couponPayment / Math.pow(1 + periodRate, i);
        }
        
        price += this.faceValue / Math.pow(1 + periodRate, totalPeriods);
        
        // Apply callable bond discount if interest rates are low
        if (this.callable && ytm < 0.03) {
            price *= 0.98; // 2% discount for call risk
        }
        
        return price;
    }

    getYield(marketConditions) {
        const price = this.calculateValue(null, marketConditions);
        const annualCoupon = this.faceValue * this.couponRate;
        return annualCoupon / price;
    }

    getMaturityDate() {
        const maturityDate = new Date(this.issueDate);
        maturityDate.setFullYear(maturityDate.getFullYear() + this.maturityYears);
        return maturityDate;
    }

    getDuration(marketConditions) {
        const yield_ = this.getYield(marketConditions);
        // Corporate bonds typically have slightly lower duration due to credit risk
        const macaulayDuration = this.maturityYears * 0.80;
        return macaulayDuration / (1 + yield_ / 2);
    }

    // Credit rating migration (bonds can be upgraded/downgraded)
    updateCreditRating(newRating, marketConditions) {
        const oldRating = this.creditRating;
        this.creditRating = newRating;
        this.creditSpread = this.getCreditSpread(newRating);
        
        return {
            oldRating,
            newRating,
            spreadChange: this.getCreditSpread(newRating) - this.getCreditSpread(oldRating),
            priceImpact: this.calculateValue(null, marketConditions)
        };
    }

    // Get call protection period (period when bond cannot be called)
    getCallProtectionEndDate() {
        if (!this.callable) return null;
        
        const callProtectionYears = Math.min(3, this.maturityYears * 0.3); // 30% of maturity or 3 years
        const callDate = new Date(this.issueDate);
        callDate.setFullYear(callDate.getFullYear() + callProtectionYears);
        return callDate;
    }

    isCallable(currentDate = new Date()) {
        if (!this.callable) return false;
        
        const callProtectionEnd = this.getCallProtectionEndDate();
        return currentDate >= callProtectionEnd;
    }
}

// Asset Manager - Factory and utility class for asset management
class AssetManager {
    constructor() {
        this.assetDatabase = this.initializeAssets();
        this.loadAssetData();
    }

    async loadAssetData() {
        try {
            const response = await fetch('data/assets.json');
            const assetData = await response.json();
            this.enhanceWithJsonData(assetData);
        } catch (error) {
            console.warn('Could not load assets.json, using default assets:', error);
        }
    }

    enhanceWithJsonData(jsonData) {
        // Add government bonds from JSON
        if (jsonData.governmentBonds) {
            jsonData.governmentBonds.forEach(bondData => {
                const bond = new GovernmentBond(
                    bondData.id,
                    bondData.name,
                    bondData.faceValue,
                    bondData.couponRate,
                    bondData.maturityYears,
                    bondData.creditRating
                );
                if (bondData.inflationProtected) bond.inflationProtected = true;
                bond.liquidity = bondData.liquidity || 'high';
                bond.description = bondData.description;
                
                // Replace or add to existing bonds
                const existingIndex = this.assetDatabase.bonds.findIndex(b => b.id === bondData.id);
                if (existingIndex >= 0) {
                    this.assetDatabase.bonds[existingIndex] = bond;
                } else {
                    this.assetDatabase.bonds.push(bond);
                }
            });
        }

        // Add corporate bonds from JSON
        if (jsonData.corporateBonds) {
            jsonData.corporateBonds.forEach(bondData => {
                const bond = new CorporateBond(
                    bondData.id,
                    bondData.name,
                    bondData.faceValue,
                    bondData.couponRate,
                    bondData.maturityYears,
                    bondData.creditRating,
                    bondData.sector,
                    bondData.issuer
                );
                bond.callable = bondData.callable !== false;
                bond.liquidity = bondData.liquidity || 'medium';
                bond.description = bondData.description;
                
                if (!this.assetDatabase.corporate) this.assetDatabase.corporate = [];
                this.assetDatabase.corporate.push(bond);
            });
        }
    }

    initializeAssets() {
        // Default fallback assets
        return {
            bonds: [
                new GovernmentBond('us_10y', 'US Treasury 10Y', 1000, 0.0425, 10, 'AAA'),
                new GovernmentBond('us_5y', 'US Treasury 5Y', 1000, 0.039, 5, 'AAA'),
                new GovernmentBond('us_2y', 'US Treasury 2Y', 1000, 0.035, 2, 'AAA'),
                (() => {
                    const tips = new GovernmentBond('tips_10y', 'TIPS 10Y', 1000, 0.015, 10, 'AAA');
                    tips.inflationProtected = true;
                    tips.liquidity = 'medium';
                    return tips;
                })()
            ],
            corporate: [
                new CorporateBond('corp_aaa_10y', 'AAA Corp 10Y', 1000, 0.055, 10, 'AAA', 'technology', 'Tech Corp'),
                new CorporateBond('corp_bbb_5y', 'BBB Corp 5Y', 1000, 0.065, 5, 'BBB', 'industrials', 'Industrial Inc'),
                new CorporateBond('corp_bb_3y', 'BB Energy 3Y', 1000, 0.085, 3, 'BB', 'energy', 'Energy Co'),
            ]
        };
    }

    findAsset(assetId) {
        for (const category in this.assetDatabase) {
            const asset = this.assetDatabase[category].find(a => a.id === assetId);
            if (asset) return asset;
        }
        return null;
    }

    calculateAssetPrice(asset) {
        const marketConditions = window.gameEngine.gameState.market;
        return asset.calculateValue(null, marketConditions);
    }

    calculateYield(asset) {
        const marketConditions = window.gameEngine.gameState.market;
        return asset.getYield(marketConditions);
    }

    calculateDuration(asset) {
        const marketConditions = window.gameEngine.gameState.market;
        return asset.getDuration(marketConditions);
    }

    getAssetsByCategory(category) {
        return this.assetDatabase[category] || [];
    }

    // Calculate portfolio-level metrics
    calculatePortfolioMetrics(portfolio) {
        let totalValue = 0;
        let weightedDuration = 0;
        let weightedYield = 0;
        const sectorAllocation = {};
        const ratingAllocation = {};

        portfolio.forEach(holding => {
            const assetValue = this.calculateAssetPrice(holding.asset) * holding.quantity;
            const assetYield = this.calculateYield(holding.asset);
            const assetDuration = this.calculateDuration(holding.asset);

            totalValue += assetValue;
            weightedYield += assetYield * assetValue;
            weightedDuration += assetDuration * assetValue;

            // Sector allocation (for corporate bonds)
            if (holding.asset.sector) {
                sectorAllocation[holding.asset.sector] = 
                    (sectorAllocation[holding.asset.sector] || 0) + assetValue;
            }

            // Rating allocation
            const rating = holding.asset.creditRating;
            ratingAllocation[rating] = (ratingAllocation[rating] || 0) + assetValue;
        });

        return {
            totalValue,
            averageYield: totalValue > 0 ? weightedYield / totalValue : 0,
            averageDuration: totalValue > 0 ? weightedDuration / totalValue : 0,
            sectorAllocation,
            ratingAllocation
        };
    }
}

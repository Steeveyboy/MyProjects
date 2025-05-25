// Portfolio Management and Analytics
class PortfolioManager {
    constructor() {
        this.historyLimit = 1000; // Keep 1000 data points for charts
        this.portfolioHistory = [];
        this.lastUpdate = Date.now();
    }

    buyAsset(assetId) {
        const asset = window.assetManager.findAsset(assetId);
        if (!asset) return false;

        const price = window.assetManager.calculateAssetPrice(asset);
        const totalCost = Math.ceil(price);

        if (window.gameEngine.gameState.player.cash < totalCost) {
            window.gameEngine.showToast('Insufficient Funds', `Need $${totalCost.toLocaleString()}`);
            return false;
        }

        // Execute purchase
        window.gameEngine.gameState.player.cash -= totalCost;
        window.gameEngine.gameState.player.totalInvested += totalCost;

        // Add to portfolio
        const portfolio = window.gameEngine.gameState.portfolio;
        if (portfolio.has(assetId)) {
            const holding = portfolio.get(assetId);
            holding.quantity += 1;
            holding.averageCost = (holding.averageCost * (holding.quantity - 1) + totalCost) / holding.quantity;
        } else {
            portfolio.set(assetId, {
                asset: asset,
                quantity: 1,
                averageCost: totalCost,
                purchaseDate: Date.now()
            });
        }

        // Add experience and check achievements
        window.gameEngine.addExperience(10);
        window.gameEngine.checkAchievements();

        // Record portfolio value for history
        this.recordPortfolioValue();

        // Update UI
        window.dashboard.updateUI();
        window.dashboard.renderAssetList();
        this.renderPortfolio();

        window.gameEngine.showToast('Purchase Successful', `Bought ${asset.name} for $${totalCost.toLocaleString()}`);
        return true;
    }

    sellAsset(assetId) {
        const portfolio = window.gameEngine.gameState.portfolio;
        const holding = portfolio.get(assetId);
        if (!holding) return false;

        const currentPrice = window.assetManager.calculateAssetPrice(holding.asset);
        const saleProceeds = Math.floor(currentPrice);

        // Execute sale
        window.gameEngine.gameState.player.cash += saleProceeds;
        
        const pnl = saleProceeds - holding.averageCost;
        window.gameEngine.gameState.player.totalReturn += pnl;

        // Remove from portfolio
        if (holding.quantity > 1) {
            holding.quantity -= 1;
        } else {
            portfolio.delete(assetId);
        }

        // Add experience
        window.gameEngine.addExperience(5);

        // Record portfolio value for history
        this.recordPortfolioValue();

        // Update UI
        window.dashboard.updateUI();
        window.dashboard.renderAssetList();
        this.renderPortfolio();

        const pnlText = pnl >= 0 ? `+$${pnl.toLocaleString()}` : `-$${Math.abs(pnl).toLocaleString()}`;
        window.gameEngine.showToast('Sale Completed', `Sold for $${saleProceeds.toLocaleString()} (${pnlText})`);
        return true;
    }

    renderPortfolio() {
        const holdingsList = document.getElementById('holdingsList');
        const portfolio = window.gameEngine.gameState.portfolio;
        
        if (portfolio.size === 0) {
            holdingsList.innerHTML = `
                <div style="text-align: center; color: #a0aec0; padding: 40px 20px; font-style: italic;">
                    Your portfolio is empty. Start by buying some government bonds!
                </div>
            `;
            return;
        }
        
        holdingsList.innerHTML = '';
        
        // Sort holdings by value (descending)
        const sortedHoldings = Array.from(portfolio.entries()).sort((a, b) => {
            const valueA = window.assetManager.calculateAssetPrice(a[1].asset) * a[1].quantity;
            const valueB = window.assetManager.calculateAssetPrice(b[1].asset) * b[1].quantity;
            return valueB - valueA;
        });
        
        sortedHoldings.forEach(([assetId, holding]) => {
            const currentPrice = window.assetManager.calculateAssetPrice(holding.asset);
            const currentValue = currentPrice * holding.quantity;
            const totalCost = holding.averageCost * holding.quantity;
            const pnl = currentValue - totalCost;
            const pnlPercent = (pnl / totalCost) * 100;
            
            const holdingElement = document.createElement('div');
            holdingElement.className = 'holding-item';
            holdingElement.innerHTML = `
                <div class="holding-info">
                    <div class="holding-name">${holding.asset.name}</div>
                    <div class="holding-details">
                        ${holding.quantity} units @ $${holding.averageCost.toFixed(2)} avg
                        • ${holding.asset.creditRating || 'N/A'} • ${(window.assetManager.calculateYield(holding.asset) * 100).toFixed(2)}% yield
                    </div>
                </div>
                <div class="holding-value">
                    <div>$${currentValue.toLocaleString()}</div>
                    <div class="holding-pnl ${pnl >= 0 ? 'positive' : 'negative'}">
                        ${pnl >= 0 ? '+' : ''}$${pnl.toFixed(0)} (${pnlPercent.toFixed(1)}%)
                    </div>
                </div>
            `;
            
            holdingsList.appendChild(holdingElement);
        });

        // Update portfolio summary metrics
        this.updatePortfolioSummary();
    }

    updatePortfolioSummary() {
        const portfolio = window.gameEngine.gameState.portfolio;
        const metrics = window.assetManager.calculatePortfolioMetrics(portfolio);

        document.getElementById('totalValue').textContent = `$${metrics.totalValue.toLocaleString()}`;
        document.getElementById('avgYield').textContent = `${(metrics.averageYield * 100).toFixed(2)}%`;
        document.getElementById('portfolioDuration').textContent = metrics.averageDuration.toFixed(1);

        // Calculate today's P&L (simplified - would need historical data for accurate calculation)
        const dayPnL = this.calculateDayPnL();
        document.getElementById('dayPnL').textContent = `${dayPnL >= 0 ? '+' : ''}$${dayPnL.toFixed(0)}`;
        document.getElementById('dayPnL').className = `metric-value ${dayPnL >= 0 ? 'positive' : 'negative'}`;
    }

    calculateDayPnL() {
        // Simplified day P&L calculation - in a real implementation, 
        // this would compare current portfolio value to yesterday's closing value
        const portfolio = window.gameEngine.gameState.portfolio;
        let dayPnL = 0;

        portfolio.forEach(holding => {
            // Simulate daily price change (this is a placeholder)
            const dailyChange = (Math.random() - 0.5) * 0.01; // ±0.5% random change
            const currentValue = window.assetManager.calculateAssetPrice(holding.asset) * holding.quantity;
            dayPnL += currentValue * dailyChange;
        });

        return dayPnL;
    }

    recordPortfolioValue() {
        const totalValue = window.gameEngine.getPortfolioValue() + window.gameEngine.gameState.player.cash;
        // Use in-game time for timestamp
        const gameTime = window.gameEngine ? window.gameEngine.timeSystem.getCurrentGameTime() : null;
        const timestamp = gameTime ? gameTime.date.getTime() : Date.now();
        this.portfolioHistory.push({
            timestamp,
            value: totalValue,
            portfolioValue: window.gameEngine.getPortfolioValue(),
            cash: window.gameEngine.gameState.player.cash
        });

        // Keep only recent history
        if (this.portfolioHistory.length > this.historyLimit) {
            this.portfolioHistory = this.portfolioHistory.slice(-this.historyLimit);
        }
    }

    addPortfolioHistoryEntry(value) {
        // Use in-game time for history
        const gameTime = window.gameEngine ? window.gameEngine.timeSystem.getCurrentGameTime() : null;
        this.portfolioHistory.push({
            value,
            timestamp: gameTime ? gameTime.date.getTime() : Date.now()
        });
        if (this.portfolioHistory.length > this.historyLimit) {
            this.portfolioHistory.shift();
        }
    }

    getPortfolioHistory(timeframe = '1D') {
        // Use in-game time for cutoff
        const gameTime = window.gameEngine ? window.gameEngine.timeSystem.getCurrentGameTime() : null;
        const now = gameTime ? gameTime.date.getTime() : Date.now();
        let cutoffTime;

        switch (timeframe) {
            case '1H':
                cutoffTime = now - (60 * 60 * 1000);
                break;
            case '1D':
                cutoffTime = now - (24 * 60 * 60 * 1000);
                break;
            case '1W':
                cutoffTime = now - (7 * 24 * 60 * 60 * 1000);
                break;
            case '1M':
                cutoffTime = now - (30 * 24 * 60 * 60 * 1000);
                break;
            default:
                cutoffTime = 0;
        }

        return this.portfolioHistory.filter(entry => entry.timestamp >= cutoffTime);
    }

    // Portfolio Analytics Methods
    calculateSharpeRatio() {
        if (this.portfolioHistory.length < 2) return 0;

        const returns = [];
        for (let i = 1; i < this.portfolioHistory.length; i++) {
            const prevValue = this.portfolioHistory[i - 1].value;
            const currentValue = this.portfolioHistory[i].value;
            returns.push((currentValue - prevValue) / prevValue);
        }

        const avgReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
        const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) / returns.length;
        const volatility = Math.sqrt(variance);

        // Assume risk-free rate of 3% annually (simplified)
        const riskFreeRate = 0.03 / 365; // Daily risk-free rate
        
        return volatility > 0 ? (avgReturn - riskFreeRate) / volatility : 0;
    }

    calculateMaxDrawdown() {
        if (this.portfolioHistory.length < 2) return 0;

        let maxValue = this.portfolioHistory[0].value;
        let maxDrawdown = 0;

        for (let i = 1; i < this.portfolioHistory.length; i++) {
            const currentValue = this.portfolioHistory[i].value;
            
            if (currentValue > maxValue) {
                maxValue = currentValue;
            } else {
                const drawdown = (maxValue - currentValue) / maxValue;
                maxDrawdown = Math.max(maxDrawdown, drawdown);
            }
        }

        return maxDrawdown;
    }

    calculateVolatility(timeframe = '1M') {
        const history = this.getPortfolioHistory(timeframe);
        if (history.length < 2) return 0;

        const returns = [];
        for (let i = 1; i < history.length; i++) {
            const prevValue = history[i - 1].value;
            const currentValue = history[i].value;
            returns.push((currentValue - prevValue) / prevValue);
        }

        const avgReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
        const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) / returns.length;
        
        return Math.sqrt(variance);
    }

    // Risk metrics
    calculateVaR(confidenceLevel = 0.95) {
        // Value at Risk calculation
        const history = this.getPortfolioHistory('1M');
        if (history.length < 10) return 0;

        const returns = [];
        for (let i = 1; i < history.length; i++) {
            const prevValue = history[i - 1].value;
            const currentValue = history[i].value;
            returns.push((currentValue - prevValue) / prevValue);
        }

        returns.sort((a, b) => a - b);
        const index = Math.floor((1 - confidenceLevel) * returns.length);
        const currentValue = window.gameEngine.getTotalAssets();
        
        return Math.abs(returns[index] * currentValue);
    }

    // Sector and rating diversification metrics
    getDiversificationMetrics() {
        const portfolio = window.gameEngine.gameState.portfolio;
        const metrics = window.assetManager.calculatePortfolioMetrics(portfolio);
        
        // Calculate Herfindahl-Hirschman Index for concentration
        const sectorHHI = this.calculateHHI(metrics.sectorAllocation, metrics.totalValue);
        const ratingHHI = this.calculateHHI(metrics.ratingAllocation, metrics.totalValue);

        // Calculate number of holdings
        const numHoldings = portfolio.size;

        return {
            numHoldings,
            sectorConcentration: sectorHHI,
            ratingConcentration: ratingHHI,
            isWellDiversified: numHoldings >= 5 && sectorHHI < 0.25 && ratingHHI < 0.4
        };
    }

    calculateHHI(allocation, totalValue) {
        let hhi = 0;
        for (const value of Object.values(allocation)) {
            const share = value / totalValue;
            hhi += share * share;
        }
        return hhi;
    }

    // Generate portfolio analytics report
    generateAnalyticsReport() {
        const portfolio = window.gameEngine.gameState.portfolio;
        if (portfolio.size === 0) return null;

        const metrics = window.assetManager.calculatePortfolioMetrics(portfolio);
        const diversification = this.getDiversificationMetrics();
        
        return {
            totalValue: metrics.totalValue,
            averageYield: metrics.averageYield,
            averageDuration: metrics.averageDuration,
            sharpeRatio: this.calculateSharpeRatio(),
            volatility: this.calculateVolatility(),
            maxDrawdown: this.calculateMaxDrawdown(),
            valueAtRisk: this.calculateVaR(),
            diversification,
            sectorAllocation: metrics.sectorAllocation,
            ratingAllocation: metrics.ratingAllocation,
            lastUpdated: new Date().toLocaleString()
        };
    }
}

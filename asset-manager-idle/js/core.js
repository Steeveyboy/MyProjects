// Core Game Engine and Time System
class GameEngine {
    constructor() {
        this.gameState = {
            player: {
                cash: 50000,
                experience: 0,
                level: 1,
                totalInvested: 0,
                totalReturn: 0,
                achievements: []
            },
            portfolio: new Map(),
            market: {
                treasuryRate: 4.25,
                creditSpread: 125,
                vix: 18.5,
                inflation: 2.8,
                economicCycle: 'stable',
                lastUpdate: Date.now()
            },
            time: {
                gameStartTime: Date.now(),
                lastTick: Date.now(),
                gameSpeed: 1
            },
            ui: {
                selectedCategory: 'bonds',
                selectedAsset: null
            }
        };

        this.timeSystem = new TimeSystem();
        this.saveManager = new SaveManager();
        this.marketEvents = this.initializeMarketEvents();
        this.achievements = this.initializeAchievements();
    }

    initializeMarketEvents() {
        return [
            {
                type: 'fed_announcement',
                probability: 0.02,
                impact: { treasuryRate: [-0.5, 0.5], vix: [-5, 15] },
                message: 'Federal Reserve announces policy changes'
            },
            {
                type: 'economic_data',
                probability: 0.05,
                impact: { inflation: [-0.3, 0.3], treasuryRate: [-0.2, 0.2] },
                message: 'New economic data released'
            },
            {
                type: 'market_volatility',
                probability: 0.03,
                impact: { vix: [-10, 20], creditSpread: [-20, 30] },
                message: 'Market volatility spike detected'
            }
        ];
    }

    initializeAchievements() {
        return [
            {
                id: 'first_purchase',
                name: 'First Investment',
                description: 'Make your first bond purchase',
                condition: () => this.gameState.portfolio.size > 0,
                reward: { experience: 100 }
            },
            {
                id: 'diversified_portfolio',
                name: 'Diversified Investor',
                description: 'Own 5 different bonds',
                condition: () => this.gameState.portfolio.size >= 5,
                reward: { experience: 250 }
            },
            {
                id: 'hundred_k',
                name: 'Portfolio Milestone',
                description: 'Reach $100,000 total assets',
                condition: () => this.getTotalAssets() >= 100000,
                reward: { experience: 500 }
            }
        ];
    }

    addExperience(amount) {
        this.gameState.player.experience += amount;
        const newLevel = Math.floor(this.gameState.player.experience / 1000) + 1;
        
        if (newLevel > this.gameState.player.level) {
            this.gameState.player.level = newLevel;
            this.showAchievement('Level Up!', `Reached Level ${newLevel}`);
            this.unlockNewAssets();
        }
    }

    unlockNewAssets() {
        document.querySelectorAll('.category-tab').forEach(tab => {
            const category = tab.dataset.category;
            const requiredLevel = this.getCategoryRequiredLevel(category);
            
            if (this.gameState.player.level >= requiredLevel) {
                tab.classList.remove('locked');
            }
        });
    }

    getCategoryRequiredLevel(category) {
        const requirements = {
            bonds: 1,
            corporate: 3,
            stocks: 5,
            derivatives: 8,
            commodities: 10
        };
        return requirements[category] || 1;
    }

    checkAchievements() {
        this.achievements.forEach(achievement => {
            if (!this.gameState.player.achievements.includes(achievement.id) && 
                achievement.condition()) {
                this.gameState.player.achievements.push(achievement.id);
                this.addExperience(achievement.reward.experience);
                this.showAchievement(achievement.name, achievement.description);
            }
        });
    }

    showAchievement(title, description) {
        const toast = document.getElementById('achievementToast');
        document.getElementById('achievementTitle').textContent = title;
        document.getElementById('achievementDesc').textContent = description;
        
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    showToast(title, message) {
        console.log(`${title}: ${message}`);
    }

    getTotalAssets() {
        let total = this.gameState.player.cash;
        
        this.gameState.portfolio.forEach(holding => {
            const currentPrice = window.assetManager.calculateAssetPrice(holding.asset);
            total += currentPrice * holding.quantity;
        });
        
        return total;
    }

    getPortfolioValue() {
        let value = 0;
        
        this.gameState.portfolio.forEach(holding => {
            const currentPrice = window.assetManager.calculateAssetPrice(holding.asset);
            value += currentPrice * holding.quantity;
        });
        
        return value;
    }

    updateMarketData() {
        const volatility = 0.002; // 0.2% daily volatility
        
        // Update treasury rate
        const rateChange = (Math.random() - 0.5) * volatility * 2;
        this.gameState.market.treasuryRate += rateChange;
        this.gameState.market.treasuryRate = Math.max(0.1, Math.min(10, this.gameState.market.treasuryRate));
        
        // Update VIX
        const vixChange = (Math.random() - 0.5) * 2;
        this.gameState.market.vix += vixChange;
        this.gameState.market.vix = Math.max(10, Math.min(80, this.gameState.market.vix));
        
        // Random market events
        this.marketEvents.forEach(event => {
            if (Math.random() < event.probability) {
                this.triggerMarketEvent(event);
            }
        });
    }

    triggerMarketEvent(event) {
        for (const [key, range] of Object.entries(event.impact)) {
            const change = range[0] + Math.random() * (range[1] - range[0]);
            this.gameState.market[key] += change;
        }
        
        this.addNewsItem(event.message);
    }

    addNewsItem(message) {
        const newsTicker = document.getElementById('newsTicker');
        const gameTime = this.timeSystem.getCurrentGameTime();
        const timeStr = gameTime.formattedTime;
        
        const newsItem = document.createElement('div');
        newsItem.className = 'news-item';
        newsItem.innerHTML = `
            <div class="news-time">${timeStr}</div>
            <div>${message}</div>
        `;
        
        newsTicker.insertBefore(newsItem, newsTicker.firstChild);
        
        // Keep only latest 10 news items
        while (newsTicker.children.length > 10) {
            newsTicker.removeChild(newsTicker.lastChild);
        }
    }

    startGameLoop() {
        setInterval(() => {
            this.updateMarketData();
            window.dashboard.updateUI();
            window.portfolio.renderPortfolio();
        }, 5000); // Update every 5 seconds
        
        // UI update loop (more frequent)
        setInterval(() => {
            window.dashboard.updateUI();
        }, 1000);
    }
}

// Time System - 1 real second = 1 game hour
class TimeSystem {
    constructor() {
        this.gameStartTime = Date.now();
        this.realStartTime = new Date(); // Current real date (May 24, 2025)
        this.hoursPerSecond = 1; // 1 real second = 1 game hour
    }

    getCurrentGameTime() {
        const realSecondsElapsed = (Date.now() - this.gameStartTime) / 1000;
        const gameHoursElapsed = Math.floor(realSecondsElapsed * this.hoursPerSecond);
        
        const gameDate = new Date(this.realStartTime);
        gameDate.setHours(gameDate.getHours() + gameHoursElapsed);
        
        return {
            date: gameDate,
            hoursElapsed: gameHoursElapsed,
            formattedTime: gameDate.toLocaleDateString() + ' ' + 
                          gameDate.getHours().toString().padStart(2, '0') + ':00',
            dayOfYear: Math.floor(gameHoursElapsed / 24),
            yearProgress: (gameHoursElapsed % (365 * 24)) / (365 * 24)
        };
    }

    // Bond coupon payments every 6 months (4380 game hours)
    getNextCouponDate(bondPurchaseDate) {
        const nextCoupon = new Date(bondPurchaseDate);
        nextCoupon.setMonth(nextCoupon.getMonth() + 6);
        return nextCoupon;
    }

    // Check if coupon payment is due for any bonds
    processCouponPayments() {
        const currentTime = this.getCurrentGameTime();
        // TODO: Implement coupon payment logic
    }

    // Economic cycle progression (simplified)
    getEconomicCyclePhase() {
        const progress = this.getCurrentGameTime().yearProgress;
        if (progress < 0.25) return 'expansion';
        if (progress < 0.4) return 'peak';
        if (progress < 0.75) return 'contraction';
        return 'trough';
    }

    // Get seasonal market effects
    getSeasonalEffects() {
        const month = this.getCurrentGameTime().date.getMonth();
        // January effect, summer doldrums, etc.
        const effects = {
            volatility: 1.0,
            liquidity: 1.0,
            riskPremium: 0.0
        };
        
        // Summer months (June-August) typically lower volatility
        if (month >= 5 && month <= 7) {
            effects.volatility *= 0.8;
            effects.liquidity *= 0.9;
        }
        
        // Year-end effects (December)
        if (month === 11) {
            effects.volatility *= 1.2;
            effects.riskPremium += 0.001;
        }
        
        return effects;
    }
}

// Save Manager for persistence
class SaveManager {
    constructor() {
        this.saveKey = 'assetManagerGame_save';
        this.autoSaveInterval = 30000; // 30 seconds
        this.startAutoSave();
    }

    saveGame(gameState) {
        try {
            // Convert Map to object for serialization
            const saveData = {
                ...gameState,
                portfolio: Object.fromEntries(gameState.portfolio),
                timestamp: Date.now()
            };
            
            localStorage.setItem(this.saveKey, JSON.stringify(saveData));
            console.log('Game saved successfully');
        } catch (error) {
            console.error('Failed to save game:', error);
        }
    }

    loadGame() {
        try {
            const saveData = localStorage.getItem(this.saveKey);
            if (!saveData) return null;
            
            const parsed = JSON.parse(saveData);
            
            // Convert portfolio back to Map
            parsed.portfolio = new Map(Object.entries(parsed.portfolio));
            
            return parsed;
        } catch (error) {
            console.error('Failed to load game:', error);
            return null;
        }
    }

    deleteSave() {
        localStorage.removeItem(this.saveKey);
        console.log('Save deleted');
    }

    hasSave() {
        return localStorage.getItem(this.saveKey) !== null;
    }

    startAutoSave() {
        setInterval(() => {
            if (window.gameEngine) {
                this.saveGame(window.gameEngine.gameState);
            }
        }, this.autoSaveInterval);
    }
}

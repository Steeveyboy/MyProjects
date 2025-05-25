// Dashboard and UI Management
class Dashboard {
    constructor() {
        this.selectedCategory = 'bonds';
        this.chartData = [];
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Category tabs
        document.querySelectorAll('.category-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const category = e.currentTarget.dataset.category;
                this.selectCategory(category);
            });
        });
    }

    selectCategory(category) {
        // Check if category is unlocked
        const requiredLevel = window.gameEngine.getCategoryRequiredLevel(category);
        if (window.gameEngine.gameState.player.level < requiredLevel) {
            window.gameEngine.showToast('Locked', `Reach Level ${requiredLevel} to unlock ${category}`);
            return;
        }

        this.selectedCategory = category;
        window.gameEngine.gameState.ui.selectedCategory = category;
        
        // Update UI
        document.querySelectorAll('.category-tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.category === category) {
                tab.classList.add('active');
            }
        });

        this.renderAssetList();
    }

    renderAssetList() {
        const assetListContainer = document.getElementById('assetList');
        const assets = window.assetManager.getAssetsByCategory(this.selectedCategory);

        assetListContainer.innerHTML = '';

        if (assets.length === 0) {
            assetListContainer.innerHTML = `
                <div style="text-align: center; color: #a0aec0; padding: 40px 20px; font-style: italic;">
                    No assets available in this category yet.
                </div>
            `;
            return;
        }

        assets.forEach(asset => {
            const price = window.assetManager.calculateAssetPrice(asset);
            const yield_ = window.assetManager.calculateYield(asset);
            const duration = window.assetManager.calculateDuration(asset);

            const assetElement = document.createElement('div');
            assetElement.className = 'asset-item';
            assetElement.innerHTML = `
                <div class="asset-header">
                    <div class="asset-name">${asset.name}</div>
                    <div class="asset-price ${price > asset.faceValue ? 'positive' : price < asset.faceValue ? 'negative' : 'neutral'}">
                        $${price.toFixed(2)}
                    </div>
                </div>
                <div class="asset-details">
                    <div>Yield: ${(yield_ * 100).toFixed(2)}%</div>
                    <div>Duration: ${duration.toFixed(1)}</div>
                    <div>Rating: ${asset.creditRating}</div>
                    <div>Maturity: ${asset.maturityYears}Y</div>
                    ${asset.sector ? `<div>Sector: ${asset.sector}</div>` : ''}
                    ${asset.callable ? `<div style="color: #ffa500;">Callable</div>` : ''}
                </div>
                <div class="asset-actions">
                    <button class="btn btn-buy" onclick="window.portfolio.buyAsset('${asset.id}')">
                        Buy ($${asset.minPurchase.toLocaleString()})
                    </button>
                    <button class="btn btn-sell" onclick="window.portfolio.sellAsset('${asset.id}')" 
                            ${!window.gameEngine.gameState.portfolio.has(asset.id) ? 'disabled' : ''}>
                        Sell
                    </button>
                </div>
            `;

            assetListContainer.appendChild(assetElement);
        });
    }

    updateUI() {
        // Update header stats
        document.getElementById('playerCash').textContent = 
            `$${window.gameEngine.gameState.player.cash.toLocaleString()}`;
        
        const portfolioValue = window.gameEngine.getPortfolioValue();
        document.getElementById('portfolioValue').textContent = 
            `$${portfolioValue.toLocaleString()}`;
        
        const totalAssets = window.gameEngine.getTotalAssets();
        document.getElementById('totalValue').textContent = 
            `$${totalAssets.toLocaleString()}`;
        
        const totalReturn = window.gameEngine.gameState.player.totalReturn;
        const totalReturnPercent = window.gameEngine.gameState.player.totalInvested > 0 ? 
            (totalReturn / window.gameEngine.gameState.player.totalInvested) * 100 : 0;
        document.getElementById('totalReturn').textContent = 
            `${totalReturnPercent >= 0 ? '+' : ''}${totalReturnPercent.toFixed(2)}%`;
        document.getElementById('totalReturn').className = 
            `stat-value ${totalReturnPercent >= 0 ? 'positive' : 'negative'}`;
        
        document.getElementById('playerLevel').textContent = 
            `Level ${window.gameEngine.gameState.player.level}`;
        
        // Update portfolio count
        document.getElementById('portfolioCount').textContent = 
            `${window.gameEngine.gameState.portfolio.size} Holdings`;
        
        // Update market indicators
        this.updateMarketIndicators();
        
        // Update game time
        this.updateGameTime();
    }

    updateMarketIndicators() {
        const market = window.gameEngine.gameState.market;
        
        document.getElementById('treasuryRate').textContent = 
            `${market.treasuryRate.toFixed(2)}%`;
        document.getElementById('vixIndex').textContent = 
            market.vix.toFixed(1);
        document.getElementById('inflationRate').textContent = 
            `${market.inflation.toFixed(1)}%`;
        
        // Update credit spread
        document.getElementById('creditSpread').textContent = 
            `${market.creditSpread.toFixed(0)}bp`;

        // Add color coding for changes (simplified - would need historical data for real changes)
        this.updateIndicatorChanges();
    }

    updateIndicatorChanges() {
        // Simplified change indicators - in a real implementation, 
        // these would show actual changes from previous values
        const changeElements = [
            'treasuryChange',
            'spreadChange', 
            'vixChange',
            'inflationChange'
        ];

        changeElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                // Simulate random changes for demo purposes
                const change = (Math.random() - 0.5) * 0.1;
                const sign = change >= 0 ? '+' : '';
                
                if (id.includes('treasury') || id.includes('inflation')) {
                    element.textContent = `${sign}${change.toFixed(2)}%`;
                } else if (id.includes('spread')) {
                    element.textContent = `${sign}${(change * 10).toFixed(0)}bp`;
                } else {
                    element.textContent = `${sign}${change.toFixed(1)}`;
                }
                
                element.className = `indicator-change ${change >= 0 ? 'positive' : 'negative'}`;
            }
        });
    }

    updateGameTime() {
        const gameTime = window.gameEngine.timeSystem.getCurrentGameTime();
        
        // Display both elapsed real time and current game date/time
        const realElapsed = Date.now() - window.gameEngine.gameState.time.gameStartTime;
        const minutes = Math.floor(realElapsed / 60000);
        const seconds = Math.floor((realElapsed % 60000) / 1000);
        
        document.getElementById('gameTime').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Update game date in header or create new element for it
        this.updateGameDate(gameTime);
    }

    updateGameDate(gameTime) {
        // Find or create game date element
        let gameDateElement = document.getElementById('gameDate');
        if (!gameDateElement) {
            // Create game date display next to game time
            const gameTimeElement = document.getElementById('gameTime');
            const parentElement = gameTimeElement.parentElement;
            
            gameDateElement = document.createElement('div');
            gameDateElement.id = 'gameDate';
            gameDateElement.className = 'stat-value';
            gameDateElement.style.fontSize = '0.9em';
            gameDateElement.style.color = '#a0aec0';
            
            const labelElement = document.createElement('div');
            labelElement.className = 'stat-label';
            labelElement.textContent = 'Game Date';
            
            parentElement.appendChild(gameDateElement);
            parentElement.appendChild(labelElement);
        }
        
        const dateStr = gameTime.date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            hour12: false
        });
        gameDateElement.textContent = dateStr + ':00';
    }

    // Chart rendering placeholder (will be enhanced in future phases)
    renderPortfolioChart() {
        const chartContainer = document.querySelector('.chart-container');
        if (!chartContainer) return;

        const history = window.portfolio.getPortfolioHistory('1D');
        
        if (history.length < 2) {
            chartContainer.innerHTML = `
                <div>
                    <div>📊 Portfolio Value Chart</div>
                    <div style="font-size: 0.8em; color: #666;">Need more data points</div>
                </div>
            `;
            return;
        }

        // Simple ASCII chart placeholder
        const minValue = Math.min(...history.map(h => h.value));
        const maxValue = Math.max(...history.map(h => h.value));
        const range = maxValue - minValue;
        
        let chartDisplay = '📈 Portfolio Trend: ';
        if (range === 0) {
            chartDisplay += '──────────';
        } else {
            const latestValue = history[history.length - 1].value;
            const firstValue = history[0].value;
            const trend = latestValue > firstValue ? '📈' : '📉';
            chartDisplay += trend + ' ' + ((latestValue - firstValue) / firstValue * 100).toFixed(2) + '%';
        }

        chartContainer.innerHTML = `
            <div style="text-align: center;">
                <div>${chartDisplay}</div>
                <div style="font-size: 0.8em; color: #a0aec0; margin-top: 10px;">
                    Advanced charts coming in Phase 2
                </div>
            </div>
        `;
    }

    // Analytics tab management (placeholder for Phase 2)
    showAnalyticsTab() {
        const report = window.portfolio.generateAnalyticsReport();
        if (!report) {
            console.log('No portfolio data for analytics');
            return;
        }

        console.log('Portfolio Analytics Report:', report);
        // In Phase 2, this will render detailed analytics charts and metrics
    }

    // Market news management
    addMarketNews(message, type = 'info') {
        const newsTicker = document.getElementById('newsTicker');
        const gameTime = window.gameEngine.timeSystem.getCurrentGameTime();
        const timeStr = gameTime.date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });
        
        const newsItem = document.createElement('div');
        newsItem.className = 'news-item';
        
        // Add type-specific styling
        let icon = '📰';
        if (type === 'fed') icon = '🏛️';
        else if (type === 'economic') icon = '📊';
        else if (type === 'market') icon = '📈';
        else if (type === 'alert') icon = '⚠️';
        
        newsItem.innerHTML = `
            <div class="news-time">${icon} ${timeStr}</div>
            <div>${message}</div>
        `;
        
        newsTicker.insertBefore(newsItem, newsTicker.firstChild);
        
        // Keep only latest 15 news items
        while (newsTicker.children.length > 15) {
            newsTicker.removeChild(newsTicker.lastChild);
        }
    }

    // Economic cycle indicators
    updateEconomicCycleDisplay() {
        const phase = window.gameEngine.timeSystem.getEconomicCyclePhase();
        const seasonalEffects = window.gameEngine.timeSystem.getSeasonalEffects();
        
        // Find or create economic cycle indicator
        let cycleElement = document.getElementById('economicCycle');
        if (!cycleElement) {
            const marketIndicators = document.querySelector('.market-indicators');
            cycleElement = document.createElement('div');
            cycleElement.id = 'economicCycle';
            cycleElement.className = 'indicator';
            marketIndicators.appendChild(cycleElement);
        }
        
        const phaseColors = {
            expansion: '#00ff88',
            peak: '#ffa500', 
            contraction: '#ff4444',
            trough: '#00d4ff'
        };
        
        cycleElement.innerHTML = `
            <div class="indicator-header">
                <span class="indicator-name">Economic Cycle</span>
                <div>
                    <span class="indicator-value" style="color: ${phaseColors[phase]}">
                        ${phase.toUpperCase()}
                    </span>
                </div>
            </div>
        `;
    }

    // Error handling and loading states
    showLoadingState(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = '<div class="loading-spinner"></div>';
        }
    }

    hideLoadingState(elementId) {
        const spinner = document.querySelector(`#${elementId} .loading-spinner`);
        if (spinner) {
            spinner.remove();
        }
    }

    // Responsive layout adjustments
    adjustLayout() {
        const width = window.innerWidth;
        const gameMain = document.querySelector('.game-main');
        
        if (width < 1200) {
            gameMain.style.gridTemplateColumns = '1fr';
            gameMain.style.gridTemplateRows = 'auto auto auto';
        } else {
            gameMain.style.gridTemplateColumns = '350px 1fr 350px';
            gameMain.style.gridTemplateRows = 'none';
        }
    }
}

// Initialize responsive layout
window.addEventListener('resize', () => {
    if (window.dashboard) {
        window.dashboard.adjustLayout();
    }
});

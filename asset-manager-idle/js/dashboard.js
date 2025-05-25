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
        // Update game date (always update on UI tick)
        const gameTime = window.gameEngine.timeSystem.getCurrentGameTime();
        this.updateGameDate(gameTime);
        // Update game time (legacy, safe to call)
        this.updateGameTime();
        // Update portfolio analytics section
        this.renderPortfolioAnalytics();
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
        // Hotfix: Only update if element exists (gameTime removed from UI)
        const gameTimeElement = document.getElementById('gameTime');
        if (!gameTimeElement) return;
        const gameTime = window.gameEngine.timeSystem.getCurrentGameTime();
        const realElapsed = Date.now() - window.gameEngine.gameState.time.gameStartTime;
        const minutes = Math.floor(realElapsed / 60000);
        const seconds = Math.floor((realElapsed % 60000) / 1000);
        gameTimeElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        this.updateGameDate(gameTime);
    }
    updateGameDate(gameTime) {
        // Update the game date in the header in format: Year Month Date Hour
        let gameDateElement = document.getElementById('gameDate');
        if (!gameDateElement) return;
        const date = gameTime.date;
        const year = date.getFullYear();
        const month = date.toLocaleString('en-US', { month: 'short' });
        const day = date.getDate().toString().padStart(2, '0');
        const hour = date.getHours().toString().padStart(2, '0');
        gameDateElement.textContent = `${year} ${month} ${day} ${hour}:00`;
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

    renderPortfolioAnalytics() {
        // Find or create analytics container
        let analyticsContainer = document.getElementById('portfolioAnalytics');
        if (!analyticsContainer) {
            analyticsContainer = document.createElement('div');
            analyticsContainer.id = 'portfolioAnalytics';
            analyticsContainer.style.marginTop = '20px';
            analyticsContainer.style.background = 'rgba(0,255,136,0.07)';
            analyticsContainer.style.border = '1px solid #00ff88';
            analyticsContainer.style.borderRadius = '8px';
            analyticsContainer.style.padding = '16px';
            analyticsContainer.style.fontSize = '0.95em';
            analyticsContainer.style.color = '#e2e8f0';
            // Insert after portfolio summary
            const summary = document.querySelector('.portfolio-summary');
            if (summary && summary.parentNode) {
                summary.parentNode.insertBefore(analyticsContainer, summary.nextSibling);
            }
        }
        // Get analytics report
        const report = window.portfolio.generateAnalyticsReport();
        if (!report) {
            analyticsContainer.innerHTML = '<em>No analytics available (empty portfolio).</em>';
            return;
        }
        analyticsContainer.innerHTML = `
            <div style="font-weight:bold; color:#00ff88; margin-bottom:8px;">Portfolio Analytics</div>
            <div>Sharpe Ratio: <span style="color:#51cf66;">${report.sharpeRatio.toFixed(2)}</span></div>
            <div>Max Drawdown: <span style="color:#ff6b6b;">${(report.maxDrawdown * 100).toFixed(2)}%</span></div>
            <div>Value at Risk (VaR 95%): <span style="color:#ffd43b;">$${report.valueAtRisk.toLocaleString(undefined, {maximumFractionDigits:0})}</span></div>
            <div>Volatility: <span style="color:#74c0fc;">${(report.volatility * 100).toFixed(2)}%</span></div>
            <div>Diversification (HHI): <span style="color:#00d4ff;">${(report.diversification.sectorConcentration * 100).toFixed(2)}%</span></div>
            <div style="font-size:0.9em; color:#a0aec0; margin-top:6px;">Last updated: ${report.lastUpdated}</div>
        `;
    }
}

// Initialize responsive layout
window.addEventListener('resize', () => {
    if (window.dashboard) {
        window.dashboard.adjustLayout();
    }
});

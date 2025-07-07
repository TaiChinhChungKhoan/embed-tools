// Unified data loader with caching
class DataLoader {
    constructor() {
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes cache
        // Base path for the app - matches vite.config.js base setting
        this.basePath = '/embed-tools/vnindex-analysis';
    }

    // Check if cached data is still valid
    isCacheValid(key) {
        const cached = this.cache.get(key);
        if (!cached) return false;
        
        const now = Date.now();
        return (now - cached.timestamp) < this.cacheTimeout;
    }

    // Fetch data with caching
    async fetchData(url, options = {}) {
        const cacheKey = `${url}_${JSON.stringify(options)}`;
        
        // Check cache first
        if (this.isCacheValid(cacheKey)) {
            return this.cache.get(cacheKey).data;
        }

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            // Cache the data
            this.cache.set(cacheKey, {
                data,
                timestamp: Date.now()
            });

            return data;
        } catch (error) {
            console.error(`Error fetching data from ${url}:`, error);
            throw error;
        }
    }

    // Load market breadth data
    async loadMarketBreadth() {
        return this.fetchData(`${this.basePath}/data/market_breadth.json`);
    }

    // Load market breadth 4 data (up/down counts)
    async loadMarketBreadth4() {
        return this.fetchData(`${this.basePath}/data/market_breadth_4.json`);
    }

    // Load other data files (to be added as needed)
    async loadIndustriesData() {
        return this.fetchData(`${this.basePath}/data/industry_strength_analysis.json`);
    }

    async loadTickersData() {
        return this.fetchData(`${this.basePath}/data/individual_stock_signals.json`);
    }

    async loadMarketOverviewData() {
        return this.fetchData(`${this.basePath}/data/market_breadth_4.json`);
    }

    async loadAbnormalSignalsData() {
        return this.fetchData(`${this.basePath}/data/abnormal_signals.json`);
    }

    async loadRSAnalysisData() {
        return this.fetchData(`${this.basePath}/data/analyze_rs.json`);
    }

    // Clear cache for specific URL or all cache
    clearCache(url = null) {
        if (url) {
            // Clear cache for specific URL pattern
            for (const [key] of this.cache) {
                if (key.includes(url)) {
                    this.cache.delete(key);
                }
            }
        } else {
            // Clear all cache
            this.cache.clear();
        }
    }

    // Get cache statistics
    getCacheStats() {
        const now = Date.now();
        let validEntries = 0;
        let expiredEntries = 0;

        for (const [key, value] of this.cache) {
            if ((now - value.timestamp) < this.cacheTimeout) {
                validEntries++;
            } else {
                expiredEntries++;
            }
        }

        return {
            total: this.cache.size,
            valid: validEntries,
            expired: expiredEntries
        };
    }
}

// Create singleton instance
const dataLoader = new DataLoader();

export default dataLoader; 
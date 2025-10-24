// js/api.js - 修复路径问题
class LoanAPI {
    constructor() {
        this.baseUrl = window.location.origin;
        this.products = [];
        this.categories = [];
        this.isLoaded = false;
    }

    // Load products from JSON file - 修复路径
    async loadProducts() {
        try {
            console.log('Loading products from data/products.json...');
            // 修复路径 - 根据您的文件结构调整
            const response = await fetch('../data/products.json');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            this.products = data.products || [];
            this.categories = data.categories || [];
            this.isLoaded = true;
            
            console.log(`Successfully loaded ${this.products.length} products`);
            return this.products;
            
        } catch (error) {
            console.error('Failed to load products:', error);
            // 提供备用数据
            this.products = this.getFallbackProducts();
            this.categories = this.getFallbackCategories();
            this.isLoaded = true;
            return this.products;
        }
    }

    // 备用产品数据
    getFallbackProducts() {
        return [
            {
                id: 1,
                company: "Harmoney",
                product: "Personal Loans",
                amount: "NZ$2,000–$100,000",
                approvalTime: "1–2 days",
                approvalRate: "High",
                popularity: "Very High",
                revolving: false,
                incentives: "None",
                category: "P2P Lender",
                commission: 25.00,
                redirectUrl: "https://www.harmoney.co.nz/",
                description: "New Zealand's first and largest peer-to-peer lender",
                isActive: true
            },
            {
                id: 2,
                company: "Avanti Finance",
                product: "Personal Loans",
                amount: "NZ$5,000–$100,000",
                approvalTime: "1–2 days",
                approvalRate: "High",
                popularity: "High",
                revolving: false,
                incentives: "None",
                category: "Non-Bank Lender",
                commission: 22.00,
                redirectUrl: "https://www.avantifinance.co.nz/",
                description: "Specialist finance company offering personal loans",
                isActive: true
            },
            {
                id: 3,
                company: "Laybuy",
                product: "BNPL",
                amount: "Up to NZ$1,500",
                approvalTime: "Instant",
                approvalRate: "High",
                popularity: "Very High",
                revolving: true,
                incentives: "First purchase discount",
                category: "BNPL Service",
                commission: 8.00,
                redirectUrl: "https://www.laybuy.com/nz",
                description: "Buy now, pay later in 6 weekly payments",
                isActive: true
            }
        ];
    }

    getFallbackCategories() {
        return ["P2P Lender", "Non-Bank Lender", "BNPL Service", "Credit Union", "Bank"];
    }

    // 其他方法保持不变...
    async getAllProducts() {
        if (!this.isLoaded) {
            await this.loadProducts();
        }
        return this.products.filter(product => product.isActive !== false);
    }

    async getFeaturedProducts(limit = 6) {
        const products = await this.getAllProducts();
        return products.slice(0, limit);
    }

    // ... 其他方法保持不变
}

// ClickTracker 类保持不变...
class ClickTracker {
    constructor() {
        this.clicks = this.loadClicks();
    }

    loadClicks() {
        try {
            return JSON.parse(localStorage.getItem('nz_product_clicks')) || [];
        } catch (error) {
            console.error('Failed to load clicks:', error);
            return [];
        }
    }

    saveClicks() {
        try {
            localStorage.setItem('nz_product_clicks', JSON.stringify(this.clicks));
        } catch (error) {
            console.error('Failed to save clicks:', error);
        }
    }

    recordClick(productId, productName, commission, additionalData = {}) {
        const clickData = {
            id: Date.now(),
            productId,
            productName,
            commission,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            referrer: document.referrer,
            ...additionalData
        };

        this.clicks.push(clickData);
        
        if (this.clicks.length > 1000) {
            this.clicks = this.clicks.slice(-500);
        }
        
        this.saveClicks();
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'product_click', {
                'product_id': productId,
                'product_name': productName,
                'commission': commission,
                'event_category': 'nz_loan_products',
                'currency': 'NZD'
            });
        }

        return clickData;
    }
}

// 创建全局实例
const loanAPI = new LoanAPI();
const clickTracker = new ClickTracker();
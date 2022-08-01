import axios from "axios";

class ApiClient {
    constructor(remoteHostUrl) {
        this.remoteHostUrl = remoteHostUrl;
        this.token = null;
        this.tokenName = "autolog_token";
    }

    /**
     * token getter and setter
     */

    getToken() {
        return this.token;
    }

    setToken(token) {
        this.token = token;
        localStorage.setItem(this.tokenName, this.token);
    }

    /**
     * Standard request function used for any request into the API client
     */

    async request({endpoint, method = "GET", data = {}}) {
        const url = `${this.remoteHostUrl}/${endpoint}`;

        const headers = {
            "Accept":"application/json, text/plain, /",
            "Content-Type": "application/json"
        }
		
        if (this.token) {
            headers["Authorization"] = `Bearer ${this.token}`;
        }

        try {
            const res = await axios({url, method, data, headers});
            return {data: res.data, error: null};
        }
        catch (err) {
            console.error({ errorResponse: err.response });
            const message = err?.response?.data?.error?.message;
            return {data: null, error: message || String(err)}
        }
    }

    /**
     * General user endpoints
     */

    async loginUser(credentials) {
        return await this.request({endpoint: 'auth/login', method:'POST', data: credentials});
    }

    async registerUser(credentials) {
        return await this.request({endpoint: 'auth/register', method: 'POST', data: credentials});
    }

    async fetchUserFromToken() {
        return await this.request({ endpoint: `auth/me`, method: `GET` })
    }

    /**
     * Settings endpoints
     */

    async patchUserCredentials(credentials) {
        return await this.request({endpoint: 'auth/', method: 'PATCH', data: credentials});
    }
    
    async patchUserPassword(credentials) {
        return await this.request({endpoint: 'auth/password', method: 'PATCH', data: credentials});
    }

    /**
     * Inventory endpoints
     */
    
    async createInventory(values) {
        return await this.request({endpoint: 'inventory/', method: 'POST', data: values})
    }

    async getAccessibleInventories() {
        return await this.request({endpoint: 'inventory/', method: 'GET'});
    }

    async getOwnedInventories() {
        return await this.request({endpoint: 'inventory/me', method: 'GET'});
    }

    async getInventoryMembers(inventoryId) {
        return await this.request({endpoint: 'inventory/member/list', method: 'POST', data: {inventoryId: inventoryId}});
    }

    async addInventoryMember(userEmail, inventoryId) {
        return await this.request({endpoint: 'inventory/member', method: 'POST', data: {userEmail: userEmail, inventoryId: inventoryId}})
    }

    /**
     * Item endpoints
     */

    async createItem(values) {
        return await this.request({endpoint: 'item/', method: 'POST', data: values})
    }

    async getItem(itemId) {
        return await this.request({endpoint: `item/id/${itemId}`, method: 'GET'});
    }
    
    async getItemList(inventoryId, pageNumber, search) {
        return await this.request({endpoint: `item/?inventoryId=${inventoryId}&page=${pageNumber || 0}&search=${search || ''}`, method: 'GET'});
    }

    async updateItem(itemId, data) {
        return await this.request({endpoint: `item/id/${itemId}`, method: 'PATCH', data: data});
    }

    async deleteItem(itemId) {
        return await this.request({endpoint: `item/id/${itemId}`, method: 'DELETE', data: data})
    }

    /**
     * Performance endpoints
     */
    async getPerformanceByCategory(inventoryId) {
        return await this.request({endpoint: `performance/?inventoryId=${inventoryId}`, method: 'GET'})
    }

    async getPerformanceFilteredByMonth(inventoryId, month) {
        return await this.request({endpoint: `performance/filter/?inventoryId=${inventoryId}&month=${month}`, method: "GET"})
    }

    async getPerformanceSortedByQuantityAsc(inventoryId, month) {
        return await this.request({endpoint: `performance/sort/ascending/?inventoryId=${inventoryId}&month=${month}`, method: "GET"})
    }

    async getPerformanceSortedByQuantityDesc(inventoryId, month) {
        return await this.request({endpoint: `performance/sort/descending/?inventoryId=${inventoryId}&month=${month}`, method: "GET"})
    }

    /**
     * Category endpoints
     */

    async getCategories(inventoryId) {
        return await this.request({endpoint: `category/?inventoryId=${inventoryId}`, method: `GET`})
    }

    async createCategory(inventoryId, categoryName) {
        return await this.request({endpoint: `category/`, method: `POST`, data: {inventoryId, categoryName}})
    }

    /**
     * Log endpoints
     */

    async getLogs(inventoryId) {
        return await this.request({endpoint: `logs/?inventoryId=${inventoryId}`, method: 'GET'})
    }
    
}

export default new ApiClient("http://localhost:3001");
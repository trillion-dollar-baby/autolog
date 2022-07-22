import axios from "axios";

class ApiClient {
    constructor(remoteHostUrl) {
        this.remoteHostUrl = remoteHostUrl;
        this.token = null;
        this.tokenName = "autolog_token";
    }

    setToken(token) {
        this.token = token;
        localStorage.setItem(this.tokenName, this.token);
    }

    async request({endpoint, method = "GET", data = {}}) {
        const url = `${this.remoteHostUrl}/${endpoint}`;
        console.log(url);

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
            return {data: null, error: message || String(error)}
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

    async changeUserCredentials(credentials) {
        return await this.request({endpoint: 'auth/change', method: 'PATCH', data: credentials});
    }
    
    async changeUserPassword(credentials) {
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
        return await this.request({endpoint: 'inventory/member/list', method: 'GET', data: {inventoryId: inventoryId}});
    }

    async addInventoryMember(userEmail, inventoryId) {
        return await this.request({endpoint: 'inventory/member', method: 'POST', data: {userEmail: userEmail, inventoryId: inventoryId}})
    }
}

export default new ApiClient("http://localhost:3001");
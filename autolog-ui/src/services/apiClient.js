import axios from "axios";
import { API_BASE_URL } from "../constants";

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
        const url = `${this.remoteHostUrl}${endpoint}`;

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
        return await this.request({endpoint: `inventory/member/list/?inventoryId=${inventoryId}`, method: 'GET'});
    }

    async addInventoryMember(inventoryId, userEmail, roleName) {
        return await this.request({endpoint: `inventory/member/?inventoryId=${inventoryId}`, method: 'POST', data: {userEmail: userEmail, roleName: roleName}});
    }

    async updateInventoryMemberRole(inventoryId, userEmail, roleName) {
        return await this.request({endpoint: `inventory/member/?inventoryId=${inventoryId}`, method: 'PATCH', data:{userEmail: userEmail, roleName: roleName}});
    }

    async removeInventoryMember(inventoryId, userEmail) {
        return await this.request({endpoint: `inventory/member/?inventoryId=${inventoryId}`, method: 'DELETE', data: {userEmail: userEmail} });
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
    
    async getItemList(inventoryId, pageNumber, search, category) {
        return await this.request({endpoint: `item/?inventoryId=${inventoryId}&page=${pageNumber || 0}&search=${search || ''}&category=${category || ''}`, method: 'GET'});
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

    /**
     * Roles endpoints
     */

    async getRoles(inventoryId) {
        return await this.request({endpoint: `inventory/roles/?inventoryId=${inventoryId}`, method: 'GET'});
    }

    async createRole(inventoryId, roleData) {
        return await this.request({endpoint: `inventory/roles/?inventoryId=${inventoryId}`, method: 'POST', data: {role: roleData}});
    }

    async updateRole(inventoryId, roleId, roleData) {
        return await this.request({endpoint: `inventory/roles/?inventoryId=${inventoryId}&roleId=${roleId}`, method: 'PATCH', data: {role: roleData}});
    }

    async deleteRole(inventoryId, roleId) {
        return await this.request({endpoint: `inventory/roles/?inventoryId=${inventoryId}&roleId=${roleId}`, method: 'DELETE'});
    }

    async getUserRole(inventoryId) {
        return await this.request({endpoint: `inventory/roles/me/?inventoryId=${inventoryId}`, method: 'GET'});
    }

    async getRoleById(inventoryId, roleId) {
        return await this.request({endpoint: `inventory/roles/?inventoryId=${inventoryId}&roleId=${roleId}`, method: `GET`});
    }
}

export default new ApiClient(API_BASE_URL);
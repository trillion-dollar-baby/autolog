import { createContext, useContext, useEffect, useState } from "react";
import apiClient from "../services/apiClient";
import AuthContext from "./auth";
import InventoryContext from "./inventory";


export const RoleContext = createContext({})

export const RoleContextProvider = ({ children }) => {
    const { userContext } = useContext(AuthContext);
    const { selectedInventoryContext } = useContext(InventoryContext);

    const [selectedInventory, setSelectedInventory] = selectedInventoryContext;

    const [isProcessing, setIsProcessing] = useState(false);
    const [roleList, setRoleList] = useState([]);

    // functionn to create a new role in the backend
    const createRole = async (roleData) => {
        if(selectedInventory?.inventoryId) {
            const {data, error} = await apiClient.createRole(selectedInventory?.inventoryId, roleData);
            console.log(data, error);
            if (data) {
                return { data: data, error: null }
            } else {
                console.error(error);
                return { data: null, error: error }
            }
        }
    }

    // get current user role in whichever inventory the user is
    const getUserRole = async () => {
        if (selectedInventory?.inventoryId) {
            const { data, error } = await apiClient.getUserRole(selectedInventory?.inventoryId);

            if (data) {
                return { data: data, error: null }
            } else {
                console.error(error);
                return { data: null, error: error }
            }
        }
    }

    // getter function for roleList
    const getRoleList = async () => {
        const { data, error } = await apiClient.getRoles(selectedInventory?.inventoryId);

        if (data) {
            return { data: data, error: null }
        } else {
            console.error(error);
            return { data: null, error: error }
        }
    }

    // function to update a specific role
    const updateRole = async (roleId, updatedRole) => {
        const { data, error } = await apiClient.updateRole(selectedInventory?.inventoryId, roleId, updatedRole);

        if (data) {
            return { data: data, error: null }
        } else {
            console.error(error);
            return { data: null, error: error }
        }
    }

    // function to delete a specific role
    const deleteRole = async (roleId) => {
        const { data, error } = await apiClient.deleteRole(selectedInventory?.inventoryId, roleId);

        if (data) {
            return data;
        } else {
            console.error(error)
            return error;
        }
    }

    const values = {
        createRole,
        getRoleList,
        getUserRole,
        updateRole,
        deleteRole,
    }

    return (
        <RoleContext.Provider value={values}>
            {children}
        </RoleContext.Provider>
    )
}   
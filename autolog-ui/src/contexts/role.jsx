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

    // useEffect(() => {
    //     const fetchRoleList = async () => {
    //         setIsProcessing(true);

    //         try {
    //             const result = await apiClient.getRoles(selectedInventory?.inventoryId);

    //             if (result?.data) {
    //                 setRoleList()
    //             }
    //         } catch (error) {
    //             console.error(error);
    //         }

    //         setIsProcessing(false);
    //     }

    //     // only fetch when user has a valid token
    //     if (apiClient.getToken()) {
    //         // fetchRoleList();
    //     }
    // }, [])

    // get current user role in whichever inventory the user is
    const getUserRole = async () => {
        if (selectedInventory?.inventoryId) {
            const { data, error } = await apiClient.getUserRole(selectedInventory?.inventoryId);

            if (data) {
                return { data: data, error: null }
            } else {
                return { data: null, error: error }
                console.error(error);
            }
        }
    }

    // getter function for roleList
    const getRoleList = async () => {
        const { data, error } = await apiClient.getRoles(selectedInventory?.inventoryId);

        if (data) {
            return { data: data, error: null }
        } else {
            return { data: null, error: error }
            console.error(error);
        }
    }

    // function to update a specific role
    const updateRole = async (roleId, updatedRole) => {
        const { data, error } = await apiClient.updateRole(selectedInventory?.inventoryId, roleId, updatedRole);

        if (data) {
            return { data: data, error: null }
        } else {
            return { data: null, error: error }
            console.error(error);
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
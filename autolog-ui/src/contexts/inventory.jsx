import { useEffect } from "react";
import { createContext, useState } from "react";
import apiClient from "../services/apiClient";

const InventoryContext = createContext({});

export const InventoryContextProvider = ({ children }) => {
  const [ownedInventories, setOwnedInventories] = useState([]);
  const [accessibleInventories, setAccessibleInventories] = useState([]);
  const [inventoryMembers, setInventoryMembers] = useState([]);
  const [error, setError] = useState("");
  

  return (
    <InventoryContext.Provider value={{
      ownedInventoriesContext: [ownedInventories, setOwnedInventories], 
      accessibleInventoriesContext: [accessibleInventories, setAccessibleInventories],
      inventoryMembersContext: [inventoryMembers, setInventoryMembers], 
      errorContext: [error, setError]
    }}>
      {children}
    </InventoryContext.Provider>
  )
}

const createInventory = async (values) => {
    const {data, error} = await apiClient.createInventory(values);
}

const getAccessibleInventories = async () => {
    const { data, error } = await apiClient.getAccessibleInventories();
}

const getOwnedInventories = async () => {
    const { data, error } = await apiClient.getOwnedInventories();
}

const getInventoryMembers = async (inventoryId) => {
    const { data, error } = await apiClient.getInventoryMembers(inventoryId);
}

const addInventoryMembers = async (userEmail, InventoryId) => {
    const { data, error } = await apiClient.addInventoryMember(userEmail, InventoryId);
}
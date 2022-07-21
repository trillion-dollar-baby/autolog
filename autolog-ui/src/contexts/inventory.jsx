import { useEffect } from "react";
import { createContext, useState } from "react";
import apiClient from "../services/apiClient";

const InventoryContext = createContext({});

export const InventoryContextProvider = ({ children }) => {
  const [ownedInventories, setOwnedInventories] = useState([]);
  const [accessibleInventories, setAccessibleInventories] = useState([]);
  const [inventoryMembers, setInventoryMembers] = useState([]);
  const [error, setError] = useState("");
  
  // Create an inventory
const createInventory = async (values) => {
    const {data, error} = await apiClient.createInventory(values);
    if (!error) {
        console.log("Created inventory is:", data);
       }
       else {
        console.error("Error acreating inventory, message:", error)
       }
}

// Get inventories that are accessible to the user
const getAccessibleInventories = async () => {
   const { data, error } = await apiClient.getAccessibleInventories();
   if (!error) {
    setInventoryMembers(data);
   }
   else {
    console.error("Error getting accessible inventories, message:", error)
   }
}

// get inventories owned by the user
const getOwnedInventories = async () => {
   const { data, error } = await apiClient.getOwnedInventories();
   if (!error) {
    setOwnedInventories(data);
   }
   else {
    console.error("Error getting owned inventories, message:", error)
   }
}

// Get members of a given inventory
const getInventoryMembers = async (inventoryId) => {
   const { data, error } = await apiClient.getInventoryMembers(inventoryId);
   if (!error) {
    setInventoryMembers(data);
   }
   else {
    console.error("Error getting inventory members, message:", error)
   }
}

// Add members to an inventory
const addInventoryMembers = async (userEmail, InventoryId) => {
   const { data, error } = await apiClient.addInventoryMember(userEmail, InventoryId);
   if (!error) {
    console.log("Added member is", data);
   }
   else {
    console.error("Error adding member to inventory, message:", error)
   }
}

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
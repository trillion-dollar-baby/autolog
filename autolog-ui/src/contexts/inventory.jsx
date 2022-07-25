import { useEffect } from "react";
import { useContext } from "react";
import { createContext, useState } from "react";
import apiClient from "../services/apiClient";
import AuthContext from "./auth";

const InventoryContext = createContext({});

export const InventoryContextProvider = ({ children }) => {
  const { userContext } = useContext(AuthContext);
  const [user, setUser] = userContext;

  const [ownedInventories, setOwnedInventories] = useState([]);
  const [accessibleInventories, setAccessibleInventories] = useState([]);
  const [inventoryMembers, setInventoryMembers] = useState([]);
  const [error, setError] = useState();
  const [isProcessing, setIsProcessing] = useState(false);

  // Based on selected inventory ID, component is going to load information for the application to be populated
  const [selectedInventory, setSelectedInventory] = useState();

  // When mounted or when user state is changed, get accessible inventories for user
  useEffect(() => {
    const fetchData = async () => {
      setIsProcessing(true);
      try {
        const { data, error } = await apiClient.getAccessibleInventories();

        if (data?.inventory) {
          // pick first accessible inventory (CHANGE)
          setAccessibleInventories(data?.inventory);
          setSelectedInventory(data?.inventory[0]);  // Select the first inventory initially, changable with the inventory dropdown
          console.log(data?.inventory);
        }

      } catch (error) {
        console.log("useEffect inventory.jsx: ", error);
      }

      setIsProcessing(false);
    }

    // fetch data only if there is a user logged in
    if (user?.email) {
      fetchData();
    }
  }, [user]);

  // Create an inventory
  const createInventory = async (values) => {
    const { data, error } = await apiClient.createInventory(values);
    if (!error) {
      console.log("Created inventory is:", data);
    }
    else {
      console.error("Error creating inventory, message:", error)
    }
  }

  // Get inventories that are accessible to the user
  const getAccessibleInventories = async () => {
    const { data, error } = await apiClient.getAccessibleInventories();
    if (!error) {
      if (data?.inventory) {
        setAccessibleInventories(data?.inventory);
        return { data: data?.inventory, error };
      }
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

  // Loading message to stop any other children components to render
  if (isProcessing) return (
    <div className="content">
      <h1>Loading inventory...</h1>
    </div>
  )

  return (
    <InventoryContext.Provider value={{
      inventoryGetContext: [createInventory, getAccessibleInventories, getOwnedInventories, getInventoryMembers],
      ownedInventoriesContext: [ownedInventories, setOwnedInventories],
      accessibleInventoriesContext: [accessibleInventories, setAccessibleInventories],
      processingContext: [isProcessing, setIsProcessing],
      selectedInventoryContext: [selectedInventory, setSelectedInventory],
      inventoryMembersContext: [inventoryMembers, setInventoryMembers],
      errorContext: [error, setError]
    }}>
      {children}
    </InventoryContext.Provider>
  )
}

export default InventoryContext;
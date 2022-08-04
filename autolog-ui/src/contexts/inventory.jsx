import { useEffect } from "react";
import { useContext } from "react";
import { createContext, useState } from "react";
import apiClient from "../services/apiClient";
import AuthContext from "./auth";
import Loading from "../components/Loading/Loading";

const InventoryContext = createContext({});

export const InventoryContextProvider = ({ children }) => {
  const { userContext } = useContext(AuthContext);
  const [user, setUser] = userContext;

  const [ownedInventories, setOwnedInventories] = useState([]);
  const [accessibleInventories, setAccessibleInventories] = useState([]);
  const [inventoryMembers, setInventoryMembers] = useState([]);
  const [error, setError] = useState();
  const [isProcessing, setIsProcessing] = useState(false);
  const [initialized, setInitialized] = useState(false);

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
          setSelectedInventory(data?.inventory[0]);
        }

      } catch (error) {
        console.error("useEffect inventory.jsx: ", error);
      }

      setIsProcessing(false);
    }

    // fetch data only if there is a user logged in
    if (user?.email && user?.emailConfirmed) {
      fetchData();
    }
    setInitialized(true);
  }, [user]);

   // Loading message to stop any other children components to render
  //  if ((isProcessing) || (initialized === false)) return (
  //   <div className="">
  //     {/* <Loading /> */}
  //   </div>
  // )

  // Create an inventory
  const createInventory = async (values) => {
    const { data, error } = await apiClient.createInventory(values);
    if (!error) {
      setAccessibleInventories((prev) => [...prev, data.inventory]);
      setSelectedInventory(data.inventory);
      // return data for components using this to know it is successful
      return {data: data, error: null}
    }
    else {
      console.error("Error creating inventory, message:", error)
      
      // return data for components using this to know it is not successful
      return {data: null, error: error}
    }
  }

  // Get inventories that are accessible to the user
  const getAccessibleInventories = async () => {
    if (selectedInventory.inventoryId !== null) {
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

  /**
   * Member requests
   */

  // Get members of a given inventory
  const getInventoryMembers = async () => {
    const { data, error } = await apiClient.getInventoryMembers(selectedInventory.inventoryId);

    if (!error) {
      setInventoryMembers(data?.members);
      return data?.members;
    } else {
      console.error("Error getting inventory members, message:", error)
    }
  }

  // Update member role
  const updateInventoryMember = async (memberEmail, roleName) => {
    const {data, error} = await apiClient.updateInventoryMemberRole(selectedInventory?.inventoryId, memberEmail, roleName)

    if(error) { 
      return error;
    }
  }

  // Add members to an inventory
  const addInventoryMembers = async (inventoryId, userEmail, roleName) => {
    const { data, error } = await apiClient.addInventoryMember(inventoryId, userEmail, roleName);

    if (!error) {
      return {data: data, error: null}
    } else {
      console.error("Error adding member to inventory, message:", error)
      return {data: null, error: error}
    }
  }

  // remove member from inventory
  const removeInventoryMember = async (userEmail) => {
    const {data, error} = await apiClient.removeInventoryMember(selectedInventory?.inventoryId, userEmail);

    if (!error) {
      return {data: data, error: null}
    } else {
      console.error("Error removing member from inventory, message:", error)
      return {data: null, error: error}
    }
  }

  return (
    <InventoryContext.Provider value={{
      inventoryGetContext: [getAccessibleInventories, getOwnedInventories, getInventoryMembers],
      inventoryPostContext: [createInventory],
      ownedInventoriesContext: [ownedInventories, setOwnedInventories],
      accessibleInventoriesContext: [accessibleInventories, setAccessibleInventories],
      processingContext: [isProcessing, setIsProcessing],
      selectedInventoryContext: [selectedInventory, setSelectedInventory],
      inventoryMembersContext: [inventoryMembers, setInventoryMembers],
      errorContext: [error, setError],
      initializedContext: [initialized, setInitialized],
      addMemberContext: [addInventoryMembers],
      updateInventoryMember,
      removeInventoryMember
    }}>
      {children}
    </InventoryContext.Provider>
  )
}

export default InventoryContext;
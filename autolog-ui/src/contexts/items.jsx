import { get } from "lodash";
import { createContext, useState, useEffect, useContext} from "react"
import apiClient from "../services/apiClient"
import AuthContext from "./auth";
import InventoriesContext from "./inventories";
import OrdersContext from "./orders";

const ItemContext = createContext({});

export const ItemContextProvider = ({children})=>{
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const [selectedItems,setSelectedItems] = useState([]);
  
  const {accessibleInventoriesContext, selectedInventoryContext} = useContext(InventoriesContext);
  const [accessibleInventories, setAccessibleInventories]= accessibleInventoriesContext;
  const [selectedInventory, setSelectedInventory] = selectedInventoryContext

  //should call the useAuthContext
  const { userContext } = useContext(AuthContext);
  const [user, setUser] = userContext;

  const { fetchOrdersContext } = useContext(OrdersContext);
  const [fetchOrdersList] = fetchOrdersContext;

// Get id of a given item
  // for when we are accessing the item through item details
  const getItem = async (itemId) => {
    const { data, error } = await apiClient.getItem(itemId, selectedInventory?.inventoryId);
    if (!error) {
      return {data, error: null};
    } else {
      console.error("Error getting items, message:", error);
      return {data: null, error};
    }
  };

  // Create item given data
  const createItem = async (values) => {
    const { data, error } = await apiClient.createItem(values, selectedInventory?.inventoryId);
    if (!error) {
      fetchOrdersList();
      return {data, error: null};
    } else {
      console.error("Error creating items, message:", error);
      return {data: null, error};
    }
  }

  // delete item given the id
  const deleteItem = async(id) => {
    const {data, error} = await apiClient.deleteItem(id, selectedInventory?.inventoryId);
    if (!error) {
      fetchOrdersList();
      return {data, error: null};
    } else {
      console.error("Error deleting item, message:", error);
      return {data: null, error};
    }
  }

  // Update item by given id
  const updateItem = async (itemId, values) => {
    const {data, error} = await apiClient.updateItem(itemId,values, selectedInventory?.inventoryId);
    if (!error) {
      fetchOrdersList();
      return {data, error: null};
    } else {
      console.error("Error getting items, message:", error);
      return {data: null, error};
    }
  }

  const values = {
    errorContext: [error, setError],
    loadingContext: [isLoading, setIsLoading],
    itemCreateContext: [createItem],
    itemUpdateContext: [updateItem],
    itemDeleteContext: [deleteItem],
    selectedItemsContext: [selectedItems, setSelectedItems],
    itemGetContext: [getItem],
  };

return(
        <ItemContext.Provider value={values}>
            {children}
        </ItemContext.Provider>
    )
}

export default ItemContext;
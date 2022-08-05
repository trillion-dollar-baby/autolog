import { get } from "lodash";
import { createContext, useState, useEffect, useContext} from "react"
import apiClient from "../services/apiClient"
import OrdersContext from "./orders";

const ItemContext = createContext({});

export const ItemContextProvider = ({children})=>{
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const { fetchOrdersContext } = useContext(OrdersContext);
  const [fetchOrdersList] = fetchOrdersContext;

// Get id of a given item
  // for when we are accessing the item through item details
  const getItem = async (itemId) => {
    const { data, error } = await apiClient.getItem(itemId);
    if (!error) {
      return {data, error: null};
    } else {
      console.error("Error getting items, message:", error);
      return {data: null, error};
    }
  };

  // Create item given data
  const createItem = async (values) => {
    const { data, error } = await apiClient.createItem(values);
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
    const {data, error} = await apiClient.deleteItem(id);
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
    const {data, error} = await apiClient.updateItem(itemId,values);
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
    itemGetContext: [getItem],
  };

return(
        <ItemContext.Provider value={values}>
            {children}
        </ItemContext.Provider>
    )
}

export default ItemContext;
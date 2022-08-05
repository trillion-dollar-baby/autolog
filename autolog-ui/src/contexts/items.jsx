import { createContext, useState, useEffect, useContext} from "react"
import apiClient from "../services/apiClient"

const ItemContext = createContext({});

export const ItemContextProvider = ({children})=>{
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Create item given data
  const createItem = async (values) => {
    const { data, error } = await apiClient.createItem(values);
    if (!error) {
      fetchItemList();
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
      fetchItemList();
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
      fetchItemList();
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
  };

return(
        <ItemContext.Provider value={values}>
            {children}
        </ItemContext.Provider>
    )
}

export default ItemContext;
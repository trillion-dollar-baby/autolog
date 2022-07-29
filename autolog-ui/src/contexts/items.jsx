import { createContext, useState, useEffect, useContext} from "react"
import apiClient from "../services/apiClient"
import InventoryContext from "./inventory"
import AuthContext from "./auth"

const ItemContext = createContext({});
export const ItemContextProvider = ({children})=>{
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
    
  //should call the useAuthContext
  const { userContext } = useContext(AuthContext);
  const [user, setUser] = userContext;

  //connect inventory context
  const {accessibleInventoriesContext, selectedInventoryContext} = useContext(InventoryContext);
  const [accessibleInventories, setAccessibleInventories]= accessibleInventoriesContext;
  const [selectedInventory, setSelectedInventory] = selectedInventoryContext


 useEffect(()=>{
    if (user && selectedInventory?.inventoryId) {
        fetchItemList()
    }

   }, [user, selectedInventory])

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

  // Search item
  const searchItem = async(search, pageNumber)=>{
    const {data, error} = await apiClient.getItemList(selectedInventory?.inventoryId, pageNumber, search);
    if(!error){
      return data;
    }
    else{
      console.error("Error searching for items, message:", error)
    }
  }


  // Fetch item list given the inventory id
  async function fetchItemList() {
    setIsLoading(true)

    const {data, err} = await apiClient.getItemList(selectedInventory?.inventoryId, 0, '')
    
    if(data){
      setItems(data?.items) 
    } else if(err) {
      setError(err)
    }

    setIsLoading(false)
  }

  const values = {
    errorContext: [error, setError],
    itemContext: [items, setItems],
    searchContext : [searchItem],
    searchTermContext: [searchTerm, setSearchTerm],
    loadingContext: [isLoading, setIsLoading],
    itemCreateContext: [createItem],
    itemGetContext: [getItem],
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
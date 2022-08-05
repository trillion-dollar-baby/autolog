import { createContext, useState, useEffect, useContext} from "react"
import apiClient from "../services/apiClient"
import InventoriesContext from "./inventories"
import AuthContext from "./auth"

const OrdersContext = createContext({});
export const OrdersContextProvider = ({children})=>{
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
    
  //should call the useAuthContext
  const { userContext } = useContext(AuthContext);
  const [user, setUser] = userContext;

  //connect inventory context
  const {accessibleInventoriesContext, selectedInventoryContext} = useContext(InventoriesContext);
  const [accessibleInventories, setAccessibleInventories]= accessibleInventoriesContext;
  const [selectedInventory, setSelectedInventory] = selectedInventoryContext


 useEffect(()=>{
    if (user && selectedInventory?.inventoryId) {
        fetchOrdersList()
    }

   }, [user, selectedInventory])

  // Get id of a given item
  // for when we are accessing the item through item details
  const getOrders = async (itemId) => {
    const { data, error } = await apiClient.getItem(itemId);
    if (!error) {
      return {data, error: null};
    } else {
      console.error("Error getting items, message:", error);
      return {data: null, error};
    }
  };


  // Search item
  const searchOrders = async(search, pageNumber, category)=>{
    const {data, error} = await apiClient.getItemList(selectedInventory?.inventoryId, pageNumber, search, category);
    if(!error){
      return data;
    } else {
      console.error("Error searching for items, message:", error)
    }
  }

  // Fetch item list given the inventory id
  async function fetchOrdersList() {
    setIsLoading(true)

    const {data, err} = await apiClient.getItemList(selectedInventory?.inventoryId, 0, '')
    
    if(data){
      setOrders(data?.items) 
    } else if(err) {
      setError(err)
    }

    setIsLoading(false)
  }

  const values = {
    errorContext: [error, setError],
    ordersContext: [orders],
    searchContext : [searchOrders],
    searchTermContext: [searchTerm, setSearchTerm],
    loadingContext: [isLoading, setIsLoading],
    getOrdersContext: [getOrders],

  };

return(
        <OrdersContext.Provider value={values}>
            {children}
        </OrdersContext.Provider>
    )
}

export default OrdersContext;
import { createContext, useState, useEffect, useContext} from "react"
import apiClient from "../services/apiClient"
import InventoryContext from "./inventory"
import AuthContext from "./auth"

const ItemContext = createContext({});
export const ItemContextProvider = ({children})=>{
  const [items, setItems] =useState([]);
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

    if (user) {
      async function fetchItemList(){
        setIsLoading(true)
        
        const {data, err} = await apiClient.getItemList(selectedInventory?.inventoryId, 0, '')
        
        if(data){
            setItems(data?.items) 
    
        }else if(err){
    
        setError(err)
       
        }
        setIsLoading(false)
        }
        fetchItemList()
    }

   }, [user, selectedInventory])

   // Get id of a given item
   //for when we are accessing the item through item details
  const getItem = async (itemId) => {
    const { data, error } = await apiClient.getItem(itemId);
    if (!error) {
      return {data, error: null}
    }
    else {
      console.error("Error getting items, message:", error)
    }
  }

  //create item
  const createItem = async (values) => {
    const { data, error } = await apiClient.createItem(values);
    if (!error) {
      return {data, error: null}
    } else {
      console.error("Error creating items, message:", error);
      return {data: null, error};
    }
  }

  //search item
  const searchItem = async(searchTerm, pageNumber)=>{
    const {data, error} = await apiClient.getItemList(selectedInventory?.inventoryId, pageNumber, searchTerm);
    if(!error){
      return data;
      
    }
    else{
      console.error("Error searching for items, message:", error)
    }
  }

const values={errorContext: [error, setError], itemContext: [items, setItems], loadingContext: [isLoading, setIsLoading], itemCreateContext: [createItem], 
            searchContext:[searchItem], searchTermContext: [searchTerm, setSearchTerm], searchFilterContext: [searchFilter, setSearchFilter]}
   
return(
        <ItemContext.Provider value={values}>
            {children}
        </ItemContext.Provider>
    )
}

export default ItemContext;
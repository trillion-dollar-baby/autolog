import { createContext, useState, useEffect, useContext} from "react"
import apiClient from "../services/apiClient"
import InventoryContext from "./inventory"
import AuthContext from "./auth"

console.log("hello")
const ItemContext = createContext({});
export const ItemContextProvider = ({children})=>{
    console.log("hello")

    const [items, setItems] =useState([]);
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    
//should call the useAuthContext
const { userContext } = useContext(AuthContext);
const [user, setUser] = userContext;
//connect inventory context
const {accessibleInventoriesContext} = useContext(InventoryContext);
const [accessibleInventories, setAccessibleInventories]= accessibleInventoriesContext;

const {selectedInventoryContext}= useContext(InventoryContext);
const [selectedInventory, setSelectedInventory] = selectedInventoryContext


 useEffect(async ()=>{

    setIsLoading(true)
    console.log("reached 1")
    const {data, err} = await apiClient.getItem()
    console.log("reached 2")
    if(data){
        console.log(data);
        setItems(data?.items) 
    }else if(err){
    setError(err)
    console.log("reached 3")
    }
    setIsLoading(false)

   }, [user, selectedInventory])

   // Get id of a given item
  const getItemList = async (inventoryId, pageNumber, search) => {
    const { data, error } = await apiClient.getItemList(inventoryId, pageNumber, search);
    if (!error) {
      console.log("Items are:", data);
    }
    else {
      console.error("Error getting items, message:", error)
    }
  }

const values={errorContext: [error, setError], itemContext: [items, setItems], loadingContext: [isLoading, setIsLoading]}
   
return(
        <ItemContext.Provider value={values}>
            {children}
        </ItemContext.Provider>
    )
}

export default ItemContext;
import { createContext, useState, useEffect, useContext} from "react"
import apiClient from "../services/apiClient"
import InventoryContext from "./inventory"
import AuthContext from "./auth"

const PerformanceContext = createContext({});

export const PerformanceContextProvider = ({children})=>{
    const [performance, setPerformance] =useState([]);
    const [filter, setFilter] = useState({})
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    // Use InventoryContext to get the current selected inventory
    const {selectedInventoryContext}= useContext(InventoryContext);
    const [selectedInventory, setSelectedInventory] = selectedInventoryContext

    // Use AuthContext to get the current user (if there is one)
        const { userContext } = useContext(AuthContext);
        const [ user, setUser ] = userContext;

    
 useEffect(()=>{
      const fetchPerformanceList = async () => {
        setIsLoading(true)
        const {data, err} = await apiClient.getPerformance(selectedInventory?.inventoryId)
        
        if (data) {
            setPerformance(data?.performance) 
            
        }
        else if(err) {
            setError(err)
        }

        setIsLoading(false)
    }

    if (user && selectedInventory?.inventoryId != undefined) {
        fetchPerformanceList()
    }
   }, [user, selectedInventory])


const values={ loadingContext: [isLoading, setIsLoading], errorContext: [error, setError], performanceContext: [performance, setPerformance], filterContext: [filter, setFilter]}
   
return (
        <PerformanceContext.Provider value={values}>
            {children}
        </PerformanceContext.Provider>
    )
}

export default PerformanceContext;
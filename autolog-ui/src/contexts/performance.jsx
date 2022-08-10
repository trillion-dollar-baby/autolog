import { createContext, useState, useEffect, useContext} from "react"
import apiClient from "../services/apiClient"
import InventoriesContext from "./inventories"
import AuthContext from "./auth"
import OrdersContext from "./orders"

const PerformanceContext = createContext({});

export const PerformanceContextProvider = ({children})=>{
    const [performance, setPerformance] =useState([]);
    const [visualPerformance, setVisualPerformance] = useState([])
    const [filter, setFilter] = useState("");
    const [sort, setSort] = useState("");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Use InventoryContext to get the current selected inventory
    const {selectedInventoryContext}= useContext(InventoriesContext);
    const [selectedInventory, setSelectedInventory] = selectedInventoryContext;

    // Use AuthContext to get the current user (if there is one)
    const { userContext } = useContext(AuthContext);
    const [ user, setUser ] = userContext;

    // Use OrdersContext to add order list as a dependency for the useEffect
    const { ordersContext } = useContext(OrdersContext);
    const [ orders ] = ordersContext;



// Default use effect
useEffect(()=>{
    const fetchPerformanceList = async () => {
        setIsLoading(true)
        const {data, err} = await apiClient.getPerformanceByCategory(selectedInventory?.inventoryId)
        
        if (data) {
            setPerformance(data?.performance) 
            
        }
        else if(err) {
            setError(err)
        }

        setIsLoading(false)
    }

    const fetchVisualPerformanceList = async () => {
        setIsLoading(true)
        const {data, err} = await apiClient.getVisualPerformance(selectedInventory?.inventoryId)
        
        if (data) {
            setVisualPerformance(data?.performance) 
            
        }
        else if(err) {
            setError(err)
        }

        setIsLoading(false)
    }

    if (user && selectedInventory?.inventoryId != undefined) {
        fetchPerformanceList()
        fetchVisualPerformanceList()
    }
}, [user, selectedInventory, orders])


// Use effect for sorting and filter
useEffect(() => {
    if (user && selectedInventory?.inventoryId != undefined) {
        // Sort is ascending
        if (sort == "Quantity ↑") {
            // Pass inventory and filter. The backend will handle filter null values
            getPerformanceSortedByQuantityAsc(selectedInventory?.inventoryId, filter)
        }
        // Sort is descending
        else if (sort == "Quantity ↓") {
            // Pass inventory and filter. The backend will handle filter null values
            getPerformanceSortedByQuantityDesc(selectedInventory?.inventoryId, filter)
        }
        // There is no sorting, only filter
        else {
            getPerformanceFilteredByMonth(selectedInventory?.inventoryId, filter)
        }
    }

}, [sort, filter])


const getPerformanceFilteredByMonth = async (inventoryId, month) => {
    const {data, err} = await apiClient.getPerformanceFilteredByMonth(inventoryId, month)

    if (data) {
        setPerformance(data?.performance) 
        
    }
    else if(err) {
        setError(err)
    }
}

const getPerformanceSortedByQuantityAsc = async (inventoryId, month) => {
    const {data, err} = await apiClient.getPerformanceSortedByQuantityAsc(inventoryId, month)

    if (data) {
        setPerformance(data?.performance) 
        
    }
    else if(err) {
        setError(err)
    }
}

const getPerformanceSortedByQuantityDesc = async (inventoryId, month) => {
    const {data, err} = await apiClient.getPerformanceSortedByQuantityDesc(inventoryId, month)

    if (data) {
        setPerformance(data?.performance) 
        
    }
    else if(err) {
        setError(err)
    }
}


const values= { loadingContext: [isLoading, setIsLoading], errorContext: [error, setError], performanceContext: [performance, setPerformance], 
                filterContext: [filter, setFilter], sortContext: [sort, setSort], visualPerformanceContext: [visualPerformance]}
   
return (
        <PerformanceContext.Provider value={values}>
            {children}
        </PerformanceContext.Provider>
    )
}

export default PerformanceContext;
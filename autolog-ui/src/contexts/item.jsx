import { useEffect, useState } from "react";
import { createContext } from "react";
import apiClient from "../services/apiClient";


/**
 * item.jsx contains ContextProvider that is in charge 
 * of giving components functions for them to be populated
 * based on invetoryId retrieved by InventoryContext
 */
ItemContext = createContext({});

export const ItemContextProvider = ({children}) => {
    // useState hooks
    const [isProcessing, setIsProcessing] = useState(false);
    const [itemList, setItemList] = useState([]);
    const [error, setError] = useState();
     
    // when mounted or inventoryId changes, reset item list and populate with new ones for user
    useEffect(() => {
        // TODO: IMPLEMENT
    }, [user]);

    if(isProcessing) 
        return(
        <div className="content">
            <h1>Fetching items...</h1>
        </div>
    )

    return (
        <ItemContext.Provider value={{
            processingContext: [isProcessing, setIsProcessing],
            itemContext: [itemList, setItemList],
        }}>
        {children}
        </ItemContext.Provider>
    )
}
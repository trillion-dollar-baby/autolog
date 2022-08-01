import { useEffect, useContext } from "react";
import { createContext, useState } from "react";
import apiClient from "../services/apiClient";
import InventoryContext from "./inventory";
import AuthContext from "./auth";
import ItemContext from "./items";

const DashboardContext = createContext({});

export const DashboardContextProvider = ({ children }) => {
    const [logs, setLogs] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);

    // Use AuthContext to get the current user (if there is one)
    const { userContext } = useContext(AuthContext);
    const [user, setUser] = userContext;

    // Connect inventory context to get the current selected inventory
    const { selectedInventoryContext } = useContext(InventoryContext);
    const [selectedInventory, setSelectedInventory] = selectedInventoryContext;

    // Connect to item context to use the item list as a dependecy so logs update every time an item is created, updated, or deleted
    const { itemContext } = useContext(ItemContext);
    const [items, setItems] = itemContext;

    useEffect(() => {
        setIsProcessing(true);

        if (user && selectedInventory?.inventoryId != undefined) {
            getLogs();
        }

        setIsProcessing(false);
    }, [selectedInventory, items]);

    const getLogs = async () => {
        const { data, error } = await apiClient.getLogs(
            selectedInventory?.inventoryId
        );
        if (data) {
            setLogs(data.logs);
        } else {
            console.error("Error getting items, message:", error);
        }
    };

    return (
        <DashboardContext.Provider
            value={{
                logContext: [logs, setLogs],
                processingContext: [isProcessing, setIsProcessing],
            }}
        >
            {children}
        </DashboardContext.Provider>
    );
};

export default DashboardContext;

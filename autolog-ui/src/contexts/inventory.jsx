import { createContext, useState, useEffect, useContext } from "react";
import apiClient from "../services/apiClient";
import InventoriesContext from "./inventories";
import AuthContext from "./auth";
import OrdersContext from "./orders";

const InventoryContext = createContext({});
export const InventoryContextProvider = ({ children }) => {
    const [inventoryItems, setInventoryItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchFilter, setSearchFilter] = useState("");

    //should call the useAuthContext
    const { userContext } = useContext(AuthContext);
    const [user, setUser] = userContext;

    //connect inventory context
    const { accessibleInventoriesContext, selectedInventoryContext } =
        useContext(InventoriesContext);
    const [accessibleInventories, setAccessibleInventories] =
        accessibleInventoriesContext;
    const [selectedInventory, setSelectedInventory] = selectedInventoryContext;

    // Orders context to add as a dependecy for useEffect
    const { ordersContext } = useContext(OrdersContext);
    const [orders] = ordersContext;

    // useEffect(() => {
    //     if (user && selectedInventory?.inventoryId) {
    //         fetchItemList();
    //     }
    // }, [user, selectedInventory]);

    // Get id of a given item
    // for when we are accessing the item through item details
    const getItem = async (itemId) => {
        const { data, error } = await apiClient.getItem(itemId);
        if (!error) {
            return { data, error: null };
        } else {
            console.error("Error getting items, message:", error);
            return { data: null, error };
        }
    };

    // Search item
    const searchItem = async (search, pageNumber, category) => {
        const { data, error } = await apiClient.getOrdersItemList(
            selectedInventory?.inventoryId,
            pageNumber,
            search,
            category
        );
        if (!error) {
            return data;
        } else {
            console.error("Error searching for items, message:", error);
        }
    };

    // Fetch item list given the inventory id
    async function fetchItemList() {
        setIsLoading(true);

        const { data, err } = await apiClient.getInventoryItemList(
            selectedInventory?.inventoryId,
            0,
            ""
        );

        if (data) {
            setInventoryItems(data?.items);
        } else if (err) {
            setError(err);
        }

        setIsLoading(false);
    }

    const values = {
        errorContext: [error, setError],
        inventoryItemContext: [inventoryItems, setInventoryItems],
        searchContext: [searchItem],
        searchTermContext: [searchTerm, setSearchTerm],
        loadingContext: [isLoading, setIsLoading],
        itemGetContext: [getItem],
    };

    return (
        <InventoryContext.Provider value={values}>
            {children}
        </InventoryContext.Provider>
    );
};

export default InventoryContext;

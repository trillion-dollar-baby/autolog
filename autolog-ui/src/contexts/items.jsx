import { createContext, useState, useEffect, useContext } from "react"
import apiClient from "../services/apiClient"
import InventoryContext from "./inventory"
import AuthContext from "./auth"
import InventoriesContext from "./inventories";

const ItemContext = createContext({});

export const ItemContextProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);

  //should call the useAuthContext
  const { userContext } = useContext(AuthContext);
  const [user, setUser] = userContext;

  //connect inventory context
  const { accessibleInventoriesContext, selectedInventoryContext } = useContext(InventoriesContext);
  const [accessibleInventories, setAccessibleInventories] = accessibleInventoriesContext;
  const [selectedInventory, setSelectedInventory] = selectedInventoryContext


  useEffect(() => {
    if (user && selectedInventory?.inventoryId) {
      fetchGenericItemList()
    }

  }, [user, selectedInventory])

  // Get id of a given item
  // for when we are accessing the item through item details
  const getItem = async (itemId) => {
    const { data, error } = await apiClient.getItem(itemId, selectedInventory?.inventoryId);
    if (!error) {
      return { data, error: null };
    } else {
      console.error("Error getting items, message:", error);
      return { data: null, error };
    }
  };

  // Create item given data
  const createItem = async (values) => {
    const { data, error } = await apiClient.createItem(values, selectedInventory?.inventoryId);
    if (!error) {
      fetchGenericItemList();
      return { data, error: null };
    } else {
      console.error("Error creating items, message:", error);
      return { data: null, error };
    }
  }

  // delete item given the id
  const deleteItem = async (id) => {
    const { data, error } = await apiClient.deleteItem(id, selectedInventory?.inventoryId);
    if (!error) {
      fetchGenericItemList();
      return { data, error: null };
    } else {
      console.error("Error deleting item, message:", error);
      return { data: null, error };
    }
  }

  // Update item by given id
  const updateItem = async (itemId, values) => {
    const { data, error } = await apiClient.updateItem(itemId, values, selectedInventory?.inventoryId);
    if (!error) {
      fetchGenericItemList();
      return { data, error: null };
    } else {
      console.error("Error getting items, message:", error);
      return { data: null, error };
    }
  }

  // Search item
  const searchItem = async (search, pageNumber, category) => {
    const { data, error } = await apiClient.getInventoryItemList(selectedInventory?.inventoryId, pageNumber, search, category);
    if (!error) {
      return data;
    } else {
      console.error("Error searching for items, message:", error)
    }
  }
  // get a generic list of items with no parameters
  const fetchGenericItemList = async () => {
    setIsLoading(true)

    const { data, err } = await apiClient.getInventoryItemList(selectedInventory?.inventoryId, 0, '')

    if (data) {
      setItems(data?.items)
    } else if (err) {
      setError(err)
    }

    setIsLoading(false)
  }

  const values = {
    errorContext: [error, setError],
    itemContext: [items, setItems],
    searchContext: [searchItem],
    searchTermContext: [searchTerm, setSearchTerm],
    selectedItemsContext: [selectedItems, setSelectedItems],
    loadingContext: [isLoading, setIsLoading],
    itemCreateContext: [createItem],
    itemGetContext: [getItem],
    itemUpdateContext: [updateItem],
    itemDeleteContext: [deleteItem],
    fetchGenericItemList
  };

  return (
    <ItemContext.Provider value={values}>
      {children}
    </ItemContext.Provider>
  )
}

export default ItemContext;
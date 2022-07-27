import { createContext, useState, useEffect, useContext } from "react";
import apiClient from "../services/apiClient";
import InventoryContext from "./inventory";
import AuthContext from "./auth";

const ItemContext = createContext({});
export const ItemContextProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  //should call the useAuthContext
  const { userContext } = useContext(AuthContext);
  const [user, setUser] = userContext;
  //connect inventory context
  const { accessibleInventoriesContext } = useContext(InventoryContext);
  const [accessibleInventories, setAccessibleInventories] =
    accessibleInventoriesContext;

  const { selectedInventoryContext } = useContext(InventoryContext);
  const [selectedInventory, setSelectedInventory] = selectedInventoryContext;

  useEffect(() => {
      const fetchItemList = async () => {
        setIsLoading(true);

        const { data, err } = await apiClient.getItemList(
          selectedInventory?.inventoryId,
          0,
          ""
        );

        if (data) {
          setItems(data?.items);
        } else if (err) {
          setError(err);
        }
        setIsLoading(false);
      }

      if (user && selectedInventory?.inventoryId) {
        fetchItemList();
      }
  }, [user, selectedInventory]);

  // Get id of a given item
  // for when we are accessing the item through item details
  // const getItem = async (itemId) => {
  //   const { data, error } = await apiClient.getItem(itemId);
  //   if (!error) {
  //     console.log("Items are:", data);
  //   } else {
  //     console.error("Error getting items, message:", error);
  //   }
  // };

  // Create item
  const createItem = async (values) => {
    const { data, error } = await apiClient.createItem(values);
    if (!error) {
      // console.log("Created item is:", data);
    } else {
      console.error("Error creating items, message:", error);
    }
  };

  const values = {
    errorContext: [error, setError],
    itemContext: [items, setItems],
    loadingContext: [isLoading, setIsLoading],
    itemCreateContext: [createItem],
  };

  return <ItemContext.Provider value={values}>{children}</ItemContext.Provider>;
};

export default ItemContext;

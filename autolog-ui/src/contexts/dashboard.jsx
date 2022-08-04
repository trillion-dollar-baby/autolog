import { useEffect, useContext } from "react";
import { createContext, useState } from "react";
import apiClient from "../services/apiClient";
import InventoryContext from "./inventory";
import AuthContext from "./auth";
import ItemContext from "./items";

const DashboardContext = createContext({});

export const DashboardContextProvider = ({ children }) => {
  //logs
  const [logs, setLogs] = useState([]);
  //checklist
  const [todos, setTodos] = useState([]);
  //announcements
  const [announcement, setAnnouncement] = useState("");
  //is processing and error useStates
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  // Use AuthContext to get the current user (if there is one)
  const { userContext } = useContext(AuthContext);
  const [user, setUser] = userContext;

  // Connect inventory context to get the current selected inventory
  const { selectedInventoryContext } = useContext(InventoryContext);
  const [selectedInventory, setSelectedInventory] = selectedInventoryContext;

  // Connect to item context to use the item list as a dependecy so logs update every time an item is created, updated, or deleted
  const { itemContext } = useContext(ItemContext);
  const [items, setItems] = itemContext;

  //lets comeback to this later
  //for now, leave as is
  useEffect(() => {
    setIsProcessing(true);

    if (user && selectedInventory?.inventoryId != undefined) {
      getLogs();
      fetchList();
      fetchAnnouncement();
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

  // Create checklist given data
  const createList = async (list) => {
    const requestObj = {
        item: list,
        inventoryId: selectedInventory?.inventoryId
      }
    const { data, error } = await apiClient.createCheckListItem(requestObj);
    const listId = data.items.id;
    if (!error) {
      fetchList(listId);
      return { data, error: null };
    } else {
      console.error("Error creating checklist, message:", error);
      return { data: null, error };
    }
  };

  //update checklist
  const updateChecklist = async (itemId, values) => {
    
    const { data, error } = await apiClient.updateCheckList(itemId, values);
    if (!error) {
      fetchList();
      return { data, error: null };
    } else {
      console.error("Error updating checklist, message:", error);
      return { data: null, error };
    }
  };
  //delete checklist
  const deleteChecklist = async (id) => {
    const { data, error } = await apiClient.deleteCheckListItem(id);
    if (!error) {
      fetchList();
      return { data, error: null };
    } else {
      console.error("Error deleting checklist, message:", error);
      return { data: null, error };
    }
  };

  // Fetch checklist given the user id
  async function fetchList(listId) {
    setIsProcessing(true);

    const { data, err } = await apiClient.getCheckList(listId);

    if (data) {
      setTodos(data?.item.todos);
    } else if (err) {
      setError(err);
    }

    setIsProcessing(false);
  }

  

  //Create announcement given data
  const createAnnouncement = async (message) => {
    const requestObj = {
        inventoryId: selectedInventory?.inventoryId,
        announcement: message,
      }
    const { data, error } = await apiClient.createAnnouncements(requestObj);
    //send item id to backend

    const itemId = data.items.id;

    if (!error) {
      fetchAnnouncement();
      updateAnnouncement(itemId)
      
      return { data, error: null };
    } else {
      console.error("Error creating announcement, message:", error);
      return { data: null, error };
    }
  };

  //Delete announcement
  const deleteAnnouncement = async (itemId) => {
    const { data, error } = await apiClient.deleteAnnouncement(itemId);
    if (!error) {
      fetchAnnouncement();
      return { data, error: null };
    } else {
      console.error("Error deleting announcement, message:", error);
      return { data: null, error };
    }
  };
  //Update announcement
  const updateAnnouncement = async (itemId, values) => {
    const requestObj = {
        announcement: values
      }
    const { data, error } = await apiClient.updateAnnouncement(itemId, requestObj);
    if (!error) {
      fetchAnnouncement();
      return { data, error: null };
    } else {
      console.error("Error updating announcement, message:", error);
      return { data: null, error };
    }
  };

  //Fetch announcement given by item id
  async function fetchAnnouncement() {
    //return first item on the list (aka most recent)
    setIsProcessing(true);
    const { data, err } = await apiClient.getAnnouncement(selectedInventory?.inventoryId);

    if (data) {
      setAnnouncement(data?.item.message)
      
    } else if (err) {
      setError(err);
    }

    setIsProcessing(false);
  }

  const values = {
    checklistCreateContext: [createList],
    checklistGetContext: [fetchList],
    checklistUpdateContext: [updateChecklist],
    checklistDeleteContext: [deleteChecklist],
    announcementCreateContext: [createAnnouncement],
    announcementGetContext: [fetchAnnouncement],
    announcementUpdateContext: [updateAnnouncement],
    announcementDeleteContext: [deleteAnnouncement],
    errorContext: [error, setError],
    logContext: [logs, setLogs],
    checklistContext: [todos, setTodos],
    announcementContext: [announcement, setAnnouncement],
    processingContext: [isProcessing, setIsProcessing],
  };

  return (
    <DashboardContext.Provider value={values}>
      {children}
    </DashboardContext.Provider>
  );
};

export default DashboardContext;

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
  const [checklist, setChecklist] = useState([]);
  //announcements
  const [announcement, setAnnouncement] = useState([]);
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

  //note: this might not work for fetchList or fetchAnnouncement because the useEffect depends on the items
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
  const createList = async (values) => {
    const { data, error } = await apiClient.createCheckListItem(values);
    if (!error) {
      fetchList();
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
  async function fetchList() {
    setIsProcessing(true);

    const { data, err } = await apiClient.getCheckList(itemId);

    if (data) {
      setChecklist(data?.checklist);
    } else if (err) {
      setError(err);
    }

    setIsProcessing(false);
  }

  //Create announcement given data
  const createAnnouncement = async (values) => {
    const { data, error } = await apiClient.createAnnouncement(values);
    if (!error) {
      fetchAnnouncement();
      return { data, error: null };
    } else {
      console.error("Error creating announcement, message:", error);
      return { data: null, error };
    }
  };

  //Delete announcement
  const deleteAnnouncement = async (id) => {
    const { data, error } = await apiClient.deleteAnnouncement(id);
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
    const { data, error } = await apiClient.updateAnnouncement(itemId, values);
    if (!error) {
      fetchAnnouncement();
      return { data, error: null };
    } else {
      console.error("Error updating announcement, message:", error);
      return { data: null, error };
    }
  };

  //Fetch announcement given by user id
  async function fetchAnnouncement() {
    setIsProcessing(true);
    const { data, err } = await apiClient.getAnnouncement(itemId);

    if (data) {
      setAnnouncement(data?.announcement);
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
    checklistContext: [checklist, setChecklist],
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

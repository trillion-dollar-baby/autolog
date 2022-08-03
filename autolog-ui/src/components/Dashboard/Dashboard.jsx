import * as React from "react";
import "./Dashboard.css";
import { motion } from "framer-motion";
import { useState, useEffect, useContext } from "react";
import Table from "../Table/Table";
import AuthContext from "../../contexts/auth";
import DashboardContext from "../../contexts/dashboard";
import ButtonInvite from "../ButtonInvite/ButtonInvite";
import { ToastContext } from "../../contexts/toast";
import Checklist from "./Checklist";

export default function Dashboard() {
  //form handling
  const [message, setMessage] = useState("");

  // Auth context
  const { userContext } = useContext(AuthContext);
  const [user, setUser] = userContext;

  // Dashboard context
  const {
    logContext,
    announcementCreateContext,
    processingContext,
    announcementUpdateContext,
    announcementGetContext,
    announcementDeleteContext,
    announcementContext,
  } = useContext(DashboardContext);
  const [logs, setLogs] = logContext;
  const [fetchAnnouncement] = announcementGetContext;
  const [createAnnouncement] = announcementCreateContext;
  const [updateAnnouncement] = announcementUpdateContext;
  const [announcement, setAnnouncement] = announcementContext;
  const [isProcessing, setIsProcessing] = processingContext;

  //Toast context
  const { notifyError, notifySuccess } = useContext(ToastContext);

  //announcement handler
  function handleSubmittedAnnouncement(e) {
    setMessage(e.target.value);
  }

  //submit button handler

  async function handleAnnouncementCreate() {
    setIsProcessing(true);
    const { data, error } = await createAnnouncement(message);
    setIsProcessing(false);

    if (data) {
      notifySuccess(`Announcement successfully created!`);
      document.getElementById("announce").style.display = "block";
      document.getElementById("edit").style.display = "block";
      document.getElementById("inputBody").style.display = "none";
      document.getElementById("delete").style.display = "block";
      document.getElementById("post").style.display = "none";
      setMessage(data?.items.announcement);
      console.log("announcement is", data?.items.announcement)
    } else {
      notifyError(error);
    }
  }

  async function handleEditAnnouncement(){
    
    document.getElementById("announce").style.display = "none";
    document.getElementById("edit").style.display = "block";
    document.getElementById("inputBody").style.display = "block";
    document.getElementById("post").style.display = "block";

    setIsProcessing(true);
    const { data, error } = await updateAnnouncement(message.id, message);
    console.log("announcementId is", )
    setIsProcessing(false);
    console.log(data?.items.announcement)
    if (data) {
      notifySuccess(`Announcement successfully updated!`);
      console.log(data);
    } else {
      notifyError(error);
    }
  }

  async function handleDeleteAnnouncement(){
    setIsProcessing(true);
    const { data, error } = await updateAnnouncement(announcementId);
    
    setIsProcessing(false);

    if (data) {
      notifySuccess(`Announcement successfully deleted!`);
      console.log(data);
      document.getElementById("inputBody").style.display = "block";
    } else {
      notifyError(error);
    }
  }

  // Table Elements
  const columnLabelArr = [
    "LOG ID",
    "action",
    "USER",
    "ITEM ID",
    "INVENTORY ID",
    "CREATEDAT",
  ];
  const tableLabel = "Latest Editions";

  const containerVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: { delay: 0.3, duration: 0.3 },
    },
    exit: {
      opacity: 0,
      transition: { ease: "easeInOut" },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial={"hidden"}
      animate={"visible"}
      exit={"exit"}
      className="dashboard"
    >
      <div className="dashboard-header">
        <div className="greeting">
          <h2 className="welcome"> Welcome Back, {user.firstName}</h2>
        </div>
        <div className="invite">
          <ButtonInvite />
        </div>
      </div>
      <div className="dashboard-body">
        <div className="announcements-container">
          <Announcements
            handleSubmittedAnnouncement={handleSubmittedAnnouncement}
            message={message}
            handleAnnouncementCreate={handleAnnouncementCreate}
            handleEditAnnouncement={handleEditAnnouncement}
            handleDeleteAnnouncement={handleDeleteAnnouncement}
            announcement={announcement}
          />
        </div>
        <div className="checklist-container">
          <Checklist/>
        </div>
      </div>
      <div className="table-container">
        <Table
          tableElementArray={logs.length ? logs : []}
          tableColumnLabelArray={columnLabelArr}
          tableLabel={tableLabel}
        />
      </div>
    </motion.div>
  );
}

function Announcements({
  handleSubmittedAnnouncement,
  message, announcement,
  handleAnnouncementCreate, handleEditAnnouncement, handleDeleteAnnouncement
}) {
  return (
    <div className="content">
      <div className="header">
        <h2 className="title"> Announcements </h2>
      </div>
      <div className="body" id="inputBody">
        <input
          className="announcement-form"
          name="label"
          placeholder="Make an announcement here..."
          value={message}
          onChange={handleSubmittedAnnouncement}
        />
      </div>
      <div id ="announce">
        {message}
        </div>
      <div className="post" id="post">
        <button className="submit-post" onClick={handleAnnouncementCreate}>Post</button>
      </div>
      {/* Edit button will appear only if post is submitted */}
      <div className="edit" id="edit">
        <button className="edit-post" onClick={handleEditAnnouncement}> Edit </button>
      </div>
      <div className="delete" id="delete">
        <button className="delete-post" onClick={handleDeleteAnnouncement}> Delete </button>
      </div>
    </div>
  );
}

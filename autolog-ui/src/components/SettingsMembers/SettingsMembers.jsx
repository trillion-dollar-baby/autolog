import { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Form from '../Form/Form';

import './SettingsMembers.css';
import MemberList from '../MemberList/MemberList';
import Dropdown from '../Dropdown/Dropdown';
import InventoryContext from '../../contexts/inventory';
import apiClient from '../../services/apiClient';

export default function SettingsMembers() {
  const { inventoryGetContext, inventoryMembersContext, selectedInventoryContext } = useContext(InventoryContext);
  const [getAccessibleInventories, getOwnedInventories, getInventoryMembers] = inventoryGetContext;
  const [selectedInventory, setSelectedInventory] = selectedInventoryContext
  const [inventoryMembers, setInventoryMembers] = inventoryMembersContext;

  const data = {
    0: 'admin',
    1: 'manager',
    2: 'employee',
    3: 'viewer'
  }

  const [isProcessing, setIsProcessing] = useState(false);
  const [userRoles, setUserRoles] = useState(data);

  // when mounted fetch list of members
  useEffect(() => {
    const fetchData = async () => {
      setIsProcessing(true);
      const result = await getInventoryMembers();
      setIsProcessing(false)
    }

    fetchData();
  }, [selectedInventory])

  if (isProcessing) return (<></>)

  const containerVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: { delay: 0.3, duration: 0.3 }
    },
    exit: {
      opacity: 0,
    }
  }

  return (
    <motion.div className="settings-member"
      variants={containerVariants}
      initial={"hidden"}
      animate={"visible"}
      exit={"exit"}
    >
        <MemberList userArray={inventoryMembers} userRoles={userRoles} setUserRoles={setUserRoles} />
    </motion.div>
  )
}
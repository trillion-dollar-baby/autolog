import { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Form from '../Form/Form';

import './SettingsMembers.css';
import MemberList from '../MemberList/MemberList';
import Dropdown from '../Dropdown/Dropdown';
import InventoryContext from '../../contexts/inventory';
import apiClient from '../../services/apiClient';
import Loading from '../Loading/Loading';
import ButtonAction from '../Button/ButtonAction';
import { useNavigate } from 'react-router';

export default function SettingsMembers() {
  const { inventoryGetContext, inventoryMembersContext, selectedInventoryContext } = useContext(InventoryContext);
  const [getAccessibleInventories, getOwnedInventories, getInventoryMembers] = inventoryGetContext;
  const [selectedInventory, setSelectedInventory] = selectedInventoryContext
  const [inventoryMembers, setInventoryMembers] = inventoryMembersContext;

  const [isProcessing, setIsProcessing] = useState(false);
  const [userRoles, setUserRoles] = useState([]);

  const navigate = useNavigate();

  // when mounted fetch list of members
  useEffect(() => {
    const fetchData = async () => {
      setIsProcessing(true);
      const resultMembers = await getInventoryMembers();
      const resultRoles = await apiClient.getRoles(selectedInventory?.inventoryId);

      if (resultRoles?.data) {
        const roleNameArray = [];
        // append in array only the names as we don't need the ID and Dropdown component only accepts array of strings
        resultRoles?.data.forEach((item) => {
          roleNameArray.push(item?.roleName);
        })
        setUserRoles(roleNameArray);
      }

      setIsProcessing(false)
    }

    fetchData();
  }, [selectedInventory])

  const onClickRedirect = () => {
    navigate('../roles')
  }

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
      <MemberList userArray={inventoryMembers} roleArray={userRoles} />
    </motion.div>
  )
}
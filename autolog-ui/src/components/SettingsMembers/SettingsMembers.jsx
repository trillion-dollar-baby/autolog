import { useContext, useEffect, useState } from 'react';
import Form from '../Form/Form';

import './SettingsMembers.css';
import MemberList from '../MemberList/MemberList';
import Dropdown from '../Dropdown/Dropdown';
import InventoryContext from '../../contexts/inventory';
import apiClient from '../../services/apiClient';

export default function SettingsMembers() {
  const { inventoryGetContext, inventoryMembersContext, selectedInventoryContext } = useContext(InventoryContext);
  const [getAccessibleInventories, getOwnedInventories, getInventoryMembers] = inventoryGetContext;
  const [ selectedInventory, setSelectedInventory ] = selectedInventoryContext
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

  if (isProcessing) return (<h1>Loading...</h1>)

  return (
    <div>
      <div className="content">
        <MemberList userArray={inventoryMembers} userRoles={userRoles} setUserRoles={setUserRoles} />
      </div>
    </div>
  )
}
import { useContext, useEffect, useState } from 'react';
import Form from '../Form/Form';

import './SettingsMembers.css';
import MemberList from '../MemberList/MemberList';
import Dropdown from '../Dropdown/Dropdown';
import InventoryContext from '../../contexts/inventory';
import apiClient from '../../services/apiClient';

export default function SettingsMembers() {
  const { inventoryGetContext, inventoryMembersContext } = useContext(InventoryContext);
  const [getAccessibleInventories, getOwnedInventories, getInventoryMembers] = inventoryGetContext;
  const [inventoryMembers, setInventoryMembers] = inventoryMembersContext;

  const data = {
    0: 'admin',
    1: 'manager',
    2: 'employee',
    3: 'viewer'
  }

  const [isProcessing, setIsProcessing] = useState(false);
  const [userRoles, setUserRoles] = useState(data);
  const [userArray, setUserArray] = useState(inventoryMembers);

  // when mounted fetch list of members
  useEffect(() => {
    const fetchData = async () => {
      setIsProcessing(true);
      console.log("testsettings");
      const result = await getInventoryMembers();

      setIsProcessing(false)
    }

    fetchData();
  }, [])
  // const userArray = [
  //   {
  //     id: 0,
  //     firstName: 'enzo',
  //     lastName: 'falone',
  //     email: 'enzo@falone.io',
  //     role: 'admin'
  //   },
  //   {
  //     id: 1,
  //     firstName: 'enzo2',
  //     lastName: 'falone2',
  //     email: 'enzo2@falone.io',
  //     role: 'manager'
  //   },
  //   {
  //     id: 2,
  //     firstName: 'enzo3',
  //     lastName: 'falone3',
  //     email: 'enzo3@falone.io',
  //     role: 'employee'
  //   },
  //   {
  //     id: 3,
  //     firstName: 'enzo4',
  //     lastName: 'falone4',
  //     email: 'enzo4@falone.io',
  //     role: 'viewer'
  //   }
  // ]

  if (isProcessing) return (<h1>Loading...</h1>)

  return (
    <div>
      <div className="settings settings-members">
        <MemberList userArray={inventoryMembers} userRoles={userRoles} setUserRoles={setUserRoles} />
      </div>
    </div>
  )
}
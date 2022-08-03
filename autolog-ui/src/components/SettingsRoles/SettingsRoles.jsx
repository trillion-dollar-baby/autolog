import React, { useContext, useEffect, useState } from 'react'

import { motion } from 'framer-motion'
import ButtonAction from '../Button/ButtonAction'
import { RoleContext } from '../../contexts/role';
import apiClient from '../../services/apiClient';
import { ToastContext } from '../../contexts/toast';
import RoleList from '../RoleList/RoleList';
import InventoryContext from '../../contexts/inventory';

import './SettingsRoles.css';
function SettingsRoles() {
    const { notifySuccess, notifyError } = useContext(ToastContext);
    const { selectedInventoryContext } = useContext(InventoryContext);
    const { getRoleList, updateRole, deleteRole } = useContext(RoleContext);

    const [selectedInventory, setSelectedInventory] = selectedInventoryContext;

    const [roleList, setRoleList] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);

    // fetch list of roles available in inventory on mount
    useEffect(() => {
        const fetchList = async () => {
            setIsProcessing(true);
            try {
                const result = await getRoleList();

                if (result?.data) {
                    setRoleList(result.data)
                }
            } catch (error) {
                console.error(error);
                notifyError(error);
            }
            setIsProcessing(false);
        }

        if (selectedInventory?.inventoryId) {
            fetchList();
        }
    }, [selectedInventory?.inventoryId])

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

    if (isProcessing) return (<></>)

    return (
        <motion.div className="settings-roles"
            variants={containerVariants}
            initial={"hidden"}
            animate={"visible"}
            exit={"exit"}>
                <RoleList roleArray={roleList} />
            <div className="content">
                <ButtonAction label={"Create new role"} color={"#2EAF79"} />
            </div>
        </motion.div>
    )
}

export default SettingsRoles
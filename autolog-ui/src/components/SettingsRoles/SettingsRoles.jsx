import React, { useContext, useEffect, useState } from 'react'

import { AnimatePresence, motion } from 'framer-motion'
import ButtonAction from '../Button/ButtonAction'
import { RoleContext } from '../../contexts/role';
import apiClient from '../../services/apiClient';
import { ToastContext } from '../../contexts/toast';
import RoleList from '../RoleList/RoleList';
import InventoriesContext from '../../contexts/inventories';

import './SettingsRoles.css';
import ModalCreateRole from '../ModalCreateRole/ModalCreateRole';
import ModalWarning from '../ModalWarning/ModalWarning';
function SettingsRoles() {
    const { notifySuccess, notifyError } = useContext(ToastContext);
    const { selectedInventoryContext } = useContext(InventoriesContext);
    const { getRoleList, updateRole, deleteRole } = useContext(RoleContext);

    const [selectedInventory, setSelectedInventory] = selectedInventoryContext;

    const [roleList, setRoleList] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);

    const [modalOpen, setModalOpen] = useState(false);
    const [modalWarningOpen, setModalWarningOpen] = useState(false);

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    //function that will refresh the list of roles
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

    // fetch list of roles available in inventory on mount
    useEffect(() => {
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
                <RoleList roleArray={roleList} fetchList={fetchList}/>
            <div className="button-wrapper">
                <ButtonAction onClick={openModal} label={"Create new role"} color={"#2EAF79"} />
            </div>
            <AnimatePresence
				initial={false}
				exitBeforeEnter={true}
				onExitComplete={() => null}>
				{
					(modalOpen &&
					<ModalCreateRole fetchList={fetchList} closeModal={closeModal}/>)
				}
			</AnimatePresence>
        </motion.div>
    )
}

export default SettingsRoles
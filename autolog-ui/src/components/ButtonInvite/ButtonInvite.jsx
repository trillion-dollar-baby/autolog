import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { useContext } from 'react';
import { useState } from 'react'
import InventoryContext from '../../contexts/inventory';
import Dropdown from '../Dropdown/Dropdown';
import Form from '../Form/Form';
import Modal from '../Modal/Modal';
import ModalInvite from '../ModalInvite/ModalInvite';

/**
 * Component that acts as a button that opens a modal to 
 * invite members into the current selectedInventory state ID
 */

import './ButtonInvite.css'

function ButtonInvite() {

	// Modal hook, error message, loading inside modal
	const [modalOpen, setModalOpen] = useState(false);

	// manage modal states
	const closeModal = () => setModalOpen(false);
	const openModal = () => setModalOpen(true);

	// form state
    const [formState, setFormState] = useState({});

	// function to handle Add button in modal and make an API call
    const onSubmitMember = async () => {
        // check only form value in this modal
        if (!formState.hasOwnProperty("email") || !formState.email.includes("@") || formState.email.length === 0) {
            setModalError("Invalid email");
        } else {
            setModalProcessing(true);

            const { data, error } = await addInventoryMembers(formState.email, selectedInventory.inventoryId);

            // if an error was returned, let user know
            if (error) {
                setModalError(error);
            }

            // close modal and reset form if successful
            if (data) {
                setFormState({});
                closeModal();
            }

            //TODO: toast saying this is successful

            setModalProcessing(false);
        }
    }

	return (
		<>
			<motion.button whileTap={{scale:0.98}} onClick={openModal} className="btn-invite">Invite</motion.button>

			<AnimatePresence
				initial={false}
				exitBeforeEnter={true}
				onExitComplete={() => null}>
				{
					modalOpen &&
					<ModalInvite closeModal={closeModal} formState={formState} setFormState={setFormState} onSubmitMember={onSubmitMember}/>
				}
			</AnimatePresence>
		</>
	)
}



export default ButtonInvite
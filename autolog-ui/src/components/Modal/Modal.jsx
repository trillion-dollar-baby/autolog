import React, { useState } from 'react';
import { motion } from 'framer-motion';

import Backdrop from '../Backdrop/Backdrop'

import ModalBody from './ModalBody'
import ModalFooter from './ModalFooter'
import ModalHeader from './ModalHeader'

import './Modal.css'
import ModalButton from '../ModalButton/ModalButton';
import Form from '../Form/Form';

export default function Modal({ handleClose, title, body, onSubmit, actionButtons }) {
    

    const dropIn = {
        hidden: {
            y: '-100vh',
            opacity: 0,
        },
        visible: {
            y: '0',
            opacity: 1,
            transition: {
                duration: 0.1,
                type: "spring",
                damping: 25,
                stiffness: 500,
            }
        },
        exit: {
            y: '100vh',
            opacity: 0,
        }
    }


    return (
        <Backdrop onClick={handleClose}>
            <motion.div
                onClick={(e) => e.stopPropagation()}
                className='modal-container'
                variants={dropIn}
                initial='hidden'
                animate='visible'
                exit='exit'
            >
                <ModalHeader title={title}/>

                <ModalBody>
                    {body}
                </ModalBody>

                <ModalFooter>
                    <ModalButton 
                        style={{ 'backgroundColor': actionButtons?.close?.backgroundColor || 'var(--actionRed)', 'marginLeft': 'auto' }} 
                        onClick={handleClose}>
                            {actionButtons?.close?.label || "Close"}
                        </ModalButton>
                    {onSubmit && 
                    <ModalButton 
                        style={{ 'backgroundColor': actionButtons?.submit?.backgroundColor || 'var(--actionBlueAccent)' }} 
                        onClick={() => {onSubmit()}}>
                            {actionButtons?.submit?.label || "Create"}
                    </ModalButton>}
                </ModalFooter>
            </motion.div>
        </Backdrop>
    )
}






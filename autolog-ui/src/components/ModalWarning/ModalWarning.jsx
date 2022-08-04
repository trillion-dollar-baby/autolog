import _ from 'lodash';
import React from 'react'
import Modal from '../Modal/Modal'

import './ModalWarning.css';

/**
 * Reusable modal to make sure he did not misclick and reassure to perform request
 */
function ModalWarning({message, onSubmit, closeModal}) {

    const actionButtons = {
        close: {
            backgroundColor: "var(--actionBlueAccent)",
            label: "Discard"
        },
        submit: {
            backgroundColor: "var(--actionRed)",
            label: "Delete"
        }
    }

    return (
        <Modal
        title={'Warning'}
        body={<h3 className='warning-message'>{_.capitalize(message)}</h3>}
        onSubmit={onSubmit}
        handleClose={closeModal}
        actionButtons={actionButtons}
    />
  )
}

export default ModalWarning
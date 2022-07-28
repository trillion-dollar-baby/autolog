import React from 'react'

import './ModalButton.css'

import {motion} from 'framer-motion'

function ModalButton({children, style,onClick}) {
  return (
    <motion.button className={'modal-button'} style={style} whileTap={{scale:0.95}} onClick={onClick}>
        {children}
    </motion.button>
  )
}

export default ModalButton
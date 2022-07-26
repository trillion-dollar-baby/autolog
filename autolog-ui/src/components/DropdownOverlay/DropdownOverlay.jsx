import React from 'react'

import './DropdownOverlay.css'

function DropdownOverlay({onClick}) {
  return (
    <div onClick={onClick} className='overlay'/>
  )
}

export default DropdownOverlay
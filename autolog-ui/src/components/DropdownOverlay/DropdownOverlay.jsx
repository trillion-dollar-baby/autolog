import React from 'react'

import './DropdownOverlay.css'

function DropdownOverlay({onBlur}) {
  return (
    <div onClick={onBlur} className='overlay'/>
  )
}

export default DropdownOverlay
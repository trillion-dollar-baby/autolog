import React from 'react'

import './RoleAbility.css'

function RoleAbility({label, state}) {
  return (
    <div className='role-ability'>
        <span className='role-ability-title'>{label}</span>
        <span className={`role-ability-state ${state ? 'green' : 'red'}`}>{state ? "\u2714" : "\u00D7"}</span>
    </div>
  )
}

export default RoleAbility
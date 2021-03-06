import _ from 'lodash';
import { useState } from 'react';

/**
 * Shows a list of members based on array received
 * each object contains
 * (firstName,
 *  lastName,
 *  email,
 *  role,
 *  )
 */

import MemberItem from '../MemberItem/MemberItem';

export default function MemberList({ userArray, userRoles, setUserRoles }) {

  // get useState to manage single roles depending on what is choosen in each item's dropdown
  const setUserRole = (id, role) => {
    setUserRoles((prevRoles) => ({
      ...prevRoles,
      [id]: role
    }))
  };

  return (
    <div className="member-list">
      {userArray.map((item, idx) => {
        let index = '';
        if(idx === 0) index = 'first';
        if(idx === userArray.length-1) index = 'last'

        return (
          <MemberItem index={index} id={item.id} firstName={item.firstName} lastName={item.lastName} email={item.email} userRole={userRoles[item.id]} setUserRole={setUserRole}/>
        )
      })}
    </div>
  )
}
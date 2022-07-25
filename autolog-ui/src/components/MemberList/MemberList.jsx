import _ from 'lodash';
import { useState } from 'react';
import MemberItem from '../MemberItem/MemberItem';
import './MemberList.css';

/**
 * Shows a list of members based on array received
 * each object contains
 * (firstName,
 *  lastName,
 *  email,
 *  role,
 *  )
 */


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
      {userArray?.map((item, idx) => {
        let index = '';
        if(idx === 0) index += ' first';
        if(idx === userArray.length-1) index += ' last'

        return (
          <MemberItem key={idx} index={index} id={item.id} firstName={item.firstName} lastName={item.lastName} email={item.userEmail} userRole={userRoles[item.id]} setUserRole={setUserRole}/>
        )
      })}
    </div>
  )
}
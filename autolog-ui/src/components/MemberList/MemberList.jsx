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

export default function MemberList({userArray}) {

    return(
        <div className="member-list">
            <MemberItem/>
        </div>
    )
}
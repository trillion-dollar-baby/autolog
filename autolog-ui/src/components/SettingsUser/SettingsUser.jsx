import { useEffect } from 'react';
import { useState } from 'react';
import Form from '../Form/Form';
import './SettingsUser.css';

export default function SettingsUser() {
    const dummyForm = {
        firstName: 'enzo',
        lastName: 'falone',
        phoneNumber: '1234567890',
        email: 'enzo@falone.io',
        username: 'enzofalone'
    }

    // TODO: populate forms with information from API client
    const [form, setForm] = useState(dummyForm);
    const [passwordForm, setPasswordForm] = useState({});

    //TODO: if the user changes the original value, render update button
    // record changes
    const [change, setChange] = useState(false);
    const [passwordChange, setPasswordChange] = useState(false);

    const [passwordError, setPasswordError] = useState(false);

    // what values we want in the form
    const formArray = [
        {
            label: "First Name",
            name: "firstName",
            type: "text",
            placeholder: "First Name"
        },
        {
            label: "Last Name",
            name: "lastName",
            type: "text",
            placeholder: "Last Name"
        },
        {
            label: "Phone Number",
            name: "phoneNumber",
            type: "tel",
            placeholder: "No phone number found"
        },
        {
            label: "Email",
            name: "email",
            type: "email",
            placeholder: "Email"
        },
        {
            label: "Username",
            name: "username",
            type: "text",
            placeholder: "Username"
        }
    ]

    const passwordFormArray = [
        {
            label: "New Password",
            name: "password",
            type: "password",
            placeholder: "New password"
        },
        {
            label: "Re-enter New Password",
            name: "rePassword",
            type: "password",
            placeholder: "Re-enter New password"
        }
    ]

    // if original data received from database is different from what the user has, 
    // render Update button to perform the changes in database as well 

    useEffect(() => {
        Object.keys(dummyForm).forEach((val, idx) => {
            if (dummyForm[val] !== form[val]) {
                console.log('change occurred')
                setChange(true);
            }
        })

        
    },[form])

    // if there is a password change, check if they both match, if they don't, let user know
    useEffect(() => {
        // if both fields do not match, set useState true to render an error message 
        console.log(passwordForm);
        setPasswordError(passwordForm.password !== passwordForm.rePassword);
        
        // if there is a change, set useState to true
        setPasswordChange(passwordForm?.password?.length > 0);

    }, [passwordForm])

    return (
        <div className="settings">
            <div className="settings-user">
                <Form formState={form} setFormState={setForm} formArray={formArray} />
            </div>
            
            {change && <p>works</p>}

            {/* divider */}
            <div className='settings-divider'>
                <span>Password settings</span>
            </div>

            <div className="settings-user">
                {/* password forms */}
                <Form formState={passwordForm} setFormState={setPasswordForm} formArray={passwordFormArray} />
                {/* if password does not match show error message */}
                {(passwordError && passwordChange) && <p style={{color: 'red'}}>you stupid the password does not match!</p>}
                {(!passwordError && passwordChange) && <p style={{color: 'green'}}> you got it brah</p> }
            </div>

        </div>
    )
}
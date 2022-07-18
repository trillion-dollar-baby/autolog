import { useState } from 'react';
import Form from '../Form/Form';
import './SettingsUser.css';

export default function SettingsUser() {
    // TODO: populate forms with information from API client
    const [form, setForm] = useState({});
    const [passwordForm, setPasswordForm] = useState({});

    //TODO: if the user changes the original value, render update button
    // record changes
    const [change, setChange] = useState(false);


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
            name: "re-password",
            type: "password",
            placeholder: "Re-enter New password"
        }
        
    ]

    return (
        <div className="settings">
            <div className="settings-user">
                <Form formState={form} setFormState={setForm} formArray={formArray} />
            </div>

            <div className='settings-divider'>
                <span>Password settings</span>
            </div>

            <div className="settings-user">
                <Form formState={passwordForm} setFormState={setPasswordForm} formArray={passwordFormArray} />
            </div>
            
        </div>
    )
}
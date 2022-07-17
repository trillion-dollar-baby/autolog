import { useState } from 'react';
import Form from '../Form/Form';
import './SettingsUser.css';

export default function SettingsUser() {
    const [form, setForm] = useState({});


    //TODO: if the user changes the original value, render update button

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

    return (
        <div className="settings content settings-user">
            <Form formState={form} setFormState={setForm} formArray={formArray}/>

            <div className='settings-divider'/>

        </div>
    )
}
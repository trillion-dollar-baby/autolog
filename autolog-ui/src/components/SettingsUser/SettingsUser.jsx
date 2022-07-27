import { useContext, useEffect } from 'react';
import { useState } from 'react';
import {motion} from 'framer-motion';
import AuthContext from '../../contexts/auth';
import ButtonAction from '../Button/ButtonAction';
import Form from '../Form/Form';
import './SettingsUser.css';

export default function SettingsUser() {
    const { userContext, settingsContext } = useContext(AuthContext);
    const [user, setUser] = userContext;
    const [updateUserData, updateUserPassword] = settingsContext;

    // populate forms with information from API client
    const [form, setForm] = useState({ ...user });
    const [passwordForm, setPasswordForm] = useState({});

    // record changes and success boolean to let user know if no errors resulted from request
    const [change, setChange] = useState(false);
    const [success, setSuccess] = useState();
    // record changes for password and track if passwords match
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

    const onSubmitCredentials = async () => {
        const result = await updateUserData(form);

        if (result) {
            setUser(result?.user);
        } else {
            console.log("error, " + result);
        }

        // reload page
        window.location.reload(false);
    }

    const onSubmitPassword = async () => {

    }
    
    // if original data received from database is different from what the user has, 
    // render Update button to perform the changes in database as well 

    useEffect(() => {
        // TODO: create form array by appending in each forEach iteration
        Object.keys(user).forEach((val, idx) => {
            if (user[val] !== form[val]) {
                console.log('change occurred')
                setChange(true);
            }
        })
    }, [form])

    // if there is a password change, check if they both match, if they don't, let user know
    useEffect(() => {
        // if both fields do not match, set useState true to render an error message 
        setPasswordError(passwordForm.password !== passwordForm.rePassword);

        // if there is a change, set useState to true
        setPasswordChange(passwordForm?.password?.length > 0);

    }, [passwordForm])

    const containerVariants = {
        hidden: {
            opacity: 0,
        },
        visible: {
            opacity: 1,
            transition: { delay: 0.3, duration: 0.3 }
        },
        exit: {
            opacity: 0,
            transition: {ease: 'easeInOut'}
        }
    }

    return (
        <motion.div className="settings"
            variants={containerVariants}
            initial={"hidden"}
            animate={"visible"}
            exit={"exit"}
            >
            <div className="settings-user">
                <Form formState={form} setFormState={setForm} formArray={formArray} />
            </div>

            {change && <ButtonAction label={'Update'} color='#3F5BE8' onClick={() => onSubmitCredentials()} />}

            {/* divider */}
            <div className='settings-divider'>
                <span>Password settings</span>
            </div>

            <div className="settings-user">
                {/* password forms */}
                <Form formState={passwordForm} setFormState={setPasswordForm} formArray={passwordFormArray} />
                {/* if password does not match show error message */}
                {(passwordError && passwordChange) && <p style={{ color: 'red' }}>Password does not match!</p>}
                {(!passwordError && passwordChange) && <ButtonAction label={'Update'} color='#3F5BE8' onClick={() => onSubmitPassword()} />}
            </div>

        </motion.div>
    )
}
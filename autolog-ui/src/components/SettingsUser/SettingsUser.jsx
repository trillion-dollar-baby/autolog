import { useContext, useEffect } from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import AuthContext from '../../contexts/auth';
import ButtonAction from '../Button/ButtonAction';
import Form from '../Form/Form';
import './SettingsUser.css';
import _ from 'lodash';
import Loading from '../Loading/Loading';

export default function SettingsUser() {
    const { userContext, settingsContext } = useContext(AuthContext);
    const [user, setUser] = userContext;
    const [updateUserData, updateUserPassword] = settingsContext;

    const [isProcessing, setIsProcessing] = useState(false);

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
        setIsProcessing(true);
        const result = await updateUserData(form);
        if (result) {
            setUser(result);
            setSuccess("Credentials have been successfully changed!");
        } else {
            console.log("error, " + result);
        }

        setIsProcessing(false);
    }

    const onSubmitPassword = async () => {
        setIsProcessing(true);

        const result = await updateUserPassword(passwordForm);

        if(result) {
            setSuccess("Password has been successfully changed!");
        } else {
            setPasswordError("An error has occurred while changing password!");
        }

        setIsProcessing(false);
    }

    // on mount, capitalize form string fields
    useEffect(() => {
        Object.keys(form).forEach((key) => {
            if (isNaN(form[key])) {
                const capitalizedField = _.capitalize(form[key]);

                setForm((prevForm) => ({
                    ...prevForm,
                    [key]: capitalizedField
                }))
            }
        })
    }, [])

    // if original data received from database is different from what the user has, 
    // render Update button to perform the changes in database as well 

    useEffect(() => {
        // TODO: create form array by appending in each forEach iteration
        if (user) {
            Object.keys(user).forEach((val, idx) => {
                const normalizedFormField = (isNaN(form[val]) ? form[val].toLowerCase() : form[val])
                const normalizedUserField = (isNaN(user[val]) ? user[val].toLowerCase() : user[val])

                if (normalizedUserField !== normalizedFormField) {
                    setChange(true);
                }
            })
        }
    }, [form])

    // if there is a password change, check if they both match, if they don't, let user know
    useEffect(() => {
        // if both fields do not match, set useState true to render an error message 
        setPasswordError(passwordForm.password !== passwordForm.rePassword);

        // if there is a change, set useState to true
        setPasswordChange(passwordForm?.password?.length > 0);

    }, [passwordForm])

    // animation properties
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
            transition: { ease: 'easeInOut' }
        }
    }

    return (
        <motion.div className="settings"
            variants={containerVariants}
            initial={"hidden"}
            animate={"visible"}
            exit={"exit"}
        >
            {isProcessing ? <Loading /> :
                <div className="settings-user">
                    <Form formState={form} setFormState={setForm} formArray={formArray} />
                </div>}
            {/* if change, render button */}
            {change &&
                <div className="submit-button">
                    <ButtonAction label={'Update'} color='#3F5BE8' onClick={() => onSubmitCredentials()} />
                </div>
            }

            {/* divider */}
            <div className='settings-divider'>
                <span>Password settings</span>
            </div>

            <div className="settings-user">
                {/* password forms */}
                <Form formState={passwordForm} setFormState={setPasswordForm} formArray={passwordFormArray} />
                {/* if password does not match show error message */}
                {(passwordError && passwordChange) && <p style={{ color: 'red' }}>Password does not match!</p>}
                {(!passwordError && passwordChange) &&
                    <div className="submit-button">
                        <ButtonAction label={'Update'} color='#3F5BE8' onClick={() => onSubmitPassword()} />
                    </div>}
                {passwordError && <label className='error-message'>{passwordError}</label>}
                {success && <label style={{'color':'green'}}>{success}</label>}
            </div>

        </motion.div>
    )
}
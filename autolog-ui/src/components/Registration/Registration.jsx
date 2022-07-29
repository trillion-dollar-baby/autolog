import * as React from 'react';
import './Registration.css'
import RedCar from '../../assets/red-car.png'
import apiClient from '../../services/apiClient';
import { Navigate, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import AuthContext from '../../contexts/auth';
import { useContext, useEffect } from 'react';

export default function Registration() {
    const { authContext, userContext, errorContext, processingContext } = useContext(AuthContext);
    const [user, setUser] = userContext;
    const [loginUser, registerUser, logoutUser] = authContext;
    const [error, setError] = errorContext;
    const [isProcessing, setIsProcessing] = processingContext;

    const navigate = useNavigate();
    const { state } = useLocation();

    const [credentials, setCredentials] = useState({ email: "", password: "", confirmPassword: "", firstName: "", lastName: "", phoneNumber: "", username: "" });

    // every time the component is unmounted, reset error
    useEffect(() => {
        return () => {
            setError();
        }
    }, [])

    // form handling
    const handleOnFormChange = (e) => {
        let name = e.target.name;
        let value = e.target.value;

        // reset error as user is changing values again
        setError();

        // Change the value of the given field
        setCredentials({ ...credentials, [name]: value });
    }

    // register user and check if it is valid
    const handleOnSubmit = async () => {
        if (credentials.password != credentials.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        const { error: errorLogin } = await registerUser(credentials);

        if (errorLogin) {
            console.error("auth error:", error);
            // let user know what happened
            setError(error);
        } else {
            navigate('/inventory/create');
        }
    }

    return (
        <div className='registration'>
            {(user?.email && <Navigate to={state?.path || '/dashboard'} />)}
            <div className='registration-page'>
                <div className='content'>
                    <div className='header'>
                        <img className='header-img' src={RedCar}></img>
                        <h1 className='header-welcome'> Welcome, start by making a new account</h1>
                        <h3 className='header-instruction'> Register your new account </h3>
                        <h3 className="error-message">{error}</h3>
                    </div>
                    <div className='registration-form'>
                        <div className='registration-username form-input-gray'>
                            <label className='input-label' htmlFor="username">Username</label>
                            <input className='registration-input' id="username" name="username" placeholder='Enter username...' value={credentials.username} onChange={handleOnFormChange}></input>
                        </div>
                        <div className='registration-form-row-1'>
                            <span className='registration-first-name form-input-gray'>
                                <label className='input-label' htmlFor="first-name">First name</label>
                                <input className='registration-input' id="first-name" name="firstName" placeholder='Enter first name...' value={credentials.firstName} onChange={handleOnFormChange}></input>
                            </span>
                            <span className='registration-last-name form-input-gray'>
                                <label className='input-label' htmlFor="last-name">Last name</label>
                                <input className='registration-input' id="last-name" name="lastName" placeholder='Enter last name...' value={credentials.lastName} onChange={handleOnFormChange}></input>
                            </span>
                        </div>
                        <div className='registration-form-row-2'>
                            <span className='registration-email form-input-gray'>
                                <label className='input-label' htmlFor="email">Email</label>
                                <input className='registration-input' id="email" name="email" placeholder='Enter email...' value={credentials.email} onChange={handleOnFormChange}></input>
                            </span>
                            <span className='registration-phone-number form-input-gray'>
                                <label className='input-label' htmlFor="phone-number">Phone number</label>
                                <input className='registration-input' id="phone-number" name="phoneNumber" placeholder='(xxx)-xxx-xxxx' value={credentials.phoneNumber} onChange={handleOnFormChange}></input>
                            </span>
                        </div>
                        <div className='registration-form-row-3'>
                            <span className='registration-password form-input-gray'>
                                <label className='input-label' htmlFor="password">Password</label>
                                <input className='registration-input' id="password" type='password' name="password" placeholder='**********' value={credentials.password} onChange={handleOnFormChange}></input>
                            </span>
                            <span className='registration-confirm-password form-input-gray'>
                                <label className='input-label' htmlFor="confirm-password">Confirm password</label>
                                <input className='registration-input' id="confirm-password" type='password' name="confirmPassword" placeholder='**********' value={credentials.confirmPassword} onChange={handleOnFormChange}></input>
                            </span>
                        </div>
                        <button className='registration-button' onClick={handleOnSubmit}> Register </button>
                    </div>
                    <div className='footer'>
                        <p> Already a user? </p>
                        <NavLink to='/login'> Sign in here! </NavLink>
                    </div>
                </div>
            </div >
        </div>
    )
}
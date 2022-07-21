import * as React from 'react';
import './Login.css'
import RedCar from '../../assets/red-car.png'
import apiClient from '../../services/apiClient';
import { Navigate, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import AuthContext from '../../contexts/auth';
import { useContext } from 'react';

export default function Login() {
    const {authContext, userContext} = useContext(AuthContext);
    const [user, setUser] = userContext;
    const [loginUser, registerUser, logoutUser] = authContext;

    const navigate = useNavigate();
    const { state } = useLocation();

    const [ credentials, setCredentials ] = useState({email: "", password: ""});
    const [error, setError] = useState();

    const handleOnFormChange = (e) => {
        let name = e.target.name;
        let value = e.target.value;

        // Change the value of the given field
        setCredentials({...credentials, [name]: value});

        // reset error
        setError();
    }

    const signInUser = async () => {
        const { data, error } = await loginUser(credentials);

        if (error) {
            console.log(error); // debug

            // let user know what happened
            setError(error);
        } else {
            navigate(state?.path || "/dashboard");
        }
    }

    return (
        <div className='login-page'>
            {(user?.email && <Navigate to={state?.path || '/dashboard'}/>)}
            <div className='content'>
                {/* header */}
                <div className='header'>
                    <img className='header-img' src={RedCar}></img>
                    <h1 className='header-welcome'> Welcome Back!</h1>
                    <h3 className='header-instruction'> Sign in to your account </h3>
                    <h3 className='error-message'>{error}</h3>
                </div>
                {/* form */}
                <div className='login-form'>
                    <div className='login-email form-input-gray'>
                        <label className='input-label' for="email">Email</label>
                        <input className='login-input' id="email" name="email" placeholder='Enter email...' value={credentials.email} onChange={handleOnFormChange}></input>
                    </div>
                    <div className='login-password form-input-gray'>
                        <label className='input-label' for="password">Password</label>
                        <input className='login-input' id="password" type="password" name="password" placeholder='Enter password...' value={credentials.password} onChange={handleOnFormChange}></input>
                    </div>
                    <button className='login-button' onClick={signInUser}> Sign In </button>
                </div>
                <div className='footer'>
                    <p> Not a user? </p>
                    <NavLink to='/register'> Register now! </NavLink>
                </div>
            </div>
        </div >
    )
}
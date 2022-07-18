import * as React from 'react';
import './Registration.css'
import RedCar from '../../assets/red-car.png'
import { NavLink } from 'react-router-dom';


export default function Registration() {
    return (
        <div className='registration'>
            <div className='registration-page'>
            <div className='content'>
                <div className='header'>
                    <img className='header-img' src={RedCar}></img>
                    <h1 className='header-welcome'> Welcome, start by making a new account</h1>
                    <h3 className='header-instruction'> Register your new account </h3>
                </div>
                <div className='registration-form'>
                    <div className='registration-username form-input-gray'>
                        <label className='input-label' for="username">Username</label>
                        <input className='registration-input' id="username" name="username" placeholder='Enter username...'></input>
                    </div>
                    <div className='registration-form-row-1'>
                        <span className='registration-first-name form-input-gray'>
                            <label className='input-label' for="first-name">First name</label>
                            <input className='registration-input' id="first-name" name="first-name" placeholder='Enter first name...'></input>
                        </span>
                        <span className='registration-last-name form-input-gray'>
                            <label className='input-label' for="last-name">Last name</label>
                            <input className='registration-input' id="last-name" name="last-name" placeholder='Enter last name...'></input>
                        </span>
                    </div>
                    <div className='registration-form-row-2'>
                        <span className='registration-email form-input-gray'>
                            <label className='input-label' for="email">Email</label>
                            <input className='registration-input' id="email" name="email" placeholder='Enter email...'></input>
                        </span>
                        <span className='registration-phone-number form-input-gray'>
                            <label className='input-label' for="phone-number">Phone number</label>
                            <input className='registration-input' id="phone-number" name="phone-number" placeholder='(xxx)-xxx-xxxx'></input>
                        </span>
                    </div>
                    <div className='registration-form-row-3'>
                        <span className='registration-password form-input-gray'>
                            <label className='input-label' for="password">Password</label>
                            <input className='registration-input' id="password" name="password" placeholder='**********'></input>
                        </span>
                        <span className='registration-confirm-password form-input-gray'>
                            <label className='input-label' for="confirm-password">Confirm password</label>
                            <input className='registration-input' id="confirm-password" name="confirm-password" placeholder='**********'></input>
                        </span>
                    </div>
                    <button className='registration-button'> Register </button>
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
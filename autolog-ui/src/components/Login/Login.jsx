import * as React from 'react';
import './Login.css'
import RedCar from '../../assets/red-car.png'

export default function Login() {
    return (
        <div className='login-page'>
            <div className='content'>
                <div className='header'>
                    <img className='header-img' src={RedCar}></img>
                    <h1 className='header-welcome'> Welcome Back!</h1>
                    <h3 className='header-instruction'> Sign in to your account </h3>
                </div>
                <div className='login-form'>
                    <div className='login-email'>
                    <label className='input-label' for="email">Email</label>
                    <input className='login-input' id="email" name="email" placeholder='Enter email...'></input>
                    </div>
                    <div className='login-password'>
                    <label className='input-label' for="password">Password</label>
                    <input className='login-input' id="password" name="password" placeholder='Enter password...'></input>
                    </div>
                    <button className='login-button'> Sign In </button>
                </div>
                <div className='footer'>
                    <p> Not a user? </p>
                    <a> Register now! </a>
                </div>
            </div>
        </div >
    )
}
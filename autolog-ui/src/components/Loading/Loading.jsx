import * as React from 'react'
import './Loading.css'
import RedCar from '../../assets/red-car.png'

export default function Loading() {
    return (
        <div className='loading-page'>
            <img className='loading-red-car' src={RedCar}></img>
        </div>
    )
}
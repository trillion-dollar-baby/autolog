import * as React from 'react';
import './Landing.css'
import YellowCar from "../../assets/yellow-car.png"
import placeholder from "../../assets/placeholder.jpg"
export default function Landing() {
    return (
        <div className='landing-page'>
            <div className="nav-heading">
            </div>
            <div className="hero">
                <div className="hero-1">
                    <div className="title-hero">
                        <h2> Free and easy-to-use solutions for automotive businesses </h2> 
                    </div>
                    <div className="description">
                        <p> Increase the efficiency of business by using Autolog, a cloud-based inventory management system which will improve the performance of small businesses with plug-and-play tools to quickly get started </p>
                    </div>
                </div>
                <div className="image">
                    <img className="yellowCar" src={YellowCar}></img>
                </div>
                
            </div>
                <div className="product-reviews">
                   <h3 className="review"> Product Reviews </h3>
                   <div className="review-card">
                    {/* <img>Review Image</img> */}
                    <p>Review 1</p>
                   </div>
                </div>

                <div className="contact-info">
                    <div className="info">
                        <p> Contact Info </p>
                    </div>
                    <div className="image-1">
                        <p> Image </p>
                    </div>
                </div>
                <div className="about-us">
                    <div className="about-title">
                    <h2 className="heading">
                        About Us
                    </h2>
                    </div>
                    <div className="about-images">
                        <img className="img" src={placeholder}></img>
                        <img className="img" src={placeholder}></img>
                        <img className="img" src={placeholder}></img>
                        <img className="img" src={placeholder}></img>
                    </div>
                    <div className="about-description">
                    <p> We are a group of developers interested in </p>
                    </div>

                </div>
                <div className="footer">
                    {/* Make this blue */}
                </div>

            

        </div>
    )
}
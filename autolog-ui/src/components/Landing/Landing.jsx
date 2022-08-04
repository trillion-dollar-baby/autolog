import * as React from 'react';
import './Landing.css'
import YellowCar from "../../assets/yellow-car.png"
import placeholder from "../../assets/placeholder.jpg"
import githubIcon from "../../assets/github-icon.png"
import twitterIcon from "../../assets/twitter-icon.png"
import discordIcon from "../../assets/discord-icon.png"
import Enzo from "../../assets/enzo.png"
import Deland from "../../assets/delandwithcat.jpg"
import Wynee from "../../assets/wynee.jpg"

export default function Landing() {
    return (
        <div className='landing-page'>
            <div className="hero">
                <div className="hero-description">
                    <div className="hero-title">
                        <h3> Affordable and easy-to-use solutions for automotive businesses. </h3> 
                    </div>
                    <div className="hero-message">
                        <p> Increase the efficiency of business by using <b>Autolog</b>, a cloud-based inventory management system which will improve the performance of small businesses with plug-and-play tools to quickly get started. </p>
                    </div>
                </div>
                <div className="hero-image">
                    <img className="yellowCar" src={YellowCar}></img>
                </div>
            </div>

            <div className='landing-page-body'>
                <div className="product-reviews"> 
                   <h3 className="product-review-title"> Product Reviews </h3>
                   <div className="product-review-body">
                        <div className="review-1">
                            <p> Product Review 1 </p>
                        </div>
                        <div className="review-2">
                            <p> Product Review 2 </p>
                        </div>
                    </div>
                </div>

                <div className="contact-info">
                    <h3 className="contact-info-title"> Contact Us </h3>
                    <div className="contact-info-body">
                        <div className="contact-info-1">
                            <p> Contact Info</p>
                        </div>
                    </div>
                </div>

                <div className="about-us">
                    <h3 className="about-us-title">
                        About Us
                    </h3>
                    <div className="about-images">
                        <img className="photo"src={Enzo}></img>
                        <img className="photo" src={Deland}></img>
                        <img className="photo" src={Wynee}></img>
                    </div>
                    <div className="about-description">
                    <p> We are a group of developers providing small businesses with solutions to their biggest problems. <b> AutoLog </b> was born out of the need for a inventory management system that could replace an outdated one, and also thrive in an autoshop's fast paced environment. Taking insight from 7 Stars — a local auto body shop in Brooklyn, NY — we customized AutoLog with features that serve their greatest needs.</p>
                    </div>

                </div>

            </div>
                <footer>
                    <div className="footer-description">
                    <p className="footer-message"> Join our mailing list to stay in the loop with our newest feature releases! </p>
                    </div>
                <div className="socials">
                    <div className="imgs">
                    <img className="icons" src={githubIcon}></img>
                    <img className="icons" src={twitterIcon}></img>
                    <img className="icons" src={discordIcon}></img>
                    </div>
                </div>
                </footer>

            

        </div>
    )
}
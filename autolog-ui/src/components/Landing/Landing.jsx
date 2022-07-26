import * as React from 'react';
import './Landing.css'
import YellowCar from "../../assets/yellow-car.png"
import placeholder from "../../assets/placeholder.jpg"
import githubIcon from "../../assets/github-icon.png"
import twitterIcon from "../../assets/twitter-icon.png"
import discordIcon from "../../assets/discord-icon.png"
import Enzo from "../../assets/enzo.png"
export default function Landing() {
    return (
        <div className='landing-page'>
            <div className="nav-heading">
            </div>
            <div className="hero">
                <div className="heros">
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
                   <div className="rev">
                        <div className="info">
                            <p> Product Review 1 </p>
                        </div>
                        <div className="info-2">
                            <p> Product Review 2 </p>
                        </div>
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
                    <h3 className="heading">
                        About Us
                    </h3>
                    </div>
                    <div className="about-images">
                        <img className="photo"src={Enzo}></img>
                        <img className="photo" src={placeholder}></img>
                        <img className="photo" src={placeholder}></img>
                    </div>
                    <div className="about-description">
                    <p> We are a group of developers interested in helping out small businesses find solutions to their biggest problems. AutoLog was born out of the need for  </p>
                    </div>

                </div>
                <div className="footers">
                    <div className="foot">
                    <p className="footer-description"> Join our mailing list to stay in the loop with our newest feature releases! </p>
                    </div>
                <div className="socials">
                    <div className="imgs">
                    <img className="icons" src={githubIcon}></img>
                    <img className="icons" src={twitterIcon}></img>
                    <img className="icons" src={discordIcon}></img>
                    </div>
                </div>
                </div>

            

        </div>
    )
}
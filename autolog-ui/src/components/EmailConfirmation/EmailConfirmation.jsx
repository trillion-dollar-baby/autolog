import React from "react";
import "./EmailConfirmation.css";
import RedCar from "../../assets/red-car.png";
import AuthContext from "../../contexts/auth";
import { useContext } from "react";
import { Navigate } from "react-router-dom";

export default function EmailConfirmation() {
    const { userContext } = useContext(AuthContext);
    const [user, setUser] = userContext;

    return (
        <div className="confirmation-content">
            {!user?.email && <Navigate to={"/login"} />}
            <div className="red-car-image">
                <img className="red-car" src={RedCar}></img>
            </div>
            <div className="confirmation-body">
                <h2> Almost set!</h2>
                <p>
                    {" "}
                    A verification email has been sent to your email{" "}
                    <b> {user?.email}</b> with the confirmation link attached{" "}
                </p>
            </div>
        </div>
    );
}

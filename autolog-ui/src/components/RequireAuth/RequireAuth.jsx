import { useContext } from "react";
import { Navigate, useLocation } from "react-router";
import AuthContext from "../../contexts/auth";
import apiClient from "../../services/apiClient";

export default function RequireAuth({ children }) {
    const { userContext, errorContext } = useContext(AuthContext);
    const location = useLocation();
    const [user, setUser] = userContext;
    const [error, setError] = errorContext;

    const notAuthorized = () => {
        // make user know that he is unauthorized
        setError("Unauthorized error, please log in")
        return <Navigate to='/login' replace state={{path: location.pathname}}/>
    }

    // if an user email is present in AuthContext, render page
    // if not, redirect to login page with an error message
    return (apiClient.getToken() ? 
        children 
        : 
        notAuthorized()
        );
}
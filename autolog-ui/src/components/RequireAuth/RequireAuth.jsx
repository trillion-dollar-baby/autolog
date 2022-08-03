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
        // Sets an error and redirects if the user is not logged in (authorized)
        setError("Unauthorized error, please log in")
        return <Navigate to='/login' replace state={{path: location.pathname}}/>
    }

    // If the user has not logged in (been authorized) then redirect to login page
    if (!apiClient.getToken()) {
        return notAuthorized()
    }
    // If the user has done both of the above, then allow the user to proceed to authenticated pages
    else {
        return children;
    }
    
}
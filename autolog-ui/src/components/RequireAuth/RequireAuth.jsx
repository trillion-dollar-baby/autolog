import { useContext } from "react";
import { Navigate, useLocation } from "react-router";
import AuthContext from "../../contexts/auth";
import InventoriesContext from "../../contexts/inventories";
import apiClient from "../../services/apiClient";

export default function RequireAuth({ children }) {
    const { userContext, errorContext } = useContext(AuthContext);
    const [user, setUser] = userContext;
    const [error, setError] = errorContext;
    
    const {accessibleInventoriesContext} = useContext(InventoriesContext);
    const [accessibleInventories, setAccessibleInventories] = accessibleInventoriesContext;

    const location = useLocation();

    const notAuthorized = () => {
        // Sets an error and redirects if the user is not logged in (authorized)
        setError("Unauthorized error, please log in")
        return <Navigate to='/login' replace state={{path: location.pathname}}/>
    }

    const redirectAuthorized = () => {
        

        if(accessibleInventories?.length > 0) {
            return children
        } else {
            return <Navigate to='/inventory/create' replace={true}/>
        }
    }

    // If the user does not have a JWT token (has not been authenticated), show application
    return (apiClient.getToken() ? 
        redirectAuthorized()    
        : 
        notAuthorized()
        );
}
import { useContext } from "react";
import { Navigate, useLocation } from "react-router";
import AuthContext from "../../contexts/auth";
import InventoryContext from "../../contexts/inventory";
import apiClient from "../../services/apiClient";

export default function RequireAuth({ children }) {
    const { userContext, errorContext } = useContext(AuthContext);
    const [user, setUser] = userContext;
    const [error, setError] = errorContext;
    
    const {accessibleInventoriesContext} = useContext(InventoryContext);
    const [accessibleInventories, setAccessibleInventories] = accessibleInventoriesContext;

    const location = useLocation();

    const notAuthorized = () => {
        // make user know that he is unauthorized
        setError("Unauthorized error, please log in")
        return <Navigate to='/login' replace state={{path: location.pathname}}/>
    }

    // check if user has an inventory
    if(apiClient.getToken() && (accessibleInventories.length < 1) && (location.pathname !== '/inventory/create')) {
        return <Navigate to='/inventory/create' replace state={{path:location.pathname}}/>
    }

    // TODO: check if user is verificated when feature is fully working

    // if all conditions are false, show application
    return (apiClient.getToken() ? 
        children 
        : 
        notAuthorized()
        );
}
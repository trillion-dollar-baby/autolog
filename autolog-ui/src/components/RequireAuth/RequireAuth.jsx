import { useContext } from "react";
import { Navigate, useLocation } from "react-router";
import AuthContext from "../../contexts/auth";

export default function RequireAuth({ children }) {
    const { userContext } = useContext(AuthContext);
    const location = useLocation();
    const [user, setUser] = userContext;
    
    return user.email ? children : <Navigate to='/login' replace state={{path: location.pathname}}/>;
}
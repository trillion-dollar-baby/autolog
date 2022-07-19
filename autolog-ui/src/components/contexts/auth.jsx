import { createContext, useState} from "react";

const AuthContext = createContext({});

export const AuthContextProvider = ({children}) => {
    const [initialized, setInitialized] = useState(false);
    const [user, setUser] = useState({});
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState("");

    return (
        <AuthContext.Provider value={ {initializedContext: [initialized, setInitialized], userContext: [user, setUser],
                                        processingContext: [isProcessing, setIsProcessing], errorContext: [error, setError] }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;
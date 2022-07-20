import { useEffect } from "react";
import { createContext, useState } from "react";
import apiClient from "../services/apiClient";

const AuthContext = createContext({});

export const AuthContextProvider = ({ children }) => {
  const [initialized, setInitialized] = useState(false);
  const [user, setUser] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState();

  const fetchUserFromToken = async () => {
    setIsProcessing(true);
    try {
      const { data, error } = await apiClient.fetchUserFromToken();

      //if token is valid and we receive data, save it for 
      // it to be used throughout the application
      if (data) {
        setUser(data.user);
        console.log("got data from token");
      }

      if (error) {
        console.log('token expired...')
      }
    } catch (error) {
      console.error("Fetching user error:", error);
      setError(error);
    }

    setInitialized(true);
    setIsProcessing(false);
  }

  useEffect(() => {
    const getUserToken = async () => {
      // if user token exists in local storage, 
      // get token and fetch from the db
      // to see if token is valid and retrieve data
      const token = localStorage.getItem(apiClient.tokenName);

      if (token) {
        apiClient.setToken(token);
        await fetchUserFromToken();
      }
    }
    getUserToken();
    setInitialized(true);
  }, []);

  // login user function
  const loginUser = async (loginForm) => {
    const { data, errorLogin } = await apiClient.loginUser(loginForm);

    if (errorLogin) {
      //return an empty object
      return { success: false, error: errorLogin, user: null }
    }

    // if login worked and we received data, store in application
    if (data?.user) {
      setUser(data.user);
      apiClient.setToken(data.token);
      return { success: true, user: data?.user }
    }
  }

  // register user function
  const registerUser = async (registrationForm) => {
    const { data, errorRegistration } = await apiClient.registerUser(registrationForm);

    if (errorRegistration) {
      return { success: false, error: errorRegistration, user: null }
    }

    // if registration worked and we received data, store in application
    if (data?.user) {
      setUser(data?.user);
      apiClient.setToken(data.token)
      return { success: true, user: data?.user }
    }
  }

  const logoutUser = async () => {
    // reset state data
    setUser({});
    //reset token from local storage
    localStorage.removeItem(apiClient.tokenName);
  }

  // check if it is still fetching data between renders
  if (!initialized) {
    return (<h1>Authenticating...</h1>)
  }

  // check if any errors have been found in useEffect request
  if (error) {
    return (<h1>Authentication error</h1>)
  }

  return (
    <AuthContext.Provider value={{
      initializedContext: [initialized, setInitialized], 
      userContext: [user, setUser],
      processingContext: [isProcessing, setIsProcessing], 
      errorContext: [error, setError]
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext;
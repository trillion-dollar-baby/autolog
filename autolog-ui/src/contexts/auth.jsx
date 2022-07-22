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
        // if token is invalid, delete from localStorage 
        // and let the rest of the application know user is invalid
        console.log('JWT EXPIRED OR INVALID');
        localStorage.removeItem(this.tokenName);
        this.token = null;
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
    const { data, error: errorLogin } = await apiClient.loginUser(loginForm);
    // handle data sent
    setUserData(data, errorLogin);
  }

  // register user function
  const registerUser = async (registrationForm) => {
    const { data, error: errorRegistration } = await apiClient.registerUser(registrationForm);
    // handle data sent
    setUserData(data, errorRegistration);
  }

  // set user data after any initial authentication method
  const setUserData = (data, error) => {
    if (data?.user) {
      setUser(data?.user);
      apiClient.setToken(data.token);
    } else {
      console.log("Authentication error:", error);
      setError(error)
    }
  }

  const logoutUser = async () => {
    // reset state data
    setUser({});

    // reset token from local storage
    localStorage.removeItem(apiClient.tokenName);

    // reload page
    window.location.reload(false);
  }

  // update user information
  const updateUserData = async (formData) => {
    // let backend handle all the data
    try {
      const {data, error} = await apiClient.patchUserCredentials(formData);
      
      if(data?.user){
        return data?.user;
      }
    } catch (error) {
      return { error }
    }
  }

  // update user password by sending new one
  const updateUserPassword = async (formData) => {
    // let backend handle all the data
    try {
      const {data, error} = await apiClient.patchUserPassword(formData);

      if(data?.message){
        return data?.message
      }
    } catch (error) {
      return { error }
    }
  }

  // check if it is still fetching data between renders
  if (!initialized || isProcessing) {
    return (<h1>Authenticating...</h1>)
  }

  // check if any errors have been found in useEffect request
  if (error && !initialized) {
    return (<h1>Authentication error</h1>)
  }

  return (
    <AuthContext.Provider value={{
      initializedContext: [initialized, setInitialized],
      userContext: [user, setUser],
      settingsContext: [updateUserData, updateUserPassword],
      authContext: [loginUser, registerUser, logoutUser],
      processingContext: [isProcessing, setIsProcessing],
      errorContext: [error, setError]
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext;
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
      }

      if (error) {
        // if token is invalid, delete from localStorage 
        // and let the rest of the application know user is invalid
        console.error('JWT EXPIRED OR INVALID');
        
        apiClient.setToken(null);
        localStorage.removeItem(apiClient.tokenName);
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

    // If the login was successful, check if the email has been confirmed
    if (data) {
      if (!data.user.emailConfirmed) {
        setError(`Your email has not been confirmed, please check your inbox`);
      }
      // If the user email has been confirmed, then allow access
      else {
        setUserData(data)
      }
    }
    // If the login was unsuccessful, then set an error
    else {
      setError(errorLogin)
    }
    
  }

  // register user function
  const registerUser = async (registrationForm) => {
    const { data, error: errorRegistration } = await apiClient.registerUser(registrationForm);

    // If user has successfully been created, set the user data 
    if (data?.user) {
      setUser(data?.user)

      return { data, error: null};
    }
    // If registration failed, then return the empty data object and the error message
    else {
      return { data, error: errorRegistration}
    }
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
    apiClient.setToken(null);

    // Redirect to landing page
    window.location.replace("http://127.0.0.1:5173");
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

  // If GET /me is still processing or uninitialized, render a blank screen
  if (!initialized || isProcessing) {
    return <div></div>
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
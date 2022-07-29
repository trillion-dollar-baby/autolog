
import {Toaster} from 'react-hot-toast';
import toast from 'react-hot-toast';
import { createContext } from 'react';

export const ToastContext = createContext({});

export const ToastContextProvider = ({children}) => {
    // functions for components to call
    const notifySuccess = (message) => toast.success(message);
    const notifyError = (message) => toast.error(message); 

    const values = {
        notifySuccess,
        notifyError,
    }

    return (
        <ToastContext.Provider value={values}>
            {children}
            <Toaster
                position='bottom-right'/>
        </ToastContext.Provider>
    )
}
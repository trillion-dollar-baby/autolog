import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import {AuthContextProvider} from './contexts/auth';
import { InventoryContextProvider } from './contexts/inventory';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <AuthContextProvider>
        <InventoryContextProvider>
          <App />
        </InventoryContextProvider>
    </ AuthContextProvider>
  </React.StrictMode>
)

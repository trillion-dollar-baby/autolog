import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import {AuthContextProvider} from './contexts/auth';
import { InventoryContextProvider } from './contexts/inventory';
import { ItemContextProvider } from './contexts/items';
import { PerformanceContextProvider } from './contexts/performance';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <AuthContextProvider>
        <InventoryContextProvider>
          <ItemContextProvider>
            <PerformanceContextProvider>
          <App />
            </PerformanceContextProvider>
          </ItemContextProvider>
        </InventoryContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
)

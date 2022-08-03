import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { AuthContextProvider } from './contexts/auth';
import { InventoryContextProvider } from './contexts/inventory';
import { ItemContextProvider } from './contexts/items';
import { PerformanceContextProvider } from './contexts/performance';
import { ToastContextProvider } from './contexts/toast';
import { DashboardContextProvider } from './contexts/dashboard';
import { RoleContextProvider } from './contexts/role';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthContextProvider>
      <InventoryContextProvider>
        <ItemContextProvider>
          <PerformanceContextProvider>
            <DashboardContextProvider>
              <RoleContextProvider>
                <ToastContextProvider>
                  <App />
                </ToastContextProvider>
              </RoleContextProvider>
            </DashboardContextProvider>
          </PerformanceContextProvider>
        </ItemContextProvider>
      </InventoryContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
)

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthContextProvider } from "./contexts/auth";
import { InventoriesContextProvider } from "./contexts/inventories";
import { ItemContextProvider } from "./contexts/items";
import { PerformanceContextProvider } from "./contexts/performance";
import { ToastContextProvider } from "./contexts/toast";
import { DashboardContextProvider } from "./contexts/dashboard";
import { RoleContextProvider } from "./contexts/role";
import { OrdersContextProvider } from "./contexts/orders";
import { InventoryContextProvider } from "./contexts/inventory";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <AuthContextProvider>
            <InventoriesContextProvider>
                <OrdersContextProvider>
                    <ItemContextProvider>
                        <PerformanceContextProvider>
                            <InventoryContextProvider>
                                <DashboardContextProvider>
                                    <RoleContextProvider>
                                        <ToastContextProvider>
                                            <App />
                                        </ToastContextProvider>
                                    </RoleContextProvider>
                                </DashboardContextProvider>
                            </InventoryContextProvider>
                        </PerformanceContextProvider>
                    </ItemContextProvider>
                </OrdersContextProvider>
            </InventoriesContextProvider>
        </AuthContextProvider>
    </React.StrictMode>
);

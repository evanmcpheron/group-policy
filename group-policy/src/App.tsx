import { Navigation } from "./components/Navigation";
import DashboardPage from "./pages/DashboardPage";
import CustomersPage from "./pages/CustomersPage";
import OrdersPage from "./pages/OrdersPage";
import ProductsPage from "./pages/ProductsPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import UsersPage from "./pages/UsersPage";
import LoginPage from "./pages/LoginPage";
import { PolicyProvider } from "./PolicyProvider";
import { Routes, Route } from "react-router";
import { BrowserRouter } from "react-router-dom";

export const App = () => {
  const socketUrl = "ws://localhost:8080";

  return (
    <BrowserRouter>
      <PolicyProvider socketUrl={socketUrl}>
        <Navigation />
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </PolicyProvider>
    </BrowserRouter>
  );
};

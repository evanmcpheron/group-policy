import { Link } from "react-router";
import { usePolicy } from "../PolicyProvider";

export const Navigation = () => {
  const { role, hasAnyPolicy } = usePolicy();

  const displayLogout = () => {
    if (role !== "GUEST") {
      return (
        <Link
          onClick={() => {
            localStorage.setItem("role", "GUEST");
          }}
          to="/login"
        >
          Logout
        </Link>
      );
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
      <div>{role}</div>
      <Link to="/">Dashboard</Link>
      {hasAnyPolicy(["VIEW_ORDERS", "EDIT_ORDERS"]) && (
        <Link to="/orders">Orders</Link>
      )}
      {hasAnyPolicy(["VIEW_CUSTOMERS", "EDIT_CUSTOMERS"]) && (
        <Link to="/customers">Customers</Link>
      )}
      {hasAnyPolicy(["VIEW_REPORTS", "EDIT_REPORTS"]) && (
        <Link to="/reports">Reports</Link>
      )}
      {hasAnyPolicy(["VIEW_SETTINGS", "EDIT_SETTINGS"]) && (
        <Link to="/settings">Settings</Link>
      )}
      {hasAnyPolicy(["VIEW_USERS", "EDIT_USERS"]) && (
        <Link to="/users">Users</Link>
      )}
      {hasAnyPolicy(["VIEW_PRODUCTS", "EDIT_PRODUCTS"]) && (
        <Link to="/products">Products</Link>
      )}
      <Link to="/login">Login</Link>

      <nav style={{ display: "flex", gap: "1rem" }}>{displayLogout()}</nav>
    </div>
  );
};

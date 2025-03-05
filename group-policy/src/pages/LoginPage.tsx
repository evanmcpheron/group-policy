import { withPermission } from "../withPermission";
import { Link } from "react-router";

const LoginPage = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <h1>Login Page</h1>
      <Link to="/" onClick={() => {}}>
        Login USER
      </Link>{" "}
      <Link to="/" onClick={() => {}}>
        Login STAFF
      </Link>
      <Link to="/" onClick={() => {}}>
        Login ADMIN
      </Link>{" "}
    </div>
  );
};

export default withPermission(LoginPage, {
  fallback: "/",
});

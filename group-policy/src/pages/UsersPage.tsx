import { withPermission } from "../withPermission";

const UsersPage = () => {
  return (
    <div>
      <h1>Users Page</h1>
    </div>
  );
};

export default withPermission(UsersPage, {
  requiredPoliciesAny: ["VIEW_USERS", "EDIT_USERS"],
  fallback: "/",
});

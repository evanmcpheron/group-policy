import { withPermission } from "../withPermission";

const DashboardPage = () => {
  return (
    <div>
      <h1>Dashboard Page</h1>
    </div>
  );
};

export default withPermission(DashboardPage, {
  requiredPoliciesAny: ["VIEW_DASHBOARD", "EDIT_DASHBOARD"],
  fallback: "/login",
});

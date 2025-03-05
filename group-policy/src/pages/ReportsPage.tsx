import { withPermission } from "../withPermission";

const ReportsPage = () => {
  return (
    <div>
      <h1>Reports Page</h1>
    </div>
  );
};

export default withPermission(ReportsPage, {
  requiredPoliciesAny: ["VIEW_REPORTS", "EDIT_REPORTS"],
  fallback: "/",
});

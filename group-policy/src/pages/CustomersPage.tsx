import { withPermission } from "../withPermission";

const CustomersPage = () => {
  return (
    <div>
      <h1>Customers</h1>
      <button>Edit Customer</button>
    </div>
  );
};

export default withPermission(CustomersPage, {
  requiredPoliciesAny: ["VIEW_CUSTOMERS", "EDIT_CUSTOMERS"],
  fallback: "/",
});

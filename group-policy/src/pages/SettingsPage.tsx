import { withPermission } from "../withPermission";
import CustomersWidget from "../components/CustomersWidget";

const SettingsPage = () => {
  return (
    <div>
      <h1>Settings Page</h1>
      <CustomersWidget />
    </div>
  );
};

export default withPermission(SettingsPage, {
  requiredPoliciesAny: ["VIEW_SETTINGS", "EDIT_SETTINGS"],
  fallback: "/",
});

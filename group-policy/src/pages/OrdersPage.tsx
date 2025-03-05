import { withPermission } from "../withPermission";
import OrdersWidget from "../components/OrdersWidget";

const OrdersPage = () => {
  return (
    <div>
      <h1>Orders Page</h1>
      <OrdersWidget />
    </div>
  );
};

export default withPermission(OrdersPage, {
  requiredPoliciesAny: ["VIEW_ORDERS", "EDIT_ORDERS"],
  fallback: "/",
});

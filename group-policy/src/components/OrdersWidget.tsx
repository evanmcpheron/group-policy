import { usePolicy } from "../PolicyProvider";
import { withPermission } from "../withPermission";

const OrdersWidget = () => {
  const { hasPolicy } = usePolicy();
  const canEditOrders = hasPolicy("EDIT_ORDERS");

  return (
    <div>
      <h2>Orders</h2>
      <button disabled={!canEditOrders}>Edit Order</button>
    </div>
  );
};

export default withPermission(OrdersWidget, {
  requiredPoliciesAny: ["VIEW_ORDERS", "EDIT_ORDERS"],
});

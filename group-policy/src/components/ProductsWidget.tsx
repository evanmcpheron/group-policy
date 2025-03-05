import { withPermission } from "../withPermission";

const ProductsWidget = () => {
  return (
    <div>
      <h2>Products</h2>
      <button>Edit Product</button>
    </div>
  );
};

export default withPermission(ProductsWidget, {
  requiredPoliciesAny: ["EDIT_PRODUCTS"],
  fallback: "/login",
});

import ProductsWidget from "../components/ProductsWidget";
import { withPermission } from "../withPermission";

const ProductsPage = () => {
  return (
    <div>
      <h1>Products Page</h1>
      <ProductsWidget />
    </div>
  );
};

export default withPermission(ProductsPage, {
  requiredPoliciesAny: ["VIEW_PRODUCTS", "EDIT_PRODUCTS"],
  fallback: "/",
});

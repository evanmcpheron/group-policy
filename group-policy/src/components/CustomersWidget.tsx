import React from "react";
import { withPermission } from "../withPermission";

const CustomersWidget = (props: any) => {
  return (
    <div>
      <button>Edit Customer</button>
    </div>
  );
};

export default withPermission(CustomersWidget, {
  requiredPolicy: "EDIT_CUSTOMERS",
});

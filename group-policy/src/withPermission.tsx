import React, { ComponentType, useMemo, useState, useEffect } from "react";
import { usePolicy } from "./PolicyProvider";
import { Navigate } from "react-router";

interface WithPermissionOptions {
  requiredPolicy?: string;
  requiredPoliciesAny?: string[];
  requiredPoliciesAll?: string[];
  fallback?: React.ReactNode;
}

export function withPermission<P extends object>(
  WrappedComponent: ComponentType<P>,
  options: WithPermissionOptions
) {
  return function WithPermissionHOC(props: P) {
    const { hasPolicy, hasAnyPolicy, isLoading } = usePolicy();
    const {
      requiredPolicy,
      requiredPoliciesAny,
      requiredPoliciesAll,
      fallback = null,
    } = options;

    const [loading, setLoading] = useState(true);

    useEffect(() => {
      if (!isLoading) {
        setLoading(false);
      }
    }, [isLoading]);

    // Memoize the allowed value
    const allowed = useMemo(() => {
      if (requiredPolicy) {
        return hasPolicy(requiredPolicy);
      }
      if (requiredPoliciesAny) {
        return hasAnyPolicy(requiredPoliciesAny);
      }
      if (requiredPoliciesAll) {
        return requiredPoliciesAll.every((pol) => hasPolicy(pol));
      }
      return false;
    }, [
      requiredPolicy,
      requiredPoliciesAny,
      requiredPoliciesAll,
      hasPolicy,
      hasAnyPolicy,
    ]);

    if (loading) {
      return <div>Loading...</div>; // or any loading indicator you prefer
    }

    if (!allowed && fallback) {
      return <Navigate to={fallback as string} />;
    }

    if (!fallback && !allowed) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}

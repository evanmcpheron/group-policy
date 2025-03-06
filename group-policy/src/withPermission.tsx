import React, { ComponentType, useMemo, useState, useEffect } from "react";
import { usePolicy } from "./PolicyProvider";
import { Navigate } from "react-router";

interface WithPermissionOptions {
  requiredPolicy?: string;
  requiredPoliciesAny?: string[];
  requiredPoliciesAll?: string[];
  fallback?: React.ReactNode;
}

/**
 * Higher-order component (HOC) to wrap a component with permission checks.
 *
 * @template P - The props type of the wrapped component.
 * @param {ComponentType<P>} WrappedComponent - The component to wrap.
 * @param {WithPermissionOptions} options - The options for permission checks.
 * @param {string} [options.requiredPolicy] - A single policy required to render the component. Ignores `requiredPoliciesAny` and `requiredPoliciesAll` if provided.
 * @param {string[]} [options.requiredPoliciesAny] - An array of policies, any of which are required to render the component. Ignores `requiredPolicyAll` if provided.
 * @param {string[]} [options.requiredPoliciesAll] - An array of policies, all of which are required to render the component.
 * @param {React.ReactNode} [options.fallback] - The fallback route to render if the required policies are not met. If not provided then it will return null.
 * @returns {ComponentType<P>} The wrapped component with permission checks.
 *
 * @example
 * const SecureComponent = withPermission(SomeComponent, {
 *   requiredPolicy: "admin-access",
 *   fallback: '/'
 * });
 */
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
      return <div>Loading...</div>;
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

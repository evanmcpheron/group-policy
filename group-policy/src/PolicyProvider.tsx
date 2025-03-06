import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";

interface PolicyContextValue {
  policies: string[];
  role: string;
  hasPolicy: (policy: string) => boolean;
  hasAnyPolicy: (policiesToCheck: string[]) => boolean;
  isLoading: boolean;
}

const PolicyContext = createContext<PolicyContextValue | undefined>(undefined);

interface PolicyProviderProps {
  children: ReactNode;
  socketUrl: string;
}

/**
 * PolicyProvider component that provides policy-related context to its children.
 * It establishes a WebSocket connection to receive policy updates and manages the policy state.
 *
 * @param {PolicyProviderProps} props - The props for the PolicyProvider component.
 * @param {React.ReactNode} props.children - The child components that will consume the policy context.
 * @param {string} props.socketUrl - The URL of the WebSocket server to connect to.
 *
 * @returns {JSX.Element} The PolicyProvider component.
 */
export function PolicyProvider({ children, socketUrl }: PolicyProviderProps) {
  const [policies, setPolicies] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const role = "STAFF";

  useEffect(() => {
    const socket = new WebSocket(socketUrl);

    socket.onopen = () => {
      console.log("WebSocket connected in PolicyProvider");
      socket.send(JSON.stringify({ type: "SUBSCRIBE_USER", role }));
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "POLICY_UPDATE") {
          setPolicies(data.newPolicies);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message", error);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error in PolicyProvider:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket closed in PolicyProvider");
    };

    return () => {
      socket.close();
    };
  }, [socketUrl, role]);

  /**
   * Checks if a given policy is included in the policies array.
   *
   * @param {string} policy - The policy to check for.
   * @returns {boolean} - Returns true if the policy is included, otherwise false.
   */
  const hasPolicy = useCallback(
    (policy: string) => {
      return policies.includes(policy);
    },
    [policies]
  );

  /**
   * Checks if any of the specified policies are present in the current policies.
   *
   * @param {string[]} policiesToCheck - An array of policy names to check against the current policies.
   * @returns {boolean} - Returns `true` if any of the specified policies are present, otherwise `false`.
   */
  const hasAnyPolicy = useCallback(
    (policiesToCheck: string[]) => {
      return policiesToCheck.some((p) => policies.includes(p));
    },
    [policies]
  );

  const value = useMemo<PolicyContextValue>(() => {
    return {
      policies,
      hasPolicy,
      hasAnyPolicy,
      role,
      isLoading,
    };
  }, [policies, hasPolicy, hasAnyPolicy, role, isLoading]);

  console.log(`🚀 ~ PolicyProvider.tsx:86 ~ PolicyProvider ~ value: \n`, value);

  return (
    <PolicyContext.Provider value={value}>{children}</PolicyContext.Provider>
  );
}

/**
 * Custom hook to access the PolicyContext.
 *
 * This hook provides access to the PolicyContext, allowing components to
 * consume the policy-related state and actions provided by the PolicyProvider.
 *
 * @throws {Error} If the hook is used outside of a PolicyProvider.
 *
 * @returns {PolicyContextType} The current context value for the PolicyContext.
 * 
 * 
 * @property {string[]} policies - The list of policies currently available.
 * @property {string} role - The role of the user, e.g., "STAFF".
 * @property {boolean} isLoading - Indicates whether the policy data is still loading.
 * @property {function} hasPolicy - Checks if a given policy is included in the policies array.
 * @property {function} hasAnyPolicy - Checks if any of the specified policies are present in the current policies.
 */
export const usePolicy = () => {
  const context = useContext(PolicyContext);

  if (!context) {
    throw new Error("usePolicy must be used within a PolicyProvider");
  }
  return context;
};

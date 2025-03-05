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

export function PolicyProvider({ children, socketUrl }: PolicyProviderProps) {
  const [policies, setPolicies] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const role = "ADMIN";

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

  const hasPolicy = useCallback(
    (policy: string) => {
      return policies.includes(policy);
    },
    [policies]
  );

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

export const usePolicy = () => {
  const context = useContext(PolicyContext);

  if (!context) {
    throw new Error("usePolicy must be used within a PolicyProvider");
  }
  return context;
};

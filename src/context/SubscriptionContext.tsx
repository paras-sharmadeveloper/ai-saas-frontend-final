import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { billingService, type SubscriptionValidation } from "@/services/billingService";

interface SubscriptionContextType {
  subscriptionValidation: SubscriptionValidation | null;
  refreshSubscription: () => Promise<void>;
  loading: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [subscriptionValidation, setSubscriptionValidation] = useState<SubscriptionValidation | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshSubscription = async () => {
    try {
      const validation = await billingService.validateSubscription();
      setSubscriptionValidation(validation);
    } catch (error) {
      console.error("Failed to refresh subscription:", error);
    }
  };

  useEffect(() => {
    refreshSubscription().finally(() => setLoading(false));
  }, []);

  return (
    <SubscriptionContext.Provider value={{ subscriptionValidation, refreshSubscription, loading }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return context;
}

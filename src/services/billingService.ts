import { api } from "./api";
import { API_ROUTES } from "./apiRoutes";

export interface Plan {
  id: number;
  plan_key: string;
  name: string;
  description?: string;
  price: string;
  billing: string;
  currency: string;
  features: string[];
  is_active?: boolean;
  most_popular?: boolean;
}

export interface MyPlan {
  plan: string;
  status: string;
  expiry?: string;
  current_period_end?: string;
}

export interface SubscriptionValidation {
  valid: boolean;
  access_type: string;
  data: {
    status: string;
    trial_started_at?: string;
    trial_ends_at?: string;
    trial_days_left?: number;
    plan?: string;
    plan_name?: string;
    amount?: string;
    currency?: string;
    starts_at?: string;
    ends_at?: string;
    days_remaining?: number;
  };
}

export interface Invoice {
  id: string;
  date: string;
  amount: number | string;
  status: string;
  invoice_pdf?: string;
  hosted_invoice_url?: string;
}

export interface PaymentIntentResponse {
  client_secret: string;
  payment_intent_id: string;
}

const s = API_ROUTES.stripe;
const p = API_ROUTES.plans;

export const billingService = {
  getAllPlans: () =>
    api.get<Plan[] | { data: Plan[] }>(p.base).then((r) => {
      const d = r.data;
      return Array.isArray(d) ? d : (d as { data: Plan[] }).data ?? [];
    }),

  getPlanByKey: (key: string) =>
    api.get<Plan | { data: Plan }>(p.byKey(key)).then((r) => {
      const d = r.data;
      return 'data' in d ? d.data : d;
    }),

  getPlans: () =>
    api.get<Plan[] | { data: Plan[] }>(s.plans).then((r) => {
      const d = r.data;
      return Array.isArray(d) ? d : (d as { data: Plan[] }).data ?? [];
    }),

  getMyPlan: () =>
    api.get<MyPlan>(s.myPlan).then((r) => r.data),

  validateSubscription: () =>
    api.get<SubscriptionValidation>(API_ROUTES.subscription.validate).then((r) => r.data),

  getSubscription: () =>
    api.get(s.subscription).then((r) => r.data),

  getInvoices: () =>
    api.get<Invoice[] | { data: Invoice[] }>(s.invoices).then((r) => {
      const d = r.data;
      return Array.isArray(d) ? d : (d as { data: Invoice[] }).data ?? [];
    }),

  getInvoiceById: (id: string) =>
    api.get<Invoice>(s.invoiceById(id)).then((r) => r.data),

  createPaymentIntent: (data: { plan: string; billing_cycle?: string }) =>
    api.post<PaymentIntentResponse>(s.createPaymentIntent, data).then((r) => r.data),

  confirmPayment: (payment_intent_id: string) =>
    api.post(s.confirmPayment, { payment_intent_id }).then((r) => r.data),

  cancelSubscription: () =>
    api.post(s.cancel).then((r) => r.data),
};

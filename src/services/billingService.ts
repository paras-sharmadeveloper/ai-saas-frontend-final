import { api } from "./api";
import { API_ROUTES } from "./apiRoutes";

export interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: string;
  features?: string[];
}

export interface MyPlan {
  plan: string;
  status: string;
  expiry?: string;
  current_period_end?: string;
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

export const billingService = {
  getPlans: () =>
    api.get<Plan[] | { data: Plan[] }>(s.plans).then((r) => {
      const d = r.data;
      return Array.isArray(d) ? d : (d as { data: Plan[] }).data ?? [];
    }),

  getMyPlan: () =>
    api.get<MyPlan>(s.myPlan).then((r) => r.data),

  getSubscription: () =>
    api.get(s.subscription).then((r) => r.data),

  getInvoices: () =>
    api.get<Invoice[] | { data: Invoice[] }>(s.invoices).then((r) => {
      const d = r.data;
      return Array.isArray(d) ? d : (d as { data: Invoice[] }).data ?? [];
    }),

  getInvoiceById: (id: string) =>
    api.get<Invoice>(s.invoiceById(id)).then((r) => r.data),

  createPaymentIntent: (data: { plan: string }) =>
    api.post<PaymentIntentResponse>(s.createPaymentIntent, data).then((r) => r.data),

  confirmPayment: (payment_intent_id: string) =>
    api.post(s.confirmPayment, { payment_intent_id }).then((r) => r.data),

  cancelSubscription: () =>
    api.post(s.cancel).then((r) => r.data),
};

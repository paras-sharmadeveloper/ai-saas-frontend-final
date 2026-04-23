/**
 * Central API route registry.
 * All backend endpoints are defined here.
 * If a backend route changes, update it ONLY in this file.
 */

export const API_ROUTES = {
  // Auth
  auth: {
    register: "/register",
    login: "/login",
    logout: "/logout",
    forgotPassword: "/forgot-password",
    resetPassword: "/reset-password",
    socialLogin: "/social-login",
    user: "/user",
    googleRedirect: "/auth/google",
    googleCallback: "/auth/google/callback",
  },

  // Dashboard
  dashboard: {
    base: "/dashboard",
  },

  // Company
  company: {
    base: "/company",
    onboarding: "/company/onboarding",
  },

  // AI Training supporting APIs
  tones: {
    base: "/tones",
    byId: (id: string) => `/tones/${id}`,
  },
  languages: {
    base: "/languages",
    byId: (id: string) => `/languages/${id}`,
  },
  voiceTypes: {
    base: "/voice-types",
    byId: (id: string) => `/voice-types/${id}`,
  },
  voices: {
    base: "/voices",
    byId: (id: string) => `/voices/${id}`,
  },
  services: {
    base: "/services",
    byId: (id: string) => `/services/${id}`,
  },
  agentCreate: {
    create: "/agent/create",
    generatePrompt: "/agent/generate-prompt", 
    myAgent:         "/agent/get-my-agent",         
    updateKnowledge: "/agent/knowledge", 
    update:          "/agent/update/:id",
    updatePrompt: (id: string) => `/agent/${id}/prompt`,
  },

  // Agent / AI Training
  aiTraining: {
    base: "/agent",
    byId: (id: string) => `/agent/${id}`,
  },
  knowledge: {
    add:    "/agent/knowledge",
    list:   "/agent/knowledge/:clientId",
    delete: "/agent/knowledge/:id",
  },

  // Agent (same routes, alias)
  agent: {
    base: "/agent",
    byId: (id: string) => `/agent/${id}`, 
  },

  // Customers
  customers: {
    base: "/customers",
    byId: (id: string) => `/customers/${id}`,
  },

  // Calls (list/detail)
  calls: {
    base: "/calls",
    byId: (id: string) => `/calls/${id}`,
    messages: (id: string) => `/calls/${id}/messages`,
  },

  // Call actions (Twilio webhooks)
  call: {
    test: "/test-call",
    start: "/call/start",
    message: "/call/message",
    end: "/call/end",
    recording: "/call/recording",
  },

  // Stripe / Billing
  stripe: {
    plans: "/stripe/plans",
    myPlan: "/stripe/my-plan",
    subscription: "/stripe/subscription",
    invoices: "/stripe/invoices",
    invoiceById: (id: string) => `/stripe/invoices/${id}`,
    createPaymentIntent: "/stripe/create-payment-intent",
    confirmPayment: "/stripe/confirm-payment",
    cancel: "/stripe/cancel",
    webhook: "/stripe/webhook",
  },

  // Settings / Profile
  settings: {
    profile: "/profile",
    changePassword: "/change-password",
  },

  // Twilio
  twilio: {
    incomingCall: "/incoming-call",
    processSpeech: "/process-speech",
    availableNumbers: "/twilio/available-numbers",
    buyNumber: "/twilio/buy-number",
    myNumbers: "/twilio/my-numbers",
    releaseNumber: (id: string) => `/twilio/release-number/${id}`,
  },
} as const;

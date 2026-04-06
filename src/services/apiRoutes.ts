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
  },

  // Company
  company: {
    base: "/company",
  },

  // Agent
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

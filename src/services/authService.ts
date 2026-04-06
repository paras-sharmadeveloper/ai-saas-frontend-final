import { api } from "./api";
import { API_ROUTES } from "./apiRoutes";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

const { login, register, logout, forgotPassword, resetPassword } = API_ROUTES.auth;

export const authService = {
  login: (data: LoginPayload) =>
    api.post<AuthResponse>(login, data).then((r) => r.data),

  signup: (data: SignupPayload) =>
    api.post<AuthResponse>(register, data).then((r) => r.data),

  logout: () =>
    api.post(logout).then((r) => r.data),

  forgotPassword: (email: string) =>
    api.post(forgotPassword, { email }).then((r) => r.data),

  resetPassword: (token: string, password: string) =>
    api.post(resetPassword, { token, password }).then((r) => r.data),
};

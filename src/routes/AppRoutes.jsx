import { Routes, Route, Navigate } from "react-router-dom";

import DashboardLayout from "../components/DashboardLayout";

import Dashboard from "../pages/Dashboard";
import PhoneNumbers from "../pages/PhoneNumbers";
import AIAgents from "../pages/AIAgents";
import AITraining from "../pages/AITraining";
import Calls from "../pages/Calls";
import CallDetail from "../pages/CallDetail";
import Customers from "../pages/Customers";
import SettingsPage from "../pages/SettingsPage";
import Billing from "../pages/Billing";
import VerifyEmail from "../pages/VerifyEmail";

import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import LoginSuccess from "../pages/LoginSuccess";
import Onboarding from "../pages/Onboarding";
import SubscribePlan from "../pages/SubscribePlan";
import Subscribe from "../pages/Subscribe";
import NotFound from "../pages/NotFound";

import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Default */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Public */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/signup"
        element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        }
      />

      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/login-success" element={<LoginSuccess />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/subscribe-plan" element={<SubscribePlan />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      {/* Private */}
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="phone-numbers" element={<PhoneNumbers />} />
          <Route path="ai-agents" element={<AIAgents />} />
          <Route path="ai-training" element={<AITraining />} />
          <Route path="calls" element={<Calls />} />
          <Route path="calls/:id" element={<CallDetail />} />
          <Route path="customers" element={<Customers />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="billing" element={<Billing />} />
          <Route path="subscribe" element={<Subscribe />} />
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;

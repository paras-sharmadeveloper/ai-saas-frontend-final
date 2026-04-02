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

import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ForgotPassword from "../pages/ForgotPassword";
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

      {/* Private */}
      <Route element={<PrivateRoute />}>
        <Route path="/admin" element={<DashboardLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="phone-numbers" element={<PhoneNumbers />} />
          <Route path="ai-agents" element={<AIAgents />} />
          <Route path="ai-training" element={<AITraining />} />
          <Route path="calls" element={<Calls />} />
          <Route path="calls/:id" element={<CallDetail />} />
          <Route path="customers" element={<Customers />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="billing" element={<Billing />} />
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;

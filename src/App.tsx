import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import PhoneNumbers from "./pages/PhoneNumbers";
import AIAgents from "./pages/AIAgents";
import AITraining from "./pages/AITraining";
import Calls from "./pages/Calls";
import CallDetail from "./pages/CallDetail";
import Customers from "./pages/Customers";
import SettingsPage from "./pages/SettingsPage";
import Billing from "./pages/Billing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/phone-numbers" element={<PhoneNumbers />} />
            <Route path="/ai-agents" element={<AIAgents />} />
            <Route path="/ai-training" element={<AITraining />} />
            <Route path="/calls" element={<Calls />} />
            <Route path="/calls/:id" element={<CallDetail />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/billing" element={<Billing />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

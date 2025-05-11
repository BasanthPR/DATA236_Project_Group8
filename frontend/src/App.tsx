import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Layout from "@/components/Layout";
import HomePage from "./pages/HomePage";
import DrivePage from "./pages/DrivePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import RidePage from "./pages/RidePage";
import ProfilePage from "./pages/ProfilePage";
import ActivityPage from "./pages/ActivityPage";
import NotFound from "./pages/NotFound";
import DriverSignupPage from "./pages/DriverSignupPage";
import DriverLoginPage from "./pages/DriverLoginPage";
import BillingPage from "./pages/BillingPage";
import PaymentPage from "./pages/PaymentPage";
import DriverDashboardPage from "./pages/DriverDashboardPage";
import EditProfilePage from "./pages/EditProfilePage";
import { UserProvider } from "./contexts/UserContext";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminSignup from "./pages/admin/AdminSignup";
import AdminDashboard from "./pages/admin/AdminDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" attribute="class">
      <UserProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout><HomePage /></Layout>} />
              <Route path="/drive" element={<Layout><DrivePage /></Layout>} />
              <Route path="/ride" element={<Layout><RidePage /></Layout>} />
              <Route path="/login" element={<Layout><LoginPage /></Layout>} />
              <Route path="/signup" element={<Layout><SignupPage /></Layout>} />
              <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
              <Route path="/profile/edit" element={<Layout><EditProfilePage /></Layout>} />
              <Route path="/activity" element={<Layout><ActivityPage /></Layout>} />
              <Route path="/driver/signup" element={<Layout><DriverSignupPage /></Layout>} />
              <Route path="/driver/login" element={<Layout><DriverLoginPage /></Layout>} />
              <Route path="/driver/dashboard" element={<Layout><DriverDashboardPage /></Layout>} />
              <Route path="/billing" element={<Layout><BillingPage /></Layout>} />
              <Route path="/payment" element={<Layout><PaymentPage /></Layout>} />
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/signup" element={<AdminSignup />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              
              <Route path="*" element={<Layout><NotFound /></Layout>} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </UserProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

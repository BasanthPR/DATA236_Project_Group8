
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import HomePage from "./pages/HomePage";
import DrivePage from "./pages/DrivePage";
import DeliverPage from "./pages/DeliverPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import RidePage from "./pages/RidePage";
import ProfilePage from "./pages/ProfilePage";
import ActivityPage from "./pages/ActivityPage";
import NotFound from "./pages/NotFound";
import DriverSignupPage from "./pages/DriverSignupPage";
import DriverLoginPage from "./pages/DriverLoginPage";
import BillingPage from "./pages/BillingPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" attribute="class">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/drive" element={<DrivePage />} />
            <Route path="/deliver" element={<DeliverPage />} />
            <Route path="/ride" element={<RidePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/activity" element={<ActivityPage />} />
            <Route path="/driver/signup" element={<DriverSignupPage />} />
            <Route path="/driver/login" element={<DriverLoginPage />} />
            <Route path="/billing" element={<BillingPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

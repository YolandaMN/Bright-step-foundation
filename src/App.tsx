import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ContentTransition from "@/components/ContentTransition";
import Navbar from "@/components/Navbar";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Report from "./pages/Report";
import Courses from "./pages/Courses";
import VolunteerDashboard from "./pages/VolunteerDashboard";
import Donate from "./pages/Donate";
import About from "./pages/About";
import Programs from "./pages/Programs";
import Stories from "./pages/Stories";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="relative">
            {/* Fixed Navbar */}
            <Navbar />
            
            {/* Page Content */}
            <Routes>
              <Route path="/" element={<ContentTransition><Index /></ContentTransition>} />
              <Route path="/auth" element={<ContentTransition><Auth /></ContentTransition>} />
              <Route path="/volunteer" element={<ContentTransition><VolunteerDashboard /></ContentTransition>} />
              <Route path="/volunteer-dashboard" element={<ContentTransition><VolunteerDashboard /></ContentTransition>} />
              <Route path="/report" element={<ContentTransition><Report /></ContentTransition>} />
              <Route path="/courses" element={<ContentTransition><Courses /></ContentTransition>} />
              <Route path="/donate" element={<ContentTransition><Donate /></ContentTransition>} />
              <Route path="/about" element={<ContentTransition><About /></ContentTransition>} />
              <Route path="/programs" element={<ContentTransition><Programs /></ContentTransition>} />
              <Route path="/stories" element={<ContentTransition><Stories /></ContentTransition>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<ContentTransition><NotFound /></ContentTransition>} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Registration from "./pages/Registration.tsx";
import PatientHomepage from "./pages/PatientHomepage.tsx";
import Login from "./pages/Login.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {/* basename casa com o base do Vite — react-router passa a entender /fonoaudiologia/entrar */}
      <BrowserRouter basename="/fonoaudiologia">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/entrar" element={<Login />} />
          <Route path="/cadastro" element={<Registration />} />
          <Route path="/paciente/inicio" element={<PatientHomepage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext.tsx"; // ✅ AJOUTÉ
import Index from "./pages/Index";
import Boutique from "./pages/Boutique";
import Personnalisation from "./pages/Personnalisation";
import Panier from "./pages/Panier";
import Contact from "./pages/Contact";
import Suivi from "./pages/Suivi";
import FAQ from "./pages/FAQ";
import Livraison from "./pages/Livraison";
import Conditions from "./pages/Conditions";
import NotFound from "./pages/NotFound";
import AdminDashboard from '@/pages/AdminDashboard';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider> {/* ✅ AJOUTÉ - Enveloppe toute l'app */}
        <Toaster />
        <Sonner />
        <HashRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/boutique" element={<Boutique />} />
            <Route path="/personnalisation" element={<Personnalisation />} />
            <Route path="/panier" element={<PanierTest />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/suivi" element={<Suivi />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/livraison" element={<Livraison />} />
            <Route path="/conditions" element={<Conditions />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </HashRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
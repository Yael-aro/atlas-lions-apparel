import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext.tsx";
import Index from "./pages/Index";
import Boutique from "./pages/Boutique";
import ProductDetail from "./pages/ProductDetail";
import Personnalisation from "./pages/Personnalisation";
import Panier from "./pages/Panier";
import Contact from "./pages/Contact";
import Suivi from "./pages/Suivi";
import FAQ from "./pages/FAQ";
import Livraison from "./pages/Livraison";
import Conditions from "./pages/Conditions";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/boutique" element={<Boutique />} />
            <Route path="/produit/:id" element={<ProductDetail />} />
            <Route path="/personnalisation" element={<Personnalisation />} />
            <Route path="/panier" element={<Panier />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/suivi" element={<Suivi />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/livraison" element={<Livraison />} />
            <Route path="/conditions" element={<Conditions />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<Dashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

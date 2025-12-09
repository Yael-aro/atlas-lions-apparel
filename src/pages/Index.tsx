import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Trophy, Truck, Shield, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { getFeaturedProducts } from "@/data/products";
import { useState, useEffect } from "react";
import JerseyShowcase from "@/components/JerseyShowcase";

const Countdown = () => {
  const targetDate = new Date("2025-12-21T00:00:00").getTime();
  
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="bg-gradient-to-r from-[#C8102E] via-[#C8102E] to-[#006233] py-6 md:py-8 px-3 md:px-4">
      <div className="container mx-auto">
        <div className="text-center text-white mb-4 md:mb-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-1 md:mb-2">CAN 2025 COMMENCE DANS</h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl opacity-90">Préparez-vous à supporter les LIONS D'ATLAS !</p>
        </div>
        
        <div className="grid grid-cols-4 gap-2 sm:gap-3 md:gap-8 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg md:rounded-xl p-2 sm:p-3 md:p-6 text-center transform hover:scale-105 transition-transform">
            <div className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-1 md:mb-2">
              {timeLeft.days.toString().padStart(2, '0')}
            </div>
            <div className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-white/80">JOURS</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg md:rounded-xl p-2 sm:p-3 md:p-6 text-center transform hover:scale-105 transition-transform">
            <div className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-1 md:mb-2">
              {timeLeft.hours.toString().padStart(2, '0')}
            </div>
            <div className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-white/80">HEURES</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg md:rounded-xl p-2 sm:p-3 md:p-6 text-center transform hover:scale-105 transition-transform">
            <div className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-1 md:mb-2">
              {timeLeft.minutes.toString().padStart(2, '0')}
            </div>
            <div className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-white/80">MINUTES</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg md:rounded-xl p-2 sm:p-3 md:p-6 text-center transform hover:scale-105 transition-transform">
            <div className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-1 md:mb-2 animate-pulse">
              {timeLeft.seconds.toString().padStart(2, '0')}
            </div>
            <div className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-white/80">SECONDES</div>
          </div>
        </div>

        <div className="text-center mt-4 md:mt-6">
          <Link to="/boutique">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-xl text-base md:text-lg px-6 md:px-8 py-3 md:py-4 font-bold w-full sm:w-auto">
              Commandez Maintenant
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const Index = () => {
  const featuredProducts = getFeaturedProducts();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* ✨ HERO SECTION - ANIMATION MAILLOTS */}
        <JerseyShowcase />

        {/* COMPTE À REBOURS */}
        <Countdown />

        <section className="py-8 md:py-12 lg:py-16 bg-muted/30">
          <div className="container px-3 md:px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <div className="text-center space-y-3 md:space-y-4 p-4 md:p-0">
                <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary/10">
                  <Trophy className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold">Qualité Premium</h3>
                <p className="text-sm md:text-base text-muted-foreground">
                  Matériaux de haute qualité pour un confort optimal
                </p>
              </div>
              
              <div className="text-center space-y-3 md:space-y-4 p-4 md:p-0">
                <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-secondary/10">
                  <Sparkles className="h-6 w-6 md:h-8 md:w-8 text-secondary" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold">Personnalisation</h3>
                <p className="text-sm md:text-base text-muted-foreground">
                  15+ polices, texte libre, prévisualisation en temps réel
                </p>
              </div>
              
              <div className="text-center space-y-3 md:space-y-4 p-4 md:p-0">
                <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-accent/10">
                  <Truck className="h-6 w-6 md:h-8 md:w-8 text-accent-foreground" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold">Livraison Maroc</h3>
                <p className="text-sm md:text-base text-muted-foreground">
                  Livraison rapide dans tout le royaume
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-8 md:py-12 lg:py-16">
          <div className="container px-3 md:px-4">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 md:mb-4">Produits Vedettes</h2>
              <p className="text-base md:text-lg lg:text-xl text-muted-foreground px-4">
                Découvrez notre sélection de produits premium
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8 max-w-6xl mx-auto">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>

            <div className="text-center mt-8 md:mt-12 px-4">
              <Link to="/boutique" className="inline-block w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary text-primary hover:bg-primary hover:text-primary-foreground text-base md:text-lg px-6 md:px-8 py-3 md:py-4">
                  Voir tous les produits
                  <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 lg:py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#C8102E] via-[#006233] to-[#C8102E]" />
          
          <div className="container px-4 md:px-6 relative z-10">
            <div className="max-w-3xl mx-auto text-center text-white">
              <Shield className="h-12 w-12 md:h-16 md:w-16 mx-auto mb-4 md:mb-6" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6 px-4">
                Commandez en toute confiance
              </h2>
              <p className="text-base md:text-lg lg:text-xl mb-6 md:mb-8 text-white/95 px-4">
                Finalisation simple via WhatsApp ou Email. Paiement sécurisé à la livraison ou par virement bancaire.
              </p>
              <Link to="/boutique" className="inline-block w-full sm:w-auto px-4">
                <Button size="lg" className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 shadow-glow text-base md:text-lg px-6 md:px-8 py-3 md:py-4">
                  Commander maintenant
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;

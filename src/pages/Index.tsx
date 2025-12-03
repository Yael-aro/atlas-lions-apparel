import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Trophy, Truck, Shield, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { getFeaturedProducts } from "@/data/products";
import { useState, useEffect } from "react";

import heroImage1 from "@/assets/hero-can-2025.jpg";
import heroImage2 from "@/assets/yt.jpg";

const preloadImages = (imageUrls: string[]) => {
  imageUrls.forEach((url) => {
    const img = new Image();
    img.src = url;
  });
};

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
    <div className="bg-gradient-to-r from-[#C8102E] via-[#C8102E] to-[#006233] py-8 px-4">
      <div className="container mx-auto">
        <div className="text-center text-white mb-6">
          <h2 className="text-2xl md:text-4xl font-bold mb-2">🏆 CAN 2025 COMMENCE DANS</h2>
          <p className="text-lg md:text-xl opacity-90">Préparez-vous à supporter les LIONS D'ATLAS !</p>
        </div>
        
        <div className="grid grid-cols-4 gap-3 md:gap-8 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 text-center transform hover:scale-105 transition-transform">
            <div className="text-4xl md:text-6xl font-bold text-white mb-2">
              {timeLeft.days.toString().padStart(2, '0')}
            </div>
            <div className="text-sm md:text-lg font-semibold text-white/80">JOURS</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 text-center transform hover:scale-105 transition-transform">
            <div className="text-4xl md:text-6xl font-bold text-white mb-2">
              {timeLeft.hours.toString().padStart(2, '0')}
            </div>
            <div className="text-sm md:text-lg font-semibold text-white/80">HEURES</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 text-center transform hover:scale-105 transition-transform">
            <div className="text-4xl md:text-6xl font-bold text-white mb-2">
              {timeLeft.minutes.toString().padStart(2, '0')}
            </div>
            <div className="text-sm md:text-lg font-semibold text-white/80">MINUTES</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 text-center transform hover:scale-105 transition-transform">
            <div className="text-4xl md:text-6xl font-bold text-white mb-2 animate-pulse">
              {timeLeft.seconds.toString().padStart(2, '0')}
            </div>
            <div className="text-sm md:text-lg font-semibold text-white/80">SECONDES</div>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link to="/boutique">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-xl text-lg px-8 font-bold">
              🛒 Commandez Maintenant
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const Index = () => {
  const featuredProducts = getFeaturedProducts();
  
  const heroImages = [heroImage1, heroImage2];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    preloadImages(heroImages);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
        setIsTransitioning(false);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="relative min-h-[500px] md:min-h-[700px] flex items-center justify-center overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800">
          <div className="absolute inset-0 z-0 flex items-center justify-center">
            {heroImages.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 flex items-center justify-center ${
                  index === currentImageIndex && !isTransitioning ? "opacity-100" : "opacity-0"
                }`}
              >
                <img 
                  src={image} 
                  alt={`CAN 2025 Morocco ${index + 1}`}
                  loading="eager"
                  fetchPriority="high"
                  className="w-full h-full object-contain max-w-full max-h-full"
                  style={{ 
                    objectFit: 'contain',
                    objectPosition: 'center'
                  }}
                />
              </div>
            ))}
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/60" />
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsTransitioning(true);
                  setTimeout(() => {
                    setCurrentImageIndex(index);
                    setIsTransitioning(false);
                  }, 500);
                }}
                className={`h-2 rounded-full transition-all ${
                  index === currentImageIndex ? "bg-white w-8" : "bg-white/50 w-2 hover:bg-white/75"
                }`}
                aria-label={`Aller à l'image ${index + 1}`}
              />
            ))}
          </div>
          
          <div className="container relative z-10 px-4 py-12 md:py-20">
            <div className="max-w-3xl mx-auto text-center text-white">
              <h1 className="text-4xl md:text-7xl font-bold mb-6 animate-fade-in drop-shadow-lg">
                CAN2025 JERSEYS
              </h1>
              <p className="text-lg md:text-2xl mb-8 text-white/95 drop-shadow-md">
                Soutenez les LIONS D'ATLAS avec style. Produits premium personnalisables.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/boutique">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-glow text-lg px-8">
                    Découvrir la boutique
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/personnalisation">
                  <Button size="lg" className="bg-primary text-white hover:bg-primary/90 border-2 border-white shadow-glow text-lg px-8">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Personnaliser
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* COMPTE À REBOURS */}
        <Countdown />

        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                  <Trophy className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Qualité Premium</h3>
                <p className="text-muted-foreground">
                  Matériaux de haute qualité pour un confort optimal
                </p>
              </div>
              
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10">
                  <Sparkles className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold">Personnalisation</h3>
                <p className="text-muted-foreground">
                  15+ polices, texte libre, prévisualisation en temps réel
                </p>
              </div>
              
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10">
                  <Truck className="h-8 w-8 text-accent-foreground" />
                </div>
                <h3 className="text-xl font-semibold">Livraison Maroc</h3>
                <p className="text-muted-foreground">
                  Livraison rapide dans tout le royaume
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Produits Vedettes</h2>
              <p className="text-lg md:text-xl text-muted-foreground">
                Découvrez notre sélection de produits premium
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to="/boutique">
                <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  Voir tous les produits
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#C8102E] via-[#C8102E] to-[#006233]" />
          
          <div className="container px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center text-white">
              <Shield className="h-16 w-16 mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Commandez en toute confiance
              </h2>
              <p className="text-lg md:text-xl mb-8 text-white/95">
                Finalisation simple via WhatsApp ou Email. Paiement sécurisé à la livraison ou par virement bancaire.
              </p>
              <Link to="/boutique">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-glow text-lg px-8">
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

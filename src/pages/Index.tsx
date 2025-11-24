import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Trophy, Truck, Shield, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { getFeaturedProducts } from "@/data/products";
import { useState, useEffect } from "react";

// ✅ Importe toutes les images pour le carrousel
import heroImage1 from "@/assets/hero-can-2025.jpg";
import heroImage2 from "@/assets/yt.jpg";


const Index = () => {
  const featuredProducts = getFeaturedProducts();
  
  // ✅ Tableau d'images pour le carrousel
  const heroImages = [heroImage1, heroImage2];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // ✅ Change l'image automatiquement toutes les 5 secondes
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
        {/* Hero Section avec carrousel */}
        <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
          {/* Images en arrière-plan avec transition */}
          <div className="absolute inset-0 z-0">
            {heroImages.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentImageIndex && !isTransitioning ? "opacity-100" : "opacity-0"
                }`}
              >
                <img 
                  src={image} 
                  alt={`CAN 2025 Morocco ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            
            {/* ✅ MODIFIÉ - Overlay noir subtil pour lisibilité (optionnel) */}
            <div className="absolute inset-0 bg-black/40" />
          </div>

          {/* Indicateurs de pagination (points) */}
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
          
          <div className="container relative z-10 px-4">
            <div className="max-w-3xl mx-auto text-center text-white">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in drop-shadow-lg">
                CAN2025 JERSEYS
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-white/95 drop-shadow-md">
                Soutenez les Atlas Lions avec style. Produits premium personnalisables.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/boutique">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-glow text-lg px-8">
                    Découvrir la boutique
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/personnalisation">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary text-lg px-8">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Personnaliser
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 bg-muted/30">
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

        {/* Featured Products */}
        <section className="py-16">
          <div className="container px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Produits Vedettes</h2>
              <p className="text-xl text-muted-foreground">
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

        {/* CTA Section */}
        <section className="py-20 gradient-hero">
          <div className="container px-4">
            <div className="max-w-3xl mx-auto text-center text-white">
              <Shield className="h-16 w-16 mx-auto mb-6" />
              <h2 className="text-4xl font-bold mb-6">
                Commandez en toute confiance
              </h2>
              <p className="text-xl mb-8 text-white/90">
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
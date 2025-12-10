import morocoImage from '@/assets/moroco.png';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SimpleProductCard } from "@/components/SimpleProductCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Trophy, Truck, Shield, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { getFeaturedProducts } from "@/data/products";
import { useState, useEffect, useRef } from "react";
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
    <div className="bg-gradient-to-r from-[#C8102E] via-[#C8102E] to-[#006233] py-6 md:py-8 lg:py-10 px-3 md:px-4">
      <div className="container mx-auto">
        <div className="text-center text-white mb-4 md:mb-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-1 md:mb-2">
            CAN 2025 COMMENCE DANS
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl opacity-90">
            Préparez-vous à supporter les LIONS D'ATLAS !
          </p>
        </div>
        
        <div className="grid grid-cols-4 gap-2 sm:gap-3 md:gap-6 lg:gap-8 max-w-5xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg md:rounded-xl border border-white/20 p-2 sm:p-3 md:p-4 lg:p-6 text-center transform hover:scale-105 transition-all duration-300 hover:bg-white/15">
            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-1 md:mb-2">
              {timeLeft.days.toString().padStart(2, '0')}
            </div>
            <div className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-white/80">JOURS</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg md:rounded-xl border border-white/20 p-2 sm:p-3 md:p-4 lg:p-6 text-center transform hover:scale-105 transition-all duration-300 hover:bg-white/15">
            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-1 md:mb-2">
              {timeLeft.hours.toString().padStart(2, '0')}
            </div>
            <div className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-white/80">HEURES</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg md:rounded-xl border border-white/20 p-2 sm:p-3 md:p-4 lg:p-6 text-center transform hover:scale-105 transition-all duration-300 hover:bg-white/15">
            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-1 md:mb-2">
              {timeLeft.minutes.toString().padStart(2, '0')}
            </div>
            <div className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-white/80">MINUTES</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg md:rounded-xl border border-white/20 p-2 sm:p-3 md:p-4 lg:p-6 text-center transform hover:scale-105 transition-all duration-300 hover:bg-white/15">
            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-1 md:mb-2 animate-pulse">
              {timeLeft.seconds.toString().padStart(2, '0')}
            </div>
            <div className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-white/80">SECONDES</div>
          </div>
        </div>

        <div className="text-center mt-4 md:mt-6 lg:mt-8">
          <Link to="/boutique" className="inline-block w-full sm:w-auto px-4 sm:px-0">
            <Button 
              size="lg" 
              className="w-full sm:w-auto bg-white text-primary hover:bg-white/95 hover:scale-105 transform transition-all duration-300 shadow-xl hover:shadow-2xl text-base md:text-lg px-6 md:px-8 lg:px-10 py-3 md:py-4 font-bold"
            >
              Commandez Maintenant
              <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const ProductCarousel = () => {
  const featuredProducts = getFeaturedProducts();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-scroll automatique
  useEffect(() => {
    if (!scrollRef.current || isHovered) return;

    const scrollContainer = scrollRef.current;
    let scrollInterval: NodeJS.Timeout;

    const startAutoScroll = () => {
      scrollInterval = setInterval(() => {
        if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
          // Retour au début smooth
          scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          // Scroll vers la droite
          scrollContainer.scrollBy({ left: 2, behavior: 'auto' });
        }
      }, 30); // Vitesse du défilement
    };

    startAutoScroll();

    return () => {
      if (scrollInterval) clearInterval(scrollInterval);
    };
  }, [isHovered]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-8 md:py-12 lg:py-16 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      <div className="container px-3 md:px-4 lg:px-6">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4 text-gray-900">
            Produits Vedettes
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 px-4 max-w-3xl mx-auto">
            Découvrez notre sélection exclusive de produits premium pour la CAN 2025
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative group">
          {/* Bouton Gauche */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/95 backdrop-blur-sm hover:bg-white p-3 md:p-4 rounded-full shadow-2xl border-2 border-gray-300 opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110"
            aria-label="Précédent"
          >
            <ChevronLeft className="h-6 w-6 md:h-7 md:w-7 text-gray-900" />
          </button>

          {/* Scroll Container */}
          <div
            ref={scrollRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {/* Dupliquer les produits pour effet infini */}
            {[...featuredProducts, ...featuredProducts].map((product, index) => (
              <div
                key={`${product.id}-${index}`}
                className="flex-shrink-0 w-[260px] sm:w-[300px] md:w-[320px] lg:w-[340px]"
              >
                <SimpleProductCard
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.image}
                  category={product.category}
                />
              </div>
            ))}
          </div>

          {/* Bouton Droit */}
          <button
            onClick={() => scroll('right')}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/95 backdrop-blur-sm hover:bg-white p-3 md:p-4 rounded-full shadow-2xl border-2 border-gray-300 opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110"
            aria-label="Suivant"
          >
            <ChevronRight className="h-6 w-6 md:h-7 md:w-7 text-gray-900" />
          </button>

          {/* Gradient Fade aux bords */}
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none z-[5]" />
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-l from-gray-50 via-gray-50/80 to-transparent pointer-events-none z-[5]" />
        </div>

        <div className="text-center mt-8 md:mt-12 lg:mt-16 px-4">
          <Link to="/boutique" className="inline-block w-full sm:w-auto">
            <Button 
              size="lg" 
              variant="outline" 
              className="w-full sm:w-auto border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-base md:text-lg px-6 md:px-8 lg:px-10 py-3 md:py-4 font-bold"
            >
              Voir tous les produits
              <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1">
        {/* MOROCO HERO SUR FOND BLANC - image agrandie et responsive */}
        <section className="w-full bg-white py-6 md:py-10 lg:py-14">
          <div className="container mx-auto px-4">
            <div className="w-full mx-auto bg-white rounded-2xl shadow-xl overflow-hidden flex items-center justify-center p-4 md:p-6 lg:p-8">
              {/* L'image est plus grande : on augmente la hauteur max responsive pour mobile et desktop */}
              <img
                src={morocoImage}
                alt="Moroco - Collection CAN 2025"
                className="w-full max-w-none h-[55vh] md:h-[75vh] lg:h-[85vh] object-contain"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* ✨ HERO SECTION - ANIMATION MAILLOTS */}
        <JerseyShowcase />

        {/* COMPTE À REBOURS */}
        <Countdown />

        {/* SECTION AVANTAGES */}
        <section className="py-8 md:py-12 lg:py-16 xl:py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="container px-3 md:px-4 lg:px-6">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 md:mb-3 text-gray-900">
                Pourquoi nous choisir ?
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
                Une expérience shopping premium pour les vrais supporters
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8 max-w-6xl mx-auto">
              <div className="bg-white rounded-xl md:rounded-2xl border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-6 md:p-8 text-center space-y-3 md:space-y-4">
                <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-red-500 to-red-600 shadow-lg">
                  <Trophy className="h-7 w-7 md:h-8 md:w-8 lg:h-10 lg:w-10 text-white" />
                </div>
                <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">Qualité Premium</h3>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                  Matériaux de haute qualité pour un confort optimal lors de chaque match
                </p>
              </div>
              
              <div className="bg-white rounded-xl md:rounded-2xl border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-6 md:p-8 text-center space-y-3 md:space-y-4">
                <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-green-600 to-green-700 shadow-lg">
                  <Sparkles className="h-7 w-7 md:h-8 md:w-8 lg:h-10 lg:w-10 text-white" />
                </div>
                <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">Personnalisation</h3>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                  15+ polices disponibles, texte libre et prévisualisation en temps réel
                </p>
              </div>
              
              <div className="bg-white rounded-xl md:rounded-2xl border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-6 md:p-8 text-center space-y-3 md:space-y-4">
                <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                  <Truck className="h-7 w-7 md:h-8 md:w-8 lg:h-10 lg:w-10 text-white" />
                </div>
                <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">Livraison Rapide</h3>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                  Livraison express dans tout le royaume du Maroc sous 48-72h
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CAROUSEL PRODUITS VEDETTES */}
        <ProductCarousel />

        {/* SECTION CTA FINAL */}
        <section className="py-12 md:py-16 lg:py-20 xl:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#C8102E] via-[#006233] to-[#C8102E]" />
          <div className="absolute inset-0 bg-black/10" />
          
          <div className="container px-4 md:px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl md:rounded-3xl border-2 border-white/30 shadow-2xl p-6 md:p-10 lg:p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/20 backdrop-blur-sm mb-6 md:mb-8">
                  <Shield className="h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 text-white" />
                </div>
                
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 text-white px-2">
                  Commandez en toute confiance
                </h2>
                
                <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-6 md:mb-8 lg:mb-10 text-white/95 px-4 max-w-2xl mx-auto leading-relaxed">
                  Finalisation simple via WhatsApp ou Email. Paiement sécurisé à la livraison ou par virement bancaire. Support client disponible 7j/7.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
                  <Link to="/boutique" className="w-full sm:w-auto">
                    <Button 
                      size="lg" 
                      className="w-full sm:w-auto bg-white text-red-600 hover:bg-gray-100 hover:scale-105 transform transition-all duration-300 shadow-xl hover:shadow-2xl text-base md:text-lg px-6 md:px-8 lg:px-10 py-3 md:py-4 lg:py-5 font-bold"
                    >
                      Commander maintenant
                      <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                    </Button>
                  </Link>
                  
                  <Link to="/personnalisation" className="w-full sm:w-auto">
                    <Button 
                      size="lg" 
                      variant="outline"
                      className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-red-600 hover:scale-105 transform transition-all duration-300 shadow-xl hover:shadow-2xl text-base md:text-lg px-6 md:px-8 lg:px-10 py-3 md:py-4 lg:py-5 font-bold"
                    >
                      Personnaliser mon maillot
                      <Sparkles className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
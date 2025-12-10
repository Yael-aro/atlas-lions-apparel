import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import maillotRouge from '@/assets/maillot-rouge-model.png';
import maillotBlanc from '@/assets/maillot-blanc-model.png';
import morocoImage from '@/assets/moroco.png';
import { title } from 'process';

const JerseyShowcase = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const jerseys = [
    {
      image: maillotRouge,
      title: "Maillot Domicile",
      subtitle: "Rouge Passion",
      description: "Le maillot officiel de l'équipe nationale",
      // gradient: "from-red-600 via-red-700 to-red-900",
      textColor: "text-gray-900"
    },
    {
      image: maillotBlanc,
      title: "Maillot Extérieur",
      subtitle: "Blanc Élégance",
      description: "Design moderne aux couleurs du Maroc",
      gradient: "from-gray-100 via-white to-gray-200",
      textColor: "text-gray-900"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000); // Change toutes les 5 secondes

    return () => clearInterval(interval);
  }, [currentIndex]);

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % jerseys.length);
      setIsAnimating(false);
    }, 500);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + jerseys.length) % jerseys.length);
      setIsAnimating(false);
    }, 500);
  };

  return (
    <div className="relative w-full overflow-hidden">
      {/* Container principal avec gradient animé */}
      <div className={`relative w-full transition-all duration-1000 bg-gradient-to-br ${jerseys[currentIndex].gradient}`}>
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            
            {/* Texte à gauche - ENCADRÉ */}
            <div className="order-2 lg:order-1">
              <div className={`bg-white/90 backdrop-blur-sm rounded-2xl border-4 border-gray-300 shadow-2xl p-6 md:p-8 space-y-6 ${jerseys[currentIndex].textColor} transition-all duration-1000`}>
                <div className="space-y-2">
                  <p className="text-sm md:text-base font-semibold tracking-widest uppercase opacity-80">
                    CAN 2025 - Collection Officielle
                  </p>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                    {jerseys[currentIndex].title}
                  </h2>
                  <p className="text-2xl md:text-3xl font-light opacity-90">
                    {jerseys[currentIndex].subtitle}
                  </p>
                </div>
                
                <p className="text-lg md:text-xl opacity-80">
                  {jerseys[currentIndex].description}
                </p>

                <div className="flex flex-col sm:flex-row flex-wrap gap-4 pt-2">
                  <Link to="/boutique" className="w-full sm:w-auto">
                    <button 
                      className={`w-full sm:w-auto px-8 py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 shadow-lg ${
                        currentIndex === 0 
                          ? 'bg-red-600 text-white hover:bg-red-700' 
                          : 'bg-gray-900 text-white hover:bg-gray-800'
                      }`}
                    >
                      Découvrez la boutique
                    </button>
                  </Link>
                  <Link to="/personnalisation" className="w-full sm:w-auto">
                    <button 
                      className={`w-full sm:w-auto px-8 py-4 rounded-lg font-bold text-lg border-2 transition-all transform hover:scale-105 ${
                        currentIndex === 0 
                          ? 'border-red-600 text-red-600 hover:bg-red-50' 
                          : 'border-gray-900 text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      Personnaliser
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Image à droite */}
            <div className="order-1 lg:order-2 relative">
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                {jerseys.map((jersey, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-all duration-1000 ${
                      index === currentIndex 
                        ? 'opacity-100 scale-100 rotate-0' 
                        : 'opacity-0 scale-75 -rotate-12'
                    }`}
                  >
                    <img 
                      src={jersey.image}
                      alt={jersey.title}
                      className="w-full h-full object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ))}

                {/* Effet brillance */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-8 mt-12">
            <button
              onClick={handlePrev}
              disabled={isAnimating}
              className={`p-3 rounded-full transition-all transform hover:scale-110 ${
                currentIndex === 0 
                  ? 'bg-white/20 text-white hover:bg-white/30' 
                  : 'bg-gray-900/20 text-gray-900 hover:bg-gray-900/30'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              aria-label="Maillot précédent"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            {/* Indicateurs */}
            <div className="flex gap-3">
              {jerseys.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (!isAnimating && index !== currentIndex) {
                      setIsAnimating(true);
                      setTimeout(() => {
                        setCurrentIndex(index);
                        setIsAnimating(false);
                      }, 500);
                    }
                  }}
                  className={`transition-all ${
                    index === currentIndex 
                      ? 'w-12 h-3' 
                      : 'w-3 h-3 hover:opacity-75'
                  } rounded-full ${
                    currentIndex === 0 
                      ? 'bg-white' 
                      : 'bg-gray-900'
                  } ${index !== currentIndex && 'opacity-40'}`}
                  aria-label={`Aller au maillot ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={isAnimating}
              className={`p-3 rounded-full transition-all transform hover:scale-110 ${
                currentIndex === 0 
                  ? 'bg-white/20 text-white hover:bg-white/30' 
                  : 'bg-gray-900/20 text-gray-900 hover:bg-gray-900/30'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              aria-label="Maillot suivant"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JerseyShowcase;

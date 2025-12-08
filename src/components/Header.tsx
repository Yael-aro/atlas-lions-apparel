import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Menu, X, Snowflake } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import logoImage from "@/assets/logo.png";

export const Header = () => {
  const location = useLocation();
  const { items } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: "/", label: "Accueil" },
    { to: "/boutique", label: "Boutique" },
    { to: "/personnalisation", label: "Personnalisation" },
    { to: "/suivi", label: "Suivi de commande" },
  ];

  return (
    <>
      <style>{`
        @keyframes snowfall {
          0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .snowfall { animation: snowfall linear infinite; }
        .twinkle { animation: twinkle 2s ease-in-out infinite; }
      `}</style>

      {/* Flocons de neige subtils */}
      <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <Snowflake
            key={i}
            className="absolute text-white/20 snowfall"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-20px`,
              width: `${10 + Math.random() * 8}px`,
              height: `${10 + Math.random() * 8}px`,
              animationDuration: `${10 + Math.random() * 8}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg"
            : "bg-white"
        }`}
      >
        {/* Guirlande lumineuse discrète */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-green-600 to-red-600 opacity-40"></div>
        <div className="absolute top-0 left-0 right-0 flex justify-around py-0.5">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full twinkle"
              style={{
                background: i % 3 === 0 ? '#C8102E' : i % 3 === 1 ? '#006233' : '#FFD700',
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>

        <div className="container px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center group">
              <img
                src={logoImage}
                alt="Atlas Lions Apparel"
                className="h-12 w-auto transition-all duration-300 group-hover:drop-shadow-[0_0_10px_rgba(200,16,46,0.5)]"
              />
              {/* Petit flocon discret à côté du logo */}
              <Snowflake className="ml-2 h-3 w-3 text-blue-400/40 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          

            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-lg font-semibold transition-all relative group ${
                    location.pathname === link.to
                      ? "text-primary"
                      : "text-gray-700 hover:text-primary"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-primary to-green-600 transition-all ${
                      location.pathname === link.to ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                  {/* Petit flocon au survol */}
                  <Snowflake className="absolute -top-5 left-1/2 -translate-x-1/2 h-3 w-3 text-blue-400/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <Link to="/panier">
                <Button variant="outline" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                      {cartItemCount}
                    </span>
                  )}
                  {/* Petit flocon si panier contient des items */}
                  {cartItemCount > 0 && (
                    <Snowflake className="absolute -bottom-1 -left-1 h-2.5 w-2.5 text-blue-400/60" />
                  )}
                </Button>
              </Link>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {isMobileMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 border-t pt-4 animate-in slide-in-from-top">
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`text-lg font-semibold px-4 py-2 rounded-lg transition-all relative ${
                      location.pathname === link.to
                        ? "bg-primary text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {link.label}
                    {/* Petit flocon sur le lien actif */}
                    {location.pathname === link.to && (
                      <Snowflake className="absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 text-white/60" />
                    )}
                  </Link>
                ))}
              </div>
            </nav>
          )}
        </div>

        {/* Ligne décorative subtile en bas */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-red-600/20 to-transparent"></div>
      </header>
    </>
  );
};
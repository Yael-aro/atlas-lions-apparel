import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import logoImage from "@/assets/logo.png";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { items } = useCart();

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const navItems = [
    { name: "Accueil", path: "/" },
    { name: "Boutique", path: "/boutique" },
    { name: "Personnalisation", path: "/personnalisation" },
    { name: "À propos", path: "/a-propos" },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-white/98 backdrop-blur-lg shadow-xl border-b border-gray-100" 
          : "bg-white/95 backdrop-blur-md shadow-md"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Section */}
          <Link 
            to="/" 
            className="flex items-center gap-3 group relative"
            onClick={() => setIsMenuOpen(false)}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-red-600/20 rounded-full blur-md group-hover:blur-lg transition-all"></div>
              <img 
                src={logoImage}
                alt="Atlas Lions Apparel Logo" 
                className="h-14 w-auto relative z-10 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 drop-shadow-lg"
                onError={(e) => {
                  e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='45' fill='%23059669'/%3E%3Ctext x='50' y='60' text-anchor='middle' font-size='50' fill='white'%3E🦁%3C/text%3E%3C/svg%3E";
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-primary via-green-600 to-red-600 bg-clip-text text-transparent leading-tight tracking-tight">
                Atlas Lions
              </span>
              <span className="text-[10px] sm:text-xs font-semibold text-gray-600 tracking-widest uppercase">
                Official Apparel
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-4 py-2 font-semibold text-sm lg:text-base transition-all duration-300 rounded-lg group ${
                  location.pathname === item.path
                    ? "text-primary"
                    : "text-gray-700 hover:text-primary"
                }`}
              >
                <span className="relative z-10">{item.name}</span>
                <span 
                  className={`absolute inset-0 bg-gradient-to-r from-primary/10 to-green-600/10 rounded-lg transition-all duration-300 ${
                    location.pathname === item.path
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100"
                  }`}
                />
                {location.pathname === item.path && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-primary to-red-600 rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Cart Button */}
            <Link to="/panier" className="relative group">
              <Button 
                variant="outline" 
                size="icon" 
                className="relative h-11 w-11 rounded-full border-2 transition-all duration-300 hover:scale-110 hover:border-primary hover:shadow-lg hover:shadow-primary/20"
              >
                <ShoppingCart className="h-5 w-5 transition-colors group-hover:text-primary" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-br from-primary to-green-700 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-lg ring-2 ring-white animate-bounce">
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden animate-in fade-in"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="fixed inset-x-0 top-20 bottom-0 bg-white z-40 md:hidden animate-in slide-in-from-top overflow-y-auto">
            <nav className="container mx-auto px-4 py-6 flex flex-col gap-2">
              {navItems.map((item, index) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`relative px-6 py-4 font-semibold text-lg rounded-xl transition-all duration-300 animate-in slide-in-from-right ${
                    location.pathname === item.path
                      ? "bg-gradient-to-r from-primary/10 to-green-600/10 text-primary shadow-md"
                      : "text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className="flex items-center justify-between">
                    {item.name}
                    {location.pathname === item.path && (
                      <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    )}
                  </span>
                </Link>
              ))}

              {/* Mobile Cart Summary */}
              <div className="mt-4 p-6 bg-gradient-to-br from-primary/5 to-green-600/5 rounded-xl border-2 border-dashed border-primary/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-600">Panier</span>
                  <ShoppingCart className="h-5 w-5 text-primary" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-primary">{cartItemCount}</span>
                  <span className="text-sm text-gray-600">
                    {cartItemCount === 0 ? 'article' : cartItemCount === 1 ? 'article' : 'articles'}
                  </span>
                </div>
                {cartItemCount > 0 && (
                  <Link to="/panier" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full mt-4 shadow-lg">
                      Voir mon panier
                    </Button>
                  </Link>
                )}
              </div>

              {/* Mobile Footer Info */}
              <div className="mt-auto pt-6 border-t border-gray-200">
                <div className="text-center space-y-2">
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">
                    CAN 2025 - Morocco
                  </p>
                  <p className="text-2xl font-black bg-gradient-to-r from-primary to-red-600 bg-clip-text text-transparent">
                    Dima Maghrib 🇲🇦
                  </p>
                </div>
              </div>
            </nav>
          </div>
        </>
      )}
    </header>
  );
};

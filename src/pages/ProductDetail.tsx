import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import {
  ShoppingCart, Heart, Share2, Star, Check, Sparkles,
  Package, ArrowLeft, Plus, Minus, ChevronLeft, ChevronRight, MessageCircle
} from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getProductById } from "@/data/products";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { trackViewProduct, trackAddToCart, trackCustomizeProduct } from '@/hooks/useTracking';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const product = getProductById(id || "");

  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (product?.hasColorVariants && product.colorVariants && product.colorVariants.length > 0) {
      setSelectedColor(product.colorVariants[0].colorName);
    }
  }, [product]);

  useEffect(() => {
    if (product?.availableSizes && product.availableSizes.length > 0) {
      setSelectedSize(product.availableSizes[0]);
    }
  }, [product]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);
  // 👁️ TRACKING: Vue du produit
useEffect(() => {
  if (product) {
    trackViewProduct({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category
    });
  }
}, [product]);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center py-20">
          <div className="text-center">
            <Package className="h-20 w-20 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Produit introuvable</h2>
            <p className="text-gray-600 mb-6">Ce produit n'existe pas ou a été supprimé.</p>
            <Link to="/boutique">
              <Button size="lg">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Retour à la boutique
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const currentVariant = product.hasColorVariants && product.colorVariants
    ? product.colorVariants.find(v => v.colorName === selectedColor)
    : null;

  const displayImages = currentVariant?.images || product.images || [product.image];
  const currentImage = displayImages[currentImageIndex] || product.image;

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % displayImages.length);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.name,
          text: `Découvrez ${product.name} sur Atlas Lions Apparel`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Lien copié !");
      }
    } catch (err) {
      console.log("Erreur partage:", err);
    }
  };

  const handleWhatsAppContact = () => {
    const phoneNumber = "212770257750";
    let message = `Bonjour! Je suis intéressé(e) par le produit: ${product.name}`;
    
    if (selectedColor) message += `\nCouleur: ${selectedColor}`;
    if (selectedSize) message += `\nTaille: ${selectedSize}`;
    message += `\nQuantité: ${quantity}`;
    message += `\nPrix: ${product.price} DH`;
    message += `\n\nLien: ${window.location.href}`;
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleAddToCart = () => {
    if (product.availableSizes && product.availableSizes.length > 0 && !selectedSize) {
      toast.error("Veuillez sélectionner une taille");
      return;
    }

    if (product.stock === 0) {
      toast.error("Ce produit est en rupture de stock");
      return;
    }

    let fullName = product.name;
    if (selectedColor) fullName += ` - ${selectedColor}`;
    if (selectedSize) fullName += ` - ${selectedSize}`;

    const uniqueId = `${product.id}-${selectedColor || 'default'}-${selectedSize || 'onesize'}`;

    addToCart({
      id: uniqueId,
      name: fullName,
      price: product.price,
      image: currentImage,
      category: product.category,
      customizable: product.customizable || false,
      size: selectedSize || undefined,
      quantity
    });

    toast.success(` ${fullName} ajouté au panier !`, {
      action: {
        label: "Voir le panier",
        onClick: () => navigate("/panier")
      }
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/panier");
  };

  const isOutOfStock = product.stock === 0;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
      <Header />

      <main className="flex-1">
        <div className="bg-gray-100 py-4">
          <div className="container px-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Link to="/" className="hover:text-primary transition-colors">Accueil</Link>
              <span>/</span>
              <Link to="/boutique" className="hover:text-primary transition-colors">Boutique</Link>
              <span>/</span>
              <span className="text-gray-900 font-semibold">{product.name}</span>
            </div>
          </div>
        </div>

        <section className="py-8 md:py-12 lg:py-16">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 max-w-6xl mx-auto">

              <div className="space-y-4">
                <Card className="overflow-hidden border-2 border-gray-200 shadow-2xl rounded-2xl">
                  <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden group cursor-zoom-in">
                    <img 
                      src={currentImage} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-125" 
                    />

                    {isOutOfStock && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <Badge variant="destructive" className="text-lg px-6 py-2">Rupture de stock</Badge>
                      </div>
                    )}

                    <button
                      onClick={() => {
                        setIsFavorite(!isFavorite);
                        toast.success(isFavorite ? "Retiré des favoris" : "Ajouté aux favoris");
                      }}
                      className="absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all transform hover:scale-110 z-10"
                    >
                      <Heart className={`h-6 w-6 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} />
                    </button>

                    {displayImages.length > 1 && (
                      <>
                        <button onClick={handlePrevImage} className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all z-10">
                          <ChevronLeft className="h-6 w-6" />
                        </button>
                        <button onClick={handleNextImage} className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all z-10">
                          <ChevronRight className="h-6 w-6" />
                        </button>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                          {displayImages.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex ? 'w-6 bg-white' : 'bg-white/50'}`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </Card>

                {displayImages.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {displayImages.slice(0, 4).map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-all group ${index === currentImageIndex ? 'border-primary shadow-lg' : 'border-gray-200 hover:border-gray-300'}`}
                      >
                        <img 
                          src={img} 
                          alt={`${product.name} ${index + 1}`} 
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <Badge className="mb-3">{product.category}</Badge>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="text-gray-600">(127 avis)</span>
                  </div>

                  <div className="flex items-baseline gap-4">
                    <span className="text-4xl font-bold text-primary">{product.price} DH</span>
                    <span className="text-2xl font-semibold text-gray-400 line-through">{Math.round(product.price * 1.4)} DH</span>
                    <Badge variant="destructive" className="text-lg px-3 py-1">-40%</Badge>
                  </div>

                  {product.stock !== undefined && (
                    <div className="mt-4">
                      {product.stock > 0 ? (
                        <Badge variant="outline" className="border-green-500 text-green-700">
                          <Check className="h-4 w-4 mr-1" />
                          En stock ({product.stock} disponibles)
                        </Badge>
                      ) : (
                        <Badge variant="destructive">Rupture de stock</Badge>
                      )}
                    </div>
                  )}
                </div>

                {product.description && (
                  <Card className="border-2 border-gray-200 bg-gradient-to-br from-blue-50 to-white">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-3">Description</h3>
                      <p className="text-gray-700">{product.description}</p>
                    </CardContent>
                  </Card>
                )}

                {product.hasColorVariants && product.colorVariants && product.colorVariants.length > 0 && (
                  <div>
                    <label className="text-lg font-bold text-gray-900 mb-4 block">Couleur : {selectedColor}</label>
                    <div className="flex gap-3">
                      {product.colorVariants.map((variant) => (
                        <button
                          key={variant.colorName}
                          onClick={() => {
                            setSelectedColor(variant.colorName);
                            setCurrentImageIndex(0);
                          }}
                          className={`w-16 h-16 rounded-xl border-4 transition-all transform hover:scale-110 ${selectedColor === variant.colorName ? 'border-primary shadow-xl scale-110' : 'border-gray-300 hover:border-gray-400'}`}
                          style={{ backgroundColor: variant.color }}
                          title={variant.colorName}
                        >
                          {selectedColor === variant.colorName && (
                            <Check className="h-8 w-8 text-white mx-auto drop-shadow-lg" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {product.availableSizes && product.availableSizes.length > 0 && (
                  <div>
                    <label className="text-lg font-bold text-gray-900 mb-4 block">Taille</label>
                    <div className="grid grid-cols-5 gap-3">
                      {product.availableSizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`h-14 rounded-xl font-bold text-lg border-2 transition-all transform hover:scale-105 ${selectedSize === size ? 'bg-primary text-white border-primary shadow-lg scale-105' : 'bg-white text-gray-700 border-gray-300 hover:border-primary'}`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-lg font-bold text-gray-900 mb-4 block">Quantité</label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={isOutOfStock}
                      className="w-12 h-12 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 rounded-xl flex items-center justify-center"
                    >
                      <Minus className="h-5 w-5" />
                    </button>
                    <span className="text-2xl font-bold text-gray-900 w-16 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      disabled={isOutOfStock}
                      className="w-12 h-12 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 rounded-xl flex items-center justify-center"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <Button
                    size="lg"
                    onClick={handleBuyNow}
                    disabled={isOutOfStock}
                    className="w-full h-14 text-lg font-bold"
                  >
                    <ShoppingCart className="mr-2 h-6 w-6" />
                    {isOutOfStock ? "Rupture de stock" : "Acheter maintenant"}
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className="w-full h-14 text-lg font-bold border-2"
                  >
                    <ShoppingCart className="mr-2 h-6 w-6" />
                    Ajouter au panier
                  </Button>

                  {product.customizable && !isOutOfStock && (
                    <Link to="/personnalisation">
                      <Button
                        size="lg"
                        variant="outline"
                        className="w-full h-14 text-lg font-bold border-2 border-primary text-primary hover:bg-primary hover:text-white"
                      >
                        <Sparkles className="mr-2 h-6 w-6" />
                        Personnaliser
                      </Button>
                    </Link>
                  )}

                  {/* Bouton WhatsApp */}
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleWhatsAppContact}
                    className="w-full h-14 text-lg font-bold border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                  >
                    <MessageCircle className="mr-2 h-6 w-6" />
                    Contacter via WhatsApp
                  </Button>

                  <button
                    onClick={handleShare}
                    className="w-full h-12 rounded-xl border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold flex items-center justify-center gap-2"
                  >
                    <Share2 className="h-5 w-5" />
                    Partager
                  </button>
                </div>

                <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white">
                  <CardContent className="p-6 space-y-3">
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-600" />
                      <p className="text-sm text-gray-700">Livraison gratuite </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-600" />
                      <p className="text-sm text-gray-700">Paiement à la livraison</p>
                    </div>
                    {product.customizable && (
                      <div className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-600" />
                        <p className="text-sm text-gray-700">Personnalisation gratuite</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
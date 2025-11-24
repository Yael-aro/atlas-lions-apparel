import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Sparkles, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import type { ColorVariant } from "@/data/products";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  images?: string[];
  category: string;
  customizable?: boolean;
  hasColorVariants?: boolean;
  colorVariants?: ColorVariant[];
}

export const ProductCard = ({ 
  id, 
  name, 
  price, 
  image, 
  images, 
  category, 
  customizable,
  hasColorVariants,
  colorVariants 
}: ProductCardProps) => {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0); // ✅ NOUVEAU - Index de la couleur sélectionnée

  // ✅ NOUVEAU - Utilise les images de la couleur sélectionnée si disponible
  const currentVariant = hasColorVariants && colorVariants ? colorVariants[selectedColorIndex] : null;
  const imageList = currentVariant?.images || images || [currentVariant?.image || image];
  const hasMultipleImages = imageList.length > 1;

  const handleAddToCart = () => {
    setIsAdding(true);
    
    const selectedColor = currentVariant?.colorName || undefined;
    
    addToCart({
      id,
      name: selectedColor ? `${name} - ${selectedColor}` : name,
      price,
      image: imageList[0],
      category,
      customizable,
    });

    setTimeout(() => {
      setIsAdding(false);
    }, 1500);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % imageList.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + imageList.length) % imageList.length);
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  // ✅ NOUVEAU - Gère le changement de couleur
  const handleColorChange = (index: number) => {
    setSelectedColorIndex(index);
    setCurrentImageIndex(0); // Reset à la première image
  };

  return (
    <Card className="group overflow-hidden hover:shadow-elegant transition-smooth border-border">
      <div className="relative overflow-hidden aspect-square">
        {/* Image */}
        <img 
          src={imageList[currentImageIndex]} 
          alt={`${name} - Image ${currentImageIndex + 1}`}
          className="object-cover w-full h-full group-hover:scale-110 transition-smooth"
        />

        {/* Flèches de navigation */}
        {hasMultipleImages && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Image précédente"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Image suivante"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            {/* Indicateurs de pagination */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
              {imageList.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    goToImage(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentImageIndex 
                      ? "bg-white scale-125" 
                      : "bg-white/50 hover:bg-white/75"
                  }`}
                  aria-label={`Aller à l'image ${index + 1}`}
                />
              ))}
            </div>

            {/* Compteur d'images */}
            {hasMultipleImages && (
              <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                {currentImageIndex + 1}/{imageList.length}
              </div>
            )}
          </>
        )}

        {/* Badges */}
        {customizable && (
          <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground">
            <Sparkles className="h-3 w-3 mr-1" />
            Personnalisable
          </Badge>
        )}
        <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
          {category}
        </Badge>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2">{name}</h3>
        
        {/* ✅ NOUVEAU - Sélecteur de couleur */}
        {hasColorVariants && colorVariants && (
          <div className="mb-3">
            <p className="text-xs text-muted-foreground mb-2">Couleur :</p>
            <div className="flex gap-2">
              {colorVariants.map((variant, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    handleColorChange(index);
                  }}
                  className={`relative w-8 h-8 rounded-full border-2 transition-all ${
                    index === selectedColorIndex
                      ? "border-primary scale-110 shadow-md"
                      : "border-border hover:border-primary/50"
                  }`}
                  style={{ backgroundColor: variant.color }}
                  title={variant.colorName}
                >
                  {index === selectedColorIndex && (
                    <Check className="absolute inset-0 m-auto h-4 w-4 text-white drop-shadow-md" />
                  )}
                  {/* Bordure noire pour le blanc */}
                  {variant.color === "#FFFFFF" && (
                    <div className="absolute inset-0 rounded-full border border-gray-300" />
                  )}
                </button>
              ))}
            </div>
            {colorVariants[selectedColorIndex] && (
              <p className="text-xs text-muted-foreground mt-1">
                {colorVariants[selectedColorIndex].colorName}
              </p>
            )}
          </div>
        )}
        
        <p className="text-2xl font-bold text-primary">{price} DH</p>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={handleAddToCart}
          disabled={isAdding}
          className={`w-full transition-all duration-300 shadow-elegant ${
            isAdding 
              ? "bg-green-600 hover:bg-green-600" 
              : "bg-primary hover:bg-primary-glow"
          }`}
        >
          {isAdding ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Ajouté !
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Ajouter au panier
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
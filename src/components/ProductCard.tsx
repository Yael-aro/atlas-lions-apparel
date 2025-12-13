import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ColorVariant } from "@/data/products";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  images?: string[];
  category: string;
  description?: string;
  stock?: number;
  customizable?: boolean;
  hasColorVariants?: boolean;
  colorVariants?: ColorVariant[];
  availableSizes?: string[];
}

export const ProductCard = ({ 
  id, 
  name, 
  price, 
  image, 
  images,
  category, 
  description, 
  stock,
  customizable,
  hasColorVariants,
  colorVariants
}: ProductCardProps) => {
  
  const [selectedVariant, setSelectedVariant] = useState<ColorVariant | null>(
    hasColorVariants && colorVariants && colorVariants.length > 0 
      ? colorVariants[0] 
      : null
  );

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const displayImages = selectedVariant?.images || images || [image];

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [selectedVariant]);

  const currentImage = displayImages[currentImageIndex] || displayImages[0] || image;

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentImageIndex((prev) => {
      const newIndex = prev === 0 ? displayImages.length - 1 : prev - 1;
      return newIndex;
    });
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentImageIndex((prev) => {
      const newIndex = prev === displayImages.length - 1 ? 0 : prev + 1;
      return newIndex;
    });
  };

  return (
    <Link to={`/produit/${id}`}>
      <Card className="shadow-elegant hover:shadow-2xl transition-all duration-300 group animate-in fade-in cursor-pointer h-full">
        <CardContent className="p-0 h-full flex flex-col">
          <div className="relative overflow-hidden rounded-t-lg">
            <div className="relative w-full h-64">
              <img
                key={currentImage}
                src={currentImage}
                alt={`${name} - Image ${currentImageIndex + 1}`}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect fill='%23dc2626' width='400' height='400'/%3E%3Ctext x='200' y='200' text-anchor='middle' dy='.3em' fill='white' font-size='80'%3E🦁%3C/text%3E%3C/svg%3E";
                }}
                style={{ minHeight: '256px' }}
              />

              {displayImages.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all z-10"
                    aria-label="Image précédente"
                    type="button"
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-800" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all z-10"
                    aria-label="Image suivante"
                    type="button"
                  >
                    <ChevronRight className="h-5 w-5 text-gray-800" />
                  </button>

                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                    {displayImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setCurrentImageIndex(index);
                        }}
                        type="button"
                        className={`h-2 rounded-full transition-all ${
                          index === currentImageIndex 
                            ? 'w-8 bg-white shadow-lg' 
                            : 'w-2 bg-white/60 hover:bg-white/80'
                        }`}
                        aria-label={`Image ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Overlay avec bouton Voir détails */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                  <Eye className="mr-2 h-5 w-5" />
                  Voir les détails
                </Button>
              </div>
            </div>

            <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 z-10">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            </div>
            {stock && stock < 10 && (
              <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10">
                Plus que {stock} !
              </div>
            )}
            {customizable && (
              <div className="absolute top-14 left-3 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold z-10">
                Personnalisable
              </div>
            )}
          </div>
          
          <div className="p-6 space-y-4 flex-1 flex flex-col">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide">
                {category}
              </p>
              <h3 className="text-xl font-bold mt-1 group-hover:text-primary transition-colors">
                {name}
              </h3>
              {description && (
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                  {description}
                </p>
              )}
            </div>
            
            <div className="flex items-center justify-between pt-2 border-t">
              <div>
                <span className="text-3xl font-bold text-primary">{price}</span>
                <span className="text-lg font-semibold text-muted-foreground ml-1">DH</span>
              </div>
              {stock === 0 && (
                <span className="text-red-600 font-bold">Épuisé</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
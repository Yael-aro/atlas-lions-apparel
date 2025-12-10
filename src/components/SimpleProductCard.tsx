import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Eye } from "lucide-react";
import { Link } from "react-router-dom";

interface SimpleProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
}

export const SimpleProductCard = ({ id, name, price, image, category }: SimpleProductCardProps) => {
  return (
    <Card className="group overflow-hidden border-2 border-gray-200 hover:border-primary hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white rounded-2xl">
      <CardContent className="p-0">
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 aspect-square">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Link to={`/produit/${id}`}>
              <Button 
                size="lg"
                className="bg-white text-gray-900 hover:bg-gray-100 font-bold shadow-xl transform scale-90 group-hover:scale-100 transition-transform duration-300"
              >
                <Eye className="mr-2 h-5 w-5" />
                Voir le produit
              </Button>
            </Link>
          </div>

          {category && (
            <div className="absolute top-3 left-3 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              {category}
            </div>
          )}
        </div>

        <div className="p-4 md:p-6 space-y-4">
          <div>
            <h3 className="text-base md:text-lg font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-primary transition-colors">
              {name}
            </h3>
            <p className="text-2xl md:text-3xl font-bold text-primary">
              {price} DH
            </p>
          </div>

          <Link to={`/produit/${id}`} className="block">
            <Button 
              className="w-full h-11 md:h-12 text-base md:text-lg font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Commander
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

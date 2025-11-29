import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart, Star } from "lucide-react";
import { toast } from "sonner";

const products = [
  {
    id: "casquette-maroc",
    name: "Casquette Atlas Lions",
    price: 120,
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500",
    category: "Accessoires",
    rating: 4.8,
  },
  {
    id: "tshirt-maroc",
    name: "T-Shirt Supporter",
    price: 150,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
    category: "Vêtements",
    rating: 4.9,
  },
  {
    id: "echarpe-maroc",
    name: "Écharpe Officielle",
    price: 80,
    image: "https://images.unsplash.com/photo-1601924357840-3c456a7c5eaf?w=500",
    category: "Accessoires",
    rating: 4.7,
  },
  {
    id: "drapeau-maroc",
    name: "Drapeau Marocain",
    price: 60,
    image: "https://images.unsplash.com/photo-1555992457-f608f640e2cd?w=500",
    category: "Accessoires",
    rating: 4.6,
  }
];

const Boutique = () => {
  const { addToCart } = useCart();

  const handleAddToCart = (product: typeof products[0]) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      customizable: false
    });
    
    toast.success(`✅ ${product.name} ajouté au panier !`, {
      duration: 3000,
      description: `${product.price} DH`,
      action: {
        label: "Voir le panier",
        onClick: () => window.location.href = "/#/panier"
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="gradient-primary py-16 text-white">
          <div className="container px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">Boutique</h1>
            <p className="text-xl text-center max-w-2xl mx-auto">
              Découvrez notre collection officielle
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product, index) => (
                <Card 
                  key={product.id} 
                  className="shadow-elegant hover:shadow-2xl transition-all animate-in fade-in slide-in-from-bottom"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-64 object-cover transition-transform hover:scale-110"
                        onError={(e) => {
                          e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect fill='%23f3f4f6' width='400' height='400'/%3E%3Ctext x='200' y='200' text-anchor='middle' dy='.3em' fill='%23999' font-size='24'%3EProduit%3C/text%3E%3C/svg%3E";
                        }}
                      />
                      <div className="absolute top-2 right-2 bg-white px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold text-sm">{product.rating}</span>
                      </div>
                    </div>
                    <div className="p-6 space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">{product.category}</p>
                        <h3 className="text-xl font-bold">{product.name}</h3>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary">{product.price} DH</span>
                        <Button onClick={() => handleAddToCart(product)} className="shadow-elegant">
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Ajouter
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Boutique;

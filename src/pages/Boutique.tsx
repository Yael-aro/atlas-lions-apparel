import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { useState } from "react";
import { getAllProducts, getProductsByCategory, getCategories } from "@/data/products";
import zelijImage from "@/assets/zelij.jpg";

const Boutique = () => {
  const [activeCategory, setActiveCategory] = useState("Tous");
  
  const categories = getCategories();
  const products = activeCategory === "Tous" 
    ? getAllProducts() 
    : getProductsByCategory(activeCategory);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Page Header avec image zelij + effet rouge/vert */}
        <section className="relative py-16 text-white overflow-hidden">
          {/* Image de fond */}
          <div className="absolute inset-0 z-0">
            <img 
              src={zelijImage} 
              alt="Zelij Background" 
              className="w-full h-full object-cover"
            />
            {/* ✅ Overlay dégradé : Rouge à gauche → Vert à droite */}
            <div 
              className="absolute inset-0"
              style={{
                background: "linear-gradient(to right, rgba(200, 16, 46, 0.85) 0%, rgba(200, 16, 46, 0.6) 30%, rgba(0, 98, 51, 0.6) 70%, rgba(0, 98, 51, 0.85) 100%)"
              }}
            />
          </div>
          
          {/* Contenu */}
          <div className="container px-4 relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Boutique CAN 2025</h1>
            <p className="text-xl text-white/90">
              Tous nos produits premium aux couleurs du Maroc
            </p>
          </div>
        </section>

        {/* Filters & Products */}
        <section className="py-12">
          <div className="container px-4">
            {/* Filter Bar */}
            <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex gap-2 flex-wrap">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={activeCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtres
              </Button>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>

            {/* Message si aucun produit */}
            {products.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Aucun produit trouvé dans cette catégorie.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Boutique;
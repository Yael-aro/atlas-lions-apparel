import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Panier = () => {
  const { items, removeFromCart, getTotalPrice } = useCart();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-8">
        <h1 className="text-4xl font-bold mb-4">Panier avec useCart</h1>
        
        {items.length === 0 ? (
          <Card className="max-w-md mx-auto text-center p-8">
            <p className="text-xl mb-4">Votre panier est vide</p>
            <Button onClick={() => navigate("/boutique")}>
              Voir la boutique
            </Button>
          </Card>
        ) : (
          <div className="max-w-4xl mx-auto">
            <p className="text-xl mb-4">✅ useCart fonctionne ! {items.length} article(s)</p>
            
            <div className="space-y-4">
              {items.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4 flex justify-between items-center">
                    <div className="flex gap-4 items-center">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div>
                        <h3 className="font-bold">{item.name}</h3>
                        <p>{item.price} DH × {item.quantity}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="mt-8">
              <CardContent className="p-6">
                <div className="flex justify-between items-center text-2xl font-bold">
                  <span>Total</span>
                  <span>{getTotalPrice()} DH</span>
                </div>
                <Button 
                  className="w-full mt-4" 
                  size="lg"
                  onClick={() => alert('Commande OK ! On ajoutera Supabase après')}
                >
                  Commander (test sans Supabase)
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Panier;

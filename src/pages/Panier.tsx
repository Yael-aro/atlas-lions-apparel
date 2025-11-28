import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Panier = () => {
  const { items, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <section className="gradient-primary py-16 text-white">
            <div className="container px-4">
              <h1 className="text-4xl font-bold text-center">Panier</h1>
            </div>
          </section>
          <section className="py-16">
            <div className="container px-4">
              <Card className="max-w-md mx-auto text-center shadow-elegant">
                <CardContent className="p-12">
                  <ShoppingBag className="h-24 w-24 mx-auto mb-6 text-muted-foreground opacity-50" />
                  <h2 className="text-2xl font-bold mb-4">Votre panier est vide</h2>
                  <Button onClick={() => navigate("/boutique")} size="lg">
                    Voir la boutique
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="gradient-primary py-16 text-white">
          <div className="container px-4">
            <h1 className="text-4xl font-bold text-center">
              Panier ({items.length})
            </h1>
          </div>
        </section>

        <section className="py-12">
          <div className="container px-4 max-w-4xl mx-auto">
            <div className="space-y-4 mb-8">
              {items.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-32 h-32 object-cover rounded-lg" 
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-xl font-bold">{item.name}</h3>
                            <p className="text-sm text-muted-foreground">{item.category}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="text-lg font-semibold w-8 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">
                              {item.price * item.quantity} DH
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-bold">Total</span>
                  <span className="text-3xl font-bold text-primary">
                    {getTotalPrice()} DH
                  </span>
                </div>
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => {
                    const message = `Commande:\n${items.map(i => `${i.name} x${i.quantity}`).join('\n')}\nTotal: ${getTotalPrice()}DH`;
                    window.open(`https://wa.me/212612345678?text=${encodeURIComponent(message)}`, '_blank');
                    toast.success("Commande envoyée !");
                    clearCart();
                  }}
                >
                  Commander via WhatsApp
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Panier;

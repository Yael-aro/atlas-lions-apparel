import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Trash2, Minus, Plus, ShoppingBag, MessageCircle, Mail, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";

const SIZES = ["S", "M", "L", "XL", "XXL"];

const Panier = () => {
  const { items, totalPrice, updateQuantity, removeFromCart, updateSize } = useCart();

  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
  });

  const shipping = 40;
  const total = totalPrice + shipping;

  const generateWhatsAppMessage = () => {
    const message = `🛒 Nouvelle commande CAN 2025\n\n` +
      `📦 Produits:\n${items.map(item => 
        `- ${item.name} (Taille: ${item.size || "M"})\n  ${item.customization ? `Personnalisation: ${item.customization}\n  ` : ""}Quantité: ${item.quantity}\n  Prix: ${item.price * item.quantity} DH`
      ).join('\n\n')}\n\n` +
      `👤 Informations client:\n` +
      `Nom: ${customerInfo.name}\n` +
      `Téléphone: ${customerInfo.phone}\n` +
      `Adresse: ${customerInfo.address}\n` +
      `Ville: ${customerInfo.city}\n\n` +
      `💰 Total: ${total} DH (Livraison incluse)`;
    
    return encodeURIComponent(message);
  };

  const handleWhatsAppOrder = () => {
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address || !customerInfo.city) {
      alert("Veuillez remplir toutes les informations de livraison");
      return;
    }
    const whatsappUrl = `https://wa.me/212600000000?text=${generateWhatsAppMessage()}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container px-4">
          <h1 className="text-4xl font-bold mb-8">Mon Panier</h1>

          {items.length === 0 ? (
            <Card className="text-center p-12">
              <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-semibold mb-2">Votre panier est vide</h2>
              <p className="text-muted-foreground mb-6">
                Découvrez nos produits premium pour la CAN 2025
              </p>
              <Link to="/boutique">
                <Button size="lg">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Découvrir la boutique
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <Card key={`${item.id}-${item.size}-${item.customization}`}>
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded"
                        />
                        
                        <div className="flex-1 space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-lg">{item.name}</h3>
                              {item.customization && (
                                <p className="text-sm text-muted-foreground">
                                  Personnalisation: {item.customization}
                                </p>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeFromCart(item.id)}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* ✅ NOUVEAU - Sélecteur de taille avec boutons */}
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Taille:</span>
                            <div className="flex gap-1">
                              {SIZES.map((size) => (
                                <button
                                  key={size}
                                  onClick={() => updateSize(item.id, size)}
                                  className={`px-3 py-1 text-sm font-medium rounded-md border transition-all ${
                                    item.size === size
                                      ? "bg-primary text-primary-foreground border-primary"
                                      : "bg-background border-border hover:border-primary hover:text-primary"
                                  }`}
                                >
                                  {size}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Quantité et Prix */}
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">Quantité:</span>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="h-8 w-8"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center font-semibold">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="h-8 w-8"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>

                            {/* ✅ CORRIGÉ - Prix × quantité */}
                            <div className="text-right">
                              <p className="text-xl font-bold text-primary">
                                {item.price * item.quantity} DH
                              </p>
                              {item.quantity > 1 && (
                                <p className="text-xs text-muted-foreground">
                                  ({item.price} DH × {item.quantity})
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Order Summary & Customer Info */}
              <div className="space-y-6">
                {/* Customer Info */}
                <Card className="shadow-elegant">
                  <CardContent className="p-6 space-y-4">
                    <h2 className="text-xl font-bold">Informations de livraison</h2>
                    
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom complet *</Label>
                      <Input
                        id="name"
                        value={customerInfo.name}
                        onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                        placeholder="Votre nom ici"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone WhatsApp *</Label>
                      <Input
                        id="phone"
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                        placeholder="+212 6XX XXX XXX"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Adresse complète *</Label>
                      <Input
                        id="address"
                        value={customerInfo.address}
                        onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                        placeholder="Rue, Numéro, Quartier"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city">Ville *</Label>
                      <Input
                        id="city"
                        value={customerInfo.city}
                        onChange={(e) => setCustomerInfo({...customerInfo, city: e.target.value})}
                        placeholder="Casablanca, Rabat..."
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Summary */}
                <Card className="shadow-elegant">
                  <CardContent className="p-6 space-y-4">
                    <h2 className="text-xl font-bold">Récapitulatif</h2>
                    
                    {/* Liste des articles */}
                    <div className="space-y-2 text-sm">
                      {items.map((item) => (
                        <div key={item.id} className="flex justify-between text-muted-foreground">
                          <span>{item.name} ({item.size}) × {item.quantity}</span>
                          <span>{item.price * item.quantity} DH</span>
                        </div>
                      ))}
                    </div>

                    <Separator />
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Sous-total</span>
                        <span className="font-semibold">{totalPrice} DH</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Livraison</span>
                        <span className="font-semibold">{shipping} DH</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-lg">
                        <span className="font-bold">Total</span>
                        <span className="font-bold text-primary">{total} DH</span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-4">
                      <Button 
                        className="w-full shadow-elegant" 
                        size="lg"
                        onClick={handleWhatsAppOrder}
                      >
                        <MessageCircle className="mr-2 h-5 w-5" />
                        Commander via WhatsApp
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full" 
                        size="lg"
                      >
                        <Mail className="mr-2 h-5 w-5" />
                        Commander via Email
                      </Button>
                    </div>

                    <p className="text-xs text-muted-foreground text-center">
                      Paiement sécurisé à la livraison ou par virement bancaire
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Panier;

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

const SIZES = ["S", "M", "L", "XL", "XXL"];

const Panier = () => {
  const { items, totalPrice, updateQuantity, removeFromCart, updateSize, clearCart } = useCart();

  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const shipping = 40;
  const total = totalPrice + shipping;

  // ✅ FONCTION POUR ENVOYER AU BACKEND
  const handleSubmitOrder = async () => {
    // Validation
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address || !customerInfo.city) {
      toast.error("Veuillez remplir toutes les informations de livraison");
      return;
    }

    if (items.length === 0) {
      toast.error("Votre panier est vide");
      return;
    }

    setIsSubmitting(true);

    try {
      // Pour chaque article du panier, créer une commande
      const orderPromises = items.map(async (item) => {
        // Créer les données de personnalisation adaptées pour le backend
        const personalizationData = {
          id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: Date.now(),
          jerseyColor: item.category === "Maillot" ? "red" : "white", // Adapter selon ton besoin
          name: {
            enabled: !!item.customization,
            text: item.customization || item.name,
            font: "montserrat",
            color: "gold",
            position: { x: 50, y: 35 }
          },
          number: {
            enabled: false,
            text: "",
            font: "montserrat",
            color: "gold",
            position: { x: 50, y: 50 }
          },
          slogan: {
            enabled: false,
            text: "",
            font: "montserrat",
            color: "gold",
            size: "medium",
            position: { x: 50, y: 65 }
          },
          selectedPosition: "back",
          // Informations spécifiques au panier
          productName: item.name,
          productCategory: item.category,
          quantity: item.quantity,
          size: item.size || "M",
          unitPrice: item.price,
          totalPrice: item.price * item.quantity,
          previewImage: item.image
        };

        // Envoyer au backend
        const response = await fetch('http://localhost:8000/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            personalizationData,
            customerInfo: {
              name: customerInfo.name,
              phone: customerInfo.phone,
              address: customerInfo.address,
              city: customerInfo.city
            }
          })
        });

        return response.json();
      });

      // Attendre toutes les requêtes
      const results = await Promise.all(orderPromises);

      // Vérifier que toutes ont réussi
      const allSuccessful = results.every(result => result.success);

      if (allSuccessful) {
        const orderNumbers = results.map(r => r.orderNumber).join(', ');
        
        toast.success(`✅ Commande(s) enregistrée(s) avec succès !`, {
          description: `Numéros: ${orderNumbers}`,
          duration: 5000
        });

        // Vider le panier
        clearCart();

        // Réinitialiser le formulaire
        setCustomerInfo({
          name: "",
          phone: "",
          address: "",
          city: "",
        });

        // Message de suivi
        setTimeout(() => {
          toast.info("📦 Vous recevrez une confirmation par téléphone", {
            duration: 5000
          });
        }, 1500);

      } else {
        toast.error("❌ Erreur lors de l'enregistrement de certaines commandes");
      }

    } catch (error) {
      console.error('Erreur:', error);
      toast.error("❌ Impossible de contacter le serveur");
    } finally {
      setIsSubmitting(false);
    }
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

                          {/* Sélecteur de taille avec boutons */}
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
                        placeholder="Votre nom complet"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone *</Label>
                      <Input
                        id="phone"
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                        placeholder="06 XX XX XX XX"
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

                    {/* ✅ BOUTON COMMANDER (Backend) */}
                    <div className="space-y-2 pt-4">
                      <Button 
                        className="w-full shadow-elegant" 
                        size="lg"
                        onClick={handleSubmitOrder}
                        disabled={isSubmitting}
                      >
                        <Package className="mr-2 h-5 w-5" />
                        {isSubmitting ? "⏳ Envoi en cours..." : "Confirmer la commande"}
                      </Button>
                    </div>

                    <p className="text-xs text-muted-foreground text-center">
                      Paiement sécurisé à la livraison ou par virement bancaire
                    </p>
                  </CardContent>
                </Card>

                {/* Info supplémentaire */}
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2 text-blue-800 text-sm">
                      📦 Livraison rapide
                    </h3>
                    <ul className="text-xs text-blue-700 space-y-1">
                      <li>✓ Livraison sous 2-5 jours ouvrés</li>
                      <li>✓ Paiement à la livraison disponible</li>
                      <li>✓ Suivi de commande par téléphone</li>
                      <li>✓ Service client réactif</li>
                    </ul>
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
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag, Truck } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from '@/lib/supabase';

const Panier = () => {
  const { items, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [showCheckout, setShowCheckout] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerCity, setCustomerCity] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  const deliveryFee = customerCity ? (customerCity.toLowerCase().includes('casa') ? 20 : 40) : 0;
  const subtotal = getTotalPrice();
  const finalTotal = Math.max(0, subtotal - discount + deliveryFee);

  const validatePhone = (phone: string) => {
    const phoneRegex = /^(06|07|05)\d{8}$/;
    if (!phone) {
      setPhoneError('Téléphone requis');
      return false;
    }
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      setPhoneError('Format: 06XXXXXXXX');
      return false;
    }
    setPhoneError('');
    return true;
  };

  const applyPromoCode = () => {
    const codes: { [key: string]: number } = {
      'CAN2025': 50,
      'LIONS10': 10,
      'MAROC20': 20
    };
    
    const discountAmount = codes[promoCode.toUpperCase()];
    if (discountAmount) {
      setDiscount(discountAmount);
      toast.success(`🎉 Code promo appliqué ! -${discountAmount} DH`);
    } else {
      toast.error('❌ Code promo invalide');
    }
  };

  const handleRemoveItem = (id: string, name: string) => {
    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          removeFromCart(id);
          resolve(true);
        }, 300);
      }),
      {
        loading: 'Suppression...',
        success: `${name} retiré du panier`,
        error: 'Erreur',
      }
    );
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error("Votre panier est vide");
      return;
    }
    setShowCheckout(true);
  };

  const handleSubmitOrder = async () => {
    if (!customerName.trim()) {
      toast.error("Nom requis");
      return;
    }
    
    if (!validatePhone(customerPhone)) {
      return;
    }

    setIsSubmitting(true);

    const loadingToast = toast.loading('⏳ Enregistrement de votre commande...');

    try {
      const { count, error: countError } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });
      
      if (countError) throw countError;
      
      const orderNumber = `CMD-${String((count || 0) + 1).padStart(4, '0')}`;
      
      const orderPromises = items.map(async (item) => {
        let personalizationData = null;
        if (item.customizable && item.id) {
          const savedData = localStorage.getItem(`personalization-${item.id}`);
          if (savedData) {
            try {
              personalizationData = JSON.parse(savedData);
            } catch (e) {
              console.error('Erreur parse personalization:', e);
            }
          }
        }

        const orderData: any = {
          order_number: `${orderNumber}-${item.id}`,
          personalization_id: item.id || `cart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          customer_name: customerName.trim(),
          customer_phone: customerPhone.replace(/\s/g, ''),
          customer_address: customerAddress.trim() || '',
          customer_city: customerCity.trim() || '',
          jersey_color: item.category === 'Maillot' ? 'red' : 'white',
          total_price: item.price * item.quantity,
          status: 'pending',
          notes: `Panier - Quantité: ${item.quantity} - ${item.name}${promoCode ? ` - Promo: ${promoCode}` : ''}`,
          name_enabled: false,
          name_text: '',
          name_font: 'montserrat',
          name_color: 'gold',
          name_position_x: 50,
          name_position_y: 35,
          number_enabled: false,
          number_text: '',
          number_font: 'montserrat',
          number_color: 'gold',
          number_position_x: 50,
          number_position_y: 50,
          slogan_enabled: false,
          slogan_text: '',
          slogan_font: 'montserrat',
          slogan_color: 'gold',
          slogan_size: 'medium',
          slogan_position_x: 50,
          slogan_position_y: 65,
          selected_position: 'back',
          preview_image_url: ''
        };

        if (personalizationData) {
          orderData.jersey_color = personalizationData.jerseyColor || orderData.jersey_color;
          orderData.name_enabled = personalizationData.name?.enabled || false;
          orderData.name_text = personalizationData.name?.text || '';
          orderData.name_font = personalizationData.name?.font || 'montserrat';
          orderData.name_color = personalizationData.name?.color || 'gold';
          orderData.name_position_x = personalizationData.name?.position?.x || 50;
          orderData.name_position_y = personalizationData.name?.position?.y || 35;
          orderData.number_enabled = personalizationData.number?.enabled || false;
          orderData.number_text = personalizationData.number?.text || '';
          orderData.number_font = personalizationData.number?.font || 'montserrat';
          orderData.number_color = personalizationData.number?.color || 'gold';
          orderData.number_position_x = personalizationData.number?.position?.x || 50;
          orderData.number_position_y = personalizationData.number?.position?.y || 50;
          orderData.slogan_enabled = personalizationData.slogan?.enabled || false;
          orderData.slogan_text = personalizationData.slogan?.text || '';
          orderData.slogan_font = personalizationData.slogan?.font || 'montserrat';
          orderData.slogan_color = personalizationData.slogan?.color || 'gold';
          orderData.slogan_size = personalizationData.slogan?.size || 'medium';
          orderData.slogan_position_x = personalizationData.slogan?.position?.x || 50;
          orderData.slogan_position_y = personalizationData.slogan?.position?.y || 65;
          orderData.selected_position = personalizationData.selectedPosition || 'back';
          orderData.preview_image_url = personalizationData.previewImage || '';
        }

        const { error } = await supabase
          .from('orders')
          .insert([orderData]);

        if (error) throw error;
      });

      await Promise.all(orderPromises);

      toast.dismiss(loadingToast);
      toast.success(`✅ Commande ${orderNumber} enregistrée !`, {
        duration: 5000,
        description: `Total: ${finalTotal} DH${discount > 0 ? ` (Économie: ${discount} DH)` : ''}`
      });

      clearCart();
      setShowCheckout(false);
      setCustomerName('');
      setCustomerPhone('');
      setCustomerCity('');
      setCustomerAddress('');
      setPromoCode('');
      setDiscount(0);

      setTimeout(() => {
        toast.info("📦 Confirmation par téléphone sous 24h", {
          duration: 5000
        });
        navigate('/');
      }, 1500);

    } catch (error: any) {
      toast.dismiss(loadingToast);
      console.error('Erreur commande:', error);
      toast.error("❌ Erreur: " + (error.message || "Veuillez réessayer"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <section className="gradient-primary py-16 text-white">
            <div className="container px-4">
              <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">Panier</h1>
            </div>
          </section>
          <section className="py-16">
            <div className="container px-4">
              <Card className="max-w-md mx-auto text-center shadow-elegant animate-in fade-in slide-in-from-bottom">
                <CardContent className="p-12">
                  <ShoppingBag className="h-24 w-24 mx-auto mb-6 text-muted-foreground opacity-50" />
                  <h2 className="text-2xl font-bold mb-4">Votre panier est vide</h2>
                  <p className="text-muted-foreground mb-8">Découvrez nos produits et commencez vos achats !</p>
                  <Button onClick={() => navigate("/boutique")} size="lg" className="shadow-elegant">
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
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
              Panier ({items.length} {items.length > 1 ? 'articles' : 'article'})
            </h1>
          </div>
        </section>

        <section className="py-12">
          <div className="container px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              
              <div className="lg:col-span-2 space-y-4">
                {items.map((item, index) => (
                  <Card 
                    key={item.id} 
                    className="shadow-elegant animate-in fade-in slide-in-from-left hover:shadow-xl transition-all"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="p-6">
                      <div className="flex gap-6">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-32 h-32 object-cover rounded-lg transition-transform hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23f3f4f6' width='100' height='100'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='%23999' font-size='16'%3EImage%3C/text%3E%3C/svg%3E";
                          }}
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
                              onClick={() => handleRemoveItem(item.id, item.name)}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-3">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => {
                                  updateQuantity(item.id, item.quantity - 1);
                                  toast.success('Quantité mise à jour');
                                }}
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="text-lg font-semibold w-8 text-center">{item.quantity}</span>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => {
                                  updateQuantity(item.id, item.quantity + 1);
                                  toast.success('Quantité mise à jour');
                                }}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-primary">{item.price * item.quantity} DH</div>
                              <div className="text-sm text-muted-foreground">{item.price} DH × {item.quantity}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div>
                <Card className="shadow-elegant sticky top-24 animate-in fade-in slide-in-from-right">
                  <CardContent className="p-6 space-y-4">
                    <h2 className="text-2xl font-bold">Résumé</h2>
                    
                    <div className="space-y-3">
                      <div className="flex gap-2">
                      </div>
                    </div>

                    <div className="space-y-2 py-4 border-y">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Sous-total</span>
                        <span className="font-semibold">{subtotal} DH</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Réduction</span>
                          <span className="font-semibold">-{discount} DH</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Truck className="h-4 w-4" />
                          Livraison
                        </span>
                        <span className="font-semibold">{deliveryFee > 0 ? `${deliveryFee} DH` : 'À calculer'}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-xl font-bold">Total</span>
                      <span className="text-3xl font-bold text-primary">{finalTotal} DH</span>
                    </div>
                    <Button className="w-full shadow-elegant" size="lg" onClick={handleCheckout}>
                      Commander maintenant
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => navigate("/boutique")}>
                      Continuer mes achats
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      {showCheckout && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-auto shadow-2xl animate-in zoom-in slide-in-from-bottom">
            <div className="p-6 space-y-4">
              <h2 className="text-2xl font-bold">📋 Vos coordonnées</h2>
              
              <div>
                <label className="block mb-2 font-semibold text-sm">Nom complet *</label>
                <input 
                  type="text" 
                  value={customerName} 
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ex: Zakaria Mihrab" 
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold text-sm">Téléphone *</label>
                <input 
                  type="tel" 
                  value={customerPhone} 
                  onChange={(e) => {
                    setCustomerPhone(e.target.value);
                    if (phoneError) validatePhone(e.target.value);
                  }}
                  placeholder="06 12 34 56 78" 
                  className={`w-full px-4 py-3 border-2 rounded-lg transition-all ${
                    phoneError ? 'border-red-500' : 'border-gray-200 focus:border-primary'
                  } focus:ring-2 focus:ring-primary/20`}
                />
                {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
              </div>

              <div>
                <label className="block mb-2 font-semibold text-sm">Ville</label>
                <input 
                  type="text" 
                  value={customerCity} 
                  onChange={(e) => setCustomerCity(e.target.value)}
                  placeholder="Ex: Casablanca" 
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold text-sm">Adresse</label>
                <textarea 
                  value={customerAddress} 
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="Ex: 123 Rue Mohammed V" 
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="font-semibold mb-3">📦 Résumé</div>
                <div className="space-y-2 text-sm text-gray-600">
                  {items.map((item, i) => (
                    <div key={i}>• {item.name} × {item.quantity} = {item.price * item.quantity} DH</div>
                  ))}
                  <div className="pt-2 border-t font-semibold text-base text-green-600">
                    Total: {finalTotal} DH
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button 
                  onClick={() => setShowCheckout(false)} 
                  disabled={isSubmitting}
                  variant="outline"
                  className="flex-1"
                >
                  Annuler
                </Button>
                <Button 
                  onClick={handleSubmitOrder} 
                  disabled={!customerName || !customerPhone || isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? '⏳ Envoi...' : '✅ Confirmer'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Panier;

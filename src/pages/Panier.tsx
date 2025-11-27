import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/contexts/CartContext";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error("Votre panier est vide");
      return;
    }
    setShowCheckout(true);
  };

  const handleSubmitOrder = async () => {
    if (!customerName || !customerPhone) {
      toast.error("Nom et téléphone obligatoires");
      return;
    }

    setIsSubmitting(true);

    try {
      // Générer le numéro de commande
      const { count, error: countError } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });
      
      if (countError) throw countError;
      
      const orderNumber = `CMD-${String((count || 0) + 1).padStart(4, '0')}`;
      
      // Créer une commande pour chaque item du panier
      const orderPromises = items.map(async (item) => {
        // Récupérer les données de personnalisation si c'est un maillot personnalisé
        let personalizationData = null;
        if (item.customizable && item.id) {
          const savedData = localStorage.getItem(`personalization-${item.id}`);
          if (savedData) {
            personalizationData = JSON.parse(savedData);
          }
        }

        // Données de base pour tous les produits
        const orderData: any = {
          order_number: `${orderNumber}-${item.id}`,
          personalization_id: item.id || `cart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          customer_name: customerName,
          customer_phone: customerPhone,
          customer_address: customerAddress || '',
          customer_city: customerCity || '',
          jersey_color: item.category === 'Maillot' ? 'red' : 'white',
          total_price: item.price * item.quantity,
          status: 'pending',
          notes: `Panier - Quantité: ${item.quantity} - ${item.name}`,
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

        // Si c'est un maillot personnalisé, utilise les données de personnalisation
        if (personalizationData) {
          orderData.jersey_color = personalizationData.jerseyColor;
          orderData.name_enabled = personalizationData.name.enabled;
          orderData.name_text = personalizationData.name.text || '';
          orderData.name_font = personalizationData.name.font;
          orderData.name_color = personalizationData.name.color;
          orderData.name_position_x = personalizationData.name.position.x;
          orderData.name_position_y = personalizationData.name.position.y;
          orderData.number_enabled = personalizationData.number.enabled;
          orderData.number_text = personalizationData.number.text || '';
          orderData.number_font = personalizationData.number.font;
          orderData.number_color = personalizationData.number.color;
          orderData.number_position_x = personalizationData.number.position.x;
          orderData.number_position_y = personalizationData.number.position.y;
          orderData.slogan_enabled = personalizationData.slogan.enabled;
          orderData.slogan_text = personalizationData.slogan.text || '';
          orderData.slogan_font = personalizationData.slogan.font;
          orderData.slogan_color = personalizationData.slogan.color;
          orderData.slogan_size = personalizationData.slogan.size;
          orderData.slogan_position_x = personalizationData.slogan.position.x;
          orderData.slogan_position_y = personalizationData.slogan.position.y;
          orderData.selected_position = personalizationData.selectedPosition;
          orderData.preview_image_url = personalizationData.previewImage || '';
        }

        // Insérer dans Supabase
        const { error } = await supabase
          .from('orders')
          .insert([orderData]);

        if (error) throw error;
      });

      // Attendre que toutes les commandes soient créées
      await Promise.all(orderPromises);

      // Succès
      toast.success(`✅ Commande ${orderNumber} enregistrée avec succès !`, {
        duration: 5000
      });

      // Vider le panier
      clearCart();
      
      // Fermer le modal
      setShowCheckout(false);
      
      // Réinitialiser le formulaire
      setCustomerName('');
      setCustomerPhone('');
      setCustomerCity('');
      setCustomerAddress('');

      // Message de confirmation
      setTimeout(() => {
        toast.info("📦 Vous recevrez une confirmation par téléphone", {
          duration: 5000
        });
        navigate('/');
      }, 1000);

    } catch (error) {
      console.error('Erreur:', error);
      toast.error("❌ Erreur lors de l'enregistrement de la commande");
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
              <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
                Panier
              </h1>
            </div>
          </section>

          <section className="py-16">
            <div className="container px-4">
              <Card className="max-w-md mx-auto text-center shadow-elegant">
                <CardContent className="p-12">
                  <ShoppingBag className="h-24 w-24 mx-auto mb-6 text-muted-foreground opacity-50" />
                  <h2 className="text-2xl font-bold mb-4">Votre panier est vide</h2>
                  <p className="text-muted-foreground mb-8">
                    Découvrez nos produits et commencez vos achats !
                  </p>
                  <Button
                    onClick={() => navigate("/boutique")}
                    size="lg"
                    className="shadow-elegant"
                  >
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
              
              {/* Liste des produits */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <Card key={item.id} className="shadow-elegant">
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
                              className="text-destructive hover:text-destructive"
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
                              <div className="text-sm text-muted-foreground">
                                {item.price} DH × {item.quantity}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Résumé */}
              <div>
                <Card className="shadow-elegant sticky top-4">
                  <CardContent className="p-6 space-y-4">
                    <h2 className="text-2xl font-bold">Résumé</h2>
                    
                    <div className="space-y-2 py-4 border-y">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Sous-total</span>
                        <span className="font-semibold">{getTotalPrice()} DH</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Livraison</span>
                        <span className="font-semibold">Calculée à la validation</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-xl font-bold">Total</span>
                      <span className="text-3xl font-bold text-primary">
                        {getTotalPrice()} DH
                      </span>
                    </div>

                    <Button 
                      className="w-full shadow-elegant" 
                      size="lg"
                      onClick={handleCheckout}
                    >
                      Commander maintenant
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => navigate("/boutique")}
                    >
                      Continuer mes achats
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Modal Checkout */}
      {showCheckout && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '12px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
              📋 Vos coordonnées
            </h2>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                Nom complet *
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Ex: Zakaria Mihrab"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '16px'
                }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                Téléphone *
              </label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Ex: 06 12 34 56 78"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '16px'
                }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                Ville
              </label>
              <input
                type="text"
                value={customerCity}
                onChange={(e) => setCustomerCity(e.target.value)}
                placeholder="Ex: Casablanca"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '16px'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                Adresse
              </label>
              <textarea
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                placeholder="Ex: 123 Rue Mohammed V, Quartier Maarif"
                rows={3}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '16px',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ 
              padding: '15px',
              backgroundColor: '#f9fafb',
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              <div style={{ fontWeight: '600', marginBottom: '10px' }}>
                📦 Résumé de la commande
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                {items.map((item, index) => (
                  <div key={index} style={{ marginBottom: '5px' }}>
                    • {item.name} × {item.quantity} = {item.price * item.quantity} DH
                  </div>
                ))}
                <div style={{ 
                  marginTop: '10px', 
                  paddingTop: '10px', 
                  borderTop: '1px solid #e5e7eb',
                  fontWeight: '600',
                  fontSize: '16px',
                  color: '#059669'
                }}>
                  Total: {getTotalPrice()} DH
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setShowCheckout(false)}
                disabled={isSubmitting}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: '#e5e7eb',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting ? 0.5 : 1
                }}
              >
                Annuler
              </button>
              <button
                onClick={handleSubmitOrder}
                disabled={!customerName || !customerPhone || isSubmitting}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: !customerName || !customerPhone || isSubmitting ? '#9ca3af' : '#059669',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: !customerName || !customerPhone || isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: !customerName || !customerPhone || isSubmitting ? 0.6 : 1
                }}
              >
                {isSubmitting ? '⏳ Envoi...' : '✅ Confirmer la commande'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Panier;
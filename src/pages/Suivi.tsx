import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Package, Search, CheckCircle, Clock, Truck, XCircle, AlertCircle, Loader2, MapPin, Phone, User, Shirt } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface OrderItem {
  product_id?: string | null;
  product_name?: string;
  product_category?: string;
  product_size?: string;
  quantity?: number;
  unit_price?: number;
  total_price?: number;
  product_image_url?: string;
  preview_image_url?: string;
  personalization?: any | null;
}

interface Order {
  id: string;
  order_number: string;
  created_at: string;
  status: string;
  customer_name: string;
  customer_phone: string;
  customer_city: string;
  customer_address: string;
  // legacy single-product fields (may be null for aggregated orders)
  product_name?: string;
  product_size?: string;
  total_price: number;
  name_text?: string;
  number_text?: string;
  slogan_text?: string;
  notes?: string;
  // new aggregated items
  order_items?: OrderItem[];
  preview_image_url?: string;
}

const Suivi = () => {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const getStatusInfo = (status: string) => {
    const statusMap: { [key: string]: { label: string; color: string; bgColor: string; icon: any } } = {
      pending: { 
        label: "En attente de confirmation", 
        color: "text-yellow-700",
        bgColor: "bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-300",
        icon: Clock
      },
      processing: { 
        label: "En préparation", 
        color: "text-blue-700",
        bgColor: "bg-gradient-to-r from-blue-50 to-blue-100 border-blue-300",
        icon: Package
      },
      shipped: { 
        label: "En cours de livraison", 
        color: "text-purple-700",
        bgColor: "bg-gradient-to-r from-purple-50 to-purple-100 border-purple-300",
        icon: Truck
      },
      delivered: { 
        label: "Livrée", 
        color: "text-green-700",
        bgColor: "bg-gradient-to-r from-green-50 to-green-100 border-green-300",
        icon: CheckCircle
      },
      cancelled: { 
        label: "Annulée", 
        color: "text-red-700",
        bgColor: "bg-gradient-to-r from-red-50 to-red-100 border-red-300",
        icon: XCircle
      },
    };
    return statusMap[status] || statusMap.pending;
  };

  // Fallback: build order_items array from legacy single-product columns when needed
  const normalizeOrderItems = (o: any): OrderItem[] => {
    if (!o) return [];
    if (Array.isArray(o.order_items) && o.order_items.length > 0) return o.order_items;
    // build fallback
    const legacy: OrderItem = {
      product_id: o.product_id ?? null,
      product_name: o.product_name ?? "Produit",
      product_category: o.product_category ?? "",
      product_size: o.product_size ?? "",
      quantity: o.quantity ?? 1,
      unit_price: o.product_price ?? (o.total_price ?? 0),
      total_price: o.total_price ?? (o.product_price ?? 0),
      product_image_url: o.product_image_url ?? "",
      preview_image_url: o.preview_image_url ?? "",
      personalization: o.personalization ?? null
    };
    return [legacy];
  };

  const computeItemsSubtotal = (items: OrderItem[] = []) =>
    items.reduce((s, it) => s + ((it.total_price ?? (it.unit_price ?? 0) * (it.quantity ?? 1)) || 0), 0);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!trackingNumber.trim()) {
      toast.error("Veuillez entrer un numéro de commande");
      return;
    }

    setIsLoading(true);
    setNotFound(false);
    setOrder(null);

    try {
      // Request order_items explicitly (new aggregated format)
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items')
        .eq('order_number', trackingNumber.trim())
        .single();

      if (error || !data) {
        setNotFound(true);
        toast.error("Commande introuvable", {
          description: "Vérifiez votre numéro de commande",
          icon: <AlertCircle className="h-4 w-4" />
        });
        return;
      }

      // Ensure order_items present for display (fallback to legacy)
      const items = normalizeOrderItems(data);
      const normalizedOrder: Order = {
        ...data,
        order_items: items,
      };

      setOrder(normalizedOrder);
      toast.success("Commande trouvée !", {
        icon: <CheckCircle className="h-4 w-4" />
      });

    } catch (error) {
      console.error('Erreur:', error);
      toast.error("Erreur lors de la recherche");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimelineSteps = (status: string, createdAt: string) => {
    const baseDate = new Date(createdAt);
    
    const steps = [
      {
        title: "Commande passée",
        date: formatDate(createdAt),
        completed: true,
        icon: CheckCircle,
        color: "bg-primary"
      },
      {
        title: "Confirmation",
        date: status !== 'pending' ? formatDate(new Date(baseDate.getTime() + 3600000).toISOString()) : "En attente",
        completed: ['processing', 'shipped', 'delivered'].includes(status),
        icon: CheckCircle,
        color: ['processing', 'shipped', 'delivered'].includes(status) ? "bg-primary" : "bg-gray-300"
      },
      {
        title: "En préparation",
        date: status === 'processing' || status === 'shipped' || status === 'delivered' 
          ? formatDate(new Date(baseDate.getTime() + 7200000).toISOString()) 
          : "En attente",
        completed: ['shipped', 'delivered'].includes(status),
        icon: Package,
        color: ['shipped', 'delivered'].includes(status) ? "bg-primary" : status === 'processing' ? "bg-blue-500" : "bg-gray-300"
      },
      {
        title: "Expédiée",
        date: status === 'shipped' || status === 'delivered'
          ? formatDate(new Date(baseDate.getTime() + 86400000).toISOString())
          : "En attente",
        completed: status === 'delivered',
        icon: Truck,
        color: status === 'delivered' ? "bg-primary" : status === 'shipped' ? "bg-purple-500" : "bg-gray-300",
        estimatedDelivery: status === 'shipped' 
          ? new Date(baseDate.getTime() + 172800000).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
          : null
      },
      {
        title: "Livrée",
        date: status === 'delivered' 
          ? formatDate(new Date(baseDate.getTime() + 172800000).toISOString())
          : "En attente",
        completed: status === 'delivered',
        icon: CheckCircle,
        color: status === 'delivered' ? "bg-green-500" : "bg-gray-300"
      }
    ];

    if (status === 'cancelled') {
      return [
        steps[0],
        {
          title: "Commande annulée",
          date: formatDate(new Date().toISOString()),
          completed: true,
          icon: XCircle,
          color: "bg-red-500"
        }
      ];
    }

    return steps;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      <main className="flex-1">
        {/* Page Header */}
        <section className="relative bg-gradient-to-r from-[#C8102E] via-[#C8102E] to-[#006233] py-12 md:py-16 lg:py-20 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/10" />
          <div className="container px-4 md:px-6 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-sm rounded-full mb-4 md:mb-6">
                <Package className="h-8 w-8 md:h-10 md:w-10" />
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4">
                Suivi de commande
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-white/90">
                Suivez votre commande en temps réel avec votre numéro de suivi
              </p>
            </div>
          </div>
        </section>

        {/* Tracking Form */}
        <section className="py-8 md:py-12 lg:py-16">
          <div className="container px-4 md:px-6">
            <Card className="max-w-2xl mx-auto shadow-2xl border-2 border-gray-200 rounded-2xl overflow-hidden">
              <CardContent className="p-6 md:p-8 lg:p-10 bg-gradient-to-br from-white to-gray-50">
                <div className="text-center mb-6 md:mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    Entrez votre numéro de commande
                  </h2>
                  <p className="text-sm md:text-base text-gray-600">
                    Vous l'avez reçu par téléphone après votre commande
                  </p>
                </div>
                
                <form onSubmit={handleTrack} className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="tracking" className="text-base md:text-lg font-semibold text-gray-700">
                      Numéro de commande
                    </Label>
                    <div className="relative">
                      <Input
                        id="tracking"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        placeholder="CMD-1234567890123-456"
                        className="text-base md:text-lg h-12 md:h-14 pl-12 pr-4 border-2 border-gray-300 focus:border-primary rounded-xl shadow-sm"
                        disabled={isLoading}
                      />
                      <Package className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                    <p className="text-xs md:text-sm text-gray-500 flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      Format : CMD-XXXXXXXXXXX-XXX
                    </p>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 md:h-14 text-base md:text-lg font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 rounded-xl" 
                    size="lg" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 md:h-6 md:w-6 animate-spin" />
                        Recherche en cours...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-5 w-5 md:h-6 md:w-6" />
                        Suivre ma commande
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Not Found Message */}
            {notFound && !order && (
              <Card className="max-w-2xl mx-auto mt-6 md:mt-8 border-2 border-red-300 bg-gradient-to-br from-red-50 to-red-100 rounded-2xl shadow-xl animate-in fade-in-50 slide-in-from-top-4 duration-300">
                <CardContent className="p-6 md:p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-red-200 rounded-full mb-4">
                    <AlertCircle className="h-8 w-8 md:h-10 md:w-10 text-red-600" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-red-800 mb-2">
                    Commande introuvable
                  </h3>
                  <p className="text-sm md:text-base text-red-600 mb-4">
                    Aucune commande ne correspond à ce numéro. Veuillez vérifier et réessayer.
                  </p>
                  <div className="bg-white/50 rounded-lg p-3 md:p-4 inline-block">
                    <p className="text-xs md:text-sm text-red-700 font-mono">
                      Format attendu : CMD-1234567890123-456
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Order Results */}
            {order && (
              <div className="max-w-4xl mx-auto mt-6 md:mt-8 lg:mt-12 space-y-6 md:space-y-8 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
                {/* Order Status Card */}
                <Card className="shadow-2xl border-2 border-gray-200 rounded-2xl overflow-hidden">
                  <div className={`${getStatusInfo(order.status).bgColor} border-b-2 p-4 md:p-6`}>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">
                          Commande #{order.order_number}
                        </h3>
                        <p className="text-sm md:text-base text-gray-600 mt-1">
                          Passée le {formatDate(order.created_at)}
                        </p>
                      </div>
                      <div>
                        <span className={`inline-flex items-center px-4 md:px-6 py-2 md:py-3 rounded-full text-sm md:text-base font-bold border-2 ${getStatusInfo(order.status).bgColor} ${getStatusInfo(order.status).color} shadow-lg`}>
                          {(() => {
                            const StatusIcon = getStatusInfo(order.status).icon;
                            return <StatusIcon className="h-4 w-4 md:h-5 md:w-5 mr-2" />;
                          })()}
                          {getStatusInfo(order.status).label}
                        </span>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6 md:p-8 bg-white">
                    <h4 className="text-lg md:text-xl font-bold text-gray-900 mb-6">
                      Progression de votre commande
                    </h4>
                    
                    {/* Timeline */}
                    <div className="space-y-6 md:space-y-8">
                      {getTimelineSteps(order.status, order.created_at).map((step, index) => {
                        const StepIcon = step.icon;
                        const isLast = index === getTimelineSteps(order.status, order.created_at).length - 1;
                        return (
                          <div key={index} className="relative">
                            <div className={`flex items-start gap-4 ${!step.completed && order.status !== 'cancelled' ? 'opacity-40' : ''}`}>
                              <div className={`relative z-10 w-12 h-12 md:w-14 md:h-14 ${step.color} rounded-full flex items-center justify-center flex-shrink-0 shadow-lg transform ${step.completed ? 'scale-100' : 'scale-90'} transition-transform duration-300`}>
                                <StepIcon className="h-6 w-6 md:h-7 md:w-7 text-white" />
                              </div>
                              <div className="flex-1 pt-2">
                                <h5 className="text-base md:text-lg font-bold text-gray-900">{step.title}</h5>
                                <p className="text-sm md:text-base text-gray-600 mt-1">{step.date}</p>
                                {step.estimatedDelivery && (
                                  <div className="mt-2 inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-sm md:text-base font-semibold">
                                    <Truck className="h-4 w-4" />
                                    Livraison estimée: {step.estimatedDelivery}
                                  </div>
                                )}
                              </div>
                            </div>
                            {!isLast && (
                              <div className={`absolute left-6 md:left-7 top-14 md:top-16 w-0.5 h-12 ${step.completed ? 'bg-primary' : 'bg-gray-300'}`} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Order Details */}
                <Card className="shadow-2xl border-2 border-gray-200 rounded-2xl overflow-hidden">
                  <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 md:p-6">
                    <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-white flex items-center gap-2">
                      <Shirt className="h-5 w-5 md:h-6 md:w-6" />
                      Détails de la commande
                    </h3>
                  </div>
                  
                  <CardContent className="p-6 md:p-8 bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <div className="space-y-4">
                        <div className="flex items-start gap-3 p-3 md:p-4 bg-gray-50 rounded-xl">
                          <User className="h-5 w-5 text-gray-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-xs md:text-sm text-gray-500 mb-1">Client</p>
                            <p className="text-sm md:text-base font-semibold text-gray-900">{order.customer_name}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3 p-3 md:p-4 bg-gray-50 rounded-xl">
                          <Phone className="h-5 w-5 text-gray-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-xs md:text-sm text-gray-500 mb-1">Téléphone</p>
                            <p className="text-sm md:text-base font-semibold text-gray-900">{order.customer_phone}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3 p-3 md:p-4 bg-gray-50 rounded-xl">
                          <MapPin className="h-5 w-5 text-gray-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-xs md:text-sm text-gray-500 mb-1">Ville</p>
                            <p className="text-sm md:text-base font-semibold text-gray-900">{order.customer_city || 'Non spécifiée'}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {/* If aggregated order_items exist, list them. Otherwise show legacy single product */}
                        {order.order_items && order.order_items.length > 0 ? (
                          <div className="space-y-3">
                            <div className="text-xs md:text-sm text-gray-600 mb-2">Produits</div>
                            {order.order_items.map((it, idx) => (
                              <div key={idx} className="p-3 md:p-4 bg-gray-50 rounded-xl border">
                                <div className="flex items-center gap-3">
                                  {it.preview_image_url || it.product_image_url ? (
                                    <img src={it.preview_image_url || it.product_image_url} alt={it.product_name} className="w-16 h-16 object-cover rounded" />
                                  ) : (
                                    <div className="w-16 h-16 bg-gray-100 rounded" />
                                  )}
                                  <div className="flex-1">
                                    <div className="font-semibold text-gray-900">{it.product_name}</div>
                                    <div className="text-sm text-gray-600">{it.product_category} {it.product_size ? `• Taille: ${it.product_size}` : ''}</div>
                                    <div className="text-sm mt-1">Qté: <strong>{it.quantity ?? 1}</strong> — PU: <strong>{it.unit_price ?? 0} DH</strong></div>
                                  </div>
                                  <div className="font-bold text-gray-900">{(it.total_price ?? (it.unit_price ?? 0) * (it.quantity ?? 1))} DH</div>
                                </div>
                              </div>
                            ))}
                            <div className="mt-2 p-3 bg-white/50 rounded">
                              <div className="flex justify-between font-semibold">
                                <div>Sous-total produits</div>
                                <div>{computeItemsSubtotal(order.order_items).toFixed(2)} DH</div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="p-3 md:p-4 bg-primary/5 rounded-xl border-2 border-primary/20">
                            <p className="text-xs md:text-sm text-gray-600 mb-2">Produit</p>
                            <p className="text-sm md:text-base font-bold text-gray-900">{order.product_name}</p>
                            {order.product_size && <p className="text-xs md:text-sm text-gray-600 mt-1">Taille: <span className="font-semibold">{order.product_size}</span></p>}
                          </div>
                        )}

                        {(order.name_text || order.number_text || order.slogan_text) && (
                          <div className="p-3 md:p-4 bg-green-50 rounded-xl border-2 border-green-200">
                            <p className="text-xs md:text-sm text-green-700 font-semibold mb-2">Personnalisation</p>
                            {order.name_text && (
                              <p className="text-xs md:text-sm text-gray-700">Nom: <span className="font-semibold">{order.name_text}</span></p>
                            )}
                            {order.number_text && (
                              <p className="text-xs md:text-sm text-gray-700">Numéro: <span className="font-semibold">{order.number_text}</span></p>
                            )}
                            {order.slogan_text && (
                              <p className="text-xs md:text-sm text-gray-700">Slogan: <span className="font-semibold">{order.slogan_text}</span></p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {order.customer_address && (
                      <div className="mt-4 p-3 md:p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
                        <p className="text-xs md:text-sm text-blue-700 font-semibold mb-1">Adresse de livraison</p>
                        <p className="text-sm md:text-base text-gray-900">{order.customer_address}</p>
                      </div>
                    )}

                    <div className="mt-6 pt-6 border-t-2 border-gray-200">
                      <div className="flex items-center justify-between p-4 md:p-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl">
                        <span className="text-lg md:text-xl font-bold text-gray-900">Total</span>
                        <span className="text-2xl md:text-3xl font-bold text-primary">{order.total_price} DH</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Support */}
                <Card className="shadow-2xl border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl overflow-hidden">
                  <CardContent className="p-6 md:p-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-200 rounded-full mb-4">
                      <AlertCircle className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-blue-900 mb-2">
                      Besoin d'aide ?
                    </h3>
                    <p className="text-sm md:text-base text-blue-700 mb-6 max-w-md mx-auto">
                      Notre service client est à votre disposition pour toute question sur votre commande
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                      <Button 
                        variant="outline" 
                        size="lg"
                        className="h-12 md:h-14 px-6 md:px-8 text-base md:text-lg font-bold bg-white hover:bg-blue-50 border-2 border-blue-300 text-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                        asChild
                      >
                        <a href={`https://wa.me/212770257750`} target="_blank" rel="noopener noreferrer">
                          <Phone className="mr-2 h-5 w-5" />
                          WhatsApp
                        </a>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="lg"
                        className="h-12 md:h-14 px-6 md:px-8 text-base md:text-lg font-bold bg-white hover:bg-blue-50 border-2 border-blue-300 text-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                        asChild
                      >
                        <a href="mailto:contact@atlasllions.com">
                          <AlertCircle className="mr-2 h-5 w-5" />
                          Email
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Suivi;
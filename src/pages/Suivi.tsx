import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Package, Search, CheckCircle, Clock, Truck, XCircle, AlertCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface Order {
  id: string;
  order_number: string;
  created_at: string;
  status: string;
  customer_name: string;
  customer_phone: string;
  customer_city: string;
  customer_address: string;
  product_name: string;
  product_size: string;
  total_price: number;
  name_text: string;
  number_text: string;
  slogan_text: string;
  notes: string;
}

const Suivi = () => {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const getStatusInfo = (status: string) => {
    const statusMap: { [key: string]: { label: string; color: string; icon: any } } = {
      pending: { 
        label: "En attente de confirmation", 
        color: "bg-yellow-100 text-yellow-800 border-yellow-300",
        icon: Clock
      },
      processing: { 
        label: "En préparation", 
        color: "bg-blue-100 text-blue-800 border-blue-300",
        icon: Package
      },
      shipped: { 
        label: "En cours de livraison", 
        color: "bg-purple-100 text-purple-800 border-purple-300",
        icon: Truck
      },
      delivered: { 
        label: "Livrée", 
        color: "bg-green-100 text-green-800 border-green-300",
        icon: CheckCircle
      },
      cancelled: { 
        label: "Annulée", 
        color: "bg-red-100 text-red-800 border-red-300",
        icon: XCircle
      },
    };
    return statusMap[status] || statusMap.pending;
  };

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
      const { data, error } = await supabase
        .from('orders')
        .select('*')
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

      setOrder(data);
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
        color: ['processing', 'shipped', 'delivered'].includes(status) ? "bg-primary" : "bg-muted"
      },
      {
        title: "En préparation",
        date: status === 'processing' || status === 'shipped' || status === 'delivered' 
          ? formatDate(new Date(baseDate.getTime() + 7200000).toISOString()) 
          : "En attente",
        completed: ['shipped', 'delivered'].includes(status),
        icon: Package,
        color: ['shipped', 'delivered'].includes(status) ? "bg-primary" : status === 'processing' ? "bg-secondary" : "bg-muted"
      },
      {
        title: "Expédiée",
        date: status === 'shipped' || status === 'delivered'
          ? formatDate(new Date(baseDate.getTime() + 86400000).toISOString())
          : "En attente",
        completed: status === 'delivered',
        icon: Truck,
        color: status === 'delivered' ? "bg-primary" : status === 'shipped' ? "bg-secondary" : "bg-muted",
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
        color: status === 'delivered' ? "bg-green-500" : "bg-muted"
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
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Page Header */}
        <section className="gradient-primary py-16 text-white">
          <div className="container px-4">
            <div className="flex items-center justify-center mb-4">
              <Package className="h-8 w-8 mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold">Suivi de commande</h1>
            </div>
            <p className="text-xl text-white/90 text-center">
              Suivez votre commande en temps réel avec votre numéro de suivi
            </p>
          </div>
        </section>

        {/* Tracking Form */}
        <section className="py-12">
          <div className="container px-4">
            <Card className="max-w-2xl mx-auto shadow-elegant">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6 text-center">
                  Entrez votre numéro de commande
                </h2>
                
                <form onSubmit={handleTrack} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="tracking">Numéro de commande</Label>
                    <Input
                      id="tracking"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="CMD-1234567890123-456"
                      className="text-lg"
                      disabled={isLoading}
                    />
                    <p className="text-sm text-muted-foreground">
                      Le numéro de commande vous a été envoyé par téléphone après votre commande
                    </p>
                  </div>

                  <Button type="submit" className="w-full shadow-elegant" size="lg" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Recherche en cours...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-5 w-5" />
                        Suivre ma commande
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Not Found Message */}
            {notFound && !order && (
              <Card className="max-w-2xl mx-auto mt-8 border-red-200 bg-red-50">
                <CardContent className="p-6 text-center">
                  <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-red-800 mb-2">Commande introuvable</h3>
                  <p className="text-red-600 mb-4">
                    Aucune commande ne correspond à ce numéro. Veuillez vérifier et réessayer.
                  </p>
                  <p className="text-sm text-red-500">
                    Format attendu : CMD-1234567890123-456
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Order Results */}
            {order && (
              <div className="max-w-2xl mx-auto mt-8 space-y-6">
                {/* Order Status Card */}
                <Card className="shadow-elegant">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                      <div>
                        <h3 className="text-xl font-bold">Commande #{order.order_number}</h3>
                        <p className="text-muted-foreground">
                          Passée le {formatDate(order.created_at)}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border-2 ${getStatusInfo(order.status).color}`}>
                          {(() => {
                            const StatusIcon = getStatusInfo(order.status).icon;
                            return <StatusIcon className="h-4 w-4 mr-2" />;
                          })()}
                          {getStatusInfo(order.status).label}
                        </span>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="space-y-4">
                      {getTimelineSteps(order.status, order.created_at).map((step, index) => {
                        const StepIcon = step.icon;
                        return (
                          <div key={index} className={`flex items-start ${!step.completed && order.status !== 'cancelled' ? 'opacity-50' : ''}`}>
                            <div className={`w-10 h-10 ${step.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                              <StepIcon className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-4 flex-1">
                              <h4 className="font-semibold">{step.title}</h4>
                              <p className="text-sm text-muted-foreground">{step.date}</p>
                              {step.estimatedDelivery && (
                                <p className="text-sm text-primary font-semibold mt-1">
                                  Livraison estimée: {step.estimatedDelivery}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Order Details */}
                <Card className="shadow-elegant">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">Détails de la commande</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Client:</span>
                        <span className="font-semibold">{order.customer_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Téléphone:</span>
                        <span className="font-semibold">{order.customer_phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Produit:</span>
                        <span className="font-semibold">{order.product_name}</span>
                      </div>
                      {order.product_size && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Taille:</span>
                          <span className="font-semibold">{order.product_size}</span>
                        </div>
                      )}
                      {order.name_text && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Nom personnalisé:</span>
                          <span className="font-semibold">{order.name_text}</span>
                        </div>
                      )}
                      {order.number_text && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Numéro:</span>
                          <span className="font-semibold">{order.number_text}</span>
                        </div>
                      )}
                      {order.slogan_text && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Slogan:</span>
                          <span className="font-semibold">{order.slogan_text}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Ville:</span>
                        <span className="font-semibold">{order.customer_city || 'Non spécifiée'}</span>
                      </div>
                      {order.customer_address && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Adresse:</span>
                          <span className="font-semibold text-right max-w-[60%]">{order.customer_address}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-lg pt-3 border-t border-border">
                        <span className="font-bold">Total:</span>
                        <span className="font-bold text-primary">{order.total_price} DH</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Support */}
                <Card className="shadow-elegant border-blue-200 bg-blue-50">
                  <CardContent className="p-6 text-center">
                    <h3 className="text-lg font-bold text-blue-800 mb-2">Besoin d'aide ?</h3>
                    <p className="text-blue-600 mb-4">
                      Contactez notre service client pour toute question sur votre commande
                    </p>
                    <div className="flex gap-4 justify-center">
                      <Button variant="outline" asChild>
                        <a href={`https://wa.me/212770-257750`} target="_blank" rel="noopener noreferrer">
                          WhatsApp
                        </a>
                      </Button>
                      <Button variant="outline" asChild>
                        <a href="mailto:contact@atlasllions.com">
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

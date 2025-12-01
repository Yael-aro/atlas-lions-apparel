import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Package, Clock, CheckCircle, XCircle, RefreshCw, LogOut, Loader2, TrendingUp, DollarSign } from "lucide-react";

interface Order {
  id: string;
  created_at: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_city: string;
  customer_address: string;
  product_name: string;
  product_price: number;
  product_category: string;
  product_size?: string;
  product_image_url?: string;
  total_price: number;
  status: string;
  notes?: string;
  jersey_color?: string;
  name_text?: string;
  number_text?: string;
  slogan_text?: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      
      if (!session) {
        toast.error("⛔ Accès non autorisé - Connexion requise");
        navigate("/login");
        return;
      }
      
      setUser(session.user);
      fetchOrders();
    } catch (error) {
      console.error("Erreur auth:", error);
      toast.error("Erreur d'authentification");
      navigate("/login");
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("👋 Déconnexion réussie");
      navigate("/login");
    } catch (error) {
      console.error("Erreur logout:", error);
      toast.error("Erreur lors de la déconnexion");
    }
  };

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur Supabase:', error);
        throw error;
      }

      setOrders(data || []);
      toast.success(`✅ ${data?.length || 0} commandes chargées`);
    } catch (error: any) {
      console.error('Erreur complète:', error);
      toast.error("❌ Erreur de chargement: " + (error.message || "Vérifiez Supabase"));
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingOrderId(orderId);
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));

      toast.success(`✅ Statut mis à jour : ${getStatusLabel(newStatus)}`);
    } catch (error: any) {
      console.error('Erreur:', error);
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'pending': 'En attente',
      'confirmed': 'Confirmée',
      'shipped': 'Expédiée',
      'delivered': 'Livrée',
      'cancelled': 'Annulée'
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'pending': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'confirmed': 'bg-blue-100 text-blue-800 border-blue-300',
      'shipped': 'bg-purple-100 text-purple-800 border-purple-300',
      'delivered': 'bg-green-100 text-green-800 border-green-300',
      'cancelled': 'bg-red-100 text-red-800 border-red-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-5 w-5" />;
      case 'confirmed': return <Package className="h-5 w-5" />;
      case 'shipped': return <TrendingUp className="h-5 w-5" />;
      case 'delivered': return <CheckCircle className="h-5 w-5" />;
      case 'cancelled': return <XCircle className="h-5 w-5" />;
      default: return <Package className="h-5 w-5" />;
    }
  };

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    revenue: orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + (o.total_price || 0), 0)
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container px-4 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Dashboard Admin</h1>
              <p className="text-muted-foreground">
                Connecté : <span className="font-semibold text-primary">{user?.email || 'Admin'}</span>
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={fetchOrders}
                variant="outline"
                className="gap-2"
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Actualiser
              </Button>
              <Button 
                onClick={handleLogout}
                variant="outline"
                className="gap-2 border-red-200 text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                Déconnexion
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <Card className="shadow-lg border-l-4 border-l-primary">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-semibold">Total Commandes</p>
                    <p className="text-3xl font-bold text-primary mt-2">{stats.total}</p>
                  </div>
                  <Package className="h-10 w-10 text-primary/30" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-l-4 border-l-yellow-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-semibold">En attente</p>
                    <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.pending}</p>
                  </div>
                  <Clock className="h-10 w-10 text-yellow-500/30" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-semibold">Confirmées</p>
                    <p className="text-3xl font-bold text-blue-600 mt-2">{stats.confirmed}</p>
                  </div>
                  <CheckCircle className="h-10 w-10 text-blue-500/30" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-l-4 border-l-green-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-semibold">Livrées</p>
                    <p className="text-3xl font-bold text-green-600 mt-2">{stats.delivered}</p>
                  </div>
                  <TrendingUp className="h-10 w-10 text-green-500/30" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-l-4 border-l-purple-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-semibold">Revenu Total</p>
                    <p className="text-2xl font-bold text-purple-600 mt-2">{stats.revenue.toFixed(2)} DH</p>
                  </div>
                  <DollarSign className="h-10 w-10 text-purple-500/30" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-lg">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-6">Commandes récentes</h2>
              
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-lg text-muted-foreground">Aucune commande pour le moment</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <Card key={order.id} className="border-2 hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                          <div className="lg:col-span-5 space-y-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-bold text-lg text-primary">{order.order_number}</h3>
                                <p className="text-sm text-muted-foreground">{formatDate(order.created_at)}</p>
                              </div>
                              <div className={`px-3 py-1 rounded-full border-2 flex items-center gap-2 ${getStatusColor(order.status)}`}>
                                {getStatusIcon(order.status)}
                                <span className="font-semibold text-sm">{getStatusLabel(order.status)}</span>
                              </div>
                            </div>
                            
                            <div className="space-y-2 pt-2 border-t">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-muted-foreground">Client:</span>
                                <span className="text-sm font-bold">{order.customer_name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-muted-foreground">Téléphone:</span>
                                <a href={`tel:${order.customer_phone}`} className="text-sm text-primary hover:underline font-semibold">
                                  {order.customer_phone}
                                </a>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-muted-foreground">Ville:</span>
                                <span className="text-sm">{order.customer_city || 'Non spécifiée'}</span>
                              </div>
                              {order.customer_address && (
                                <div className="flex items-start gap-2">
                                  <span className="text-sm font-semibold text-muted-foreground">Adresse:</span>
                                  <span className="text-sm">{order.customer_address}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="lg:col-span-4 space-y-3 border-l-0 lg:border-l-2 lg:pl-6">
                            {order.product_image_url && (
                              <img 
                                src={order.product_image_url} 
                                alt={order.product_name}
                                className="w-24 h-24 object-cover rounded-lg mb-2"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            )}
                            
                            <h4 className="font-bold text-lg">{order.product_name}</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Catégorie:</span>
                                <span className="text-sm font-semibold">{order.product_category}</span>
                              </div>
                              {order.product_size && (
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Taille:</span>
                                  <span className="text-sm font-semibold">{order.product_size}</span>
                                </div>
                              )}
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Prix unitaire:</span>
                                <span className="text-sm font-semibold">{order.product_price} DH</span>
                              </div>
                              <div className="flex justify-between pt-2 border-t">
                                <span className="text-base font-bold text-muted-foreground">Total:</span>
                                <span className="text-xl font-bold text-primary">{order.total_price} DH</span>
                              </div>
                            </div>
                            
                            {(order.name_text || order.number_text || order.slogan_text) && (
                              <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <p className="text-xs font-bold text-blue-800 mb-2">✨ PERSONNALISÉ</p>
                                {order.name_text && (
                                  <p className="text-xs text-blue-700">Nom: <span className="font-bold">{order.name_text}</span></p>
                                )}
                                {order.number_text && (
                                  <p className="text-xs text-blue-700">Numéro: <span className="font-bold">{order.number_text}</span></p>
                                )}
                                {order.slogan_text && (
                                  <p className="text-xs text-blue-700">Slogan: <span className="font-bold">{order.slogan_text}</span></p>
                                )}
                              </div>
                            )}

                            {order.notes && (
                              <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-muted-foreground">
                                📝 {order.notes}
                              </div>
                            )}
                          </div>

                          <div className="lg:col-span-3 flex flex-col gap-2">
                            <p className="text-sm font-semibold text-muted-foreground mb-2">Changer le statut :</p>
                            {['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((status) => (
                              <Button
                                key={status}
                                onClick={() => updateOrderStatus(order.id, status)}
                                disabled={updatingOrderId === order.id || order.status === status}
                                variant={order.status === status ? "default" : "outline"}
                                size="sm"
                                className={`justify-start gap-2 ${
                                  order.status === status ? 'opacity-100' : 'opacity-70'
                                }`}
                              >
                                {updatingOrderId === order.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  getStatusIcon(status)
                                )}
                                {getStatusLabel(status)}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;

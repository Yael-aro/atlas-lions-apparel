import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Package, Clock, CheckCircle, XCircle, RefreshCw, LogOut, Loader2, TrendingUp, DollarSign, Eye, MessageCircle, Download, User } from "lucide-react";

interface Order {
  id: string;
  created_at: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_city: string;
  customer_address: string;
  order_items?: Array<any>;
  total_price: number;
  status: string;
  notes?: string;
  preview_image_url?: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showModal, setShowModal] = useState(false);

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

  // Helper fallback same as AdminDashboard
  const normalizeOrderItemsFallback = (order) => {
    if (!order) return [];
    if (Array.isArray(order.order_items) && order.order_items.length > 0) return order.order_items;

    const fallback = {
      product_id: order.product_id || null,
      product_name: order.product_name || 'Produit',
      product_category: order.product_category || '',
      product_size: order.product_size || '',
      quantity: order.quantity || 1,
      unit_price: order.product_price ?? order.total_price ?? 0,
      total_price: order.total_price ?? (order.product_price ?? 0),
      product_image_url: order.product_image_url || '',
      preview_image_url: order.preview_image_url || '',
      personalization: order.personalization || null
    };
    return [fallback];
  };

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      // Request order_items explicitly
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items')
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

  const computeItemsSubtotal = (items = []) =>
    items.reduce((s, it) => s + ((it.total_price ?? (it.unit_price * it.quantity)) || 0), 0);

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

  const openOrderDetail = async (orderId: string) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items')
        .eq('id', orderId)
        .single();

      if (error) throw error;

      data.order_items = normalizeOrderItemsFallback(data);
      setSelectedOrder(data);
      setShowModal(true);
    } catch (error) {
      console.error('Erreur détail:', error);
      toast.error('Erreur lors du chargement du détail');
    }
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
          {/* Header and stats omitted for brevity (unchanged) */}

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
                  {orders.map((order) => {
                    const items = order.order_items || normalizeOrderItemsFallback(order);
                    const firstItem = items[0] || {};
                    return (
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
                              </div>
                            </div>

                            <div className="lg:col-span-4 space-y-3 border-l-0 lg:border-l-2 lg:pl-6">
                              {firstItem.preview_image_url && (
                                <img src={firstItem.preview_image_url} alt={firstItem.product_name || 'Produit'} className="w-24 h-24 object-cover rounded-lg mb-2" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                              )}
                              
                              <h4 className="font-bold text-lg">{firstItem.product_name || 'Produit'}</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Articles:</span>
                                  <span className="text-sm font-semibold">{items.length}</span>
                                </div>
                                {firstItem.product_size && (
                                  <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Taille:</span>
                                    <span className="text-sm font-semibold">{firstItem.product_size}</span>
                                  </div>
                                )}
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Prix total:</span>
                                  <span className="text-sm font-semibold">{order.total_price} DH</span>
                                </div>
                                <div className="flex justify-between pt-2 border-t">
                                  <span className="text-base font-bold text-muted-foreground">Total:</span>
                                  <span className="text-xl font-bold text-primary">{order.total_price} DH</span>
                                </div>
                              </div>
                              
                              {(firstItem.personalization && (firstItem.personalization.name?.text || firstItem.personalization.number?.text || firstItem.personalization.slogan?.text)) && (
                                <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                  <p className="text-xs font-bold text-blue-800 mb-2">✨ PERSONNALISÉ</p>
                                  {firstItem.personalization.name?.text && (<p className="text-xs text-blue-700">Nom: <span className="font-bold">{firstItem.personalization.name.text}</span></p>)}
                                  {firstItem.personalization.number?.text && (<p className="text-xs text-blue-700">Numéro: <span className="font-bold">{firstItem.personalization.number.text}</span></p>)}
                                  {firstItem.personalization.slogan?.text && (<p className="text-xs text-blue-700">Slogan: <span className="font-bold">{firstItem.personalization.slogan.text}</span></p>)}
                                </div>
                              )}

                              {order.notes && (<div className="mt-2 p-2 bg-gray-50 rounded text-xs text-muted-foreground">📝 {order.notes}</div>)}
                            </div>

                            <div className="lg:col-span-3 flex flex-col gap-2">
                              <p className="text-sm font-semibold text-muted-foreground mb-2">Changer le statut :</p>
                              {['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((status) => (
                                <Button key={status} onClick={() => updateOrderStatus(order.id, status)} disabled={updatingOrderId === order.id || order.status === status} variant={order.status === status ? "default" : "outline"} size="sm" className={`justify-start gap-2 ${order.status === status ? 'opacity-100' : 'opacity-70'}`}>
                                  {updatingOrderId === order.id ? (<Loader2 className="h-4 w-4 animate-spin" />) : (getStatusIcon(status))}
                                  {getStatusLabel(status)}
                                </Button>
                              ))}

                              <Button variant="outline" onClick={() => openOrderDetail(order.id)} className="mt-2">
                                <Eye className="h-4 w-4 mr-2" /> Voir détails
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />

      {/* Modal in Dashboard to show order items details */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-bold">Commande #{selectedOrder.order_number}</h3>
              <button onClick={() => setShowModal(false)} className="p-2 rounded bg-gray-100"><XCircle className="h-5 w-5" /></button>
            </div>
            <div className="p-4 space-y-4">
              {(selectedOrder.order_items || []).map((it, idx) => (
                <div key={idx} className="flex gap-4 p-3 border rounded">
                  {it.preview_image_url ? (
                    <img src={it.preview_image_url} alt={it.product_name} className="w-20 h-20 object-cover rounded" />
                  ) : it.product_image_url ? (
                    <img src={it.product_image_url} alt={it.product_name} className="w-20 h-20 object-cover rounded" />
                  ) : (
                    <div className="w-20 h-20 bg-gray-100 rounded" />
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <div className="font-semibold">{it.product_name || 'Produit'}</div>
                      <div className="font-bold text-green-600">{(it.total_price || (it.unit_price * it.quantity) || 0)} DH</div>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">{it.product_category} {it.product_size ? `• Taille: ${it.product_size}` : ''}</div>
                    <div className="mt-2 text-sm">Quantité: <strong>{it.quantity}</strong> — Prix unitaire: <strong>{it.unit_price ?? 0} DH</strong></div>
                    {it.personalization && <div className="mt-2 text-sm text-gray-700">Personnalisation: {it.personalization.name?.text ? `Nom: ${it.personalization.name.text}` : ''}{it.personalization.number?.text ? ` • N°: ${it.personalization.number.text}` : ''}</div>}
                  </div>
                </div>
              ))}

              <div className="p-3 bg-gray-50 rounded">
                <div className="flex justify-between font-semibold">
                  <div>Sous-total produits</div>
                  <div>{computeItemsSubtotal(selectedOrder.order_items).toFixed(2)} DH</div>
                </div>
                <div className="flex justify-between mt-2">
                  <div>Prix total commande</div>
                  <div className="font-bold">{selectedOrder.total_price} DH</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
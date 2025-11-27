import { useState, useEffect } from 'react';
import { 
  Package, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  Search, 
  RefreshCw,
  Eye,
  MessageCircle,
  Download,
  MapPin,
  Phone,
  User,
  Calendar,
  X,
  Trash2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    total_orders: 0,
    total_revenue: 0,
    in_progress: 0,
    delivered: 0
  });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchStats();
    fetchOrders();
  }, [statusFilter]);

  const fetchStats = async () => {
    try {
      // Date d'aujourd'hui
      const today = new Date().toISOString().split('T')[0];
      
      // Total commandes du jour
      const { count: totalOrders, error: countError } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today);

      if (countError) throw countError;

      // Chiffre d'affaires du jour
      const { data: ordersData, error: revenueError } = await supabase
        .from('orders')
        .select('total_price')
        .gte('created_at', today);
      
      if (revenueError) throw revenueError;

      const totalRevenue = ordersData?.reduce((sum, order) => sum + (order.total_price || 0), 0) || 0;

      // Commandes en cours
      const { count: inProgress, error: progressError } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .in('status', ['pending', 'confirmed', 'in_production']);

      if (progressError) throw progressError;

      // Commandes livrées
      const { count: delivered, error: deliveredError } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'delivered');

      if (deliveredError) throw deliveredError;

      setStats({
        total_orders: totalOrders || 0,
        total_revenue: totalRevenue,
        in_progress: inProgress || 0,
        delivered: delivered || 0
      });

    } catch (error) {
      console.error('Erreur stats:', error);
      alert('❌ Erreur lors du chargement des statistiques');
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      // Filtre par statut
      if (statusFilter) {
        query = query.eq('status', statusFilter);
      }

      // Recherche
      if (search) {
        query = query.or(`customer_name.ilike.%${search}%,customer_phone.ilike.%${search}%,order_number.ilike.%${search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      setOrders(data || []);
    } catch (error) {
      console.error('Erreur commandes:', error);
      alert('❌ Erreur lors du chargement des commandes');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetail = async (orderId) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (error) throw error;

      setSelectedOrder(data);
      setShowModal(true);
    } catch (error) {
      console.error('Erreur détails:', error);
      alert('❌ Erreur lors du chargement des détails');
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: newStatus, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', orderId);

      if (error) throw error;

      alert('✅ Statut mis à jour avec succès');
      fetchOrders();
      fetchStats();
    } catch (error) {
      console.error('Erreur update:', error);
      alert('❌ Erreur lors de la mise à jour');
    }
  };

  const deleteOrder = async (orderId) => {
    if (!confirm('⚠️ Supprimer cette commande ? Cette action est irréversible.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);

      if (error) throw error;

      alert('✅ Commande supprimée avec succès');
      setShowModal(false);
      fetchOrders();
      fetchStats();
    } catch (error) {
      console.error('Erreur suppression:', error);
      alert('❌ Erreur lors de la suppression');
    }
  };

  const downloadImage = (imageDataUrl, orderNumber) => {
    // L'image est stockée en base64 dans preview_image_url
    const link = document.createElement('a');
    link.href = imageDataUrl;
    link.download = `maillot-${orderNumber}.png`;
    link.click();
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'En attente', bg: '#fef3c7', color: '#92400e', icon: Clock },
      confirmed: { label: 'Confirmée', bg: '#dbeafe', color: '#1e40af', icon: CheckCircle },
      in_production: { label: 'En production', bg: '#e9d5ff', color: '#6b21a8', icon: Package },
      shipped: { label: 'Expédiée', bg: '#fed7aa', color: '#9a3412', icon: TrendingUp },
      delivered: { label: 'Livrée', bg: '#d1fae5', color: '#065f46', icon: CheckCircle },
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <span style={{ 
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 12px', 
        backgroundColor: config.bg,
        color: config.color,
        borderRadius: '6px',
        fontSize: '13px',
        fontWeight: '600'
      }}>
        <Icon size={14} />
        {config.label}
      </span>
    );
  };

  return (
    <div style={{ 
      padding: '30px', 
      fontFamily: 'system-ui, -apple-system, sans-serif', 
      backgroundColor: '#f9fafb', 
      minHeight: '100vh' 
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '30px' 
      }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#111', marginBottom: '8px' }}>
            🏆 Dashboard Admin
          </h1>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            Gestion des commandes Atlas Lions Apparel - CAN 2025
          </p>
        </div>
        <button
          onClick={() => {
            fetchStats();
            fetchOrders();
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            backgroundColor: 'white',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600'
          }}
        >
          <RefreshCw size={16} />
          Actualiser
        </button>
      </div>
      
      {/* Statistiques */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: '20px', 
        marginBottom: '30px' 
      }}>
        <div style={{ 
          backgroundColor: 'white', 
          padding: '24px', 
          borderRadius: '12px', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
                Commandes du jour
              </div>
              <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#2563eb' }}>
                {stats.total_orders || 0}
              </div>
            </div>
            <div style={{ 
              padding: '12px', 
              backgroundColor: '#dbeafe', 
              borderRadius: '10px' 
            }}>
              <Package size={24} color="#2563eb" />
            </div>
          </div>
        </div>
        
        <div style={{ 
          backgroundColor: 'white', 
          padding: '24px', 
          borderRadius: '12px', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
                CA du jour
              </div>
              <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#059669' }}>
                {stats.total_revenue?.toFixed(0) || 0} DH
              </div>
            </div>
            <div style={{ 
              padding: '12px', 
              backgroundColor: '#d1fae5', 
              borderRadius: '10px' 
            }}>
              <TrendingUp size={24} color="#059669" />
            </div>
          </div>
        </div>
        
        <div style={{ 
          backgroundColor: 'white', 
          padding: '24px', 
          borderRadius: '12px', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
                En cours
              </div>
              <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#f59e0b' }}>
                {stats.in_progress || 0}
              </div>
            </div>
            <div style={{ 
              padding: '12px', 
              backgroundColor: '#fef3c7', 
              borderRadius: '10px' 
            }}>
              <Clock size={24} color="#f59e0b" />
            </div>
          </div>
        </div>
        
        <div style={{ 
          backgroundColor: 'white', 
          padding: '24px', 
          borderRadius: '12px', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
                Livrées
              </div>
              <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#059669' }}>
                {stats.delivered || 0}
              </div>
            </div>
            <div style={{ 
              padding: '12px', 
              backgroundColor: '#d1fae5', 
              borderRadius: '10px' 
            }}>
              <CheckCircle size={24} color="#059669" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtres et Recherche */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '12px', 
        marginBottom: '20px', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '200px', position: 'relative' }}>
            <Search 
              size={18} 
              style={{ 
                position: 'absolute', 
                left: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)',
                color: '#9ca3af'
              }} 
            />
            <input
              type="text"
              placeholder="Rechercher par nom, téléphone, numéro..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && fetchOrders()}
              style={{ 
                width: '100%', 
                padding: '12px 12px 12px 40px', 
                fontSize: '14px', 
                border: '2px solid #e5e7eb', 
                borderRadius: '8px',
                outline: 'none'
              }}
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '12px 16px',
              fontSize: '14px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              outline: 'none',
              cursor: 'pointer',
              backgroundColor: 'white'
            }}
          >
            <option value="">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="confirmed">Confirmée</option>
            <option value="in_production">En production</option>
            <option value="shipped">Expédiée</option>
            <option value="delivered">Livrée</option>
          </select>
          
          <button 
            onClick={fetchOrders}
            disabled={loading}
            style={{ 
              padding: '12px 24px', 
              backgroundColor: '#2563eb', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              opacity: loading ? 0.6 : 1
            }}
          >
            <Search size={16} />
            {loading ? 'Recherche...' : 'Rechercher'}
          </button>
        </div>
      </div>

      {/* Liste des commandes */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '24px', 
        borderRadius: '12px', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <h2 style={{ 
          fontSize: '20px', 
          fontWeight: 'bold', 
          marginBottom: '20px', 
          color: '#111',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <Package size={24} />
          Commandes ({orders.length})
        </h2>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6b7280' }}>
            <RefreshCw size={48} style={{ animation: 'spin 1s linear infinite' }} />
            <p style={{ fontSize: '16px', marginTop: '16px' }}>Chargement...</p>
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6b7280' }}>
            <Package size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
            <p style={{ fontSize: '18px', fontWeight: '500' }}>Aucune commande</p>
            <p style={{ fontSize: '14px', marginTop: '8px' }}>Les commandes apparaîtront ici</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {orders.map((order) => (
              <div key={order.id} style={{ 
                padding: '20px', 
                border: '2px solid #e5e7eb', 
                borderRadius: '12px',
                display: 'flex',
                gap: '20px',
                alignItems: 'start',
                transition: 'all 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#2563eb'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
              >
                {/* Image preview */}
                {order.preview_image_url && (
                  <img 
                    src={order.preview_image_url}
                    alt="Maillot"
                    style={{ 
                      width: '120px', 
                      height: '120px', 
                      objectFit: 'contain', 
                      borderRadius: '8px', 
                      border: '2px solid #e5e7eb',
                      backgroundColor: '#f9fafb'
                    }}
                  />
                )}
                
                {/* Infos */}
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    fontWeight: 'bold', 
                    fontSize: '20px', 
                    marginBottom: '8px',
                    color: '#111'
                  }}>
                    #{order.order_number}
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '6px',
                    fontSize: '14px',
                    color: '#6b7280'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <User size={14} />
                      {order.customer_name || 'Client'}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Phone size={14} />
                      {order.customer_phone || 'N/A'}
                    </div>
                    {order.customer_city && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <MapPin size={14} />
                        {order.customer_city}
                      </div>
                    )}
                  </div>
                  
                  <div style={{ 
                    marginTop: '12px',
                    padding: '12px',
                    backgroundColor: '#f9fafb',
                    borderRadius: '6px',
                    fontSize: '14px',
                    color: '#374151'
                  }}>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                      Maillot {order.jersey_color === 'red' ? '🔴 Rouge' : '⚪ Blanc'}
                    </div>
                    {order.name_enabled && order.name_text && (
                      <div>• Nom: {order.name_text}</div>
                    )}
                    {order.number_enabled && order.number_text && (
                      <div>• Numéro: #{order.number_text}</div>
                    )}
                    {order.slogan_enabled && order.slogan_text && (
                      <div>• Slogan: {order.slogan_text}</div>
                    )}
                  </div>
                  
                  <div style={{ 
                    marginTop: '8px', 
                    fontSize: '12px', 
                    color: '#9ca3af',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <Calendar size={12} />
                    {new Date(order.created_at).toLocaleDateString('fr-FR')} à {new Date(order.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                
                {/* Prix et Actions */}
                <div style={{ 
                  minWidth: '200px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  <div style={{ 
                    fontSize: '32px', 
                    fontWeight: 'bold', 
                    color: '#059669',
                    textAlign: 'right'
                  }}>
                    {order.total_price} DH
                  </div>
                  
                  <div style={{ textAlign: 'right' }}>
                    {getStatusBadge(order.status)}
                  </div>
                  
                  <select 
                    value={order.status}
                    onChange={(e) => {
                      e.stopPropagation();
                      updateStatus(order.id, e.target.value);
                    }}
                    style={{ 
                      padding: '8px 12px', 
                      borderRadius: '6px', 
                      border: '2px solid #e5e7eb',
                      fontSize: '13px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      backgroundColor: 'white'
                    }}
                  >
                    <option value="pending">En attente</option>
                    <option value="confirmed">Confirmée</option>
                    <option value="in_production">En production</option>
                    <option value="shipped">Expédiée</option>
                    <option value="delivered">Livrée</option>
                  </select>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        fetchOrderDetail(order.id);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '8px 12px',
                        backgroundColor: '#2563eb',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      <Eye size={14} />
                      Détails
                    </button>
                    
                    {order.customer_phone && (
                      <a 
                        href={`https://wa.me/212${order.customer_phone.replace(/^0/, '').replace(/\s/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          padding: '8px 12px',
                          backgroundColor: '#25D366',
                          color: 'white',
                          textDecoration: 'none',
                          borderRadius: '6px',
                          fontSize: '13px',
                          fontWeight: '600'
                        }}
                      >
                        <MessageCircle size={14} />
                        WhatsApp
                      </a>
                    )}
                    
                    {order.preview_image_url && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadImage(order.preview_image_url, order.order_number);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          padding: '8px 12px',
                          backgroundColor: 'white',
                          color: '#374151',
                          border: '2px solid #e5e7eb',
                          borderRadius: '6px',
                          fontSize: '13px',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        <Download size={14} />
                        Image
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Détails */}
      {showModal && selectedOrder && (
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
          zIndex: 1000,
          padding: '20px'
        }}
        onClick={() => setShowModal(false)}
        >
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            maxWidth: '800px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative'
          }}
          onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              position: 'sticky',
              top: 0,
              backgroundColor: 'white',
              padding: '20px',
              borderBottom: '2px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              zIndex: 1
            }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>
                Commande #{selectedOrder.order_number}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  padding: '8px',
                  backgroundColor: '#f3f4f6',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '24px' }}>
              {/* Image */}
              {selectedOrder.preview_image_url && (
                <div style={{ marginBottom: '24px', textAlign: 'center' }}>
                  <img 
                    src={selectedOrder.preview_image_url}
                    alt="Maillot"
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '400px',
                      borderRadius: '12px',
                      border: '2px solid #e5e7eb'
                    }}
                  />
                </div>
              )}

              {/* Infos Client */}
              <div style={{ 
                backgroundColor: '#f9fafb',
                padding: '20px',
                borderRadius: '8px',
                marginBottom: '20px'
              }}>
                <h3 style={{ 
                  fontSize: '18px', 
                  fontWeight: 'bold', 
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <User size={20} />
                  Informations client
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Nom</div>
                    <div style={{ fontWeight: '600' }}>{selectedOrder.customer_name || 'N/A'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Téléphone</div>
                    <div style={{ fontWeight: '600' }}>{selectedOrder.customer_phone || 'N/A'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Ville</div>
                    <div style={{ fontWeight: '600' }}>{selectedOrder.customer_city || 'N/A'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Adresse</div>
                    <div style={{ fontWeight: '600' }}>{selectedOrder.customer_address || 'N/A'}</div>
                  </div>
                </div>
              </div>

              {/* Personnalisation */}
              <div style={{ 
                backgroundColor: '#f9fafb',
                padding: '20px',
                borderRadius: '8px',
                marginBottom: '20px'
              }}>
                <h3 style={{ 
                  fontSize: '18px', 
                  fontWeight: 'bold', 
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Package size={20} />
                  Personnalisation
                </h3>
                <div style={{ fontSize: '14px', lineHeight: '1.8' }}>
                  <div><strong>Couleur:</strong> {selectedOrder.jersey_color === 'red' ? '🔴 Rouge' : '⚪ Blanc'}</div>
                  {selectedOrder.name_enabled && (
                    <div><strong>Nom:</strong> {selectedOrder.name_text} ({selectedOrder.name_font}, {selectedOrder.name_color})</div>
                  )}
                  {selectedOrder.number_enabled && (
                    <div><strong>Numéro:</strong> #{selectedOrder.number_text}</div>
                  )}
                  {selectedOrder.slogan_enabled && (
                    <div><strong>Slogan:</strong> {selectedOrder.slogan_text}</div>
                  )}
                </div>
              </div>

              {/* Commande */}
              <div style={{ 
                backgroundColor: '#f9fafb',
                padding: '20px',
                borderRadius: '8px'
              }}>
                <h3 style={{ 
                  fontSize: '18px', 
                  fontWeight: 'bold', 
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <TrendingUp size={20} />
                  Commande
                </h3>
                <div style={{ fontSize: '14px', lineHeight: '1.8' }}>
                  <div><strong>Prix total:</strong> <span style={{ fontSize: '20px', color: '#059669', fontWeight: 'bold' }}>{selectedOrder.total_price} DH</span></div>
                  <div><strong>Statut:</strong> {getStatusBadge(selectedOrder.status)}</div>
                  <div><strong>Date création:</strong> {new Date(selectedOrder.created_at).toLocaleString('fr-FR')}</div>
                  {selectedOrder.notes && (
                    <div><strong>Notes:</strong> {selectedOrder.notes}</div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div style={{ 
                display: 'flex', 
                gap: '12px', 
                marginTop: '24px',
                borderTop: '2px solid #e5e7eb',
                paddingTop: '24px'
              }}>
                {selectedOrder.customer_phone && (
                  <a 
                    href={`https://wa.me/212${selectedOrder.customer_phone.replace(/^0/, '').replace(/\s/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '12px',
                      backgroundColor: '#25D366',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}
                  >
                    <MessageCircle size={16} />
                    WhatsApp
                  </a>
                )}
                {selectedOrder.preview_image_url && (
                  <button
                    onClick={() => downloadImage(selectedOrder.preview_image_url, selectedOrder.order_number)}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '12px',
                      backgroundColor: 'white',
                      color: '#374151',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    <Download size={16} />
                    Télécharger
                  </button>
                )}
                <button
                  onClick={() => deleteOrder(selectedOrder.id)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '12px',
                    backgroundColor: '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  <Trash2 size={16} />
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
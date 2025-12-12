// ============================================
// ATLAS LIONS - HOOK DE TRACKING UNIFIÉ
// Facebook Pixel + TikTok Pixel (FORMAT OPTIMAL)
// ============================================

// ⚠️ REMPLACE TON_FACEBOOK_PIXEL_ID PAR TON VRAI ID
const FB_PIXEL_ID = 'TON_FACEBOOK_PIXEL_ID';
const TT_PIXEL_ID = 'D4U6I8JC77UA9I4QNVM0';

// Fonction pour hasher les données sensibles (SHA-256)
const hashData = async (data) => {
  if (!data) return null;
  try {
    const msgBuffer = new TextEncoder().encode(data.toLowerCase().trim());
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch {
    return null;
  }
};

// ============================================
// FONCTION GÉNÉRIQUE DE TRACKING
// ============================================

export const trackEvent = (eventName, facebookData = {}, tiktokData = null) => {
  // Utiliser les mêmes données pour les deux si tiktokData n'est pas fourni
  const ttData = tiktokData || facebookData;
  
  console.log(`📊 Tracking événement: ${eventName}`, { facebook: facebookData, tiktok: ttData });
  
  // Facebook Pixel
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, facebookData);
  }
  
  // TikTok Pixel
  if (typeof window !== 'undefined' && window.ttq) {
    window.ttq.track(eventName, ttData);
  }
};

// ============================================
// ÉVÉNEMENTS SPÉCIFIQUES POUR E-COMMERCE
// ============================================

// 👁️ Vue d'un produit
// 👁️ Vue d'un produit
export const trackViewProduct = (product) => {
  const productId = String(product.id || 'product-' + Date.now());
  
  // Format Facebook
  const fbData = {
    content_ids: [productId],
    content_name: product.name,
    content_type: 'product',
    content_category: product.category,
    value: product.price,
    currency: 'MAD'
  };
  
  // Format TikTok (avec content_id au singulier + value)
  const ttData = {
    content_type: 'product',
    content_id: productId,
    content_name: product.name,
    content_category: product.category,
    price: product.price,
    value: product.price, // ✅ Ajouté pour TikTok ROAS
    currency: 'MAD'
  };
  
  trackEvent('ViewContent', fbData, ttData);
};

// 🛒 Ajout au panier
// 🛒 Ajout au panier
export const trackAddToCart = (product, quantity = 1) => {
  const productId = String(product.id || 'product-' + Date.now());
  const totalValue = product.price * quantity;
  
  // Format Facebook
  const fbData = {
    content_ids: [productId],
    content_name: product.name,
    content_type: 'product',
    content_category: product.category,
    value: totalValue,
    currency: 'MAD',
    num_items: quantity
  };
  
  // Format TikTok
  const ttData = {
    content_type: 'product',
    content_id: productId,
    content_name: product.name,
    content_category: product.category,
    quantity: quantity,
    price: product.price,
    value: totalValue, // ✅ Value déjà présent
    currency: 'MAD'
  };
  
  trackEvent('AddToCart', fbData, ttData);
};

// 🚀 Début du processus de commande
export const trackInitiateCheckout = (cartItems, totalPrice) => {
  const productIds = cartItems.map(item => String(item.id || 'item-' + Date.now()));
  const numItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  
  // Format Facebook
  const fbData = {
    content_ids: productIds,
    contents: cartItems.map(item => ({
      id: String(item.id || ''),
      quantity: item.quantity,
      item_price: item.price
    })),
    value: totalPrice,
    currency: 'MAD',
    num_items: numItems
  };
  
  // Format TikTok (avec contents au format TikTok)
  const ttData = {
    content_type: 'product',
    contents: cartItems.map(item => ({
      content_id: String(item.id || ''),
      content_name: item.name || '',
      content_category: item.category || '',
      quantity: item.quantity,
      price: item.price
    })),
    value: totalPrice,
    currency: 'MAD',
    num_items: numItems
  };
  
  trackEvent('InitiateCheckout', fbData, ttData);
};

// 💳 Achat complété (avec infos client hashées)
export const trackPurchase = async (orderNumber, cartItems, totalPrice, customerInfo = {}) => {
  const productIds = cartItems.map(item => String(item.id || 'item-' + Date.now()));
  const numItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  
  // Hasher email et téléphone pour TikTok
  const hashedEmail = customerInfo.email ? await hashData(customerInfo.email) : null;
  const hashedPhone = customerInfo.phone ? await hashData(customerInfo.phone) : null;
  
  // Format Facebook
  const fbData = {
    content_ids: productIds,
    contents: cartItems.map(item => ({
      id: String(item.id || ''),
      quantity: item.quantity,
      item_price: item.price
    })),
    value: totalPrice,
    currency: 'MAD',
    num_items: numItems
  };
  
  // Format TikTok (avec contents au format TikTok + infos client)
  const ttData = {
    content_type: 'product',
    contents: cartItems.map(item => ({
      content_id: String(item.id || ''),
      content_name: item.name || '',
      content_category: item.category || '',
      quantity: item.quantity,
      price: item.price
    })),
    value: totalPrice,
    currency: 'MAD',
    num_items: numItems
  };
  
  // Ajouter infos client hashées si disponibles
  if (hashedEmail) ttData.email = hashedEmail;
  if (hashedPhone) ttData.phone_number = hashedPhone;
  
  trackEvent('Purchase', fbData, ttData);
};

// 📱 Contact (WhatsApp, etc.)
export const trackContact = (method = 'whatsapp') => {
  const data = {
    contact_method: method
  };
  
  trackEvent('Contact', data);
};

// 🎨 Début de personnalisation
export const trackCustomizeProduct = (product) => {
  const productId = String(product.id || 'product-' + Date.now());
  
  // Format Facebook
  const fbData = {
    content_ids: [productId],
    content_name: product.name,
    content_type: 'product_customization'
  };
  
  // Format TikTok
  const ttData = {
    content_type: 'product_customization',
    content_id: productId,
    content_name: product.name
  };
  
  trackEvent('CustomizeProduct', fbData, ttData);
};

export default {
  trackEvent,
  trackViewProduct,
  trackAddToCart,
  trackInitiateCheckout,
  trackPurchase,
  trackContact,
  trackCustomizeProduct
};
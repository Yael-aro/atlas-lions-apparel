// utilitaire pour envoyer une commande vers Google Sheets via Apps Script
// Configure VITE_SHEET_URL et VITE_SHEET_SECRET dans ton .env.local (ou REACT_APP_* si tu utilises CRA)
// Si tu ne veux pas utiliser d'env, l'URL ci-dessous est déjà remplie avec celle que tu as fournie.
import { supabase } from './supabase';

const SHEET_URL = (import.meta && import.meta.env && import.meta.env.VITE_SHEET_URL) || process.env.REACT_APP_SHEET_URL || 'https://script.google.com/macros/s/AKfycbwiPTO_SxSmIgpBFvcpocW0XBV8sOlIirQkgUDVBn4p9IVcmkuuqquGvrYSvS6KjOO-/exec';
const SHEET_SECRET = (import.meta && import.meta.env && import.meta.env.VITE_SHEET_SECRET) || process.env.REACT_APP_SHEET_SECRET || 'Lemaroc0123@';

/**
 * Envoie la commande vers le Google Apps Script. Retry 2 fois, puis log dans la table failed_sheet_syncs si échec définitif.
 * @param order objet ordre retourné par Supabase (contenant id, order_number, order_items, total_price, created_at, ...)
 */
export async function sendOrderToSheet(order: any, retries = 2): Promise<boolean> {
  const payload = {
    __secret: SHEET_SECRET,
    order_id: order.id,
    order_number: order.order_number,
    customer_name: order.customer_name,
    customer_phone: order.customer_phone,
    customer_city: order.customer_city,
    customer_address: order.customer_address,
    total_price: order.total_price,
    items: order.order_items || [],
    notes: order.notes || '',
    created_at: order.created_at || new Date().toISOString()
  };

  try {
    const res = await fetch(SHEET_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    let json = null;
    try { json = await res.json(); } catch (e) { /* ignore parse if not JSON */ }

    if (!res.ok) throw new Error(`Status ${res.status}`);
    if (json && json.ok === false) throw new Error(`AppsScript error: ${JSON.stringify(json)}`);

    return true;
  } catch (err: any) {
    console.warn('sendOrderToSheet error, retries left:', retries, err);
    if (retries > 0) {
      await new Promise((r) => setTimeout(r, 1500));
      return sendOrderToSheet(order, retries - 1);
    }

    // enregistrement de l'erreur dans Supabase pour debug manuel (table failed_sheet_syncs)
    try {
      await supabase.from('failed_sheet_syncs').insert([{
        order_id: order.id,
        payload,
        error: String(err),
        created_at: new Date().toISOString()
      }]);
    } catch (e) {
      console.error('Impossible de logguer failed_sheet_syncs dans Supabase', e);
    }

    return false;
  }
}
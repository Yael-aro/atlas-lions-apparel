import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";

const Panier = () => {
  const { items, getTotalPrice } = useCart();

  console.log('🔍 Items dans le panier:', items);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-8">
        <h1 className="text-4xl font-bold mb-4">Debug Panier</h1>
        
        <div style={{ backgroundColor: '#f0f0f0', padding: '20px', marginBottom: '20px' }}>
          <p><strong>Nombre d'articles :</strong> {items.length}</p>
          <p><strong>Total :</strong> {getTotalPrice()} DH</p>
        </div>

        <h2 className="text-2xl font-bold mb-4">Liste des produits :</h2>
        
        {items.length === 0 ? (
          <p>Panier vide</p>
        ) : (
          <div>
            {items.map((item, index) => {
              console.log(`Item ${index}:`, item);
              
              return (
                <div 
                  key={item.id || index}
                  style={{
                    backgroundColor: 'white',
                    padding: '20px',
                    marginBottom: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '8px'
                  }}
                >
                  <p><strong>Nom :</strong> {item.name || 'Non défini'}</p>
                  <p><strong>Prix :</strong> {item.price || 0} DH</p>
                  <p><strong>Quantité :</strong> {item.quantity || 0}</p>
                  <p><strong>ID :</strong> {item.id || 'Pas d\'ID'}</p>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Panier;

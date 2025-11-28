import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const Panier = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-8">
        <h1 className="text-4xl font-bold mb-4">TEST PANIER</h1>
        <p className="text-xl">Si tu vois ce texte, le problème vient de useCart ou Supabase !</p>
        <div className="mt-8 p-6 bg-blue-100 rounded">
          <p className="font-bold">🎯 Le panier basique fonctionne !</p>
          <p>Maintenant on va identifier quel composant plante...</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Panier;

import { createContext, useContext, useState, ReactNode } from "react";
import { toast } from "sonner";

// Type pour un item du panier
export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
  size?: string;
  customization?: string;
  customizable?: boolean;
}

// Type pour le contexte
interface CartContextType {
  items: CartItem[];
  cartCount: number;
  totalPrice: number;
  addToCart: (product: Omit<CartItem, "quantity">, size?: string, customization?: string) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateSize: (id: string, size: string) => void; // ✅ NOUVEAU
  clearCart: () => void;
}

// Création du contexte
const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider du panier
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Calculer le nombre total d'articles
  const cartCount = items.reduce((total, item) => total + item.quantity, 0);

  // Calculer le prix total
  const totalPrice = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Ajouter un produit au panier
  const addToCart = (
    product: Omit<CartItem, "quantity">,
    size?: string,
    customization?: string
  ) => {
    setItems((currentItems) => {
      // Vérifier si le produit existe déjà avec les mêmes options
      const existingItemIndex = currentItems.findIndex(
        (item) =>
          item.id === product.id &&
          item.size === (size || "M") &&
          item.customization === (customization || "")
      );

      if (existingItemIndex > -1) {
        // Incrémenter la quantité
        const updatedItems = [...currentItems];
        updatedItems[existingItemIndex].quantity += 1;

        toast.success(`${product.name}`, {
          description: `Quantité: ${updatedItems[existingItemIndex].quantity}`,
          duration: 2000,
        });

        return updatedItems;
      }

      // Ajouter le nouveau produit
      toast.success(`${product.name} ajouté au panier !`, {
        description: `${product.price} DH`,
        duration: 2000,
      });

      return [
        ...currentItems,
        {
          ...product,
          quantity: 1,
          size: size || "M",
          customization: customization || "",
        },
      ];
    });
  };

  // Supprimer un produit du panier
  const removeFromCart = (id: string) => {
    setItems((currentItems) => {
      const item = currentItems.find((i) => i.id === id);
      if (item) {
        toast.info(`${item.name} retiré du panier`);
      }
      return currentItems.filter((item) => item.id !== id);
    });
  };

  // Mettre à jour la quantité
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  // ✅ NOUVEAU - Mettre à jour la taille
  const updateSize = (id: string, size: string) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, size } : item
      )
    );
    toast.success(`Taille mise à jour: ${size}`, { duration: 1500 });
  };

  // Vider le panier
  const clearCart = () => {
    setItems([]);
    toast.info("Panier vidé");
  };

  return (
    <CartContext.Provider
      value={{
        items,
        cartCount,
        totalPrice,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateSize, // ✅ NOUVEAU
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook personnalisé pour utiliser le panier
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart doit être utilisé dans un CartProvider");
  }
  return context;
};
// ============================================
// FICHIER CENTRALISÉ - TOUS LES PRODUITS
// ============================================
// Modifie ce fichier pour ajouter/modifier des produits
// Les changements seront reflétés partout (Index + Boutique)

import jerseyImage from "@/assets/jersey-red.jpg";
import accessoriesImage from "@/assets/accessories.jpg";
import echapeImage from "@/assets/echape.jpg";
import ShortImage from "@/assets/short.jpg";
import siffletImage from "@/assets/sifflet.jpg";
import backImage from "@/assets/back.jpg";
import flagImage from "@/assets/flag.jpg";
import MinatureImage from "@/assets/minature.jpg";

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  images?: string[];
  category: string;
  customizable?: boolean;
  featured?: boolean; // true = apparaît sur la page d'accueil
}

export const products: Product[] = [
  // ============================================
  // PACKS
  // ============================================
  {
    id: "1",
    name: "Tenue Maroc Premium",
    price: 280,
    image: jerseyImage,
    images: [jerseyImage, backImage],
    category: "Pack",
    customizable: true,
    featured: true, // ✅ Apparaît sur la page d'accueil
  },
  {
    id: "2",
    name: "Pack Complet Supporter",
    price: 280,
    image: MinatureImage,
    images: [
      MinatureImage,
      jerseyImage,
      accessoriesImage,
      flagImage,
      echapeImage,
      siffletImage,
    ],
    category: "Pack",
    customizable: false,
    featured: true, // ✅ Apparaît sur la page d'accueil
  },

  // ============================================
  // VÊTEMENTS
  // ============================================
  {
    id: "3",
    name: "Short Maroc Premium",
    price: 90,
    image: ShortImage,
    category: "Short",
    customizable: false,
    featured: false,
  },

  // ============================================
  // ACCESSOIRES
  // ============================================
  {
    id: "4",
    name: "Écharpe Supporter",
    price: 50,
    image: echapeImage,
    category: "Accessoires",
    customizable: false,
    featured: false,
  },
  {
    id: "5",
    name: "Casquette Atlas Lions",
    price: 70,
    image: accessoriesImage,
    category: "Accessoires",
    customizable: false,
    featured: true, // ✅ Apparaît sur la page d'accueil
  },
  {
    id: "6",
    name: "Sifflet Officiel",
    price: 70,
    image: siffletImage,
    category: "Accessoires",
    customizable: false,
    featured: false,
  },
];

// ============================================
// FONCTIONS UTILITAIRES
// ============================================

// Récupère les produits vedettes (pour la page d'accueil)
export const getFeaturedProducts = (): Product[] => {
  return products.filter((product) => product.featured);
};

// Récupère tous les produits (pour la boutique)
export const getAllProducts = (): Product[] => {
  return products;
};

// Récupère un produit par son ID
export const getProductById = (id: string): Product | undefined => {
  return products.find((product) => product.id === id);
};

// Filtre les produits par catégorie
export const getProductsByCategory = (category: string): Product[] => {
  if (category === "Tous") return products;
  return products.filter((product) => product.category === category);
};

// Récupère toutes les catégories uniques
export const getCategories = (): string[] => {
  const categories = products.map((p) => p.category);
  return ["Tous", ...Array.from(new Set(categories))];
};

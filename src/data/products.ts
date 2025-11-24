// ============================================
// FICHIER CENTRALISÉ - TOUS LES PRODUITS
// ============================================

import jerseyImage from "@/assets/jersey-red.jpg";
import accessoriesImage from "@/assets/accessories.jpg";
import echapeImage from "@/assets/echape.jpg";
import ShortImage from "@/assets/short.jpg";
import siffletImage from "@/assets/sifflet.jpg";
import backImage from "@/assets/back.jpg";
import flagImage from "@/assets/flag.jpg";
import MinatureImage from "@/assets/minature.jpg";
import jerseyWhiteImage from "@/assets/jerseyWhiteImage.jpg";
import backWhiteImage from "@/assets/backWhiteImage.jpg";
import shortWhiteImage from "@/assets/short-white.jpg";
import biriaImage from "@/assets/biria.jpg";
import biria1Image from "@/assets/biria1.jpg";
// ✅ AJOUTE l'import pour le short blanc ici :


// Type pour les variantes de couleur
export interface ColorVariant {
  color: string;
  colorName: string;
  image: string;
  images?: string[];
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  images?: string[];
  category: string;
  customizable?: boolean;
  featured?: boolean;
  hasColorVariants?: boolean;
  colorVariants?: ColorVariant[];
}

export const products: Product[] = [
  // ============================================
  // MAILLOTS
  // ============================================
  {
    id: "1",
    name: "Maillot Maroc Premium",
    price: 280,
    image: jerseyImage,
    images: [jerseyImage, backImage],
    category: "Maillot",
    customizable: true,
    featured: true,
    hasColorVariants: true,
    colorVariants: [
      {
        color: "#C8102E", // Rouge
        colorName: "Rouge",
        image: jerseyImage,
        images: [jerseyImage, backImage],
      },
      {
        color: "#FFFFFF", // Blanc
        colorName: "Blanc",
        image: jerseyWhiteImage,
        images: [jerseyWhiteImage, backWhiteImage],
      },
    ],
  },

  // ============================================
  // PACKS
  // ============================================
  {
    id: "2",
    name: "Pack Complet Supporter",
    price: 280,
    image: MinatureImage,
    images: [
      MinatureImage,
      jerseyImage,
      biria1Image,
      flagImage,
      echapeImage,
      siffletImage,
    ],
    category: "Pack",
    customizable: false,
    featured: true,
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
    hasColorVariants: true, // ✅ NOUVEAU - Active le sélecteur de couleur
    colorVariants: [
      {
        color: "#C8102E", // Rouge
        colorName: "Rouge",
        image: ShortImage,
        images: [ShortImage],
      },
      {
        color: "#FFFFFF", // Blanc
        colorName: "Blanc",
        image: shortWhiteImage, // ⚠️ Temporaire - remplace par shortWhiteImage quand tu as l'image
        images: [shortWhiteImage], // ⚠️ Temporaire
      },
    ],
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
    featured: true,
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
    {
    id: "7",
    name: "Chapeau Bob ",
    price: 70,
    image: biria1Image,
    category: "Accessoires",
    customizable: false,
    featured: false,
  },
];

// ============================================
// FONCTIONS UTILITAIRES
// ============================================

export const getFeaturedProducts = (): Product[] => {
  return products.filter((product) => product.featured);
};

export const getAllProducts = (): Product[] => {
  return products;
};

export const getProductById = (id: string): Product | undefined => {
  return products.find((product) => product.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  if (category === "Tous") return products;
  return products.filter((product) => product.category === category);
};

export const getCategories = (): string[] => {
  const categories = products.map((p) => p.category);
  return ["Tous", ...Array.from(new Set(categories))];
};
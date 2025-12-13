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

// ⚠️ corrige : le fichier est "jerseywhiteimage.jpg"
import jerseywhiteImage from "@/assets/jerseywhiteimage.jpg";

// ⚠️ corrige : le fichier est "backwhiteimage.jpg"
import backWhiteImage from "@/assets/backwhiteimage.jpg";

import shortWhiteImage from "@/assets/short-white.jpg";
import biriaImage from "@/assets/biria.jpg";
import biria1Image from "@/assets/biria1.jpg";

// ⚠️ corrige : le fichier est "minaturewhite.jpg"
import MinatureWhiteImage from "@/assets/minaturewhite.jpg";

import tarbouchImage from "@/assets/tarbouch.jpg";
import survethoodieImage from "@/assets/survethoodie.png";
import survetpontalonImage from "@/assets/survetpontalon.png";
import ensembleImage from "@/assets/ensemble.png";

// ============================================
// TYPES
// ============================================

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
  description?: string;
  stock?: number;
  customizable?: boolean;
  featured?: boolean;
  hasColorVariants?: boolean;
  colorVariants?: ColorVariant[];
  availableSizes?: string[]; // ✅ NOUVEAU
}

// ============================================
// LISTE DES PRODUITS
// ============================================

export const products: Product[] = [
  // ============================================
  // MAILLOTS
  // ============================================
  {
  id: "1",
  name: "Maillot Maroc Premium",
  price: 249,
  image: jerseyImage,
  images: [jerseyImage, backImage], // ✅ Images par défaut
  category: "Maillot",
  description: "Maillot officiel premium de l'équipe du Maroc",
  stock: 50,
  customizable: true,
  featured: true,
  availableSizes: ["S", "M", "L", "XL", "XXL"],
  hasColorVariants: true,
  colorVariants: [
    {
      color: "#C8102E",
      colorName: "Rouge",
      image: jerseyImage,
      images: [jerseyImage, backImage], // ✅ Face PUIS Dos rouge
    },
    {
      color: "#FFFFFF",
      colorName: "Blanc",
      image: jerseywhiteImage,
      images: [jerseywhiteImage, backWhiteImage], // ✅ Face PUIS Dos blanc
    },
  ],
},

  // ============================================
  // PACKS
  // ============================================
  {
  id: "2",
  name: "Pack Complet Supporter",
  price: 349,
  image: MinatureImage,
  images: [
    MinatureImage,
    jerseyImage,
    tarbouchImage,
    flagImage,
    echapeImage,
    siffletImage,
  ], // ✅ Images par défaut
  category: "Pack",
  description: "Pack complet supporter avec maillot, Tarbouch, drapeau, écharpe et sifflet",
  stock: 30,
  customizable: false,
  featured: true,
  availableSizes: ["S", "M", "L", "XL", "XXL"],
  hasColorVariants: true,
  colorVariants: [
    {
      color: "#C8102E",
      colorName: "Rouge",
      image: MinatureImage,
      images: [
        MinatureImage,    // ✅ Miniature rouge
        jerseyImage,      // Maillot
        tarbouchImage,      // Chapeau
        flagImage,        // Drapeau
        echapeImage,      // Écharpe
        siffletImage,     // Sifflet
      ],
    },
    {
      color: "#FFFFFF",
      colorName: "Blanc",
      image: MinatureWhiteImage, // ⚠️ Change par MinatureWhiteImage si tu l'as
      images: [
        MinatureWhiteImage,    // ⚠️ Change par MinatureWhiteImage si tu l'as
        jerseywhiteImage,      // Reste pareil
        tarbouchImage,      // Reste pareil
        flagImage,        // Reste pareil
        echapeImage,      // Reste pareil
        siffletImage,     // Reste pareil
      ],
    },
  ],
},

  // ============================================
  // VÊTEMENTS
  // ============================================

   {
    id: "3",
    name: "Survêtement Maroc",
    price: 349,
    image: ensembleImage,
    images: [,ensembleImage,survethoodieImage, survetpontalonImage],
    category: "Vêtements",
    description: "survetement officiel de l'équipe du Maroc ",
    stock: 40,
    customizable: false,
    featured: false,
    availableSizes: ["S", "M", "L", "XL", "XXL"],
  },

  // ============================================
  // ACCESSOIRES (PAS DE TAILLES)
  // ============================================
  {
    id: "4",
    name: "Écharpe Supporter",
    price: 89,
    image: echapeImage,
    category: "Accessoires",
    description: "Écharpe officielle des supporters aux couleurs du Maroc",
    stock: 80,
    customizable: false,
    featured: false,
    // ❌ PAS de availableSizes
  },
,

  {
    id: "6",
    name: "Chapeau Bob",
    price: 70,
    image: biria1Image,
    category: "Accessoires",
    description: "Chapeau Bob aux couleurs du Maroc",
    stock: 0,
    customizable: false,
    featured: false,
    // ❌ PAS de availableSizes
  },

 
  
];


// ============================================
// FONCTIONS UTILITAIRES
// ============================================

export const getFeaturedProducts = () => products.filter((p) => p.featured);

export const getAllProducts = () => products;

export const getProductById = (id: string) =>
  products.find((product) => product.id === id);

export const getProductsByCategory = (category: string) => {
  if (category === "Tous") return products;
  return products.filter((p) => p.category === category);
};

export const getCategories = (): string[] => {
  const categories = products.map((p) => p.category);
  return ["Tous", ...Array.from(new Set(categories))];
};
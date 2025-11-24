import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useRef, useEffect } from "react";
import { ShoppingCart, Sparkles, ZoomIn, ZoomOut, RotateCcw, Info, Save, Check, AlertCircle } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import jerseyRedImage from "@/assets/jersey-red.jpg";
import jerseyWhiteImage from "@/assets/jerseyWhiteImage.jpg";
import backRedImage from "@/assets/back.jpg";
import backWhiteImage from "@/assets/backWhiteImage.jpg";

// ✅ Type pour les données de personnalisation complètes
interface PersonalizationData {
  id: string;
  timestamp: number;
  jerseyColor: string;
  name: {
    enabled: boolean;
    text: string;
    font: string;
    color: string;
    position: { x: number; y: number };
  };
  number: {
    enabled: boolean;
    text: string;
    font: string;
    color: string;
    position: { x: number; y: number };
  };
  slogan: {
    enabled: boolean;
    text: string;
    font: string;
    color: string;
    size: "small" | "medium" | "large";
    position: { x: number; y: number };
  };
  selectedPosition: string;
  previewImage?: string;
}

const Personnalisation = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  
  // États de base
  const [customText, setCustomText] = useState("MAROC");
  const [customNumber, setCustomNumber] = useState("10");
  const [selectedFont, setSelectedFont] = useState("montserrat");
  const [selectedColor, setSelectedColor] = useState("gold");
  const [selectedPosition, setSelectedPosition] = useState("back");
  const [jerseyColor, setJerseyColor] = useState("red");
  
  // ✅ NOUVEAU - États pour le slogan
  const [sloganEnabled, setSloganEnabled] = useState(false);
  const [sloganText, setSloganText] = useState("");
  const [sloganFont, setSloganFont] = useState("montserrat");
  const [sloganColor, setSloganColor] = useState("gold");
  const [sloganSize, setSloganSize] = useState<"small" | "medium" | "large">("medium");
  
  // États pour positions drag & drop
  const [textPosition, setTextPosition] = useState({ x: 50, y: 35 });
  const [numberPosition, setNumberPosition] = useState({ x: 50, y: 50 });
  const [sloganPosition, setSloganPosition] = useState({ x: 50, y: 65 });
  
  // États drag & drop
  const [draggedElement, setDraggedElement] = useState<"text" | "number" | "slogan" | null>(null);
  
  // États zoom
  const [zoomLevel, setZoomLevel] = useState(1);
  
  // ✅ NOUVEAU - États de sauvegarde
  const [isSaved, setIsSaved] = useState(false);
  const [personalizationId, setPersonalizationId] = useState<string | null>(null);
  
  const previewRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLDivElement>(null);
  const sloganRef = useRef<HTMLDivElement>(null);

  const fonts = [
    { value: "montserrat", label: "Montserrat Bold", fontFamily: "'Montserrat', sans-serif" },
    { value: "bebas", label: "Bebas Neue", fontFamily: "'Bebas Neue', sans-serif" },
    { value: "oswald", label: "Oswald", fontFamily: "'Oswald', sans-serif" },
    { value: "roboto", label: "Roboto Black", fontFamily: "'Roboto', sans-serif" },
    { value: "impact", label: "Impact", fontFamily: "'Impact', sans-serif" },
    { value: "permanent", label: "Permanent Marker", fontFamily: "'Permanent Marker', cursive" },
    { value: "cairo", label: "Cairo Bold (عربي)", fontFamily: "'Cairo', sans-serif" },
    { value: "amiri", label: "Amiri (عربي)", fontFamily: "'Amiri', serif" },
  ];

  const colors = [
    { value: "gold", label: "Or", hex: "#FFD700" },
    { value: "white", label: "Blanc", hex: "#FFFFFF" },
    { value: "black", label: "Noir", hex: "#000000" },
    { value: "red", label: "Rouge", hex: "#C1272D" },
    { value: "green", label: "Vert", hex: "#006233" },
  ];

  const jerseyColors = [
    { 
      value: "red", 
      label: "Rouge (Domicile)", 
      image: jerseyRedImage,
      backImage: backRedImage,
      recommendedTextColors: ["gold", "white"]
    },
    { 
      value: "white", 
      label: "Blanc (Extérieur)", 
      image: jerseyWhiteImage,
      backImage: backWhiteImage,
      recommendedTextColors: ["red", "green", "black"]
    },
  ];

  // ✅ Tailles de slogan
  const sloganSizes = [
    { value: "small", label: "Petit", fontSize: "1rem" },
    { value: "medium", label: "Moyen", fontSize: "1.5rem" },
    { value: "large", label: "Grand", fontSize: "2rem" },
  ];

  const getCurrentJerseyImage = () => {
    const currentJersey = jerseyColors.find(j => j.value === jerseyColor);
    return selectedPosition === "back" 
      ? currentJersey?.backImage || backRedImage
      : currentJersey?.image || jerseyRedImage;
  };

  const getColorSuggestion = () => {
    const currentJersey = jerseyColors.find(j => j.value === jerseyColor);
    const recommended = currentJersey?.recommendedTextColors || [];
    if (recommended.includes(selectedColor)) return null;
    
    const recommendedLabels = recommended
      .map(c => colors.find(col => col.value === c)?.label)
      .filter(Boolean);
    
    return recommendedLabels.length > 0 
      ? `💡 Pour une meilleure lisibilité, essayez le texte ${recommendedLabels.join(" ou ")}`
      : null;
  };

  // Gestion du drag & drop pour tous les éléments
  const handleMouseDown = (element: "text" | "number" | "slogan") => (e: React.MouseEvent) => {
    setDraggedElement(element);
    setIsSaved(false); // Marquer comme non sauvegardé
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (draggedElement && previewRef.current) {
      const rect = previewRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      const constrainedX = Math.max(10, Math.min(90, x));
      const constrainedY = Math.max(10, Math.min(90, y));
      
      if (draggedElement === "text") {
        setTextPosition({ x: constrainedX, y: constrainedY });
      } else if (draggedElement === "number") {
        setNumberPosition({ x: constrainedX, y: constrainedY });
      } else if (draggedElement === "slogan") {
        setSloganPosition({ x: constrainedX, y: constrainedY });
      }
    }
  };

  const handleMouseUp = () => {
    setDraggedElement(null);
  };

  useEffect(() => {
    if (draggedElement) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [draggedElement]);

  // Gestion du zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoomLevel(prev => Math.max(0.5, Math.min(2, prev + delta)));
  };

  const handleZoomIn = () => setZoomLevel(prev => Math.min(2, prev + 0.2));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(0.5, prev - 0.2));
  const handleResetZoom = () => setZoomLevel(1);

  // Reset positions
  useEffect(() => {
    setTextPosition({ x: 50, y: 35 });
    setNumberPosition({ x: 50, y: 50 });
    setSloganPosition({ x: 50, y: 65 });
  }, [selectedPosition]);

  // Marquer comme non sauvegardé quand on modifie
  useEffect(() => {
    setIsSaved(false);
  }, [customText, customNumber, selectedFont, selectedColor, jerseyColor, sloganEnabled, sloganText, sloganFont, sloganColor, sloganSize]);

  // Calcul du prix
  const calculatePrice = () => {
    const basePrice = 180;
    const textPrice = customText ? 30 : 0;
    const numberPrice = customNumber ? 20 : 0;
    const sloganPrice = sloganEnabled && sloganText ? 50 : 0; // ✅ +50 DH pour slogan
    return basePrice + textPrice + numberPrice + sloganPrice;
  };

  // ✅ VALIDATION des données
  const validatePersonalization = (): string | null => {
    if (!customText && !customNumber && (!sloganEnabled || !sloganText)) {
      return "Veuillez saisir au moins un nom, un numéro ou un slogan";
    }
    if (customText && customText.length > 15) {
      return "Le nom ne doit pas dépasser 15 caractères";
    }
    if (sloganText && sloganText.length > 30) {
      return "Le slogan ne doit pas dépasser 30 caractères";
    }
    return null;
  };

  // ✅ CAPTURE de la prévisualisation
  const capturePreview = async (): Promise<string> => {
    // Pour capturer l'image, tu devras installer html2canvas:
    // npm install html2canvas @types/html2canvas
    
    // Pour l'instant, retourne une capture simulée
    // Quand tu installes html2canvas, décommente ce code:
    
    /*
    const html2canvas = (await import('html2canvas')).default;
    if (previewRef.current) {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        backgroundColor: null,
        logging: false,
      });
      return canvas.toDataURL('image/png');
    }
    */
    
    return "data:image/png;base64,preview-image-placeholder";
  };

  // ✅ SAUVEGARDE de la personnalisation
  const handleSavePersonalization = async () => {
    // Validation
    const error = validatePersonalization();
    if (error) {
      toast.error(error, {
        icon: <AlertCircle className="h-4 w-4" />
      });
      return;
    }

    try {
      // Générer un ID unique
      const id = `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Capturer l'image de prévisualisation
      const previewImage = await capturePreview();
      
      // Créer l'objet de données
      const data: PersonalizationData = {
        id,
        timestamp: Date.now(),
        jerseyColor,
        name: {
          enabled: !!customText,
          text: customText,
          font: selectedFont,
          color: selectedColor,
          position: textPosition,
        },
        number: {
          enabled: !!customNumber,
          text: customNumber,
          font: selectedFont, // Même police que le nom
          color: selectedColor,
          position: numberPosition,
        },
        slogan: {
          enabled: sloganEnabled,
          text: sloganText,
          font: sloganFont,
          color: sloganColor,
          size: sloganSize,
          position: sloganPosition,
        },
        selectedPosition,
        previewImage,
      };

      // Sauvegarder dans localStorage
      localStorage.setItem(`personalization-${id}`, JSON.stringify(data));
      
      // ✅ Option: Envoyer au backend
      // await fetch('/api/personalizations', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // });

      setPersonalizationId(id);
      setIsSaved(true);
      
      toast.success("✓ Personnalisation enregistrée avec succès !", {
        icon: <Check className="h-4 w-4" />
      });
    } catch (error) {
      toast.error("Erreur lors de la sauvegarde", {
        icon: <AlertCircle className="h-4 w-4" />
      });
    }
  };

  // ✅ AJOUT AU PANIER (seulement si sauvegardé)
  const handleAddToCart = () => {
    if (!isSaved) {
      toast.error("Veuillez d'abord enregistrer votre personnalisation", {
        icon: <AlertCircle className="h-4 w-4" />
      });
      return;
    }

    addToCart({
      id: personalizationId || `custom-${Date.now()}`,
      name: `Maillot Personnalisé ${jerseyColor === "red" ? "Rouge" : "Blanc"}`,
      price: calculatePrice(),
      image: getCurrentJerseyImage(),
      category: "Maillot",
      customizable: true,
    });
    
    toast.success("Ajouté au panier !");
    navigate("/panier");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700&family=Bebas+Neue&family=Oswald:wght@700&family=Roboto:wght@900&family=Permanent+Marker&family=Cairo:wght@700&family=Amiri:wght@700&display=swap" rel="stylesheet" />
      
      <main className="flex-1">
        <section className="gradient-primary py-16 text-white">
          <div className="container px-4">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold">Personnalisation Premium</h1>
            </div>
            <p className="text-xl text-white/90 text-center">
              Créez votre maillot unique avec nom, numéro et slogan personnalisés
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="container px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
              
              {/* Preview */}
              <Card className="shadow-elegant">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-4 text-center">Prévisualisation</h2>
                  
                  <div className="flex justify-center gap-2 mb-4">
                    <Button variant="outline" size="sm" onClick={handleZoomOut}>
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleResetZoom}>
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleZoomIn}>
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground flex items-center">
                      {Math.round(zoomLevel * 100)}%
                    </span>
                  </div>

                  <div 
                    ref={previewRef}
                    className="relative aspect-square max-w-md mx-auto overflow-hidden rounded-lg bg-muted/20"
                    onWheel={handleWheel}
                    style={{ cursor: draggedElement ? "grabbing" : "default" }}
                  >
                    <div 
                      style={{ 
                        transform: `scale(${zoomLevel})`,
                        transformOrigin: "center",
                        transition: draggedElement ? "none" : "transform 0.2s"
                      }}
                      className="w-full h-full"
                    >
                      <img 
                        src={getCurrentJerseyImage()} 
                        alt="Maillot" 
                        className="w-full h-full object-contain"
                        draggable={false}
                      />
                      
                      {/* Nom */}
                      {customText && (
                        <div 
                          ref={textRef}
                          onMouseDown={handleMouseDown("text")}
                          className="absolute text-center select-none"
                          style={{ 
                            left: `${textPosition.x}%`,
                            top: `${textPosition.y}%`,
                            transform: "translate(-50%, -50%)",
                            cursor: "move",
                            fontFamily: fonts.find(f => f.value === selectedFont)?.fontFamily,
                            color: colors.find(c => c.value === selectedColor)?.hex,
                            fontSize: "2rem",
                            fontWeight: "bold",
                            textShadow: "2px 2px 4px rgba(0,0,0,0.7)",
                            WebkitTextStroke: "1px rgba(0,0,0,0.3)",
                          }}
                        >
                          {customText}
                        </div>
                      )}
                      
                      {/* Numéro */}
                      {customNumber && (
                        <div 
                          ref={numberRef}
                          onMouseDown={handleMouseDown("number")}
                          className="absolute text-center select-none"
                          style={{ 
                            left: `${numberPosition.x}%`,
                            top: `${numberPosition.y}%`,
                            transform: "translate(-50%, -50%)",
                            cursor: "move",
                            fontFamily: fonts.find(f => f.value === selectedFont)?.fontFamily,
                            color: colors.find(c => c.value === selectedColor)?.hex,
                            fontSize: "5rem",
                            fontWeight: "bold",
                            textShadow: "3px 3px 6px rgba(0,0,0,0.7)",
                            WebkitTextStroke: "2px rgba(0,0,0,0.3)",
                          }}
                        >
                          {customNumber}
                        </div>
                      )}
                      
                      {/* ✅ NOUVEAU - Slogan */}
                      {sloganEnabled && sloganText && (
                        <div 
                          ref={sloganRef}
                          onMouseDown={handleMouseDown("slogan")}
                          className="absolute text-center select-none"
                          style={{ 
                            left: `${sloganPosition.x}%`,
                            top: `${sloganPosition.y}%`,
                            transform: "translate(-50%, -50%)",
                            cursor: "move",
                            fontFamily: fonts.find(f => f.value === sloganFont)?.fontFamily,
                            color: colors.find(c => c.value === sloganColor)?.hex,
                            fontSize: sloganSizes.find(s => s.value === sloganSize)?.fontSize,
                            fontWeight: "bold",
                            textShadow: "2px 2px 4px rgba(0,0,0,0.7)",
                            WebkitTextStroke: "0.5px rgba(0,0,0,0.3)",
                          }}
                        >
                          {sloganText}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <p className="text-center text-sm text-muted-foreground">
                      Position: {selectedPosition === "back" ? "Dos" : selectedPosition === "chest" ? "Poitrine" : "Manche"}
                    </p>
                    <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1">
                      <Info className="h-3 w-3" />
                      Glissez les éléments pour les déplacer • Molette pour zoomer
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Options */}
              <div className="space-y-6">
                <Card className="shadow-elegant">
                  <CardContent className="p-6 space-y-6">
                    <h2 className="text-2xl font-bold">Options de personnalisation</h2>

                    {/* Couleur maillot */}
                    <div className="space-y-2">
                      <Label>Couleur du maillot</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {jerseyColors.map((jersey) => (
                          <button
                            key={jersey.value}
                            onClick={() => setJerseyColor(jersey.value)}
                            className={`relative p-3 rounded-lg border-2 transition-all ${
                              jerseyColor === jersey.value 
                                ? "border-primary bg-primary/5 scale-105" 
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            <img 
                              src={jersey.image} 
                              alt={jersey.label}
                              className="w-full h-24 object-contain mb-2"
                            />
                            <p className="text-sm font-medium">{jersey.label}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Nom */}
                    <div className="space-y-2">
                      <Label htmlFor="customText">Nom personnalisé (max 15 caractères)</Label>
                      <Input
                        id="customText"
                        value={customText}
                        onChange={(e) => setCustomText(e.target.value.slice(0, 15).toUpperCase())}
                        placeholder="ZAKARIA, DIMA MAGHRIB..."
                        maxLength={15}
                      />
                      <p className="text-xs text-muted-foreground">{customText.length}/15 caractères</p>
                    </div>

                    {/* Numéro */}
                    <div className="space-y-2">
                      <Label htmlFor="customNumber">Numéro (1-99)</Label>
                      <Input
                        id="customNumber"
                        type="number"
                        min="1"
                        max="99"
                        value={customNumber}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === "" || (parseInt(val) >= 1 && parseInt(val) <= 99)) {
                            setCustomNumber(val);
                          }
                        }}
                        placeholder="10"
                      />
                    </div>

                    {/* Police et Couleur pour Nom/Numéro */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="font">Police</Label>
                        <Select value={selectedFont} onValueChange={setSelectedFont}>
                          <SelectTrigger id="font">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {fonts.map((font) => (
                              <SelectItem key={font.value} value={font.value}>
                                {font.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Couleur</Label>
                        <Select value={selectedColor} onValueChange={setSelectedColor}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {colors.map((color) => (
                              <SelectItem key={color.value} value={color.value}>
                                {color.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {getColorSuggestion() && (
                      <p className="text-xs text-amber-600">{getColorSuggestion()}</p>
                    )}

                    {/* Position */}
                    <div className="space-y-2">
                      <Label>Position</Label>
                      <RadioGroup value={selectedPosition} onValueChange={setSelectedPosition}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="back" id="back" />
                          <Label htmlFor="back" className="cursor-pointer">Dos</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="chest" id="chest" />
                          <Label htmlFor="chest" className="cursor-pointer">Poitrine</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="sleeve" id="sleeve" />
                          <Label htmlFor="sleeve" className="cursor-pointer">Manche</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* ✅ NOUVEAU - Section Slogan */}
                    <div className="pt-4 border-t border-border space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="slogan-checkbox" 
                          checked={sloganEnabled}
                          onCheckedChange={(checked) => setSloganEnabled(checked as boolean)}
                        />
                        <Label htmlFor="slogan-checkbox" className="cursor-pointer font-semibold">
                          ☑ Ajouter un slogan (+50 DH)
                        </Label>
                      </div>

                      {sloganEnabled && (
                        <div className="space-y-4 pl-4 border-l-2 border-primary">
                          <div className="space-y-2">
                            <Label htmlFor="sloganText">Slogan (max 30 caractères)</Label>
                            <Input
                              id="sloganText"
                              value={sloganText}
                              onChange={(e) => setSloganText(e.target.value.slice(0, 30).toUpperCase())}
                              placeholder="DIMA MAGHRIB, ALLEZ LES LIONS..."
                              maxLength={30}
                            />
                            <p className="text-xs text-muted-foreground">{sloganText.length}/30 caractères</p>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Police slogan</Label>
                              <Select value={sloganFont} onValueChange={setSloganFont}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {fonts.map((font) => (
                                    <SelectItem key={font.value} value={font.value}>
                                      {font.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label>Couleur slogan</Label>
                              <Select value={sloganColor} onValueChange={setSloganColor}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {colors.map((color) => (
                                    <SelectItem key={color.value} value={color.value}>
                                      {color.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Taille du slogan</Label>
                            <RadioGroup value={sloganSize} onValueChange={(val) => setSloganSize(val as any)}>
                              <div className="flex gap-4">
                                {sloganSizes.map((size) => (
                                  <div key={size.value} className="flex items-center space-x-2">
                                    <RadioGroupItem value={size.value} id={size.value} />
                                    <Label htmlFor={size.value} className="cursor-pointer">
                                      {size.label}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </RadioGroup>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* ✅ Boutons d'action */}
                    <div className="pt-4 border-t border-border space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">Prix total:</span>
                        <span className="text-2xl font-bold text-primary">
                          {calculatePrice()} DH
                        </span>
                      </div>

                      {/* Bouton Enregistrer */}
                      <Button 
                        onClick={handleSavePersonalization}
                        className="w-full shadow-elegant bg-green-600 hover:bg-green-700" 
                        size="lg"
                        disabled={!customText && !customNumber && (!sloganEnabled || !sloganText)}
                      >
                        <Save className="mr-2 h-5 w-5" />
                        {isSaved ? "✓ Personnalisation enregistrée" : "Enregistrer la personnalisation"}
                      </Button>

                      {/* Bouton Ajouter au panier */}
                      <Button 
                        onClick={handleAddToCart}
                        className={`w-full shadow-elegant ${
                          !isSaved ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        size="lg"
                        disabled={!isSaved}
                      >
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        Ajouter au panier
                      </Button>

                      {!isSaved && (
                        <p className="text-xs text-center text-muted-foreground">
                          Enregistrez d'abord votre personnalisation
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Info */}
                <Card className="bg-accent/10 border-accent">
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2 flex items-center">
                      <Sparkles className="h-4 w-4 mr-2 text-accent-foreground" />
                      Personnalisation Premium
                    </h3>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>✓ Maillot de base: 180 DH</li>
                      <li>✓ Nom personnalisé: +30 DH</li>
                      <li>✓ Numéro: +20 DH</li>
                      <li>✓ Slogan: +50 DH</li>
                      <li>✓ Déplacement libre par glisser-déposer</li>
                      <li>✓ Zoom interactif</li>
                      <li>✓ Sauvegarde sécurisée</li>
                      <li>✓ Qualité garantie</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Personnalisation;
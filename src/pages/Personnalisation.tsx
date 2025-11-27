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
import { supabase } from '@/lib/supabase';

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
  
  const [customText, setCustomText] = useState("MAROC");
  const [customNumber, setCustomNumber] = useState("10");
  const [selectedFont, setSelectedFont] = useState("montserrat");
  const [selectedColor, setSelectedColor] = useState("gold");
  const [selectedPosition, setSelectedPosition] = useState("back");
  const [jerseyColor, setJerseyColor] = useState("red");
  
  const [sloganEnabled, setSloganEnabled] = useState(false);
  const [sloganText, setSloganText] = useState("");
  const [sloganFont, setSloganFont] = useState("montserrat");
  const [sloganColor, setSloganColor] = useState("gold");
  const [sloganSize, setSloganSize] = useState<"small" | "medium" | "large">("medium");
  
  const [textPosition, setTextPosition] = useState({ x: 50, y: 35 });
  const [numberPosition, setNumberPosition] = useState({ x: 50, y: 50 });
  const [sloganPosition, setSloganPosition] = useState({ x: 50, y: 65 });
  
  const [draggedElement, setDraggedElement] = useState<"text" | "number" | "slogan" | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isSaved, setIsSaved] = useState(false);
  const [personalizationId, setPersonalizationId] = useState<string | null>(null);
  
  const [showClientForm, setShowClientForm] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientCity, setClientCity] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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

  const handleMouseDown = (element: "text" | "number" | "slogan") => (e: React.MouseEvent) => {
    setDraggedElement(element);
    setIsSaved(false);
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

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoomLevel(prev => Math.max(0.5, Math.min(2, prev + delta)));
  };

  const handleZoomIn = () => setZoomLevel(prev => Math.min(2, prev + 0.2));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(0.5, prev - 0.2));
  const handleResetZoom = () => setZoomLevel(1);

  useEffect(() => {
    setTextPosition({ x: 50, y: 35 });
    setNumberPosition({ x: 50, y: 50 });
    setSloganPosition({ x: 50, y: 65 });
  }, [selectedPosition]);

  useEffect(() => {
    setIsSaved(false);
  }, [customText, customNumber, selectedFont, selectedColor, jerseyColor, sloganEnabled, sloganText, sloganFont, sloganColor, sloganSize]);

  const calculatePrice = () => {
    const basePrice = 180;
    const textPrice = customText ? 30 : 0;
    const numberPrice = customNumber ? 20 : 0;
    const sloganPrice = sloganEnabled && sloganText ? 50 : 0;
    return basePrice + textPrice + numberPrice + sloganPrice;
  };

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

const capturePreview = async (): Promise<string> => {
  // ON IGNORE HTML2CANVAS - ça plante trop souvent
  console.log('Pas de capture - mode simple');
  return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
};

  const handleSavePersonalization = async () => {
    const error = validatePersonalization();
    if (error) {
      toast.error(error, {
        icon: <AlertCircle className="h-4 w-4" />
      });
      return;
    }

    try {
      const id = `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const previewImage = await capturePreview();
      
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
          font: selectedFont,
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

      localStorage.setItem(`personalization-${id}`, JSON.stringify(data));
      
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

  const handleOrderNow = async () => {
    if (!isSaved || !personalizationId) {
      toast.error("Veuillez d'abord enregistrer votre personnalisation", {
        icon: <AlertCircle className="h-4 w-4" />
      });
      return;
    }
    
    setShowClientForm(true);
  };

  const submitOrder = async () => {
    if (!clientName || !clientPhone) {
      toast.error("Nom et téléphone obligatoires");
      return;
    }

    setIsSubmitting(true);

    try {
      const savedData = localStorage.getItem(`personalization-${personalizationId}`);
      if (!savedData) {
        toast.error("Données de personnalisation introuvables");
        return;
      }

      const data: PersonalizationData = JSON.parse(savedData);
      
      const { count, error: countError } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });
      
      if (countError) throw countError;
      
      const orderNumber = `CMD-${String((count || 0) + 1).padStart(4, '0')}`;
      const totalPrice = calculatePrice();
      
      const { data: order, error: insertError } = await supabase
        .from('orders')
        .insert([
          {
            order_number: orderNumber,
            personalization_id: data.id,
            customer_name: clientName,
            customer_phone: clientPhone,
            customer_address: clientAddress || '',
            customer_city: clientCity || '',
            jersey_color: data.jerseyColor,
            name_enabled: data.name.enabled,
            name_text: data.name.text || '',
            name_font: data.name.font,
            name_color: data.name.color,
            name_position_x: data.name.position.x,
            name_position_y: data.name.position.y,
            number_enabled: data.number.enabled,
            number_text: data.number.text || '',
            number_font: data.number.font,
            number_color: data.number.color,
            number_position_x: data.number.position.x,
            number_position_y: data.number.position.y,
            slogan_enabled: data.slogan.enabled,
            slogan_text: data.slogan.text || '',
            slogan_font: data.slogan.font,
            slogan_color: data.slogan.color,
            slogan_size: data.slogan.size,
            slogan_position_x: data.slogan.position.x,
            slogan_position_y: data.slogan.position.y,
            selected_position: data.selectedPosition,
            preview_image_url: data.previewImage || '',
            total_price: totalPrice,
            status: 'pending'
          }
        ])
        .select();

      if (insertError) throw insertError;

      toast.success(`✅ Commande ${orderNumber} enregistrée avec succès !`, {
        duration: 5000
      });
      
      setShowClientForm(false);
      setClientName('');
      setClientPhone('');
      setClientCity('');
      setClientAddress('');
      
      setTimeout(() => {
        toast.info("📦 Vous recevrez une confirmation par téléphone", {
          duration: 5000
        });
      }, 1000);
      
    } catch (error) {
      console.error('Erreur:', error);
      toast.error("❌ Erreur lors de l'enregistrement de la commande");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddToCart = () => {
    if (!isSaved) {
      toast.error("Veuillez d'abord enregistrer votre personnalisation");
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
              Créez votre maillot unique - Commande directe en ligne
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="container px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
              
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

              <div className="space-y-6">
                <Card className="shadow-elegant">
                  <CardContent className="p-6 space-y-6">
                    <h2 className="text-2xl font-bold">Options de personnalisation</h2>

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

                    <div className="pt-4 border-t border-border space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">Prix total:</span>
                        <span className="text-2xl font-bold text-primary">
                          {calculatePrice()} DH
                        </span>
                      </div>

                      <Button 
                        onClick={handleSavePersonalization}
                        className="w-full shadow-elegant bg-green-600 hover:bg-green-700" 
                        size="lg"
                        disabled={!customText && !customNumber && (!sloganEnabled || !sloganText)}
                      >
                        <Save className="mr-2 h-5 w-5" />
                        {isSaved ? "✓ Personnalisation enregistrée" : "Enregistrer la personnalisation"}
                      </Button>

                      <Button 
                        onClick={handleOrderNow}
                        className={`w-full shadow-elegant ${
                          !isSaved ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        size="lg"
                        disabled={!isSaved}
                      >
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        Commander maintenant
                      </Button>

                      <Button 
                        onClick={handleAddToCart}
                        className="w-full shadow-elegant"
                        size="lg"
                        variant="outline"
                        disabled={!isSaved}
                      >
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        Ou ajouter au panier
                      </Button>

                      {!isSaved && (
                        <p className="text-xs text-center text-muted-foreground">
                          Enregistrez d'abord votre personnalisation
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-3 flex items-center text-blue-800">
                      <Info className="h-5 w-5 mr-2" />
                      Comment ça marche ?
                    </h3>
                    <ol className="text-sm space-y-2 text-blue-700">
                      <li className="flex items-start">
                        <span className="font-bold mr-2">1️⃣</span>
                        <span>Personnalisez votre maillot (nom, numéro, slogan)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="font-bold mr-2">2️⃣</span>
                        <span>Cliquez sur "Enregistrer la personnalisation"</span>
                      </li>
                      <li className="flex items-start">
                        <span className="font-bold mr-2">3️⃣</span>
                        <span>Cliquez sur "Commander maintenant"</span>
                      </li>
                      <li className="flex items-start">
                        <span className="font-bold mr-2">4️⃣</span>
                        <span><strong>Remplissez vos coordonnées</strong> (nom, téléphone, adresse)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="font-bold mr-2">5️⃣</span>
                        <span>Validez - Votre commande est enregistrée ! ✅</span>
                      </li>
                      <li className="flex items-start">
                        <span className="font-bold mr-2">6️⃣</span>
                        <span>Nous vous contactons pour confirmer et livrer 📦</span>
                      </li>
                    </ol>
                    
                    <div className="mt-3 p-2 bg-blue-100 rounded-lg">
                      <p className="text-xs text-blue-800 font-semibold">
                        💡 Livraison rapide • Paiement à la livraison disponible
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      {showClientForm && (
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
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '12px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
              📋 Vos coordonnées
            </h2>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                Nom complet *
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Ex: Zakaria Mihrab"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '16px'
                }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                Téléphone *
              </label>
              <input
                type="tel"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder="Ex: 06 12 34 56 78"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '16px'
                }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                Ville
              </label>
              <input
                type="text"
                value={clientCity}
                onChange={(e) => setClientCity(e.target.value)}
                placeholder="Ex: Casablanca"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '16px'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                Adresse
              </label>
              <textarea
                value={clientAddress}
                onChange={(e) => setClientAddress(e.target.value)}
                placeholder="Ex: 123 Rue Mohammed V, Quartier Maarif"
                rows={3}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '16px',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setShowClientForm(false)}
                disabled={isSubmitting}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: '#e5e7eb',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting ? 0.5 : 1
                }}
              >
                Annuler
              </button>
              <button
                onClick={submitOrder}
                disabled={!clientName || !clientPhone || isSubmitting}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: !clientName || !clientPhone || isSubmitting ? '#9ca3af' : '#059669',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: !clientName || !clientPhone || isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: !clientName || !clientPhone || isSubmitting ? 0.6 : 1
                }}
              >
                {isSubmitting ? '⏳ Envoi...' : '✅ Confirmer la commande'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Personnalisation;

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, 
  Save, 
  ShoppingCart, 
  Palette, 
  Type, 
  MapPin, 
  Ruler, 
  Edit3, 
  Hash, 
  MessageSquare, 
  Coins,
  ClipboardList,
  CheckCircle,
  Loader2,
  Info
} from "lucide-react";
import html2canvas from "html2canvas";
import { toast } from "sonner";
import { supabase } from '@/lib/supabase';
import jerseyRedImage from "@/assets/jersey-red.jpg";
import jerseywhiteImage from "@/assets/jerseywhiteimage.jpg";
import backRedImage from "@/assets/back.jpg";
import backWhiteImage from "@/assets/backwhiteimage.jpg";

const Personnalisation = () => {
  const navigate = useNavigate();
  const previewRef = useRef<HTMLDivElement>(null);

  const [jerseyColor, setJerseyColor] = useState<"red" | "white">("red");
  const [selectedSize, setSelectedSize] = useState<string>("M");
  
  const [customText, setCustomText] = useState("");
  const [customNumber, setCustomNumber] = useState("");
  const [customSlogan, setCustomSlogan] = useState("");
  
  const [textEnabled, setTextEnabled] = useState(false);
  const [numberEnabled, setNumberEnabled] = useState(false);
  const [sloganEnabled, setSloganEnabled] = useState(false);
  
  const [selectedFont, setSelectedFont] = useState("montserrat");
  const [selectedColor, setSelectedColor] = useState("white");
  const [selectedPosition, setSelectedPosition] = useState<"back" | "chest" | "sleeve">("back");
  
  const [textPosition, setTextPosition] = useState({ x: 50, y: 35 });
  const [numberPosition, setNumberPosition] = useState({ x: 50, y: 50 });
  const [sloganPosition, setSloganPosition] = useState({ x: 50, y: 65 });
  
  const [draggedElement, setDraggedElement] = useState<"text" | "number" | "slogan" | null>(null);
  
  const [isSaved, setIsSaved] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerCity, setCustomerCity] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableSizes = ["S", "M", "L", "XL", "XXL"];

  const fonts = [
    { value: "montserrat", label: "Montserrat", style: "font-sans" },
    { value: "roboto", label: "Roboto", style: "font-sans" },
    { value: "playfair", label: "Playfair Display", style: "font-serif" },
    { value: "inter", label: "Inter", style: "font-sans" },
    { value: "lora", label: "Lora", style: "font-serif" },
    { value: "opensans", label: "Open Sans", style: "font-sans" },
    { value: "raleway", label: "Raleway", style: "font-sans" },
    { value: "poppins", label: "Poppins", style: "font-sans" },
  ];

  const colors = [
    { value: "white", label: "Blanc", color: "#FFFFFF" },
    { value: "red", label: "Rouge", color: "#C8102E" },
    { value: "green", label: "Vert", color: "#006233" },
  ];

  const jerseyImages = {
    red: { front: jerseyRedImage, back: backRedImage },
    white: { front: jerseywhiteImage, back: backWhiteImage }
  };

  const currentJerseyImage = selectedPosition === "back" 
    ? jerseyImages[jerseyColor].back 
    : jerseyImages[jerseyColor].front;

  const validatePhone = (phone: string) => {
    const phoneRegex = /^(06|07|05)\d{8}$/;
    if (!phone) {
      setPhoneError('Téléphone requis');
      return false;
    }
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      setPhoneError('Format: 06XXXXXXXX');
      return false;
    }
    setPhoneError('');
    return true;
  };

  const handleMouseDown = (element: "text" | "number" | "slogan") => (e: React.MouseEvent) => {
    setDraggedElement(element);
    setIsSaved(false);
    e.preventDefault();
  };

  const handleTouchStart = (element: "text" | "number" | "slogan") => (e: React.TouchEvent) => {
    setDraggedElement(element);
    setIsSaved(false);
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (draggedElement && previewRef.current) {
      const rect = previewRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      const clampedX = Math.max(10, Math.min(90, x));
      const clampedY = Math.max(10, Math.min(90, y));

      if (draggedElement === "text") setTextPosition({ x: clampedX, y: clampedY });
      if (draggedElement === "number") setNumberPosition({ x: clampedX, y: clampedY });
      if (draggedElement === "slogan") setSloganPosition({ x: clampedX, y: clampedY });
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (draggedElement && previewRef.current && e.touches.length > 0) {
      const touch = e.touches[0];
      const rect = previewRef.current.getBoundingClientRect();
      const x = ((touch.clientX - rect.left) / rect.width) * 100;
      const y = ((touch.clientY - rect.top) / rect.height) * 100;

      const clampedX = Math.max(10, Math.min(90, x));
      const clampedY = Math.max(10, Math.min(90, y));

      if (draggedElement === "text") setTextPosition({ x: clampedX, y: clampedY });
      if (draggedElement === "number") setNumberPosition({ x: clampedX, y: clampedY });
      if (draggedElement === "slogan") setSloganPosition({ x: clampedX, y: clampedY });
    }
  };

  const handleMouseUp = () => {
    setDraggedElement(null);
  };

  const handleTouchEnd = () => {
    setDraggedElement(null);
  };

  useEffect(() => {
    if (draggedElement) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleTouchEnd);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [draggedElement]);

  const capturePreview = async () => {
    if (!previewRef.current) return "";

    try {
      const canvas = await html2canvas(previewRef.current, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        scale: 2,
      });
      return canvas.toDataURL("image/png");
    } catch (error) {
      console.error("Erreur capture:", error);
      return "";
    }
  };

  const handleSaveCustomization = async () => {
    if (!textEnabled && !numberEnabled && !sloganEnabled) {
      toast.error("Activez au moins une personnalisation");
      return;
    }

    if (textEnabled && !customText.trim()) {
      toast.error("Veuillez entrer un nom");
      return;
    }

    if (numberEnabled && !customNumber.trim()) {
      toast.error("Veuillez entrer un numéro");
      return;
    }

    const preview = await capturePreview();
    setPreviewImage(preview);

    const customizationData = {
      jerseyColor,
      selectedSize,
      name: { enabled: textEnabled, text: customText, font: selectedFont, color: selectedColor, position: textPosition },
      number: { enabled: numberEnabled, text: customNumber, font: selectedFont, color: selectedColor, position: numberPosition },
      slogan: { enabled: sloganEnabled, text: customSlogan, font: selectedFont, color: selectedColor, size: "medium", position: sloganPosition },
      selectedPosition,
      previewImage: preview,
    };

    localStorage.setItem("personalization-1", JSON.stringify(customizationData));
    setIsSaved(true);
    toast.success("Personnalisation enregistrée !", {
      description: "Remplissez vos coordonnées pour commander",
      icon: <CheckCircle className="h-4 w-4" />
    });
  };

  const submitOrder = async () => {
    if (!isSaved) {
      toast.error("Enregistrez d'abord votre personnalisation");
      return;
    }

    if (!customerName.trim()) {
      toast.error("Nom requis");
      return;
    }

    if (!validatePhone(customerPhone)) {
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading('Enregistrement de votre commande...', {
      icon: <Loader2 className="h-4 w-4 animate-spin" />
    });

    try {
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      const orderNumber = `CMD-${timestamp}-${random}`;

      let sloganPrice = 0;
      if (sloganEnabled && customSlogan.trim()) {
        sloganPrice = 50;
      }

      const basePrice = 249;
      const totalPrice = basePrice + sloganPrice;

      const orderData = {
        order_number: orderNumber,
        personalization_id: '1',
        customer_name: customerName.trim(),
        customer_phone: customerPhone.replace(/\s/g, ''),
        customer_address: customerAddress.trim() || '',
        customer_city: customerCity.trim() || '',
        
        product_name: 'Maillot CAN 2025 Personnalisé',
        product_price: basePrice,
        product_image_url: currentJerseyImage,
        product_category: 'Maillot',
        product_size: selectedSize,
        
        jersey_color: jerseyColor,
        total_price: totalPrice,
        status: 'pending',
        notes: `Maillot ${jerseyColor === 'red' ? 'Rouge' : 'Blanc'} - Taille: ${selectedSize} - Position: ${selectedPosition}${sloganEnabled ? ' - Avec slogan (+50 DH)' : ''}`,
        
        name_enabled: textEnabled,
        name_text: customText,
        name_font: selectedFont,
        name_color: selectedColor,
        name_position_x: textPosition.x,
        name_position_y: textPosition.y,
        
        number_enabled: numberEnabled,
        number_text: customNumber,
        number_font: selectedFont,
        number_color: selectedColor,
        number_position_x: numberPosition.x,
        number_position_y: numberPosition.y,
        
        slogan_enabled: sloganEnabled,
        slogan_text: customSlogan,
        slogan_font: selectedFont,
        slogan_color: selectedColor,
        slogan_size: 'medium',
        slogan_position_x: sloganPosition.x,
        slogan_position_y: sloganPosition.y,
        
        selected_position: selectedPosition,
        preview_image_url: previewImage,
      };

      const { error } = await supabase.from('orders').insert([orderData]);

      if (error) throw error;

      toast.dismiss(loadingToast);
      toast.success(`Commande ${orderNumber} enregistrée !`, {
        duration: 5000,
        description: `Total: ${totalPrice} DH`,
        icon: <CheckCircle className="h-4 w-4" />
      });

      localStorage.removeItem("personalization-1");

      setTimeout(() => {
        toast.info("Confirmation par téléphone sous 24h", { 
          duration: 5000,
          icon: <Info className="h-4 w-4" />
        });
        navigate('/');
      }, 1500);

    } catch (error: any) {
      toast.dismiss(loadingToast);
      console.error('Erreur commande:', error);
      toast.error("Erreur: " + (error.message || "Veuillez réessayer"));
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const savedData = localStorage.getItem("personalization-1");
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        setJerseyColor(data.jerseyColor || "red");
        setSelectedSize(data.selectedSize || "M");
        setCustomText(data.name?.text || "");
        setCustomNumber(data.number?.text || "");
        setCustomSlogan(data.slogan?.text || "");
        setTextEnabled(data.name?.enabled || false);
        setNumberEnabled(data.number?.enabled || false);
        setSloganEnabled(data.slogan?.enabled || false);
        setSelectedFont(data.name?.font || "montserrat");
        setSelectedColor(data.name?.color || "white");
        setSelectedPosition(data.selectedPosition || "back");
        setTextPosition(data.name?.position || { x: 50, y: 35 });
        setNumberPosition(data.number?.position || { x: 50, y: 50 });
        setSloganPosition(data.slogan?.position || { x: 50, y: 65 });
        setPreviewImage(data.previewImage || "");
        setIsSaved(true);
      } catch (e) {
        console.error("Erreur chargement:", e);
      }
    }
  }, []);

  const getFontClass = (font: string) => {
    const fontMap: { [key: string]: string } = {
      montserrat: "font-sans",
      roboto: "font-sans",
      playfair: "font-serif",
      inter: "font-sans",
      lora: "font-serif",
      opensans: "font-sans",
      raleway: "font-sans",
      poppins: "font-sans",
    };
    return fontMap[font] || "font-sans";
  };

  const getColorValue = (color: string) => {
    const colorMap: { [key: string]: string } = {
      white: "#FFFFFF",
      red: "#C8102E",
      green: "#006233",
    };
    return colorMap[color] || "#FFFFFF";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="container px-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" onClick={() => navigate("/boutique")} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Retour à la boutique
            </Button>
            <h1 className="text-3xl md:text-4xl font-bold">Personnalisez votre maillot</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="shadow-2xl">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Palette className="h-6 w-6 text-primary" />
                  Aperçu en temps réel
                </h2>

                <div 
                  ref={previewRef}
                  className="relative w-full aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden shadow-inner"
                  style={{ touchAction: 'none' }}
                >
                  <img 
                    src={currentJerseyImage}
                    alt={`Maillot ${jerseyColor}`}
                    className="w-full h-full object-contain"
                  />

                  {textEnabled && customText && (
                    <div
                      onMouseDown={handleMouseDown("text")}
                      onTouchStart={handleTouchStart("text")}
                      className={`absolute ${getFontClass(selectedFont)} font-bold text-4xl md:text-5xl cursor-move select-none`}
                      style={{
                        left: `${textPosition.x}%`,
                        top: `${textPosition.y}%`,
                        transform: 'translate(-50%, -50%)',
                        color: getColorValue(selectedColor),
                        textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                        WebkitTextStroke: '1px rgba(0,0,0,0.5)',
                      }}
                    >
                      {customText}
                    </div>
                  )}

                  {numberEnabled && customNumber && (
                    <div
                      onMouseDown={handleMouseDown("number")}
                      onTouchStart={handleTouchStart("number")}
                      className={`absolute ${getFontClass(selectedFont)} font-bold text-6xl md:text-7xl cursor-move select-none`}
                      style={{
                        left: `${numberPosition.x}%`,
                        top: `${numberPosition.y}%`,
                        transform: 'translate(-50%, -50%)',
                        color: getColorValue(selectedColor),
                        textShadow: '3px 3px 6px rgba(0,0,0,0.8)',
                        WebkitTextStroke: '1.5px rgba(0,0,0,0.5)',
                      }}
                    >
                      {customNumber}
                    </div>
                  )}

                  {sloganEnabled && customSlogan && (
                    <div
                      onMouseDown={handleMouseDown("slogan")}
                      onTouchStart={handleTouchStart("slogan")}
                      className={`absolute ${getFontClass(selectedFont)} font-semibold text-2xl md:text-3xl cursor-move select-none`}
                      style={{
                        left: `${sloganPosition.x}%`,
                        top: `${sloganPosition.y}%`,
                        transform: 'translate(-50%, -50%)',
                        color: getColorValue(selectedColor),
                        textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                        WebkitTextStroke: '0.5px rgba(0,0,0,0.5)',
                      }}
                    >
                      {customSlogan}
                    </div>
                  )}
                </div>

                <p className="text-sm text-muted-foreground mt-4 text-center flex items-center justify-center gap-1">
                  <Info className="h-4 w-4" />
                  {window.innerWidth > 768 
                    ? "Glissez les éléments pour les déplacer • Molette pour zoomer" 
                    : "Glissez les éléments pour les déplacer"}
                </p>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="shadow-lg">
                <CardContent className="p-6 space-y-6">
                  <div>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Palette className="h-5 w-5" />
                      Couleur du maillot
                    </h3>
                    <RadioGroup value={jerseyColor} onValueChange={(value: "red" | "white") => {setJerseyColor(value); setIsSaved(false);}}>
                      <div className="grid grid-cols-2 gap-4">
                        <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${jerseyColor === "red" ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300"}`}>
                          <RadioGroupItem value="red" />
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-[#C8102E] border-2 border-gray-300"></div>
                            <span className="font-semibold">Rouge</span>
                          </div>
                        </label>
                        <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${jerseyColor === "white" ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300"}`}>
                          <RadioGroupItem value="white" />
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-300"></div>
                            <span className="font-semibold">Blanc</span>
                          </div>
                        </label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Ruler className="h-5 w-5" />
                      Taille du maillot
                    </h3>
                    <div className="grid grid-cols-5 gap-2">
                      {availableSizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => {setSelectedSize(size); setIsSaved(false);}}
                          className={`px-4 py-3 rounded-lg border-2 font-bold transition-all ${
                            selectedSize === size
                              ? 'border-primary bg-primary text-white scale-105 shadow-lg'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Taille sélectionnée : <span className="font-bold text-primary">{selectedSize}</span>
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Position
                    </h3>
                    <RadioGroup value={selectedPosition} onValueChange={(value: "back" | "chest" | "sleeve") => {setSelectedPosition(value); setIsSaved(false);}}>
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { value: "back", label: "Dos", icon: <MapPin className="h-5 w-5" /> },
                          { value: "chest", label: "Poitrine", icon: <MapPin className="h-5 w-5" /> },
                          { value: "sleeve", label: "Manche", icon: <MapPin className="h-5 w-5" /> },
                        ].map((pos) => (
                          <label key={pos.value} className={`flex flex-col items-center gap-2 p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedPosition === pos.value ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300"}`}>
                            <RadioGroupItem value={pos.value} />
                            {pos.icon}
                            <span className="font-semibold text-sm">{pos.label}</span>
                          </label>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-4 border-t pt-6">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="text-toggle" className="text-lg font-bold flex items-center gap-2">
                        <Edit3 className="h-5 w-5" />
                        Nom
                      </Label>
                      <input type="checkbox" id="text-toggle" checked={textEnabled} onChange={(e) => {setTextEnabled(e.target.checked); setIsSaved(false);}} className="w-5 h-5" />
                    </div>
                    {textEnabled && (
                      <Input value={customText} onChange={(e) => {setCustomText(e.target.value.slice(0, 15)); setIsSaved(false);}} placeholder="Ex: ZIYECH" maxLength={15} className="text-lg" />
                    )}
                  </div>

                  <div className="space-y-4 border-t pt-6">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="number-toggle" className="text-lg font-bold flex items-center gap-2">
                        <Hash className="h-5 w-5" />
                        Numéro
                      </Label>
                      <input type="checkbox" id="number-toggle" checked={numberEnabled} onChange={(e) => {setNumberEnabled(e.target.checked); setIsSaved(false);}} className="w-5 h-5" />
                    </div>
                    {numberEnabled && (
                      <Input type="number" min="1" max="99" value={customNumber} onChange={(e) => {const val = e.target.value; if (!val || (parseInt(val) >= 1 && parseInt(val) <= 99)) {setCustomNumber(val); setIsSaved(false);}}} placeholder="Ex: 7" className="text-lg" />
                    )}
                  </div>

                 

                  <div className="space-y-4 border-t pt-6">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <Type className="h-5 w-5" />
                      Police d'écriture
                    </h3>
                    <RadioGroup value={selectedFont} onValueChange={(value) => {setSelectedFont(value); setIsSaved(false);}}>
                      <div className="grid grid-cols-2 gap-3">
                        {fonts.map((font) => (
                          <label key={font.value} className={`flex items-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition-all ${selectedFont === font.value ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300"}`}>
                            <RadioGroupItem value={font.value} />
                            <span className={`${font.style} font-semibold`}>{font.label}</span>
                          </label>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-4 border-t pt-6">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <Palette className="h-5 w-5" />
                      Couleur du texte
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                      {colors.map((color) => (
                        <button
                          key={color.value}
                          onClick={() => {setSelectedColor(color.value); setIsSaved(false);}}
                          className={`flex flex-col items-center gap-2 p-3 border-2 rounded-lg transition-all ${selectedColor === color.value ? "border-primary scale-105 shadow-lg" : "border-gray-200 hover:border-gray-300"}`}
                        >
                          <div className="w-12 h-12 rounded-full border-2 border-gray-300" style={{ backgroundColor: color.color, boxShadow: color.value === 'white' ? 'inset 0 0 0 1px #e5e7eb' : 'none' }}></div>
                          <span className="text-sm font-semibold">{color.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg bg-gradient-to-br from-primary/5 to-secondary/5">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Coins className="h-6 w-6" />
                    Récapitulatif
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-lg">
                      <span>Maillot personnalisé</span>
                      <span className="font-bold">249 DH</span>
                    </div>
                    {sloganEnabled && customSlogan.trim() && (
                      <div className="flex justify-between text-lg text-green-600">
                        <span>Slogan personnalisé</span>
                        <span className="font-bold">+50 DH</span>
                      </div>
                    )}
                    <div className="border-t-2 pt-3 flex justify-between text-2xl font-bold text-primary">
                      <span>Total</span>
                      <span>{sloganEnabled && customSlogan.trim() ? 349 : 249} DH</span>
                    </div>
                  </div>

                  <Button onClick={handleSaveCustomization} disabled={isSaved} size="lg" className="w-full mt-6 shadow-lg gap-2">
                    <Save className="h-5 w-5" />
                    {isSaved ? "Enregistré" : "Enregistrer ma personnalisation"}
                  </Button>
                </CardContent>
              </Card>

              {isSaved && (
                <Card className="shadow-lg border-2 border-primary animate-in fade-in slide-in-from-bottom">
                  <CardContent className="p-6 space-y-4">
                    <h3 className="text-2xl font-bold flex items-center gap-2">
                      <ClipboardList className="h-6 w-6" />
                      Vos coordonnées
                    </h3>
                    
                    <div>
                      <Label>Nom complet *</Label>
                      <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Votre nom" className="mt-2" />
                    </div>

                    <div>
                      <Label>Téléphone *</Label>
                      <Input type="tel" value={customerPhone} onChange={(e) => {setCustomerPhone(e.target.value); if (phoneError) validatePhone(e.target.value);}} placeholder="Votre numéro de téléphone" className={`mt-2 ${phoneError ? 'border-red-500' : ''}`} />
                      {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
                    </div>

                    <div>
                      <Label>Ville</Label>
                      <Input value={customerCity} onChange={(e) => setCustomerCity(e.target.value)} placeholder="Votre ville" className="mt-2" />
                    </div>

                    <div>
                      <Label>Adresse</Label>
                      <Textarea value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} placeholder="Votre adresse" rows={2} className="mt-2 resize-none" />
                    </div>

                    <Button onClick={submitOrder} disabled={!customerName || !customerPhone || isSubmitting} size="lg" className="w-full shadow-lg gap-2">
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="h-5 w-5" />
                          Commander maintenant
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Personnalisation;
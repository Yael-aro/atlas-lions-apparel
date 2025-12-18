import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, 
  Save, 
  ShoppingCart, 
  CheckCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  X
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

  const [showOrderModal, setShowOrderModal] = useState(false);

  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    base: true,
    text: false,
    style: false,
    order: false
  });

  const availableSizes = ["S", "M", "L", "XL", "XXL"];

  const fonts = [
    { value: "montserrat", label: "Montserrat" },
    { value: "roboto", label: "Roboto" },
    { value: "inter", label: "Inter" },
    { value: "poppins", label: "Poppins" },
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

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

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
    // Si déjà enregistré, ouvrir directement le modal
    if (isSaved) {
      setShowOrderModal(true);
      return;
    }

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
    setShowOrderModal(true); // Ouvrir le modal au lieu de l'accordéon
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
    const loadingToast = toast.loading('Enregistrement de votre commande...');

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
      setShowOrderModal(false);

      setTimeout(() => {
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
    <div className="min-h-screen flex flex-col bg-[#2b2b2b]">
      <Header />
      
      {/* Barre d'outils supérieure */}
      <div className="bg-[#1e1e1e] border-b border-gray-700 px-3 lg:px-4 py-2 lg:py-3">
        <div className="container max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 lg:gap-4">
            <button 
              onClick={() => navigate("/boutique")} 
              className="flex items-center gap-1 lg:gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-xs lg:text-sm font-medium hidden sm:inline">Retour</span>
            </button>
            <div className="h-6 w-px bg-gray-600 hidden sm:block"></div>
            <h1 className="text-sm lg:text-lg font-semibold text-white">Personnalisation</h1>
          </div>
          
          <div className="flex items-center gap-2 lg:gap-3">
            <div className="text-right">
              <div className="text-[10px] lg:text-xs text-gray-400">Total</div>
              <div className="text-sm lg:text-lg font-bold text-primary">
                {sloganEnabled && customSlogan.trim() ? 349 : 249} DH
              </div>
            </div>
            {/* Bouton desktop */}
            <button
              onClick={handleSaveCustomization}
              className={`hidden lg:flex px-2 lg:px-4 py-1.5 lg:py-2 rounded-lg font-medium text-xs lg:text-sm items-center gap-1 lg:gap-2 transition-all ${
                isSaved
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-primary text-white hover:bg-primary/90'
              }`}
            >
              {isSaved ? (
                <>
                  <ShoppingCart className="h-3 lg:h-4 w-3 lg:w-4" />
                  <span>Commander</span>
                </>
              ) : (
                <>
                  <Save className="h-3 lg:h-4 w-3 lg:w-4" />
                  <span>Enregistrer</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Panneau latéral */}
        <div className="w-full lg:w-80 bg-[#252525] border-b lg:border-r lg:border-b-0 border-gray-700 overflow-y-auto max-h-[40vh] lg:max-h-none pb-20 lg:pb-0">
          <div className="p-3 lg:p-4 space-y-2">
            
            {/* Section: Configuration de base */}
            <div className="bg-[#1e1e1e] rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection('base')}
                className="w-full flex items-center justify-between px-3 lg:px-4 py-2.5 lg:py-3 text-white hover:bg-[#2b2b2b] transition-colors"
              >
                <span className="font-medium text-xs lg:text-sm">Configuration de base</span>
                {openSections.base ? <ChevronUp className="h-3 lg:h-4 w-3 lg:w-4" /> : <ChevronDown className="h-3 lg:h-4 w-3 lg:w-4" />}
              </button>
              
              {openSections.base && (
                <div className="p-3 lg:p-4 space-y-3 lg:space-y-4 border-t border-gray-700">
                  <div>
                    <Label className="text-xs text-gray-400 mb-2 block">COULEUR</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {setJerseyColor("red"); setIsSaved(false);}}
                        className={`py-2 px-3 rounded text-sm font-medium transition-all ${
                          jerseyColor === "red"
                            ? 'bg-primary text-white'
                            : 'bg-[#2b2b2b] text-gray-300 hover:bg-[#333]'
                        }`}
                      >
                        Rouge
                      </button>
                      <button
                        onClick={() => {setJerseyColor("white"); setIsSaved(false);}}
                        className={`py-2 px-3 rounded text-sm font-medium transition-all ${
                          jerseyColor === "white"
                            ? 'bg-primary text-white'
                            : 'bg-[#2b2b2b] text-gray-300 hover:bg-[#333]'
                        }`}
                      >
                        Blanc
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs text-gray-400 mb-2 block">TAILLE</Label>
                    <div className="grid grid-cols-5 gap-1.5">
                      {availableSizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => {setSelectedSize(size); setIsSaved(false);}}
                          className={`py-2 rounded text-sm font-semibold transition-all ${
                            selectedSize === size
                              ? 'bg-primary text-white'
                              : 'bg-[#2b2b2b] text-gray-300 hover:bg-[#333]'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs text-gray-400 mb-2 block">POSITION</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: "back", label: "Dos" },
                        { value: "chest", label: "Poitrine" },
                        { value: "sleeve", label: "Manche" }
                      ].map((pos) => (
                        <button
                          key={pos.value}
                          onClick={() => {setSelectedPosition(pos.value as any); setIsSaved(false);}}
                          className={`py-2 rounded text-xs font-medium transition-all ${
                            selectedPosition === pos.value
                              ? 'bg-primary text-white'
                              : 'bg-[#2b2b2b] text-gray-300 hover:bg-[#333]'
                          }`}
                        >
                          {pos.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Section: Texte et numéro */}
            <div className="bg-[#1e1e1e] rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection('text')}
                className="w-full flex items-center justify-between px-3 lg:px-4 py-2.5 lg:py-3 text-white hover:bg-[#2b2b2b] transition-colors"
              >
                <span className="font-medium text-xs lg:text-sm">Texte & Numéro</span>
                {openSections.text ? <ChevronUp className="h-3 lg:h-4 w-3 lg:w-4" /> : <ChevronDown className="h-3 lg:h-4 w-3 lg:w-4" />}
              </button>
              
              {openSections.text && (
                <div className="p-3 lg:p-4 space-y-3 lg:space-y-4 border-t border-gray-700">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-xs text-gray-400">NOM</Label>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={textEnabled} 
                          onChange={(e) => {setTextEnabled(e.target.checked); setIsSaved(false);}}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-600 rounded-full peer peer-checked:bg-primary peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                      </label>
                    </div>
                    {textEnabled && (
                      <Input 
                        value={customText} 
                        onChange={(e) => {setCustomText(e.target.value.slice(0, 15)); setIsSaved(false);}} 
                        placeholder="Ex: ZIYECH" 
                        maxLength={15}
                        className="bg-[#2b2b2b] border-gray-600 text-white placeholder:text-gray-500"
                      />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-xs text-gray-400">NUMÉRO</Label>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={numberEnabled} 
                          onChange={(e) => {setNumberEnabled(e.target.checked); setIsSaved(false);}}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-600 rounded-full peer peer-checked:bg-primary peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                      </label>
                    </div>
                    {numberEnabled && (
                      <Input 
                        type="number" 
                        min="1" 
                        max="99" 
                        value={customNumber} 
                        onChange={(e) => {
                          const val = e.target.value; 
                          if (!val || (parseInt(val) >= 1 && parseInt(val) <= 99)) {
                            setCustomNumber(val); 
                            setIsSaved(false);
                          }
                        }} 
                        placeholder="Ex: 7"
                        className="bg-[#2b2b2b] border-gray-600 text-white placeholder:text-gray-500"
                      />
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Section: Style */}
            <div className="bg-[#1e1e1e] rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection('style')}
                className="w-full flex items-center justify-between px-3 lg:px-4 py-2.5 lg:py-3 text-white hover:bg-[#2b2b2b] transition-colors"
              >
                <span className="font-medium text-xs lg:text-sm">Style</span>
                {openSections.style ? <ChevronUp className="h-3 lg:h-4 w-3 lg:w-4" /> : <ChevronDown className="h-3 lg:h-4 w-3 lg:w-4" />}
              </button>
              
              {openSections.style && (
                <div className="p-3 lg:p-4 space-y-3 lg:space-y-4 border-t border-gray-700">
                  <div>
                    <Label className="text-xs text-gray-400 mb-2 block">POLICE</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {fonts.map((font) => (
                        <button
                          key={font.value}
                          onClick={() => {setSelectedFont(font.value); setIsSaved(false);}}
                          className={`py-2 px-2 rounded text-xs font-medium transition-all ${
                            selectedFont === font.value
                              ? 'bg-primary text-white'
                              : 'bg-[#2b2b2b] text-gray-300 hover:bg-[#333]'
                          }`}
                        >
                          {font.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs text-gray-400 mb-2 block">COULEUR TEXTE</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {colors.map((color) => (
                        <button
                          key={color.value}
                          onClick={() => {setSelectedColor(color.value); setIsSaved(false);}}
                          className={`py-2 rounded text-xs font-medium transition-all ${
                            selectedColor === color.value
                              ? 'bg-primary text-white'
                              : 'bg-[#2b2b2b] text-gray-300 hover:bg-[#333]'
                          }`}
                        >
                          {color.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Zone d'aperçu principale */}
        <div className="flex-1 flex items-center justify-center p-4 lg:p-8 pb-24 lg:pb-8 overflow-auto bg-[#2b2b2b]">
          <div className="w-full max-w-2xl">
            <div 
              ref={previewRef}
              className="relative w-full aspect-square bg-[#1e1e1e] rounded-lg overflow-hidden border border-gray-700"
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
                  className={`absolute ${getFontClass(selectedFont)} font-bold text-3xl sm:text-4xl md:text-5xl cursor-move select-none`}
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
                  className={`absolute ${getFontClass(selectedFont)} font-bold text-5xl sm:text-6xl md:text-7xl cursor-move select-none`}
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
                  className={`absolute ${getFontClass(selectedFont)} font-semibold text-xl sm:text-2xl md:text-3xl cursor-move select-none`}
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
            <p className="text-xs text-gray-400 mt-3 lg:mt-4 text-center">
              Glissez les éléments pour les repositionner
            </p>
          </div>
        </div>
      </main>

      {/* Modal de commande */}
      {showOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#1e1e1e] rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-gray-700 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700 sticky top-0 bg-[#1e1e1e]">
              <h3 className="text-lg font-semibold text-white">Finaliser la commande</h3>
              <button
                onClick={() => setShowOrderModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 space-y-4">
              {/* Récap */}
              <div className="bg-[#252525] rounded-lg p-4 border border-gray-700">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Maillot personnalisé</span>
                  <span className="text-white font-semibold">249 DH</span>
                </div>
                {sloganEnabled && customSlogan.trim() && (
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Slogan personnalisé</span>
                    <span className="text-green-400 font-semibold">+50 DH</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 border-t border-gray-700">
                  <span className="text-base font-semibold text-white">Total</span>
                  <span className="text-xl font-bold text-primary">
                    {sloganEnabled && customSlogan.trim() ? 349 : 249} DH
                  </span>
                </div>
              </div>

              {/* Formulaire */}
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-gray-400 mb-1.5 block">NOM COMPLET *</Label>
                  <Input 
                    value={customerName} 
                    onChange={(e) => setCustomerName(e.target.value)} 
                    placeholder="Votre nom"
                    className="bg-[#2b2b2b] border-gray-600 text-white placeholder:text-gray-500"
                  />
                </div>

                <div>
                  <Label className="text-xs text-gray-400 mb-1.5 block">TÉLÉPHONE *</Label>
                  <Input 
                    type="tel" 
                    value={customerPhone} 
                    onChange={(e) => {
                      setCustomerPhone(e.target.value); 
                      if (phoneError) validatePhone(e.target.value);
                    }} 
                    placeholder="06XXXXXXXX"
                    className={`bg-[#2b2b2b] border-gray-600 text-white placeholder:text-gray-500 ${phoneError ? 'border-red-500' : ''}`}
                  />
                  {phoneError && <p className="text-red-400 text-xs mt-1">{phoneError}</p>}
                </div>

                <div>
                  <Label className="text-xs text-gray-400 mb-1.5 block">VILLE</Label>
                  <Input 
                    value={customerCity} 
                    onChange={(e) => setCustomerCity(e.target.value)} 
                    placeholder="Votre ville"
                    className="bg-[#2b2b2b] border-gray-600 text-white placeholder:text-gray-500"
                  />
                </div>

                <div>
                  <Label className="text-xs text-gray-400 mb-1.5 block">ADRESSE</Label>
                  <Textarea 
                    value={customerAddress} 
                    onChange={(e) => setCustomerAddress(e.target.value)} 
                    placeholder="Votre adresse" 
                    rows={2}
                    className="bg-[#2b2b2b] border-gray-600 text-white placeholder:text-gray-500 resize-none"
                  />
                </div>
              </div>

              {/* Bouton commander */}
              <button
                onClick={submitOrder}
                disabled={!customerName || !customerPhone || isSubmitting}
                className="w-full py-3 bg-primary text-white rounded-lg font-semibold text-sm flex items-center justify-center gap-2 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
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
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bouton flottant mobile pour enregistrer */}
      <button
        onClick={handleSaveCustomization}
        className={`lg:hidden fixed bottom-6 right-6 z-40 p-4 rounded-full shadow-2xl flex items-center gap-2 font-semibold transition-all ${
          isSaved
            ? 'bg-green-600 text-white hover:bg-green-700'
            : 'bg-primary text-white hover:bg-primary/90 active:scale-95'
        }`}
      >
        {isSaved ? (
          <>
            <ShoppingCart className="h-5 w-5" />
            <span className="text-sm">Commander</span>
          </>
        ) : (
          <>
            <Save className="h-5 w-5" />
            <span className="text-sm">Enregistrer</span>
          </>
        )}
      </button>

      <Footer />
    </div>
  );
};

export default Personnalisation;
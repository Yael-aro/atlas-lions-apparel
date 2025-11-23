import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { ShoppingCart, Sparkles } from "lucide-react";
import jerseyImage from "@/assets/jersey-red.jpg";

const Personnalisation = () => {
  const [customText, setCustomText] = useState("MAROC");
  const [customNumber, setCustomNumber] = useState("10");
  const [selectedFont, setSelectedFont] = useState("montserrat");
  const [selectedColor, setSelectedColor] = useState("gold");
  const [selectedPosition, setSelectedPosition] = useState("back");

  const fonts = [
    { value: "montserrat", label: "Montserrat Bold" },
    { value: "athletic", label: "Athletic" },
    { value: "jersey", label: "Jersey M54" },
    { value: "sports", label: "Sports World" },
    { value: "freshman", label: "Freshman" },
    { value: "bebas", label: "Bebas Neue" },
    { value: "oswald", label: "Oswald" },
    { value: "roboto", label: "Roboto Black" },
    { value: "times", label: "Times New Roman" },
    { value: "georgia", label: "Georgia Bold" },
    { value: "playfair", label: "Playfair Display" },
    { value: "impact", label: "Impact" },
    { value: "brush", label: "Brush Script" },
    { value: "permanent", label: "Permanent Marker" },
    { value: "cairo", label: "Cairo Bold (عربي)" },
    { value: "tajawal", label: "Tajawal (عربي)" },
    { value: "amiri", label: "Amiri (عربي)" },
  ];

  const colors = [
    { value: "gold", label: "Or", hex: "#FFD700" },
    { value: "white", label: "Blanc", hex: "#FFFFFF" },
    { value: "black", label: "Noir", hex: "#000000" },
    { value: "red", label: "Rouge", hex: "#C1272D" },
    { value: "green", label: "Vert", hex: "#006233" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Page Header */}
        <section className="gradient-primary py-16 text-white">
          <div className="container px-4">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold">Personnalisation Premium</h1>
            </div>
            <p className="text-xl text-white/90 text-center">
              Créez votre maillot unique avec 15+ polices et prévisualisation temps réel
            </p>
          </div>
        </section>

        {/* Personnalisation Interface */}
        <section className="py-12">
          <div className="container px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
              
              {/* Preview */}
              <Card className="shadow-elegant">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-6 text-center">Prévisualisation</h2>
                  <div className="relative aspect-square max-w-md mx-auto">
                    <img 
                      src={jerseyImage} 
                      alt="Maillot" 
                      className="w-full h-full object-contain"
                    />
                    {/* Text Overlay Preview */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center" style={{ 
                        fontFamily: selectedFont === "cairo" || selectedFont === "tajawal" || selectedFont === "amiri" ? "Amiri" : "Montserrat",
                        color: colors.find(c => c.value === selectedColor)?.hex,
                        fontSize: "2rem",
                        fontWeight: "bold",
                        textShadow: "2px 2px 4px rgba(0,0,0,0.5)"
                      }}>
                        {customText && <div>{customText}</div>}
                        {customNumber && <div className="text-5xl mt-2">{customNumber}</div>}
                      </div>
                    </div>
                  </div>
                  <p className="text-center text-sm text-muted-foreground mt-4">
                    Position: {selectedPosition === "back" ? "Dos" : selectedPosition === "chest" ? "Poitrine" : "Manche"}
                  </p>
                </CardContent>
              </Card>

              {/* Options */}
              <div className="space-y-6">
                <Card className="shadow-elegant">
                  <CardContent className="p-6 space-y-6">
                    <h2 className="text-2xl font-bold">Options de personnalisation</h2>

                    {/* Texte */}
                    <div className="space-y-2">
                      <Label htmlFor="customText">Texte personnalisé (max 15 caractères)</Label>
                      <Input
                        id="customText"
                        value={customText}
                        onChange={(e) => setCustomText(e.target.value.slice(0, 15))}
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
                          const val = parseInt(e.target.value);
                          if (val >= 1 && val <= 99) setCustomNumber(e.target.value);
                        }}
                        placeholder="10"
                      />
                    </div>

                    {/* Police */}
                    <div className="space-y-2">
                      <Label htmlFor="font">Police de caractères</Label>
                      <Select value={selectedFont} onValueChange={setSelectedFont}>
                        <SelectTrigger id="font">
                          <SelectValue placeholder="Sélectionner une police" />
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

                    {/* Couleur */}
                    <div className="space-y-2">
                      <Label>Couleur du texte</Label>
                      <RadioGroup value={selectedColor} onValueChange={setSelectedColor}>
                        <div className="grid grid-cols-5 gap-2">
                          {colors.map((color) => (
                            <div key={color.value} className="flex flex-col items-center">
                              <RadioGroupItem
                                value={color.value}
                                id={color.value}
                                className="sr-only"
                              />
                              <Label
                                htmlFor={color.value}
                                className={`w-12 h-12 rounded-full cursor-pointer border-2 transition-smooth ${
                                  selectedColor === color.value ? 'border-primary scale-110' : 'border-border'
                                }`}
                                style={{ backgroundColor: color.hex }}
                              />
                              <span className="text-xs mt-1">{color.label}</span>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>

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

                    {/* Prix */}
                    <div className="pt-4 border-t border-border">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-semibold">Prix total:</span>
                        <span className="text-2xl font-bold text-primary">
                          {customText && customNumber ? "230 DH" : customText || customNumber ? "200 DH" : "180 DH"}
                        </span>
                      </div>
                      <Button className="w-full shadow-elegant" size="lg">
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        Ajouter au panier
                      </Button>
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
                      <li>✓ Nom personnalisé: +30 DH</li>
                      <li>✓ Numéro: +20 DH</li>
                      <li>✓ Nom + Numéro: +50 DH</li>
                      <li>✓ Prévisualisation en temps réel</li>
                      <li>✓ Qualité professionnelle garantie</li>
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

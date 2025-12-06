import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Package, Search, CheckCircle, Clock, Truck } from "lucide-react";
import { useState } from "react";

const Suivi = () => {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [showResults, setShowResults] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      setShowResults(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Page Header */}
        <section className="gradient-primary py-16 text-white">
          <div className="container px-4">
            <div className="flex items-center justify-center mb-4">
              <Package className="h-8 w-8 mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold">Suivi de commande</h1>
            </div>
            <p className="text-xl text-white/90 text-center">
              Suivez votre commande en temps réel avec votre numéro de suivi
            </p>
          </div>
        </section>

        {/* Tracking Form */}
        <section className="py-12">
          <div className="container px-4">
            <Card className="max-w-2xl mx-auto shadow-elegant">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6 text-center">
                  Entrez votre numéro de suivi
                </h2>
                
                <form onSubmit={handleTrack} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="tracking">Numéro de suivi</Label>
                    <Input
                      id="tracking"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="CAN2025XXXXXX"
                      className="text-lg"
                    />
                    <p className="text-sm text-muted-foreground">
                      Le numéro de suivi vous a été envoyé par WhatsApp ou Email après votre commande
                    </p>
                  </div>

                  <Button type="submit" className="w-full shadow-elegant" size="lg">
                    <Search className="mr-2 h-5 w-5" />
                    Suivre ma commande
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Mock Results */}
            {showResults && (
              <div className="max-w-2xl mx-auto mt-8 space-y-6">
                <Card className="shadow-elegant">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-bold">Commande #{trackingNumber}</h3>
                        <p className="text-muted-foreground">Date: 15 Janvier 2025</p>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-secondary text-secondary-foreground">
                          <Truck className="h-4 w-4 mr-1" />
                          En cours de livraison
                        </span>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <div className="ml-4 flex-1">
                          <h4 className="font-semibold">Commande confirmée</h4>
                          <p className="text-sm text-muted-foreground">15 Jan 2025, 10:30</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <div className="ml-4 flex-1">
                          <h4 className="font-semibold">En préparation</h4>
                          <p className="text-sm text-muted-foreground">15 Jan 2025, 14:00</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                          <Truck className="h-6 w-6 text-secondary-foreground" />
                        </div>
                        <div className="ml-4 flex-1">
                          <h4 className="font-semibold">Expédiée</h4>
                          <p className="text-sm text-muted-foreground">16 Jan 2025, 09:00</p>
                          <p className="text-sm text-primary font-semibold mt-1">
                            Livraison estimée: 18 Janvier 2025
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start opacity-50">
                        <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                          <Clock className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="ml-4 flex-1">
                          <h4 className="font-semibold text-muted-foreground">Livrée</h4>
                          <p className="text-sm text-muted-foreground">En attente</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Order Details */}
                <Card className="shadow-elegant">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">Détails de la commande</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Produit:</span>
                        <span className="font-semibold">Maillot Maroc Premium (L)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Personnalisation:</span>
                        <span className="font-semibold">Votre nom 10</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Adresse</span>
                        <span className="font-semibold text-right">votre ville </span>
                      </div>
                      <div className="flex justify-between text-lg pt-3 border-t border-border">
                        <span className="font-bold">Total payé:</span>
                        <span className="font-bold text-primary">220 DH</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Suivi;

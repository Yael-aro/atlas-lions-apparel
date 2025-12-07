import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Truck, MapPin, Clock, Package, Bold } from "lucide-react";
import charikaImage from "@/assets/charika.jpg";

const Livraison = () => {
  const zones = [
    {
      name: "Grandes villes",
      cities: "Casablanca, Rabat, Marrakech, Fès, Tanger, Agadir, Meknès, Oujda, Kenitra, Tétouan",
      delay: "2-3 jours ouvrables",
      price: "GRATUIT",
    },
    {
      name: "Autres villes",
      cities: "Safi, El Jadida, Nador, Béni Mellal, Mohammedia, Khouribga, Larache...",
      delay: "3-5 jours ouvrables",
      price: "GRATUIT",
    },
    {
      name: "Zones rurales",
      cities: "Toutes les communes rurales du Maroc",
      delay: "5-7 jours ouvrables",
      price: "30-40 DH",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Page Header */}
        <section className="gradient-primary py-16 text-white">
          <div className="container px-4">
            <div className="flex items-center justify-center mb-4">
              <Truck className="h-8 w-8 mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold">Livraison</h1>
            </div>
            <p className="text-xl text-white/90 text-center">
              Livraison rapide et sécurisée dans tout le Maroc
            </p>
          </div>
        </section>

        {/* Livraison Info */}
        <section className="py-12">
          <div className="container px-4">
            
            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Truck className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Livraison rapide</h3>
                  <p className="text-sm text-muted-foreground">2-7 jours selon la zone</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="h-6 w-6 text-secondary" />
                  </div>
                  <h3 className="font-semibold mb-2">Tout le Maroc</h3>
                  <p className="text-sm text-muted-foreground">Toutes les régions couvertes</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <h3 className="font-semibold mb-2">Suivi en ligne</h3>
                  <p className="text-sm text-muted-foreground">Suivez votre colis en temps réel</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Délais garantis</h3>
                  <p className="text-sm text-muted-foreground">Respect des délais annoncés</p>
                </CardContent>
              </Card>
            </div>

            {/* Zones & Tarifs */}
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">Zones et tarifs de livraison</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {zones.map((zone, idx) => (
                  <Card key={idx} className="shadow-elegant">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-4 text-primary">{zone.name}</h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-semibold text-muted-foreground mb-1">Villes incluses:</p>
                          <p className="text-sm">{zone.cities}</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-muted-foreground mb-1">Délai:</p>
                          <p className="text-sm font-bold">{zone.delay}</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-muted-foreground mb-1">Tarif:</p>
                          <p className="text-lg font-bold text-primary">{zone.price}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Process */}
              <Card className="shadow-elegant">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-6">Comment fonctionne la livraison ?</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 text-primary-foreground font-bold">
                        1
                      </div>
                      <div className="ml-4">
                        <h3 className="font-semibold mb-1">Passez votre commande</h3>
                        <p className="text-muted-foreground">
                          Finalisez votre commande via WhatsApp ou Email avec vos informations de livraison complètes.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 text-primary-foreground font-bold">
                        2
                      </div>
                      <div className="ml-4">
                        <h3 className="font-semibold mb-1">Confirmation et préparation</h3>
                        <p className="text-muted-foreground">
                          Nous validons votre commande et commençons la préparation. Vous recevez un numéro de suivi.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 text-primary-foreground font-bold">
                        3
                      </div>
                      <div className="ml-4">
                        <h3 className="font-semibold mb-1">Expédition</h3>
                        <p className="text-muted-foreground">
                          Votre colis est confié à nos partenaires de livraison 
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0 text-secondary-foreground font-bold">
                        4
                      </div>
                      <div className="ml-4">
                        <h3 className="font-semibold mb-1">Réception</h3>
                        <p className="text-muted-foreground">
                          Vous recevez votre commande à l'adresse indiquée. Paiement possible à la livraison.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Partners */}
              <Card className="mt-8 bg-muted/30">
                <CardContent className="p-8">
                  <h2 className="text-xl font-bold mb-4 text-center">Nos partenaires de livraison</h2>
                  <div className="flex flex-wrap justify-center gap-8 text-muted-foreground">
                    <img src={charikaImage} alt="Charika Logo" className="h-12 object-contain" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Livraison;

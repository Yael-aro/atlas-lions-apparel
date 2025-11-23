import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, FileText } from "lucide-react";

const Conditions = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Page Header */}
        <section className="gradient-secondary py-16 text-white">
          <div className="container px-4">
            <div className="flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold">Conditions de vente</h1>
            </div>
            <p className="text-xl text-white/90 text-center">
              Conditions générales et mentions légales
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="container px-4">
            <div className="max-w-4xl mx-auto space-y-8">
              
              {/* Disclaimer Important */}
              <Card className="border-accent bg-accent/5">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <AlertCircle className="h-6 w-6 text-accent-foreground flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-lg mb-2">Avertissement Important</h3>
                      <p className="text-sm leading-relaxed">
                        Les produits vendus sur ce site sont des articles de haute qualité inspirés des équipes nationales. 
                        <strong> Ils ne sont pas affiliés, approuvés ou sponsorisés par la CAF (Confédération Africaine de Football), 
                        la FRMF (Fédération Royale Marocaine de Football) ou toute autre organisation officielle.</strong> Ce sont 
                        des produits de supporter créés avec des matériaux premium pour les fans passionnés.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sections */}
              <Card>
                <CardContent className="p-8 space-y-6">
                  <section>
                    <h2 className="text-2xl font-bold mb-4 flex items-center">
                      <span className="w-2 h-8 bg-primary rounded mr-3"></span>
                      1. Commandes
                    </h2>
                    <div className="space-y-3 text-muted-foreground">
                      <p>
                        Les commandes sont effectuées via WhatsApp ou Email après sélection des produits sur notre site.
                      </p>
                      <p>
                        Toute commande vaut acceptation des présentes conditions générales de vente.
                      </p>
                      <p>
                        Les modifications de commande sont possibles dans les 2 heures suivant la confirmation, sous réserve 
                        que la commande ne soit pas déjà en préparation.
                      </p>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold mb-4 flex items-center">
                      <span className="w-2 h-8 bg-primary rounded mr-3"></span>
                      2. Prix et Paiement
                    </h2>
                    <div className="space-y-3 text-muted-foreground">
                      <p>
                        Tous les prix sont indiqués en Dirhams marocains (DH) et incluent la TVA.
                      </p>
                      <p>
                        Les frais de livraison sont calculés selon la zone de destination et ajoutés au montant total.
                      </p>
                      <p>
                        <strong>Modes de paiement acceptés :</strong>
                      </p>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Paiement à la livraison (cash)</li>
                        <li>Virement bancaire (coordonnées communiquées après validation de commande)</li>
                      </ul>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold mb-4 flex items-center">
                      <span className="w-2 h-8 bg-primary rounded mr-3"></span>
                      3. Livraison
                    </h2>
                    <div className="space-y-3 text-muted-foreground">
                      <p>
                        Nous livrons dans tout le Maroc via nos partenaires de confiance (Amana, Aramex, J&T Express, GLS).
                      </p>
                      <p>
                        <strong>Délais indicatifs :</strong>
                      </p>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Grandes villes : 2-3 jours ouvrables</li>
                        <li>Autres villes : 3-5 jours ouvrables</li>
                        <li>Zones rurales : 5-7 jours ouvrables</li>
                      </ul>
                      <p>
                        Ces délais sont donnés à titre indicatif et peuvent varier selon les conditions de transport.
                      </p>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold mb-4 flex items-center">
                      <span className="w-2 h-8 bg-primary rounded mr-3"></span>
                      4. Retours et Remboursements
                    </h2>
                    <div className="space-y-3 text-muted-foreground">
                      <p>
                        <strong>Produits non personnalisés :</strong> Retour possible dans les 7 jours suivant la réception, 
                        dans leur état d'origine avec emballage intact. Frais de retour à la charge du client.
                      </p>
                      <p>
                        <strong>Produits personnalisés :</strong> Aucun retour ni remboursement possible, sauf en cas de 
                        défaut de fabrication ou d'erreur de notre part.
                      </p>
                      <p>
                        En cas de produit défectueux, contactez-nous sous 48h avec photos. Nous procéderons au remplacement 
                        ou remboursement après vérification.
                      </p>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold mb-4 flex items-center">
                      <span className="w-2 h-8 bg-primary rounded mr-3"></span>
                      5. Garantie et Qualité
                    </h2>
                    <div className="space-y-3 text-muted-foreground">
                      <p>
                        Tous nos produits sont soigneusement sélectionnés pour leur qualité premium.
                      </p>
                      <p>
                        Nous garantissons la conformité des produits livrés avec la description et la prévisualisation présentées.
                      </p>
                      <p>
                        Les produits bénéficient d'une garantie contre les défauts de fabrication.
                      </p>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold mb-4 flex items-center">
                      <span className="w-2 h-8 bg-primary rounded mr-3"></span>
                      6. Propriété Intellectuelle
                    </h2>
                    <div className="space-y-3 text-muted-foreground">
                      <p>
                        Les contenus du site (textes, images, designs) sont protégés par les droits d'auteur et restent 
                        notre propriété exclusive.
                      </p>
                      <p>
                        Toute reproduction, même partielle, est interdite sans autorisation préalable.
                      </p>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold mb-4 flex items-center">
                      <span className="w-2 h-8 bg-primary rounded mr-3"></span>
                      7. Protection des Données
                    </h2>
                    <div className="space-y-3 text-muted-foreground">
                      <p>
                        Les informations collectées lors de votre commande sont nécessaires au traitement de celle-ci.
                      </p>
                      <p>
                        Ces données sont confidentielles et ne seront jamais cédées à des tiers.
                      </p>
                      <p>
                        Conformément à la loi, vous disposez d'un droit d'accès, de rectification et de suppression 
                        de vos données personnelles.
                      </p>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold mb-4 flex items-center">
                      <span className="w-2 h-8 bg-primary rounded mr-3"></span>
                      8. Contact
                    </h2>
                    <div className="space-y-3 text-muted-foreground">
                      <p>
                        Pour toute question concernant nos conditions de vente :
                      </p>
                      <ul className="space-y-1">
                        <li>Email : contact@can2025.ma</li>
                        <li>WhatsApp : +212 6XX XXX XXX</li>
                        <li>Téléphone : +212 6XX XXX XXX</li>
                      </ul>
                    </div>
                  </section>
                </CardContent>
              </Card>

              <p className="text-center text-sm text-muted-foreground">
                Dernière mise à jour : Janvier 2025
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Conditions;

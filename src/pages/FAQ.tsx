import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const FAQ = () => {
  const faqs = [
    {
      category: "Commande & Paiement",
      questions: [
        {
          q: "Comment passer une commande ?",
          a: "Sélectionnez vos produits, personnalisez-les si vous le souhaitez, ajoutez-les au panier, puis finalisez via WhatsApp ou Email. Vous recevrez ensuite les instructions de paiement."
        },
        {
          q: "Quels sont les modes de paiement acceptés ?",
          a: "Nous acceptons le paiement à la livraison (cash) et le virement bancaire. Les coordonnées bancaires vous seront envoyées après validation de votre commande."
        },
        {
          q: "Puis-je modifier ma commande après validation ?",
          a: "Oui, contactez-nous rapidement via WhatsApp ou Email avec votre numéro de commande. Les modifications sont possibles tant que la commande n'est pas en préparation."
        },
      ]
    },
    {
      category: "Personnalisation",
      questions: [
        {
          q: "Quelles polices sont disponibles pour la personnalisation ?",
          a: "Nous proposons plus de 15 polices : Athletic, Jersey M54, Sports World, Montserrat, Bebas Neue, Oswald, Cairo, Amiri et bien d'autres. Consultez la page Personnalisation pour voir toutes les options."
        },
        {
          q: "Combien de caractères puis-je ajouter ?",
          a: "Vous pouvez ajouter jusqu'à 15 caractères pour le texte personnalisé. Les numéros vont de 1 à 99."
        },
        {
          q: "Puis-je personnaliser en arabe ?",
          a: "Oui ! Nous proposons plusieurs polices arabes (Cairo Bold, Tajawal, Amiri) pour vos personnalisations en arabe."
        },
        {
          q: "Quel est le coût de la personnalisation ?",
          a: "Nom personnalisé: +30 DH | Numéro: +20 DH | Nom + Numéro: +50 DH"
        },
      ]
    },
    {
      category: "Livraison",
      questions: [
        {
          q: "Livrez-vous dans tout le Maroc ?",
          a: "Oui, nous livrons dans toutes les villes et régions du Maroc, y compris les zones rurales."
        },
        {
          q: "Quels sont les délais de livraison ?",
          a: "Grandes villes (Casa, Rabat, Marrakech...): 2-3 jours | Autres villes: 3-5 jours | Zones rurales: 5-7 jours"
        },
        {
          q: "Quels sont les frais de livraison ?",
          a: "Grandes villes: 30-40 DH | Autres villes: 40-50 DH | Zones rurales: 50-60 DH. Les frais exacts sont calculés lors de la finalisation."
        },
        {
          q: "Comment suivre ma commande ?",
          a: "Vous recevrez un numéro de suivi par WhatsApp/Email. Utilisez-le sur notre page 'Suivi de commande' pour voir l'état en temps réel."
        },
      ]
    },
    {
      category: "Produits & Qualité",
      questions: [
        {
          q: "Les produits sont-ils officiels ?",
          a: "Non. Nos produits sont des articles de haute qualité inspirés des équipes nationales. Ils ne sont pas affiliés à la CAF, FRMF ou autres organisations officielles. Ce sont des produits de supporter premium."
        },
        {
          q: "Quelle est la qualité des produits ?",
          a: "Nous utilisons des matériaux premium de haute qualité pour garantir confort et durabilité. Tous nos produits sont soigneusement sélectionnés."
        },
        {
          q: "Quelles tailles sont disponibles ?",
          a: "Nous proposons les tailles S, M, L, XL et XXL pour la plupart de nos produits."
        },
        {
          q: "Puis-je retourner un produit personnalisé ?",
          a: "Les produits personnalisés ne peuvent pas être retournés sauf en cas de défaut de fabrication. Les produits non personnalisés peuvent être retournés dans les 7 jours."
        },
      ]
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Page Header */}
        <section className="gradient-secondary py-16 text-white">
          <div className="container px-4">
            <div className="flex items-center justify-center mb-4">
              <HelpCircle className="h-8 w-8 mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold">Questions Fréquentes</h1>
            </div>
            <p className="text-xl text-white/90 text-center">
              Trouvez rapidement les réponses à vos questions
            </p>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="py-12">
          <div className="container px-4">
            <div className="max-w-4xl mx-auto space-y-8">
              {faqs.map((category, idx) => (
                <div key={idx}>
                  <h2 className="text-2xl font-bold mb-4 flex items-center">
                    <span className="w-2 h-8 bg-primary rounded mr-3"></span>
                    {category.category}
                  </h2>
                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((item, qIdx) => (
                      <AccordionItem key={qIdx} value={`item-${idx}-${qIdx}`}>
                        <AccordionTrigger className="text-left">
                          {item.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {item.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;

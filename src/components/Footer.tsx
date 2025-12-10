import { Facebook, Instagram, Mail, Phone, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "@/assets/logo.png";
import CharikaLogo from "@/assets/charika.jpg";
import ozomImage from "@/assets/ozom.png";

export const Footer = () => {
  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="container px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="space-y-4">
            <img
              src={Logo}
              alt="CAN 2025 Logo"
              className="w-32 object-contain"
            />

            <p className="text-sm text-muted-foreground">
              Produits premium pour supporters passionnés. Qualité supérieure garantie.
            </p>

            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-smooth">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://www.instagram.com/atlasllions?igsh=c3BxdmZrMHl5OTc=" className="text-muted-foreground hover:text-primary transition-smooth">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h4 className="font-semibold">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/boutique" className="text-muted-foreground hover:text-primary transition-smooth">
                  Boutique
                </Link>
              </li>
              <li>
                <Link to="/personnalisation" className="text-muted-foreground hover:text-primary transition-smooth">
                  Personnalisation
                </Link>
              </li>
              <li>
                <Link to="/suivi" className="text-muted-foreground hover:text-primary transition-smooth">
                  Suivi de commande
                </Link>
              </li>
            </ul>
          </div>

          {/* Informations */}
          <div className="space-y-4">
            <h4 className="font-semibold">Informations</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-primary transition-smooth">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/livraison" className="text-muted-foreground hover:text-primary transition-smooth">
                  Livraison
                </Link>
              </li>
              <li>
                <Link to="/conditions" className="text-muted-foreground hover:text-primary transition-smooth">
                  Conditions de vente
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>
                  +212 770-257750
                </span>
              </li>
              <li className="flex items-center space-x-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>contact@atlasllions.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Partenaire de Livraison */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Truck className="h-5 w-5" />
              <h4 className="font-semibold text-foreground">Partenaire de Livraison</h4>
            </div>
            <div className="flex items-center justify-center gap-2 bg-white rounded-xl px-6 py-4 shadow-md hover:shadow-lg transition-shadow">
              <img
                src={CharikaLogo}
                alt="Charika Livraison"
                className="h-12 w-auto object-contain"
              />
              <img
              src ={ozomImage}
              className="h-8 w-auto object-contain"
              />
              <span className="text-sm font-semibold text-gray-700">Livraison rapide et fiable</span>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground text-center max-w-3xl mx-auto">
            <strong>Avertissement :</strong> Les produits vendus sur ce site sont des articles de haute qualité inspirés des équipes nationales. 
            Ils ne sont pas affiliés, approuvés ou sponsorisés par la CAF, la FRMF ou toute organisation officielle. 
            Ce sont des produits de supporter créés avec des matériaux premium.
          </p>
          <p className="text-xs text-muted-foreground text-center mt-4">
            © 2025 CAN 2025 Shop. Tous droits réservés.
          </p>
        </div>

      </div>
    </footer>
  );
};
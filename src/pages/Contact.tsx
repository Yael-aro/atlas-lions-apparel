import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, MessageCircle, Clock } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Page Header */}
        <section className="gradient-secondary py-16 text-white">
          <div className="container px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contactez-nous</h1>
            <p className="text-xl text-white/90">
              Notre équipe est à votre disposition pour répondre à toutes vos questions
            </p>
          </div>
        </section>

        {/* Contact Content */}
        <section className="py-12">
          <div className="container px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              
              {/* Contact Form */}
              <Card className="shadow-elegant">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-6">Envoyez-nous un message</h2>
                  
                  <form className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="contact-name">Nom complet</Label>
                      <Input id="contact-name" placeholder="Votre nom" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact-email">Email</Label>
                      <Input id="contact-email" type="email" placeholder="votre@email.com" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact-phone">Téléphone</Label>
                      <Input id="contact-phone" placeholder="+212 6XX XXX XXX" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact-subject">Sujet</Label>
                      <Input id="contact-subject" placeholder="Sujet de votre message" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact-message">Message</Label>
                      <Textarea 
                        id="contact-message" 
                        placeholder="Votre message..."
                        rows={6}
                      />
                    </div>

                    <Button type="submit" className="w-full shadow-elegant" size="lg">
                      Envoyer le message
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Contact Info */}
              <div className="space-y-6">
                <Card className="shadow-elegant">
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold mb-6">Informations de contact</h2>
                    
                    <div className="space-y-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <Phone className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">Téléphone</h3>
                          <p className="text-muted-foreground">+212 6XX XXX XXX</p>
                          <p className="text-sm text-muted-foreground">Lun-Sam: 9h-19h</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <MessageCircle className="h-6 w-6 text-secondary" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">WhatsApp</h3>
                          <p className="text-muted-foreground">+212 6XX XXX XXX</p>
                          <Button variant="link" className="p-0 h-auto text-secondary">
                            Démarrer une conversation
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <Mail className="h-6 w-6 text-accent-foreground" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">Email</h3>
                          <p className="text-muted-foreground">contact@atlasllions.com</p>
                          <p className="text-muted-foreground">contact@atlasllions.com</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <MapPin className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">Adresse</h3>
                          <p className="text-muted-foreground">
                            Casablanca, Maroc
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="gradient-hero text-white">
                  <CardContent className="p-8">
                    <Clock className="h-12 w-12 mb-4" />
                    <h3 className="text-xl font-bold mb-2">Horaires d'ouverture</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Lundi - Vendredi</span>
                        <span className="font-semibold">9h00 - 19h00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Samedi</span>
                        <span className="font-semibold">9h00 - 17h00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Dimanche</span>
                        <span className="font-semibold">Fermé</span>
                      </div>
                    </div>
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

export default Contact;
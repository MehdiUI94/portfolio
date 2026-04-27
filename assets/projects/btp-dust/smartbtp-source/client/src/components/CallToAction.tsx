import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin } from "lucide-react";

export default function CallToAction() {
  return (
    <section className="relative py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-primary via-primary to-blue-600 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold">Prêt à démarrer votre projet ?</h2>
          <p className="text-lg sm:text-xl text-white/95 max-w-2xl mx-auto">
            Devis gratuit sous 24h • Intervention Lyon et région Rhône-Alpes
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <a href="tel:0472000000" data-testid="link-call-cta">
              <Button
                size="lg"
                className="gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-none shadow-xl hover:shadow-2xl transition-all text-lg px-8 py-6"
              >
                <Phone className="h-5 w-5" />
                Appeler : 04 72 00 00 00
              </Button>
            </a>
            <a href="mailto:contact@smartbtp.fr" data-testid="link-email-cta">
              <Button
                size="lg"
                variant="outline"
                className="gap-2 bg-white text-primary hover:bg-white/90 border-none shadow-xl hover:shadow-2xl transition-all text-lg px-8 py-6"
              >
                <Mail className="h-5 w-5" />
                Email : contact@smartbtp.fr
              </Button>
            </a>
          </div>

          <div className="pt-6 flex items-center justify-center gap-2 text-white/90">
            <MapPin className="h-5 w-5" />
            <p className="text-lg">SmartBTP • 15 rue des Artisans • 69001 Lyon, France</p>
          </div>
        </div>
      </div>
    </section>
  );
}

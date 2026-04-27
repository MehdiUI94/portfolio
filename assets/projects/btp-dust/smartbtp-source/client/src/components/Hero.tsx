import { Card } from "@/components/ui/card";
import PriceSimulator from "@/components/PriceSimulator";

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-primary via-primary to-blue-600 text-white py-16 sm:py-20 lg:py-24 overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1" fill="currentColor" opacity="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
              Travaux BTP avec{" "}
              <span className="text-orange-500 drop-shadow-lg">prix transparents</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/95 leading-relaxed">
              Première entreprise BTP française à afficher ses tarifs publiquement. Calculez votre devis instantanément, sans surprise.
            </p>

            <div className="grid grid-cols-3 gap-4 pt-4">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-4 text-center hover-elevate">
                <div className="text-3xl font-bold text-orange-500" data-testid="text-stat-years">15+</div>
                <div className="text-sm text-white/90">Ans d'expérience</div>
              </Card>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-4 text-center hover-elevate">
                <div className="text-3xl font-bold text-orange-500" data-testid="text-stat-projects">500+</div>
                <div className="text-sm text-white/90">Projets réalisés</div>
              </Card>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-4 text-center hover-elevate">
                <div className="text-3xl font-bold text-orange-500" data-testid="text-stat-satisfaction">4.9/5</div>
                <div className="text-sm text-white/90">Satisfaction</div>
              </Card>
            </div>
          </div>

          <div>
            <PriceSimulator />
          </div>
        </div>
      </div>
    </section>
  );
}

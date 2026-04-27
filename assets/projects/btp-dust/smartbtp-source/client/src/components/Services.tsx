import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Wrench, Home, Maximize2 } from "lucide-react";

const services = [
  {
    icon: Building2,
    title: "Gros Œuvre",
    price: "850€/m²",
    description: "Fondations, maçonnerie, charpente, couverture",
    gradient: "from-blue-500 to-primary",
  },
  {
    icon: Wrench,
    title: "Second Œuvre",
    price: "650€/m²",
    description: "Électricité, plomberie, isolation, finitions",
    gradient: "from-orange-500 to-orange-600",
  },
  {
    icon: Home,
    title: "Rénovation",
    price: "1200€/m²",
    description: "Rénovation complète, redistribution",
    gradient: "from-green-500 to-green-600",
  },
  {
    icon: Maximize2,
    title: "Extension",
    price: "1600€/m²",
    description: "Agrandissement, surélévation moderne",
    gradient: "from-purple-500 to-purple-600",
  },
];

export default function Services() {
  const scrollToSimulator = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section id="services" className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-background to-accent/20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Nos services avec <span className="text-orange-500">prix affichés</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Première entreprise BTP française à afficher ses tarifs publiquement
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card
              key={index}
              className="relative overflow-hidden group hover:-translate-y-2 transition-all duration-300 hover:shadow-xl"
              data-testid={`card-service-${index}`}
            >
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${service.gradient}`}></div>

              <CardHeader className="text-center pb-4">
                <div
                  className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <service.icon className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-xl">{service.title}</CardTitle>
                <div className="text-3xl font-bold text-orange-500 my-2" data-testid={`text-price-${index}`}>
                  {service.price}
                </div>
              </CardHeader>

              <CardContent className="text-center space-y-4">
                <CardDescription className="text-base">{service.description}</CardDescription>
                <Button
                  variant="outline"
                  className="w-full hover:bg-primary hover:text-white transition-colors"
                  onClick={scrollToSimulator}
                  data-testid={`button-calculate-${index}`}
                >
                  Calculer mon devis
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

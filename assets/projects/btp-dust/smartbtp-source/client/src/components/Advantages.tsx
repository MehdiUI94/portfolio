import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Clock, CheckCircle2 } from "lucide-react";

const advantages = [
  {
    icon: Shield,
    title: "Prix transparents",
    description:
      "Première entreprise BTP à afficher tous ses tarifs. Aucune surprise, aucun dépassement non autorisé.",
    gradient: "from-blue-500 to-primary",
    borderColor: "border-blue-500",
  },
  {
    icon: Clock,
    title: "Délais garantis",
    description:
      "Engagement contractuel sur les délais avec pénalités automatiques en cas de retard de notre fait.",
    gradient: "from-orange-500 to-orange-600",
    borderColor: "border-orange-500",
  },
  {
    icon: CheckCircle2,
    title: "Qualité certifiée",
    description: "Garantie décennale, artisans certifiés RGE et satisfaction client 100% assurée.",
    gradient: "from-green-500 to-green-600",
    borderColor: "border-green-500",
  },
];

export default function Advantages() {
  return (
    <section id="avantages" className="py-16 sm:py-20 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">Pourquoi choisir SmartBTP ?</h2>
          <p className="text-lg sm:text-xl text-muted-foreground">La différence qui fait la différence</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {advantages.map((advantage, index) => (
            <div key={index} className="text-center" data-testid={`advantage-${index}`}>
              <div className="relative mx-auto mb-6">
                <div
                  className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-br ${advantage.gradient} flex items-center justify-center animate-pulse`}
                >
                  <advantage.icon className="h-12 w-12 text-white" />
                </div>
                <div
                  className={`absolute inset-0 w-28 h-28 mx-auto rounded-full border-2 ${advantage.borderColor} opacity-20 animate-ping`}
                  style={{ animationDuration: "2s" }}
                ></div>
              </div>

              <Card className="border-none shadow-none bg-transparent">
                <CardHeader>
                  <CardTitle className="text-2xl">{advantage.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{advantage.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

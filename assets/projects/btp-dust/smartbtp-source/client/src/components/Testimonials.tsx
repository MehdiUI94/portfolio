import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Jean Dupont",
    initials: "JD",
    location: "Particulier • Lyon 6ème",
    rating: 5,
    quote:
      "Travail impeccable pour notre extension. Délais respectés à la lettre et prix exactement conforme au devis initial. Une équipe vraiment professionnelle !",
    project: "Extension 40m² - Budget final : 65 000€ TTC",
    stats: [
      { value: "15h", label: "Gagnées/semaine" },
      { value: "+25%", label: "Valeur ajoutée" },
      { value: "320%", label: "ROI projet" },
    ],
  },
  {
    name: "Marie Martin",
    initials: "MM",
    location: "Propriétaire • Villeurbanne",
    rating: 5,
    quote:
      "Rénovation de notre appartement parfaitement réalisée. L'équipe est arrivée chaque jour à l'heure et le chantier était toujours propre. Résultat au-delà de nos attentes !",
    project: "Rénovation complète 80m² - Budget final : 95 000€ TTC",
    stats: [
      { value: "12h", label: "Gagnées/semaine" },
      { value: "+18%", label: "Valeur immobilière" },
      { value: "280%", label: "Satisfaction" },
    ],
  },
  {
    name: "Pierre Moreau",
    initials: "PM",
    location: "Entrepreneur • Caluire-et-Cuire",
    rating: 5,
    quote:
      "Construction de notre maison individuelle. Suivi exceptionnel avec photos quotidiennes et finitions de très haute qualité. Je recommande vivement !",
    project: "Maison neuve 120m² - Budget final : 180 000€ TTC",
    stats: [
      { value: "10h", label: "Gagnées/semaine" },
      { value: "+22%", label: "Économies énergie" },
      { value: "250%", label: "Recommandation" },
    ],
  },
];

export default function Testimonials() {
  return (
    <section id="temoignages" className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-blue-50 to-orange-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">Nos clients témoignent</h2>
          <p className="text-lg sm:text-xl text-muted-foreground">Plus de 500 projets réalisés avec succès</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="relative shadow-lg hover:shadow-xl transition-shadow" data-testid={`testimonial-${index}`}>
              <div className="absolute -top-4 -left-4 text-7xl text-orange-500 font-bold opacity-20">"</div>

              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-16 w-16 bg-gradient-to-br from-primary to-blue-500">
                    <AvatarFallback className="text-white font-bold text-lg">{testimonial.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-bold text-lg">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-orange-500 text-orange-500" />
                    ))}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="italic text-muted-foreground leading-relaxed">{testimonial.quote}</p>

                <Card className="bg-accent/50 p-3 text-center text-sm">
                  <p className="text-muted-foreground">{testimonial.project}</p>
                </Card>

                <div className="grid grid-cols-3 gap-2">
                  {testimonial.stats.map((stat, statIndex) => (
                    <Card
                      key={statIndex}
                      className="p-3 text-center bg-gradient-to-br from-muted to-accent hover-elevate"
                    >
                      <div className="font-bold text-green-600 text-sm sm:text-base" data-testid={`stat-value-${index}-${statIndex}`}>{stat.value}</div>
                      <div className="text-xs text-muted-foreground">{stat.label}</div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

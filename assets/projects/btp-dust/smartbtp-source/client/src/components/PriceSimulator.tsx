import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calculator, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const PROJECT_TYPES = {
  gros_oeuvre: "Gros Œuvre",
  second_oeuvre: "Second Œuvre",
  renovation: "Rénovation",
  extension: "Extension",
};

interface PriceResult {
  priceHT: number;
  priceTTC: number;
  duration: string;
}

export default function PriceSimulator() {
  const { toast } = useToast();
  const [surface, setSurface] = useState("");
  const [projectType, setProjectType] = useState("");
  const [result, setResult] = useState<PriceResult | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const calculateMutation = useMutation({
    mutationFn: async (data: { surface: number; projectType: string }) => {
      const res = await apiRequest("POST", "/api/calculate-price", data);
      return (await res.json()) as PriceResult;
    },
    onSuccess: (data) => {
      setResult(data);
      toast({
        title: "Estimation calculée",
        description: "Voici votre estimation personnalisée",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const quoteMutation = useMutation({
    mutationFn: async () => {
      if (!result) throw new Error("Aucun calcul effectué");
      const res = await apiRequest("POST", "/api/quote-requests", {
        name,
        phone,
        email,
        projectType,
        surface: parseInt(surface),
        priceHT: result.priceHT,
        priceTTC: result.priceTTC,
        duration: result.duration,
      });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Demande envoyée !",
        description: "Notre équipe vous recontacte dans les 2 heures.",
      });
      setShowContactForm(false);
      setName("");
      setPhone("");
      setEmail("");
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const surfaceNum = parseFloat(surface);
    if (!surfaceNum || !projectType) {
      toast({
        title: "Champs incomplets",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }
    calculateMutation.mutate({ surface: surfaceNum, projectType });
  };

  return (
    <Card className="bg-white shadow-2xl relative overflow-visible">
      <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 via-blue-500 to-green-500 rounded-lg opacity-75 blur-sm -z-10"></div>

      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge className="bg-orange-500 hover:bg-orange-600 text-white" data-testid="badge-instant">
            Calcul instantané
          </Badge>
        </div>
        <CardTitle className="text-2xl text-primary">Calculateur de Prix</CardTitle>
        <CardDescription>Obtenez votre estimation en quelques secondes</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <form onSubmit={handleCalculate} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="surface">Surface du projet (m²)</Label>
            <Input
              id="surface"
              type="number"
              placeholder="Ex: 80"
              value={surface}
              onChange={(e) => setSurface(e.target.value)}
              data-testid="input-surface"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="projectType">Type de projet</Label>
            <Select value={projectType} onValueChange={setProjectType}>
              <SelectTrigger id="projectType" data-testid="select-project-type">
                <SelectValue placeholder="Choisissez un type" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(PROJECT_TYPES).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            disabled={calculateMutation.isPending}
            className="w-full gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
            data-testid="button-calculate"
          >
            {calculateMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Calculator className="h-4 w-4" />
            )}
            Calculer mon prix instantané
          </Button>
        </form>

        {result && (
          <Card className="bg-gradient-to-br from-green-50 to-orange-50 border-orange-500 border-2 mt-6" data-testid="card-result">
            <CardHeader>
              <CardTitle className="text-center text-green-600">Votre estimation personnalisée</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 text-center">
                  <div className="text-sm text-muted-foreground">Prix HT</div>
                  <div className="text-2xl font-bold text-green-600" data-testid="text-price-ht">
                    {result.priceHT.toLocaleString("fr-FR")}€
                  </div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-sm text-muted-foreground">Prix TTC</div>
                  <div className="text-2xl font-bold text-green-600" data-testid="text-price-ttc">
                    {result.priceTTC.toLocaleString("fr-FR")}€
                  </div>
                </Card>
              </div>

              <Card className="p-4 text-center bg-white/70">
                <div className="text-sm text-muted-foreground">Durée estimée</div>
                <div className="text-xl font-bold text-primary" data-testid="text-duration">
                  {result.duration}
                </div>
              </Card>

              {!showContactForm ? (
                <Button
                  onClick={() => setShowContactForm(true)}
                  variant="default"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                  data-testid="button-show-quote-form"
                >
                  Recevoir un devis détaillé gratuit
                </Button>
              ) : (
                <div className="space-y-3 pt-4 border-t-2 border-orange-500">
                  <h4 className="font-semibold text-center">Recevoir un devis gratuit</h4>
                  <Input
                    placeholder="Votre nom complet"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    data-testid="input-name"
                  />
                  <Input
                    type="tel"
                    placeholder="Votre téléphone (ex: 06 12 34 56 78)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    data-testid="input-phone"
                  />
                  <Input
                    type="email"
                    placeholder="Votre email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    data-testid="input-email"
                  />
                  <Button
                    onClick={() => quoteMutation.mutate()}
                    disabled={quoteMutation.isPending}
                    className="w-full gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                    data-testid="button-send-quote"
                  >
                    {quoteMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                    Envoyer ma demande de devis
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}

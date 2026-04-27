import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertQuoteRequestSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import { ZodError } from "zod";

const BASE_PRICES: Record<string, number> = {
  gros_oeuvre: 850,
  second_oeuvre: 650,
  renovation: 1200,
  extension: 1600,
};

const DURATION_FACTORS: Record<string, number> = {
  gros_oeuvre: 0.8,
  second_oeuvre: 0.6,
  renovation: 1.2,
  extension: 1.5,
};

function calculateDuration(surface: number, projectType: string): string {
  const factor = DURATION_FACTORS[projectType];
  let days = Math.ceil(surface * factor);
  if (surface > 200) days = Math.ceil(days * 1.1);
  if (surface > 500) days = Math.ceil(days * 1.2);

  if (days <= 30) return `${days} jours`;
  if (days <= 60) return `${Math.ceil(days / 7)} semaines`;
  return `${Math.ceil(days / 30)} mois`;
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/calculate-price", (req, res) => {
    const { surface, projectType } = req.body;
    const surfaceNum = parseFloat(surface);

    if (!surfaceNum || surfaceNum <= 0) {
      return res.status(400).json({ error: "Surface invalide" });
    }

    if (surfaceNum > 1000) {
      return res
        .status(400)
        .json({ error: "Pour les projets de plus de 1000m², contactez-nous directement au 04 72 00 00 00" });
    }

    if (!projectType || !BASE_PRICES[projectType]) {
      return res.status(400).json({ error: "Type de projet invalide" });
    }

    const pricePerM2 = BASE_PRICES[projectType];
    const priceHT = Math.round(surfaceNum * pricePerM2);
    const priceTTC = Math.round(priceHT * 1.2);
    const duration = calculateDuration(surfaceNum, projectType);

    res.json({ priceHT, priceTTC, duration });
  });

  app.post("/api/quote-requests", async (req, res) => {
    try {
      const validated = insertQuoteRequestSchema.parse(req.body);
      const quote = await storage.createQuoteRequest(validated);
      res.status(201).json(quote);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: fromZodError(error).toString() });
      }
      res.status(500).json({ error: "Erreur lors de l'enregistrement de la demande" });
    }
  });

  app.get("/api/quote-requests", async (_req, res) => {
    const quotes = await storage.getAllQuoteRequests();
    res.json(quotes);
  });

  app.get("/api/quote-requests/:id", async (req, res) => {
    const quote = await storage.getQuoteRequest(req.params.id);
    if (!quote) return res.status(404).json({ error: "Devis non trouvé" });
    res.json(quote);
  });

  const httpServer = createServer(app);
  return httpServer;
}

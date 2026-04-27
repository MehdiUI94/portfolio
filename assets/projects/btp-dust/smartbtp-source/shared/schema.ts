import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const quoteRequests = pgTable("quote_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  projectType: text("project_type").notNull(),
  surface: integer("surface").notNull(),
  priceHT: integer("price_ht").notNull(),
  priceTTC: integer("price_ttc").notNull(),
  duration: text("duration").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertQuoteRequestSchema = createInsertSchema(quoteRequests)
  .omit({
    id: true,
    createdAt: true,
  })
  .extend({
    name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    phone: z
      .string()
      .regex(
        /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/,
        "Numéro de téléphone français invalide"
      ),
    email: z.string().email("Adresse email invalide"),
    projectType: z.enum(["gros_oeuvre", "second_oeuvre", "renovation", "extension"]),
    surface: z.number().int().positive().max(1000, "Pour les projets de plus de 1000m², contactez-nous directement"),
  });

export type InsertQuoteRequest = z.infer<typeof insertQuoteRequestSchema>;
export type QuoteRequest = typeof quoteRequests.$inferSelect;

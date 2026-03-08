import { z } from "zod";

export const collaborativeListItemSchema = z.object({
  title: z
    .string()
    .min(1, "Le titre est requis")
    .max(120, "Le titre ne doit pas dépasser 120 caractères"),
  bringText: z
    .string()
    .min(1, "La description est requise")
    .max(500, "La description ne doit pas dépasser 500 caractères"),
  status: z.enum(["A_APPORTER", "APPORTE", "EN_ATTENTE"]).default("A_APPORTER"),
});

export type CollaborativeListItemFormData = {
  title: string;
  bringText: string;
  status: "A_APPORTER" | "APPORTE" | "EN_ATTENTE";
};

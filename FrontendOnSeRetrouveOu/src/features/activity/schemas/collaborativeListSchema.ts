import { z } from "zod";

export const collaborativeListItemSchema = z
  .object({
    title: z
      .string()
      .min(1, "Le titre est requis")
      .max(120, "Le titre ne doit pas dépasser 120 caractères"),
    bringText: z
      .string()
      .min(1, "La description est requise")
      .max(500, "La description ne doit pas dépasser 500 caractères"),
    status: z.enum(["EN_ATTENTE", "ASSIGNE"]).default("EN_ATTENTE"),
    assignedUserId: z.number().nullable().optional(),
  })
  .refine((data) => data.status !== "ASSIGNE" || data.assignedUserId !== null, {
    message: "Vous devez sélectionner une personne pour le statut 'Assigné'",
    path: ["assignedUserId"],
  });

export type CollaborativeListItemFormData = {
  title: string;
  bringText: string;
  status: "EN_ATTENTE" | "ASSIGNE";
  assignedUserId?: number | null;
};

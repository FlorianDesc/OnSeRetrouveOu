import { z } from "zod";

export const createActivitySchema = z.object({
  title: z.string().min(1, "Le titre est obligatoire"),
  description: z.string().min(1, "La description est obligatoire"),
  location: z.string().min(1, "Le lieu est obligatoire"),
  dateActivity: z.string().min(1, "La date est obligatoire"),
  maxParticipants: z.union([z.string(), z.number()]).optional(),
  imageName: z.string().optional(),
});

export type CreateActivityFormData = z.infer<typeof createActivitySchema>;

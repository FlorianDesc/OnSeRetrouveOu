import { z } from "zod";

const activitySchemaInput = z.object({
  title: z.string().min(1, "Le titre est obligatoire"),
  description: z.string().min(1, "La description est obligatoire"),
  location: z.string().min(1, "Le lieu est obligatoire"),
  dateActivity: z.string().min(1, "La date est obligatoire"),
  maxParticipants: z.union([z.string(), z.number()]).optional(),
});

export const createActivitySchema = activitySchemaInput.transform((data) => ({
  ...data,
  maxParticipants: data.maxParticipants
    ? typeof data.maxParticipants === "string"
      ? Number(data.maxParticipants) || undefined
      : data.maxParticipants
    : undefined,
}));

export type CreateActivityFormData = z.infer<typeof createActivitySchema>;

import { updateActivity } from "@/api/activity/activity.api";
import { activityKeys } from "@/api/activity/activity.queries";
import type { CreateActivityFormData } from "@/features/activity/schemas/activitySchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useUpdateActivity(activityId: number, onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateActivityFormData) =>
      updateActivity(activityId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: activityKeys.all });
      onSuccess?.();
      toast.success("Activité mise à jour avec succès");
    },
    onError: (error: Error) => {
      console.error("Error updating activity:", error);
      toast.error(error.message || "Erreur lors de la mise à jour");
    },
  });
}

import { createActivity } from "@/api/activity/activity.api";
import { activityKeys } from "@/api/activity/activity.queries";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useCreateActivity(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: activityKeys.all });
      onSuccess?.();
      toast.success("Activité créée avec succès");
    },
    onError: (error: Error) => {
      console.error("Error creating activity:", error);
      toast.error("Erreur lors de la création de l'activité");
    },
  });
}

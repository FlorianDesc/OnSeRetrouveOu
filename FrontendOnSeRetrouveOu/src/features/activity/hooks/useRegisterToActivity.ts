import { registerToActivity } from "@/api/activity/activity.api";
import { activityKeys } from "@/api/activity/activity.queries";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useRegisterToActivity(
  activityId: number,
  onSuccess?: () => void,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => registerToActivity(activityId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: activityKeys.participant(activityId),
      });
      queryClient.invalidateQueries({ queryKey: activityKeys.all });
      onSuccess?.();
      toast.success("Vous avez été inscrit avec succès");
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Erreur lors de l'inscription");
    },
  });
}

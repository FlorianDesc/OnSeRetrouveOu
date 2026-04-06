import { deleteActivity } from "@/api/activity/activity.api";
import { activityKeys } from "@/api/activity/activity.queries";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useDeleteActivity(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: activityKeys.all });
      onSuccess?.();
      toast.success("Activité supprimée avec succès");
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Erreur lors de la suppression");
    },
  });
}

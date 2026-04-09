import {
  addCollaborativeListItem,
  deleteCollaborativeListItem,
  updateCollaborativeListItem,
} from "@/api/collaborativeList/collaborativeList.api";
import { collaborativeListKeys } from "@/api/collaborativeList/collaborativeList.queries";
import type { CollaborativeListItemFormData } from "@/features/activity/schemas/collaborativeListSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useAddCollaborativeListItem(
  activityId: number,
  onSuccess?: () => void,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CollaborativeListItemFormData) =>
      addCollaborativeListItem(activityId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: collaborativeListKeys.list(activityId),
      });
      onSuccess?.();
      toast.success("Élément ajouté avec succès");
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Erreur lors de l'ajout");
    },
  });
}

export function useDeleteCollaborativeListItem(
  activityId: number,
  onSuccess?: () => void,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: number) =>
      deleteCollaborativeListItem(activityId, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: collaborativeListKeys.list(activityId),
      });
      onSuccess?.();
      toast.success("Élément supprimé avec succès");
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Erreur lors de la suppression");
    },
  });
}

export function useUpdateCollaborativeListItem(
  activityId: number,
  onSuccess?: () => void,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      itemId: number;
      formData: CollaborativeListItemFormData;
    }) => updateCollaborativeListItem(activityId, data.itemId, data.formData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: collaborativeListKeys.list(activityId),
      });
      onSuccess?.();
      toast.success("Élément modifié avec succès");
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Erreur lors de la modification");
    },
  });
}

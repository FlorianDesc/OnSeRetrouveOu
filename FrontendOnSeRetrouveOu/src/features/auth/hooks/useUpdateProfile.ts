import { updateProfile } from "@/api/user/user.api";
import { userKeys } from "@/api/user/user.queries";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useUpdateProfile(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.current() });
      onSuccess?.();
      toast.success("Profil mis à jour avec succès");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

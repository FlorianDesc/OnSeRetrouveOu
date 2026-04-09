import { updatePassword } from "@/api/user/user.api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function useUpdatePassword(onSuccess?: () => void) {
  return useMutation({
    mutationFn: updatePassword,
    onSuccess: () => {
      onSuccess?.();
      toast.success("Mot de passe mis à jour avec succès");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

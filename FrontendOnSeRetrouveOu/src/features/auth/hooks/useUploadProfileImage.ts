import { updateProfile } from "@/api/user/user.api";
import { userKeys } from "@/api/user/user.queries";
import { uploadImage } from "@/lib/uploadApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useUploadProfileImage(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const result = await uploadImage(file);
      return updateProfile({ profileImage: result.fileName });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.current() });
      onSuccess?.();
      toast.success("Photo de profil mise à jour");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

import { login, register } from "@/features/auth/api/authApi";
import { useMutation } from "@tanstack/react-query";

export function useAuth() {
  const signIn = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
    },
  });

  const signUp = useMutation({
    mutationFn: register,
  });

  const logout = () => {
    localStorage.removeItem("token");
  };

  const getToken = () => {
    return localStorage.getItem("token");
  };

  return {
    signIn,
    signUp,
    logout,
    getToken,
  };
}

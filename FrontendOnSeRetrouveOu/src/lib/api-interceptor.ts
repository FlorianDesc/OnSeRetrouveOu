import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

export function useApiInterceptor() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleUnauthorized = () => {
    localStorage.removeItem("token");
    queryClient.clear();
    navigate("/login", { replace: true });
  };

  return { handleUnauthorized };
}

export async function apiCall<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const token = localStorage.getItem("token");

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options?.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem("token");

    throw new Error("UNAUTHORIZED");
  }

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}

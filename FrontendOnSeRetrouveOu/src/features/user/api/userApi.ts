import type { User } from "@/types/user";

const API_URL = "http://localhost:8080/api/users";

export const fetchCurrentUser = async (): Promise<User> => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Utilisateur non authentifié");
  }

  const response = await fetch(`${API_URL}/current`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    throw new Error("Session expirée");
  }

  if (!response.ok) {
    throw new Error("Impossible de récupérer l'utilisateur courant");
  }

  return response.json();
};

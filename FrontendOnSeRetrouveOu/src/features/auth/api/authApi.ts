import type { AuthCredentials, AuthResponse } from "@/types/auth";

const API_URL = "http://localhost:8080/api/auth";

export const login = async (
  credentials: AuthCredentials
): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error("Erreur de connexion");
  }

  return response.json();
};

export const register = async (credentials: AuthCredentials): Promise<void> => {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...credentials,
      role: "ROLE_USER",
    }),
  });

  if (!response.ok) {
    throw new Error("Erreur d'inscription");
  }

  return response.json();
};

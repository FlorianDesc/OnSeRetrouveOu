import type { AuthCredentials, AuthResponse, RegisterCredentials } from "@/types/auth";
import { translateErrorMessage } from "@/lib/errorTranslator";

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
    let errorMessage = "Erreur de connexion";
    
    try {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } else {
        // Si ce n'est pas du JSON, récupère le texte brut
        errorMessage = await response.text();
      }
    } catch {
      // Si le parsing échoue, utilise le message par défaut
      errorMessage = "Erreur de connexion";
    }
    
    throw new Error(translateErrorMessage(errorMessage));
  }

  return response.json();
};

export const register = async (credentials: RegisterCredentials): Promise<void> => {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: credentials.username,
      password: credentials.password,
      confirmPassword: credentials.confirmPassword,
      firstname: credentials.firstname,
      lastname: credentials.lastname,
      email: credentials.email,
      role: "ROLE_USER",
    }),
  });

  if (!response.ok) {
    let errorMessage = "Erreur d'inscription";
    
    try {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } else {
        // Si ce n'est pas du JSON, récupère le texte brut
        errorMessage = await response.text();
      }
    } catch {
      // Si le parsing échoue, utilise le message par défaut
      errorMessage = "Erreur d'inscription";
    }
    
    throw new Error(translateErrorMessage(errorMessage));
  }

  return response.json();
};

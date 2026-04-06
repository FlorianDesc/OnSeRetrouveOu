import { API_BASE_URL } from "@/config";
import type { User } from "@/types/user";

const API_URL = `${API_BASE_URL}/users`;

export type UpdateProfileData = {
  firstname?: string;
  lastname?: string;
  email?: string;
  profileImage?: string;
};

export type UpdatePasswordData = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

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
    const event = new CustomEvent("unauthorized", {
      detail: { code: "UNAUTHORIZED" },
    });
    window.dispatchEvent(event);
    throw new Error("UNAUTHORIZED");
  }

  if (!response.ok) {
    throw new Error("Impossible de récupérer l'utilisateur courant");
  }

  return response.json();
};

export const updateProfile = async (data: UpdateProfileData): Promise<User> => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Utilisateur non authentifié");
  }

  const response = await fetch(`${API_URL}/current`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem("token");
    const event = new CustomEvent("unauthorized", {
      detail: { code: "UNAUTHORIZED" },
    });
    window.dispatchEvent(event);
    throw new Error("UNAUTHORIZED");
  }

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Erreur lors de la mise à jour du profil");
  }

  return response.json();
};

export const updatePassword = async (
  data: UpdatePasswordData,
): Promise<void> => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Utilisateur non authentifié");
  }

  const response = await fetch(`${API_URL}/current/password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem("token");
    const event = new CustomEvent("unauthorized", {
      detail: { code: "UNAUTHORIZED" },
    });
    window.dispatchEvent(event);
    throw new Error("UNAUTHORIZED");
  }

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Erreur lors du changement de mot de passe");
  }
};

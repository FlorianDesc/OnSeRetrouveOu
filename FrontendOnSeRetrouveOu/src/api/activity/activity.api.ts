import { API_BASE_URL } from "@/config";
import type { CreateActivityFormData } from "@/features/activity/schemas/activitySchema";
import type { Activity } from "@/types/activity";
import type { User } from "@/types/user";

const API_URL = `${API_BASE_URL}/activities`;

export type PaginatedResponse = {
  content: Activity[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
};

export const fetchActivities = async (
  page: number = 0,
  size: number = 10,
  sort?: string,
  search?: string,
): Promise<PaginatedResponse> => {
  const token = localStorage.getItem("token");

  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("size", String(size));
  if (sort) params.set("sort", sort);
  if (search) params.set("search", search);

  const response = await fetch(`${API_URL}?${params.toString()}`, {
    method: "GET",
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
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
    throw new Error("Erreur lors de la récupération des activités");
  }

  return response.json();
};

export const fetchActivityParticipants = async (
  activityId: number,
): Promise<User[]> => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Utilisateur non authentifié");
  }

  const response = await fetch(`${API_URL}/${activityId}/participants`, {
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
    throw new Error("Erreur lors de la récupération des participants");
  }

  return response.json();
};

export const createActivity = async (
  data: CreateActivityFormData,
): Promise<Activity> => {
  const token = localStorage.getItem("token");

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
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
    throw new Error("Erreur lors de la création de l'activité");
  }

  return response.json();
};

export const registerToActivity = async (
  activityId: number,
): Promise<Activity> => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Utilisateur non authentifié");
  }

  const response = await fetch(`${API_URL}/${activityId}/register`, {
    method: "POST",
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
    const errorText = await response.text();
    const normalized = (errorText || "").toLowerCase();
    let message = errorText || "Erreur lors de l'inscription à l'activité";

    if (normalized.includes("activity is full")) {
      message = "Cette activité est déjà complète";
    } else if (normalized.includes("user already registered")) {
      message = "Vous êtes déjà inscrit à cette activité";
    }
    throw new Error(message);
  }

  return response.json();
};

export const updateActivity = async (
  activityId: number,
  data: CreateActivityFormData,
): Promise<Activity> => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Utilisateur non authentifié");
  }

  const response = await fetch(`${API_URL}/${activityId}`, {
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
    throw new Error("Erreur lors de la mise à jour de l'activité");
  }

  return response.json();
};

export const deleteActivity = async (activityId: number): Promise<void> => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Utilisateur non authentifié");
  }

  const response = await fetch(`${API_URL}/${activityId}`, {
    method: "DELETE",
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
    throw new Error("Erreur lors de la suppression de l'activité");
  }
};

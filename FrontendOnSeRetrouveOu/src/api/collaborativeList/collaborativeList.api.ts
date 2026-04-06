import { API_BASE_URL } from "@/config";
import type {
  CollaborativeListItem,
  CreateCollaborativeListItemRequest,
} from "@/types/collaborativeList";

const API_URL = `${API_BASE_URL}/activities`;

export const fetchCollaborativeListItems = async (
  activityId: number,
): Promise<CollaborativeListItem[]> => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Utilisateur non authentifié");
  }

  const response = await fetch(`${API_URL}/${activityId}/collaborative-list`, {
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
    throw new Error("Erreur lors de la récupération de la liste collaborative");
  }

  return response.json();
};

export const addCollaborativeListItem = async (
  activityId: number,
  data: CreateCollaborativeListItemRequest,
): Promise<CollaborativeListItem> => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Utilisateur non authentifié");
  }

  const response = await fetch(`${API_URL}/${activityId}/collaborative-list`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    throw new Error("Session expirée");
  }

  if (!response.ok) {
    throw new Error("Erreur lors de l'ajout d'un élément à la liste");
  }

  return response.json();
};

export const updateCollaborativeListItem = async (
  activityId: number,
  itemId: number,
  data: CreateCollaborativeListItemRequest,
): Promise<CollaborativeListItem> => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Utilisateur non authentifié");
  }

  const response = await fetch(
    `${API_URL}/${activityId}/collaborative-list/${itemId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    },
  );

  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    throw new Error("Session expirée");
  }

  if (!response.ok) {
    throw new Error("Erreur lors de la mise à jour de l'élément");
  }

  return response.json();
};

export const deleteCollaborativeListItem = async (
  activityId: number,
  itemId: number,
): Promise<void> => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Utilisateur non authentifié");
  }

  const response = await fetch(
    `${API_URL}/${activityId}/collaborative-list/${itemId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    throw new Error("Session expirée");
  }

  if (!response.ok) {
    throw new Error("Erreur lors de la suppression de l'élément");
  }
};

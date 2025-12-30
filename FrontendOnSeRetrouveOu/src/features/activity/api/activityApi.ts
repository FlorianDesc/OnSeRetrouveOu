import type { Activity } from "@/types/activity";

const API_URL = "http://localhost:8080/api/activities";

export type PaginatedResponse = {
  content: Activity[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
};

export const fetchActivities = async (
  page: number = 0,
  size: number = 10
): Promise<PaginatedResponse> => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}?page=${page}&size=${size}`, {
    method: "GET",
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    throw new Error("Session expirée");
  }

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des activités");
  }

  return response.json();
};

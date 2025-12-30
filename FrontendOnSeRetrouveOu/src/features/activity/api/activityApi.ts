import type { Activity } from "@/types/activity";

const API_URL = "http://localhost:8080/api/activities";

export const fetchActivities = async (): Promise<Activity[]> => {
  const token = localStorage.getItem("token");

  const response = await fetch(API_URL, {
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

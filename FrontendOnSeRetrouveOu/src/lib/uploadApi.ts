const UPLOAD_URL = "http://localhost:8080/api/upload";
export const UPLOADS_BASE_URL = "http://localhost:8080/uploads";

export type UploadResponse = {
  fileName: string;
};

export const uploadImage = async (file: File): Promise<UploadResponse> => {
  const token = localStorage.getItem("token");

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(UPLOAD_URL, {
    method: "POST",
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: formData,
  });

  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    throw new Error("Session expirée");
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Erreur lors de l'upload de l'image");
  }

  return response.json();
};

export const getImageUrl = (imageName: string): string => {
  return `${UPLOADS_BASE_URL}/${imageName}`;
};

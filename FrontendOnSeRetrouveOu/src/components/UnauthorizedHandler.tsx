import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function UnauthorizedHandler() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleUnauthorized = (event: CustomEvent<{ code: string }>) => {
      if (event.detail?.code === "UNAUTHORIZED") {
        localStorage.removeItem("token");
        queryClient.clear();
        navigate("/login", { replace: true });
      }
    };

    window.addEventListener(
      "unauthorized",
      handleUnauthorized as EventListener,
    );
    return () =>
      window.removeEventListener(
        "unauthorized",
        handleUnauthorized as EventListener,
      );
  }, [navigate, queryClient]);

  return null;
}

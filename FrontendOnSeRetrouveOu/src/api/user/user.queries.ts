import { queryOptions } from "@tanstack/react-query";
import { fetchCurrentUser } from "./user.api";

// Query Keys
export const userKeys = {
  all: ["users"] as const,
  current: () => [...userKeys.all, "current"] as const,
};

// Query Options
export const currentUserQueryOptions = () =>
  queryOptions({
    queryKey: userKeys.current(),
    queryFn: fetchCurrentUser,
  });

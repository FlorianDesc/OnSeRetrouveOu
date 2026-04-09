import { queryOptions } from "@tanstack/react-query";
import { fetchActivities, fetchActivityParticipants } from "./activity.api";

// Query Keys
export const activityKeys = {
  all: ["activities"] as const,
  lists: () => [...activityKeys.all, "list"] as const,
  list: (page: number, size: number, sort?: string, search?: string) =>
    [...activityKeys.lists(), { page, size, sort, search }] as const,
  participants: () => [...activityKeys.all, "participants"] as const,
  participant: (activityId: number) =>
    [...activityKeys.participants(), activityId] as const,
};

// Query Options
export const activitiesQueryOptions = (
  page: number = 0,
  size: number = 10,
  sort?: string,
  search?: string,
) =>
  queryOptions({
    queryKey: activityKeys.list(page, size, sort, search),
    queryFn: () => fetchActivities(page, size, sort, search),
  });

export const activityParticipantsQueryOptions = (activityId: number) =>
  queryOptions({
    queryKey: activityKeys.participant(activityId),
    queryFn: () => fetchActivityParticipants(activityId),
  });

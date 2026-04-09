import { queryOptions } from "@tanstack/react-query";
import { fetchCollaborativeListItems } from "./collaborativeList.api";

// Query Keys
export const collaborativeListKeys = {
  all: ["collaborativeLists"] as const,
  lists: () => [...collaborativeListKeys.all, "list"] as const,
  list: (activityId: number) =>
    [...collaborativeListKeys.lists(), activityId] as const,
};

// Query Options
export const collaborativeListItemsQueryOptions = (activityId: number) =>
  queryOptions({
    queryKey: collaborativeListKeys.list(activityId),
    queryFn: () => fetchCollaborativeListItems(activityId),
  });

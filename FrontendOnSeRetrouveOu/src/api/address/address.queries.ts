import { queryOptions } from "@tanstack/react-query";
import { searchAddressesApi } from "./address.api";

// Query Keys
export const addressKeys = {
  all: ["addresses"] as const,
  searches: () => [...addressKeys.all, "search"] as const,
  search: (query: string) => [...addressKeys.searches(), query] as const,
};

// Query Options
export const addressesQueryOptions = (query: string) =>
  queryOptions({
    queryKey: addressKeys.search(query),
    queryFn: () => searchAddressesApi(query),
    enabled: query.length >= 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

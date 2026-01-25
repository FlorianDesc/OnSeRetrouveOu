import { Button } from "@/components/ui/button";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { fetchCurrentUser } from "../user/api/userApi";
import ActivityCard from "./ActivityCard";
import { fetchActivities } from "./api/activityApi";

import type { User } from "@/types/user";

type Props = {
  search?: string;
  sort?: string;
};

export default function ActivityCardList({ search, sort }: Props) {
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [currentPage]);

  const { data: currentUser } = useSuspenseQuery<User>({
    queryKey: ["current-user"],
    queryFn: fetchCurrentUser,
  });

  const { data } = useSuspenseQuery({
    queryKey: ["activities", currentPage, search ?? null, sort ?? null],
    queryFn: () => fetchActivities(currentPage, 10, sort, search),
  });

  const totalPages = data.totalPages;
  const currentActivities = data.content;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {currentActivities.map((activity) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            currentUser={currentUser}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentPage(0)}
            disabled={currentPage === 0}>
            &lt;&lt;
          </Button>

          {currentPage > 0 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentPage(currentPage - 1)}>
              {currentPage}
            </Button>
          )}

          <Button variant="default" size="icon" className="pointer-events-none">
            {currentPage + 1}
          </Button>

          {currentPage < totalPages - 1 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentPage(currentPage + 1)}>
              {currentPage + 2}
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentPage(totalPages - 1)}
            disabled={currentPage === totalPages - 1}>
            &gt;&gt;
          </Button>
        </div>
      )}
    </div>
  );
}

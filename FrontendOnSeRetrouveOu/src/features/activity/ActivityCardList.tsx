import { Button } from "@/components/ui/button";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import ActivityCard from "./ActivityCard";
import { fetchActivities } from "./api/activityApi";

export default function ActivityCardList() {
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [currentPage]);

  const { data } = useSuspenseQuery({
    queryKey: ["activities", currentPage],
    queryFn: () => fetchActivities(currentPage, 10),
  });

  const totalPages = data.totalPages;
  const currentActivities = data.content;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {currentActivities.map((activity) => (
          <ActivityCard key={activity.id} activity={activity} />
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

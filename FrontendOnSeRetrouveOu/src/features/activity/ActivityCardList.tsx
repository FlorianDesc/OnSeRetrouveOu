import { Button } from "@/components/ui/button";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import ActivityCard from "./ActivityCard";
import { fetchActivities } from "./api/activityApi";

const ITEMS_PER_PAGE = 10;

export default function ActivityCardList() {
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [currentPage]);

  const { data: activities } = useSuspenseQuery({
    queryKey: ["activities"],
    queryFn: fetchActivities,
  });

  const totalPages = Math.ceil(activities.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentActivities = activities.slice(startIndex, endIndex);

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
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}>
            &lt;&lt;
          </Button>

          {currentPage > 1 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentPage(currentPage - 1)}>
              {currentPage - 1}
            </Button>
          )}

          <Button variant="default" size="icon" className="pointer-events-none">
            {currentPage}
          </Button>

          {currentPage < totalPages && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentPage(currentPage + 1)}>
              {currentPage + 1}
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}>
            &gt;&gt;
          </Button>
        </div>
      )}
    </div>
  );
}

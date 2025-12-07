import ActivityCard from "@/features/activity/ActivityCard";

export default function Activity() {
  // const {data: activities} = useSuspenseQuery('activities', fetchActivities);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Liste des activités</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ActivityCard />
        <ActivityCard />
        <ActivityCard />
      </div>
    </div>
  );
}

import SearchBar from "@/components/SearchBar";
import { Spinner } from "@/components/ui/spinner";
import ActivityCardList from "@/features/activity/ActivityCardList";
import { Suspense, useState } from "react";

export default function Activity() {
  const [search, setSearch] = useState("");

  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense
        fallback={
          <div className="fixed inset-0 flex justify-center items-center">
            <Spinner className="size-7 text-gray-700" />
          </div>
        }>
        <div className="mb-6">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Rechercher une activité"
          />
        </div>
        <ActivityCardList />
      </Suspense>
    </div>
  );
}

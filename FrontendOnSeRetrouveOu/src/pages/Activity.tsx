import SearchBar from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import ActivityCardList from "@/features/activity/components/ActivityCardList";
import CreateActivitySheet from "@/features/activity/components/CreateActivitySheet";
import { Suspense, useState } from "react";

export default function Activity() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("DATE_RECENT");

  const sortLabel = (s: string) => {
    switch (s) {
      case "DATE_RECENT":
        return "Date (récentes)";
      case "DATE_OLD":
        return "Date (anciennes)";
      case "ALPHA_AZ":
        return "Nom A → Z";
      case "ALPHA_ZA":
        return "Nom Z → A";
      default:
        return s;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
        <div className="grid grid-cols-2 gap-4 md:flex md:flex-row md:gap-4 md:items-center col-span-2 md:col-span-1">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Rechercher une activité"
            className="md:max-w-md"
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full md:w-auto">
                Trier: {sortLabel(sort)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent sideOffset={8} className="w-48">
              <DropdownMenuLabel>Tri</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setSort("DATE_RECENT")}>
                Date (récentes)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSort("DATE_OLD")}>
                Date (anciennes)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSort("ALPHA_AZ")}>
                Nom A → Z
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSort("ALPHA_ZA")}>
                Nom Z → A
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <CreateActivitySheet 
          buttonClassName="w-full md:w-auto"
          wrapperClassName="col-span-2 md:col-span-1"
        />
      </div>

      <Suspense
        fallback={
          <div className="fixed inset-0 flex justify-center items-center">
            <Spinner className="size-7 text-gray-700" />
          </div>
        }>
        <ActivityCardList search={search} sort={sort} />
      </Suspense>
    </div>
  );
}

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import type { Activity } from "@/types/activity";
import { Suspense } from "react";
import ActivityForm from "./ActivityForm";

type EditActivitySheetProps = {
  activity: Activity;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function EditActivitySheet({
  activity,
  isOpen,
  onOpenChange,
}: EditActivitySheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex flex-col p-0 h-full">
        <SheetHeader className="p-4 shrink-0">
          <SheetTitle>Modifier l'activité</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-4">
          {isOpen && (
            <Suspense
              fallback={
                <div className="flex justify-center items-center py-8">
                  <Spinner className="h-4 w-4" />
                </div>
              }>
              <ActivityForm
                activity={activity}
                onSuccess={() => onOpenChange(false)}
              />
            </Suspense>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

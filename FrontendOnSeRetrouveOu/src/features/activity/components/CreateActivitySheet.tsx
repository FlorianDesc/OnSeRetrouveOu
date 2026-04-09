import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import ActivityForm from "./ActivityForm";

type CreateActivitySheetProps = {
  buttonClassName?: string;
  wrapperClassName?: string;
};

export default function CreateActivitySheet({
  buttonClassName = "",
  wrapperClassName = "",
}: CreateActivitySheetProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <div className={wrapperClassName}>
        <SheetTrigger asChild>
          <Button type="button" variant="outline" className={buttonClassName}>
            Créer une activité
            <PlusIcon className="h-4 w-4 ml-2" />
          </Button>
        </SheetTrigger>
      </div>
      <SheetContent className="flex flex-col p-0 h-full">
        <SheetHeader className="p-4 shrink-0">
          <SheetTitle>Créer une activité</SheetTitle>
          <SheetDescription>
            Remplissez les informations pour créer une nouvelle activité
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4">
          <ActivityForm onSuccess={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}

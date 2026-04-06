import { activityParticipantsQueryOptions } from "@/api/activity/activity.queries";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { capitalizeFirstLetter } from "@/lib/utils";
import type { User } from "@/types/user";
import { useQuery } from "@tanstack/react-query";

type ParticipantsSheetProps = {
  activityId: number;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

const getInitial = (user: User) => {
  const fallback = user.firstname?.[0] || user.lastname?.[0] || "?";
  return (user.username?.[0] || fallback || "?").toUpperCase();
};

function ParticipantsContent({ activityId }: { activityId: number }) {
  const { data: participants = [], isLoading } = useQuery(
    activityParticipantsQueryOptions(activityId),
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Spinner className="h-4 w-4" />
      </div>
    );
  }

  return (
    <>
      {participants.length === 0 && (
        <p className="text-sm text-gray-600">
          Aucun participant pour le moment
        </p>
      )}

      {participants.map((participant, index) => (
        <div key={participant.id}>
          <div className="flex items-center gap-3 px-1 py-1.5">
            <Avatar>
              <AvatarFallback>{getInitial(participant)}</AvatarFallback>
            </Avatar>
            <div className="text-sm text-gray-800">
              {capitalizeFirstLetter(participant.firstname)}{" "}
              {capitalizeFirstLetter(participant.lastname)}
            </div>
          </div>
          {index < participants.length - 1 && (
            <Separator className="my-2 bg-gray-200" />
          )}
        </div>
      ))}
    </>
  );
}

export default function ParticipantsSheet({
  activityId,
  isOpen,
  onOpenChange,
}: ParticipantsSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex flex-col p-0 h-full">
        <SheetHeader className="p-4 shrink-0">
          <SheetTitle>Participants</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-4 space-y-0">
          {isOpen && <ParticipantsContent activityId={activityId} />}
        </div>
      </SheetContent>
    </Sheet>
  );
}

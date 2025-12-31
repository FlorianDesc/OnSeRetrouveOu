import defaultImg from "@/assets/default-picture.jpg";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { capitalizeFirstLetter } from "@/lib/utils";
import type { Activity } from "@/types/activity";
import type { User } from "@/types/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Calendar, MapPin, User as UserIcon, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  fetchActivityParticipants,
  registerToActivity,
} from "./api/activityApi";
import { activityImages } from "./constants/activityImages";

type ActivityCardProps = {
  activity: Activity;
  currentUser?: User;
};

export default function ActivityCard({
  activity,
  currentUser,
}: ActivityCardProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const queryClient = useQueryClient();

  const formattedDate = new Date(activity.dateActivity).toLocaleDateString(
    "fr-FR",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  const activityImage = activityImages[activity.id] || defaultImg;
  const isCreator = currentUser && activity.creator?.id === currentUser.id;

  const { data: participants, isLoading: participantsLoading } = useQuery({
    queryKey: ["participants", activity.id],
    queryFn: () => fetchActivityParticipants(activity.id),
    enabled: isSheetOpen,
  });

  const registerMutation = useMutation({
    mutationFn: () => registerToActivity(activity.id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["participants", activity.id],
      });
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      setIsSheetOpen(true);
      toast.success("Vous avez été inscrit avec succès");
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Erreur lors de l'inscription");
    },
  });

  const participantList = participants || [];

  const getInitial = (user: User) => {
    const fallback = user.firstname?.[0] || user.lastname?.[0] || "?";
    return (user.username?.[0] || fallback || "?").toUpperCase();
  };

  return (
    <Card className="w-full overflow-hidden p-0">
      <div className="flex flex-row h-full">
        {activityImage && (
          <div className="w-[30%]">
            <img
              src={activityImage}
              alt={activity.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="flex flex-col w-[70%] py-4 h-full">
          <CardHeader className="pb-0">
            <CardTitle className="text-xl font-semibold">
              {activity.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-0 pt-0 flex flex-col h-full">
            <div className="flex-1 flex flex-col justify-start">
              <p className="text-sm text-gray-600 mb-3">
                {activity.description}
              </p>

              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-600">
                <span className="flex items-start gap-2 min-w-0 whitespace-normal wrap-break-word">
                  <MapPin className="size-4" />
                  {activity.location}
                </span>
                <span className="flex items-start gap-2 min-w-0 whitespace-normal wrap-break-word">
                  <Calendar className="size-4" />
                  {formattedDate}
                </span>

                <span className="flex items-start gap-2 min-w-0 whitespace-normal wrap-break-word">
                  <UserIcon className="size-4" />
                  Créé par {activity.creator.firstname}{" "}
                  {activity.creator.lastname}
                </span>
                <span className="flex items-start gap-2 min-w-0 whitespace-normal wrap-break-word">
                  <Users className="size-4" />
                  {activity.maxParticipants} participants
                </span>
              </div>
            </div>

            <div className="mt-6 w-full flex flex-row flex-wrap gap-3 items-end">
              {!isCreator && (
                <Button
                  className="flex-[0.65] min-w-[100px]"
                  variant="default"
                  onClick={() => registerMutation.mutate()}
                  disabled={registerMutation.isPending}>
                  {registerMutation.isPending ? (
                    <div className="flex items-center justify-center gap-2">
                      <Spinner className="text-white" />
                      <span className="sr-only">Inscription...</span>
                    </div>
                  ) : (
                    "S'inscrire"
                  )}
                </Button>
              )}

              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <Button className="flex-1 min-w-[140px]" variant="outline">
                    Voir les participants
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <SheetHeader>
                    <SheetTitle>Participants</SheetTitle>
                    <p className="text-sm text-gray-600">
                      {participantList.length} participant(s)
                    </p>
                  </SheetHeader>
                  <div className="px-4 pb-4 space-y-0 overflow-y-auto">
                    {participantsLoading && (
                      <p className="text-sm text-gray-600">Chargement...</p>
                    )}

                    {!participantsLoading && participantList.length === 0 && (
                      <p className="text-sm text-gray-600">
                        Aucun participant pour le moment
                      </p>
                    )}

                    {!participantsLoading &&
                      participantList.map((participant, index) => (
                        <div key={participant.id}>
                          <div className="flex items-center gap-3 px-1 py-1.5">
                            <Avatar>
                              <AvatarFallback>
                                {getInitial(participant)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col text-sm text-gray-800">
                              <span>
                                {capitalizeFirstLetter(participant.firstname)}{" "}
                                {capitalizeFirstLetter(participant.lastname)}
                              </span>
                              <span>
                                {capitalizeFirstLetter(participant.username)}
                              </span>
                            </div>
                          </div>
                          {index < participantList.length - 1 && (
                            <Separator className="my-2 bg-gray-200" />
                          )}
                        </div>
                      ))}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  );
}

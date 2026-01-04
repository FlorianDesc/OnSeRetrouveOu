import defaultImg from "@/assets/default-picture.jpg";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { capitalizeFirstLetter } from "@/lib/utils";
import type { Activity } from "@/types/activity";
import type { User } from "@/types/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Calendar,
  Edit2,
  Eye,
  MapPin,
  MoreHorizontal,
  Trash2,
  User as UserIcon,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  deleteActivity,
  fetchActivityParticipants,
  registerToActivity,
} from "./api/activityApi";
import { activityImages } from "./constants/activityImages";
import ActivityForm from "./CreateActivityForm";

type ActivityCardProps = {
  activity: Activity;
  currentUser?: User;
};

export default function ActivityCard({
  activity,
  currentUser,
}: ActivityCardProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
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

  const deleteMutation = useMutation({
    mutationFn: () => deleteActivity(activity.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      setIsDeleteDialogOpen(false);
      toast.success("Activité supprimée avec succès");
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Erreur lors de la suppression");
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
          <CardHeader className="pb-0 flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-semibold">
              {activity.title}
            </CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="size-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="flex items-center gap-2"
                  onSelect={() => setIsSheetOpen(true)}>
                  <Eye className="size-4" />
                  Voir les participants
                </DropdownMenuItem>
                {isCreator && (
                  <>
                    <DropdownMenuItem
                      className="flex items-center gap-2"
                      onSelect={() => setIsEditSheetOpen(true)}>
                      <Edit2 className="size-4" />
                      Modifier
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="group flex items-center gap-2 text-red-600 data-highlighted:bg-red-50 data-highlighted:text-red-700 focus:bg-red-50 focus:text-red-700"
                      onSelect={() => setIsDeleteDialogOpen(true)}>
                      <Trash2 className="size-4 text-red-600 group-data-highlighted:text-red-700" />
                      Supprimer
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
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
              <Button
                className="w-full"
                variant="outline"
                onClick={() => registerMutation.mutate()}
                disabled={isCreator || registerMutation.isPending}>
                {registerMutation.isPending ? (
                  <div className="flex items-center justify-center gap-2">
                    <Spinner className="text-current" />
                    <span className="sr-only">Inscription...</span>
                  </div>
                ) : (
                  "S'inscrire"
                )}
              </Button>

              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
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

              <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
                <SheetContent side="right">
                  <SheetHeader>
                    <SheetTitle>Modifier l'activité</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <ActivityForm
                      activity={activity}
                      onSuccess={() => setIsEditSheetOpen(false)}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </CardContent>
        </div>
      </div>
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette activité ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est définitive. Confirmez pour supprimer l'activité "
              {activity.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-700"
              disabled={deleteMutation.isPending}
              onClick={() => deleteMutation.mutate()}>
              {deleteMutation.isPending ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

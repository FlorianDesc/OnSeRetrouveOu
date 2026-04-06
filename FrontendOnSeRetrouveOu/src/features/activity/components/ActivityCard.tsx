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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { UPLOADS_BASE_URL } from "@/lib/uploadApi";
import type { Activity } from "@/types/activity";
import type { User } from "@/types/user";
import {
  Calendar,
  Edit2,
  Eye,
  ListTodo,
  MapPin,
  MoreHorizontal,
  Trash2,
  User as UserIcon,
  Users,
} from "lucide-react";
import { useState } from "react";
import { activityImages } from "../constants/activityImages";
import { useDeleteActivity } from "../hooks/useDeleteActivity";
import { useRegisterToActivity } from "../hooks/useRegisterToActivity";

import { ActivityMapModal } from "./ActivityMapModal";
import CollaborativeListSheet from "./CollaborativeListSheet";
import EditActivitySheet from "./EditActivitySheet";
import ParticipantsSheet from "./ParticipantsSheet";

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
  const [isCollaborativeListOpen, setIsCollaborativeListOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  const formattedDate = new Date(activity.dateActivity).toLocaleDateString(
    "fr-FR",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  );

  const activityImage = activity.imageName
    ? `${UPLOADS_BASE_URL}/${activity.imageName}`
    : activityImages[activity.id] || defaultImg;
  const isCreator = currentUser && activity.creator?.id === currentUser.id;

  const registerMutation = useRegisterToActivity(activity.id, () => {
    setIsSheetOpen(true);
  });

  const deleteMutation = useDeleteActivity(() => {
    setIsDeleteDialogOpen(false);
  });

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
                <DropdownMenuItem
                  className="flex items-center gap-2"
                  onSelect={() => setIsCollaborativeListOpen(true)}>
                  <ListTodo className="size-4" />
                  Liste collaborative
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
              <p className="text-sm text-gray-600 mb-3 truncate max-w-xs">
                {activity.description}
              </p>

              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-600">
                <button
                  onClick={() => setIsMapModalOpen(true)}
                  className="flex items-center gap-2 min-w-0 hover:text-blue-600 hover:underline transition-colors cursor-pointer">
                  <MapPin className="size-4 shrink-0" />
                  <span className="truncate">{activity.location}</span>
                </button>
                <span className="flex items-center gap-2 min-w-0">
                  <Calendar className="size-4 shrink-0" />
                  <span className="truncate">{formattedDate}</span>
                </span>

                <span className="flex items-center gap-2 min-w-0">
                  <UserIcon className="size-4 shrink-0" />
                  <span className="truncate">
                    Créé par {activity.creator.firstname}{" "}
                    {activity.creator.lastname}
                  </span>
                </span>
                <span className="flex items-center gap-2 min-w-0">
                  <Users className="size-4 shrink-0" />
                  <span className="truncate">
                    {activity.maxParticipants} participants
                  </span>
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
                    <Spinner className="text-current h-4 w-4" />
                    <span>Inscription...</span>
                  </div>
                ) : (
                  "S'inscrire"
                )}
              </Button>

              {isSheetOpen && (
                <ParticipantsSheet
                  activityId={activity.id}
                  isOpen={isSheetOpen}
                  onOpenChange={setIsSheetOpen}
                />
              )}

              {isEditSheetOpen && (
                <EditActivitySheet
                  activity={activity}
                  isOpen={isEditSheetOpen}
                  onOpenChange={setIsEditSheetOpen}
                />
              )}

              {isCollaborativeListOpen && (
                <CollaborativeListSheet
                  activity={activity}
                  isOpen={isCollaborativeListOpen}
                  onOpenChange={setIsCollaborativeListOpen}
                  currentUserId={currentUser?.id}
                />
              )}
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
              onClick={() => deleteMutation.mutate(activity.id)}>
              {deleteMutation.isPending ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ActivityMapModal
        location={activity.location}
        isOpen={isMapModalOpen}
        onOpenChange={setIsMapModalOpen}
      />
    </Card>
  );
}

import { activityParticipantsQueryOptions } from "@/api/activity/activity.queries";
import { collaborativeListItemsQueryOptions } from "@/api/collaborativeList/collaborativeList.queries";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import type { CollaborativeListItem } from "@/types/collaborativeList";
import { useQuery } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  useAddCollaborativeListItem,
  useDeleteCollaborativeListItem,
  useUpdateCollaborativeListItem,
} from "../hooks/useCollaborativeListMutations";
import type { CollaborativeListItemFormData } from "../schemas/collaborativeListSchema";

type CollaborativeListSheetProps = {
  activity: Activity;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentUserId?: number;
};

const statusLabels: Record<string, string> = {
  EN_ATTENTE: "En attente",
  ASSIGNE: "Assigné",
};

function CollaborativeListContent({
  activity,
}: Omit<CollaborativeListSheetProps, "isOpen" | "onOpenChange">) {
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);

  const form = useForm<CollaborativeListItemFormData>({
    defaultValues: {
      title: "",
      bringText: "",
      status: "EN_ATTENTE",
      assignedUserId: null,
    },
  });

  const { data: items = [], isLoading } = useQuery(
    collaborativeListItemsQueryOptions(activity.id),
  );

  const { data: participants = [] } = useQuery(
    activityParticipantsQueryOptions(activity.id),
  );

  const addItemMutation = useAddCollaborativeListItem(activity.id, () => {
    form.reset();
  });

  const deleteItemMutation = useDeleteCollaborativeListItem(activity.id);

  const editItemMutation = useUpdateCollaborativeListItem(activity.id, () => {
    form.reset();
    setEditingItemId(null);
  });

  const onSubmit = (data: CollaborativeListItemFormData) => {
    if (editingItemId !== null) {
      editItemMutation.mutate({ itemId: editingItemId, formData: data });
    } else {
      addItemMutation.mutate(data);
    }
  };

  const handleEditItem = (item: CollaborativeListItem) => {
    setEditingItemId(item.id);
    form.setValue("title", item.title);
    form.setValue("bringText", item.bringText);
    form.setValue("status", item.status);
    // Récupérer l'ID depuis assignedUserId ou depuis assignedUser.id
    const assignedId = item.assignedUserId ?? item.assignedUser?.id ?? null;
    form.setValue("assignedUserId", assignedId);
    if (assignedId) {
      form.setValue("status", "ASSIGNE");
    }
  };

  const handleCancelEdit = () => {
    setEditingItemId(null);
    form.reset();
  };

  const handleDeleteItem = (itemId: number) => {
    setDeleteItemId(itemId);
  };

  const confirmDeleteItem = () => {
    if (deleteItemId !== null) {
      deleteItemMutation.mutate(deleteItemId);
      setDeleteItemId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Spinner className="h-4 w-4" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ex: Pizza"
                      {...field}
                      disabled={addItemMutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bringText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ex: 2 grandes pizzas"
                      {...field}
                      disabled={addItemMutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Statut</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant={
                          field.value === "EN_ATTENTE" ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => {
                          field.onChange("EN_ATTENTE");
                          form.setValue("assignedUserId", null);
                        }}
                        disabled={
                          addItemMutation.isPending ||
                          editItemMutation.isPending
                        }
                        className="flex-1">
                        En attente
                      </Button>
                      <Button
                        type="button"
                        variant={
                          field.value === "ASSIGNE" ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => field.onChange("ASSIGNE")}
                        disabled={
                          addItemMutation.isPending ||
                          editItemMutation.isPending
                        }
                        className="flex-1">
                        Assigné
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="assignedUserId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Personne à assignée</FormLabel>
                  <Select
                    value={field.value?.toString() ?? "none"}
                    onValueChange={(value) =>
                      field.onChange(value === "none" ? null : parseInt(value))
                    }
                    disabled={
                      form.watch("status") === "EN_ATTENTE" ||
                      addItemMutation.isPending ||
                      editItemMutation.isPending
                    }>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            form.watch("status") === "EN_ATTENTE"
                              ? "Aucun"
                              : "Sélectionner une personne"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">Aucun</SelectItem>
                      {participants.map((participant) => (
                        <SelectItem
                          key={participant.id}
                          value={participant.id.toString()}>
                          {capitalizeFirstLetter(participant.firstname)}{" "}
                          {capitalizeFirstLetter(participant.lastname)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2">
              <Button
                type="submit"
                className="flex-1"
                disabled={
                  addItemMutation.isPending || editItemMutation.isPending
                }>
                {addItemMutation.isPending || editItemMutation.isPending ? (
                  <div className="flex items-center justify-center gap-2">
                    <Spinner className="text-current" />
                    <span>
                      {editingItemId ? "Modification..." : "Ajout..."}
                    </span>
                  </div>
                ) : editingItemId ? (
                  "Modifier"
                ) : (
                  "Ajouter"
                )}
              </Button>
              {editingItemId !== null && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelEdit}
                  disabled={editItemMutation.isPending}
                  className="flex-1">
                  Annuler
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>

      <Separator className="my-4 -mx-4" />

      {/* Liste des éléments */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm">Éléments ({items.length})</h3>

        {items.length === 0 && (
          <p className="text-sm text-gray-600 text-center py-4">
            Aucun élément pour le moment
          </p>
        )}

        {items.length > 0 && (
          <div className="space-y-2">
            {items.map((item, index) => (
              <div key={item.id}>
                <div className="py-2 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">
                        {item.title}
                      </p>
                      <p className="text-sm text-gray-600 truncate">
                        {item.bringText}
                      </p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => handleEditItem(item)}
                        className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        disabled={editItemMutation.isPending}>
                        <Pencil className="size-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        disabled={deleteItemMutation.isPending}>
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      {statusLabels[item.status]}
                    </span>
                    {item.assignedUser && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        {capitalizeFirstLetter(item.assignedUser.firstname)}{" "}
                        {capitalizeFirstLetter(item.assignedUser.lastname)}
                      </span>
                    )}
                  </div>
                </div>
                {index < items.length - 1 && (
                  <Separator className="mt-2 bg-gray-100" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <AlertDialog
        open={deleteItemId !== null}
        onOpenChange={(open) => !open && setDeleteItemId(null)}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cet élément ?</AlertDialogTitle>
            <AlertDialogDescription>
              L'élément sera définitivement supprimé de la liste collaborative.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteItemMutation.isPending}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-700"
              disabled={deleteItemMutation.isPending}
              onClick={confirmDeleteItem}>
              {deleteItemMutation.isPending ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default function CollaborativeListSheet({
  activity,
  isOpen,
  onOpenChange,
  currentUserId,
}: CollaborativeListSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex flex-col p-0 h-full">
        <SheetHeader className="p-4 shrink-0">
          <SheetTitle>Liste collaborative</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-4">
          {isOpen && (
            <CollaborativeListContent
              activity={activity}
              currentUserId={currentUserId}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

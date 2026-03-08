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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  addCollaborativeListItem,
  deleteCollaborativeListItem,
  fetchCollaborativeListItems,
  updateCollaborativeListItem,
} from "./api/collaborativeListApi";
import type { CollaborativeListItemFormData } from "./schemas/collaborativeListSchema";

type CollaborativeListSheetProps = {
  activity: Activity;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentUserId?: number;
};

const statusLabels: Record<string, string> = {
  A_APPORTER: "À apporter",
  APPORTE: "Apporté",
  EN_ATTENTE: "En attente",
};

export default function CollaborativeListSheet({
  activity,
  isOpen,
  onOpenChange,
  currentUserId,
}: CollaborativeListSheetProps) {
  const queryClient = useQueryClient();
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);

  const form = useForm<CollaborativeListItemFormData>({
    defaultValues: {
      title: "",
      bringText: "",
      status: "A_APPORTER",
    },
  });

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["collaborativeList", activity.id],
    queryFn: () => fetchCollaborativeListItems(activity.id),
    enabled: isOpen,
  });

  const addItemMutation = useMutation({
    mutationFn: (data: CollaborativeListItemFormData) =>
      addCollaborativeListItem(activity.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["collaborativeList", activity.id],
      });
      form.reset();
      toast.success("Élément ajouté avec succès");
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Erreur lors de l'ajout");
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: (itemId: number) =>
      deleteCollaborativeListItem(activity.id, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["collaborativeList", activity.id],
      });
      toast.success("Élément supprimé avec succès");
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Erreur lors de la suppression");
    },
  });

  const editItemMutation = useMutation({
    mutationFn: (data: {
      itemId: number;
      formData: CollaborativeListItemFormData;
    }) => updateCollaborativeListItem(activity.id, data.itemId, data.formData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["collaborativeList", activity.id],
      });
      form.reset();
      setEditingItemId(null);
      toast.success("Élément modifié avec succès");
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Erreur lors de la modification");
    },
  });

  const getInitials = (item: CollaborativeListItem) => {
    const firstLetter = item.creator.firstname?.[0] || "";
    const lastLetter = item.creator.lastname?.[0] || "";
    return (firstLetter + lastLetter).toUpperCase() || "?";
  };

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

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Liste collaborative</SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-6 px-4">
          {/* Formulaire */}
          <div className="space-y-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4">
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
                              field.value === "A_APPORTER"
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() => field.onChange("A_APPORTER")}
                            disabled={addItemMutation.isPending}
                            className="flex-1">
                            À apporter
                          </Button>
                          <Button
                            type="button"
                            variant={
                              field.value === "APPORTE" ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => field.onChange("APPORTE")}
                            disabled={addItemMutation.isPending}
                            className="flex-1">
                            Apporté
                          </Button>
                          <Button
                            type="button"
                            variant={
                              field.value === "EN_ATTENTE"
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() => field.onChange("EN_ATTENTE")}
                            disabled={addItemMutation.isPending}
                            className="flex-1">
                            En attente
                          </Button>
                        </div>
                      </FormControl>
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

            {isLoading && (
              <p className="text-sm text-gray-600 text-center py-4">
                Chargement...
              </p>
            )}

            {!isLoading && items.length === 0 && (
              <p className="text-sm text-gray-600 text-center py-4">
                Aucun élément pour le moment
              </p>
            )}

            {!isLoading && items.length > 0 && (
              <div className="space-y-2">
                {items.map((item, index) => (
                  <div key={item.id}>
                    <div className="flex gap-3 py-2">
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarFallback className="text-xs font-semibold">
                          {getInitials(item)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {capitalizeFirstLetter(item.creator.firstname)}{" "}
                              {capitalizeFirstLetter(item.creator.lastname)}
                            </p>
                            <p className="text-sm text-gray-600 truncate">
                              {item.title}
                            </p>
                          </div>
                          {currentUserId === item.creator.id && (
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
                          )}
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-2">
                          {item.bringText}
                        </p>
                        <div className="pt-0.5">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            {statusLabels[item.status]}
                          </span>
                        </div>
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
        </div>

        <AlertDialog
          open={deleteItemId !== null}
          onOpenChange={(open) => !open && setDeleteItemId(null)}>
          <AlertDialogContent className="max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle>Supprimer cet élément ?</AlertDialogTitle>
              <AlertDialogDescription>
                L'élément sera définitivement supprimé de la liste
                collaborative.
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
      </SheetContent>
    </Sheet>
  );
}

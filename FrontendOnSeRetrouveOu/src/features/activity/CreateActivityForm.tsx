import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import type { Activity } from "@/types/activity";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PlusIcon, ImageIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Controller,
  useForm,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";
import { toast } from "sonner";
import { createActivity, updateActivity } from "./api/activityApi";
import { uploadImage, UPLOADS_BASE_URL } from "@/lib/uploadApi";
import {
  createActivitySchema,
  type CreateActivityFormData,
} from "./schemas/activitySchema";

type ActivityFormProps = {
  activity?: Activity;
  onSuccess?: () => void;
};

type FormFieldsProps = {
  register: UseFormRegister<CreateActivityFormData>;
  control: Control<CreateActivityFormData>;
  errors: FieldErrors<CreateActivityFormData>;
  imagePreview: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageRemove: () => void;
  isUploading: boolean;
};

const FormFields = ({
  register,
  control,
  errors,
  imagePreview,
  onImageChange,
  onImageRemove,
  isUploading,
}: FormFieldsProps) => (
  <>
    <div className="flex flex-col gap-2">
      <Label htmlFor="title">
        Titre<span className="text-red-500">*</span>
      </Label>
      <Input id="title" {...register("title")} />
      {errors.title && (
        <p className="text-sm text-red-500">{errors.title.message}</p>
      )}
    </div>

    <div className="flex flex-col gap-2">
      <Label htmlFor="description">
        Description<span className="text-red-500">*</span>
      </Label>
      <Input id="description" {...register("description")} />
      {errors.description && (
        <p className="text-sm text-red-500">{errors.description.message}</p>
      )}
    </div>

    <div className="flex flex-col gap-2">
      <Label htmlFor="location">
        Lieu<span className="text-red-500">*</span>
      </Label>
      <Input id="location" {...register("location")} />
      {errors.location && (
        <p className="text-sm text-red-500">{errors.location.message}</p>
      )}
    </div>

    <div className="flex flex-col gap-2">
      <Label htmlFor="dateActivity">
        Date<span className="text-red-500">*</span>
      </Label>
      <Controller
        name="dateActivity"
        control={control}
        render={({ field }) => (
          <DatePicker
            date={field.value ? new Date(field.value) : undefined}
            onDateChange={(date) => {
              field.onChange(date ? date.toISOString().split("T")[0] : "");
            }}
            placeholder="Sélectionner une date"
          />
        )}
      />
      {errors.dateActivity && (
        <p className="text-sm text-red-500">{errors.dateActivity.message}</p>
      )}
    </div>

    <div className="flex flex-col gap-2">
      <Label htmlFor="maxParticipants">Nombre maximum de participants</Label>
      <Input
        id="maxParticipants"
        type="number"
        {...register("maxParticipants")}
      />
      {errors.maxParticipants && (
        <p className="text-sm text-red-500">{errors.maxParticipants.message}</p>
      )}
    </div>

    <div className="flex flex-col gap-2">
      <Label>Image (optionnel)</Label>
      {imagePreview ? (
        <div className="relative w-full h-40 rounded-md overflow-hidden border">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={onImageRemove}
            className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70">
            <XIcon className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <label
          htmlFor="image-upload"
          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md cursor-pointer hover:border-gray-400 transition-colors">
          {isUploading ? (
            <Spinner className="h-6 w-6" />
          ) : (
            <>
              <ImageIcon className="h-8 w-8 text-gray-400" />
              <span className="text-sm text-gray-500 mt-2">
                Cliquez pour ajouter une image
              </span>
            </>
          )}
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onImageChange}
            disabled={isUploading}
          />
        </label>
      )}
    </div>
  </>
);

export default function ActivityForm({
  activity,
  onSuccess,
}: ActivityFormProps) {
  const [open, setOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const queryClient = useQueryClient();
  const isEditing = !!activity;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
  } = useForm<CreateActivityFormData>({
    resolver: zodResolver(createActivitySchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      dateActivity: "",
      maxParticipants: undefined,
      imageName: undefined,
    },
  });

  useEffect(() => {
    if (isEditing && activity) {
      setValue("title", activity.title);
      setValue("description", activity.description);
      setValue("location", activity.location);
      setValue("dateActivity", activity.dateActivity);
      setValue("maxParticipants", activity.maxParticipants || undefined);
      setValue("imageName", activity.imageName || undefined);
      if (activity.imageName) {
        setImagePreview(`${UPLOADS_BASE_URL}/${activity.imageName}`);
      }
    }
  }, [activity, isEditing, setValue]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    setIsUploading(true);
    try {
      const result = await uploadImage(file);
      setValue("imageName", result.fileName);
      toast.success("Image uploadée");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erreur lors de l'upload",
      );
      setImagePreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageRemove = () => {
    setImagePreview(null);
    setValue("imageName", undefined);
  };

  const createMutation = useMutation({
    mutationFn: createActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      reset();
      setImagePreview(null);
      setOpen(false);
      toast.success("Activité créée avec succès");
    },
    onError: (error: Error) => {
      console.error("Error creating activity:", error);
      toast.error("Erreur lors de la création de l'activité");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: CreateActivityFormData) =>
      updateActivity(activity!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      reset();
      onSuccess?.();
      toast.success("Activité mise à jour avec succès");
    },
    onError: (error: Error) => {
      console.error("Error updating activity:", error);
      toast.error(error.message || "Erreur lors de la mise à jour");
    },
  });

  const mutation = isEditing ? updateMutation : createMutation;

  const onSubmit = (data: CreateActivityFormData) => {
    const cleanedData = {
      ...data,
      maxParticipants: data.maxParticipants || undefined,
    };
    mutation.mutate(cleanedData);
  };

  const formContent = (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <FormFields
        register={register}
        control={control}
        errors={errors}
        imagePreview={imagePreview}
        onImageChange={handleImageChange}
        onImageRemove={handleImageRemove}
        isUploading={isUploading}
      />

      {isEditing ? (
        <div className="flex gap-2 mt-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            disabled={mutation.isPending}
            onClick={() => onSuccess?.()}>
            Annuler
          </Button>
          <Button
            type="submit"
            className="flex-1"
            disabled={mutation.isPending}>
            {mutation.isPending ? (
              <>
                <Spinner className="mr-2" />
                Mise à jour...
              </>
            ) : (
              "Enregistrer"
            )}
          </Button>
        </div>
      ) : (
        <SheetFooter className="mt-4 flex gap-2 px-0">
          <SheetClose asChild>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              disabled={mutation.isPending}>
              Annuler
            </Button>
          </SheetClose>
          <Button
            type="submit"
            className="flex-1"
            disabled={mutation.isPending}>
            {mutation.isPending ? (
              <>
                <Spinner className="mr-2" />
                Création...
              </>
            ) : (
              "Créer"
            )}
          </Button>
        </SheetFooter>
      )}
    </form>
  );

  if (isEditing) {
    return <div className="p-6">{formContent}</div>;
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">
          Créer une activité
          <PlusIcon className="h-4 w-4 ml-2" />
        </Button>
      </SheetTrigger>
      <SheetContent className="p-6">
        <SheetHeader className="p-0">
          <SheetTitle>Créer une activité</SheetTitle>
          <SheetDescription>
            Remplissez les informations pour créer une nouvelle activité
          </SheetDescription>
        </SheetHeader>

        <div className="pt-6">{formContent}</div>
      </SheetContent>
    </Sheet>
  );
}

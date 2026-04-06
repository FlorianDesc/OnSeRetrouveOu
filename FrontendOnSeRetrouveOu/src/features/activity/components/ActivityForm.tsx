import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { uploadImage, UPLOADS_BASE_URL } from "@/lib/uploadApi";
import type { Activity } from "@/types/activity";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Controller,
  useForm,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";
import { toast } from "sonner";
import { useCreateActivity } from "../hooks/useCreateActivity";
import { useUpdateActivity } from "../hooks/useUpdateActivity";
import {
  createActivitySchema,
  type CreateActivityFormData,
} from "../schemas/activitySchema";
import { LocationCombobox } from "./LocationCombobox";

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
  locationValue: string;
  onLocationChange: (value: string) => void;
};

const FormFields = ({
  register,
  control,
  errors,
  imagePreview,
  onImageChange,
  locationValue,
  onLocationChange,
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

    <LocationCombobox
      value={locationValue}
      onChange={onLocationChange}
      error={errors.location?.message}
    />

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
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [locationValue, setLocationValue] = useState("");
  const isEditing = !!activity;

  const createMutation = useCreateActivity(() => {
    reset();
    setImagePreview(null);
    onSuccess?.();
  });

  const updateMutation = useUpdateActivity(activity?.id || 0, () => {
    reset();
    onSuccess?.();
  });

  const mutation = isEditing ? updateMutation : createMutation;

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
      setLocationValue(activity.location);
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
        locationValue={locationValue}
        onLocationChange={(value) => {
          setLocationValue(value);
          setValue("location", value);
        }}
      />

      <div className="flex gap-2 mt-4">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          disabled={mutation.isPending}
          onClick={() => onSuccess?.()}>
          Annuler
        </Button>
        <Button type="submit" className="flex-1" disabled={mutation.isPending}>
          {mutation.isPending ? (
            <>
              <Spinner className="mr-2" />
              {isEditing ? "Mise à jour..." : "Création..."}
            </>
          ) : isEditing ? (
            "Enregistrer"
          ) : (
            "Créer"
          )}
        </Button>
      </div>
    </form>
  );

  return formContent;
}

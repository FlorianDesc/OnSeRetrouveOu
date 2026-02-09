import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import {
  fetchCurrentUser,
  updatePassword,
  updateProfile,
} from "@/features/user/api/userApi";
import { uploadImage, UPLOADS_BASE_URL } from "@/lib/uploadApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Camera, Eye, EyeOff } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

export default function Profile() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form states
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { data: user, isLoading } = useQuery({
    queryKey: ["current-user"],
    queryFn: fetchCurrentUser,
  });

  const profileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
      setIsEditingProfile(false);
      toast.success("Profil mis à jour avec succès");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const passwordMutation = useMutation({
    mutationFn: updatePassword,
    onSuccess: () => {
      setIsEditingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Mot de passe mis à jour avec succès");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const imageMutation = useMutation({
    mutationFn: async (file: File) => {
      const result = await uploadImage(file);
      return updateProfile({ profileImage: result.fileName });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
      toast.success("Photo de profil mise à jour");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleEditProfile = () => {
    if (user) {
      setFirstname(user.firstname || "");
      setLastname(user.lastname || "");
      setEmail(user.email || "");
    }
    setIsEditingProfile(true);
  };

  const handleSaveProfile = () => {
    profileMutation.mutate({
      firstname,
      lastname,
      email,
    });
  };

  const handleSavePassword = () => {
    if (newPassword !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }
    passwordMutation.mutate({
      currentPassword,
      newPassword,
      confirmPassword,
    });
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      imageMutation.mutate(file);
    }
  };

  const getInitials = () => {
    if (!user) return "?";
    const first = user.firstname?.[0] || "";
    const last = user.lastname?.[0] || "";
    return (first + last).toUpperCase() || user.username?.[0]?.toUpperCase() || "?";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Utilisateur non trouvé</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-semibold mb-6">Mon Profil</h1>

      {/* Photo de profil */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Photo de profil</CardTitle>
          <CardDescription>
            Cliquez sur la photo pour la modifier
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <div className="relative group cursor-pointer" onClick={handleImageClick}>
            <Avatar className="size-32">
              {user.profileImage ? (
                <AvatarImage src={`${UPLOADS_BASE_URL}/${user.profileImage}`} />
              ) : null}
              <AvatarFallback className="text-3xl">{getInitials()}</AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              {imageMutation.isPending ? (
                <Spinner className="size-6 text-white" />
              ) : (
                <Camera className="size-8 text-white" />
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
        </CardContent>
      </Card>

      {/* Informations personnelles */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Informations personnelles</CardTitle>
            <CardDescription>
              Gérez vos informations personnelles
            </CardDescription>
          </div>
          {!isEditingProfile && (
            <Button variant="outline" onClick={handleEditProfile}>
              Modifier
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditingProfile ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstname">Prénom</Label>
                  <Input
                    id="firstname"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastname">Nom</Label>
                  <Input
                    id="lastname"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setIsEditingProfile(false)}
                  disabled={profileMutation.isPending}
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleSaveProfile}
                  disabled={profileMutation.isPending}
                >
                  {profileMutation.isPending ? (
                    <>
                      <Spinner className="mr-2 size-4" />
                      Enregistrement...
                    </>
                  ) : (
                    "Enregistrer"
                  )}
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Prénom</p>
                  <p className="font-medium">{user.firstname || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Nom</p>
                  <p className="font-medium">{user.lastname || "-"}</p>
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Nom d'utilisateur</p>
                <p className="font-medium">{user.username}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user.email || "-"}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Membre depuis</p>
                <p className="font-medium">
                  {new Date(user.createdAt).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Changement de mot de passe */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Mot de passe</CardTitle>
            <CardDescription>
              Modifiez votre mot de passe
            </CardDescription>
          </div>
          {!isEditingPassword && (
            <Button variant="outline" onClick={() => setIsEditingPassword(true)}>
              Modifier
            </Button>
          )}
        </CardHeader>
        {isEditingPassword && (
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Mot de passe actuel</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nouveau mot de passe</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditingPassword(false);
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                }}
                disabled={passwordMutation.isPending}
              >
                Annuler
              </Button>
              <Button
                onClick={handleSavePassword}
                disabled={passwordMutation.isPending}
              >
                {passwordMutation.isPending ? (
                  <>
                    <Spinner className="mr-2 size-4" />
                    Enregistrement...
                  </>
                ) : (
                  "Changer le mot de passe"
                )}
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}

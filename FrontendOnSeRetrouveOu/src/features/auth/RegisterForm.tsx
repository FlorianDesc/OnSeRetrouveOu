import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { registerSchema, type RegisterFormData } from "./schemas/authSchema";

export default function RegisterForm() {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormData) => {
    signUp.mutate(data, {
      onSuccess: () => {
        navigate("/login");
      },
      onError: (error) => {
        console.error("Erreur d'inscription:", error);
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Inscription</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Nom d'utilisateur</Label>
              <Input
                id="username"
                type="text"
                {...register("username")}
                placeholder="Choisissez un nom d'utilisateur"
              />
              {errors.username && (
                <p className="text-sm text-red-500">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                {...register("password")}
                placeholder="Choisissez un mot de passe"
              />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {signUp.isError && (
              <p className="text-sm text-red-500">
                Une erreur est survenue. Veuillez réessayer.
              </p>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={signUp.isPending}>
              {signUp.isPending ? "Inscription..." : "S'inscrire"}
            </Button>

            <p className="text-center text-sm text-gray-600">
              Déjà un compte ?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                Se connecter
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

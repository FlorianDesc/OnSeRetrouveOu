/**
 * Traduit les messages d'erreur du serveur en français
 */
export const translateErrorMessage = (errorMessage: string): string => {
  // Erreurs directes du backend
  if (errorMessage.includes("Username already exists")) {
    return "Le nom d'utilisateur existe déjà";
  }

  if (errorMessage.includes("Email already exists")) {
    return "L'email existe déjà";
  }

  // Vérifier si c'est une erreur de contrainte unique
  if (errorMessage.includes('duplicate key value violates unique constraint')) {
    if (errorMessage.includes('users_email_key')) {
      return "L'email existe déjà";
    }
    if (errorMessage.includes('users_username_key')) {
      return "Le nom d'utilisateur existe déjà";
    }
    return "Cette valeur existe déjà";
  }

  // Erreurs de validation
  if (errorMessage.includes('password')) {
    return "Le mot de passe ne respecte pas les critères requis";
  }

  if (errorMessage.includes('email')) {
    return "L'adresse email n'est pas valide";
  }

  if (errorMessage.includes('username')) {
    return "Le nom d'utilisateur n'est pas valide";
  }

  // Erreurs de base de données génériques
  if (errorMessage.includes('SQL') || errorMessage.includes('constraint')) {
    return "Une erreur base de données s'est produite";
  }

  // Erreur non gérée
  return errorMessage || "Une erreur est survenue";
};

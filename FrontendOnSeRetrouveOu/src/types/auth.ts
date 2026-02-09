export type AuthCredentials = {
  username: string;
  password: string;
};

export type RegisterCredentials = {
  username: string;
  password: string;
  confirmPassword: string;
  firstname: string;
  lastname: string;
  email: string;
};

export type AuthResponse = {
  token: string;
  type: string;
};

import type { User } from "./user";

export type Activity = {
  id: number;
  title: string;
  description: string;
  location: string;
  dateActivity: string;
  createdAt: string;
  creator: User;
  maxParticipants: number;
};

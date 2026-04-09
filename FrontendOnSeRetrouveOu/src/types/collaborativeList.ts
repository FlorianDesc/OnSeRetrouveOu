import type { User } from "./user";

export type CollaborativeListItemStatus = "EN_ATTENTE" | "ASSIGNE";

export type CollaborativeListItem = {
  id: number;
  title: string;
  bringText: string;
  status: CollaborativeListItemStatus;
  creator: User;
  assignedUser?: User | null;
  assignedUserId?: number | null;
  activity: {
    id: number;
  };
};

export type CreateCollaborativeListItemRequest = {
  title: string;
  bringText: string;
  status?: CollaborativeListItemStatus;
  assignedUserId?: number | null;
};

import type { User } from "./user";

export type CollaborativeListItemStatus =
  | "A_APPORTER"
  | "APPORTE"
  | "EN_ATTENTE";

export type CollaborativeListItem = {
  id: number;
  title: string;
  bringText: string;
  status: CollaborativeListItemStatus;
  creator: User;
  activity: {
    id: number;
  };
};

export type CreateCollaborativeListItemRequest = {
  title: string;
  bringText: string;
  status?: CollaborativeListItemStatus;
};

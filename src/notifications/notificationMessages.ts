import { NotificationType } from "./Notification";

export const notificationMessages: Record<NotificationType, string> = {
  [NotificationType.Error]: "we're sorry, an error has occurred",
  [NotificationType.MintPending]: "mint pending...",
  [NotificationType.MintSuccessful]: "mint successful",
};

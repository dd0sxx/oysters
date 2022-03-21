export enum NotificationType {
  MintPending = 0,
  MintSuccessful = 1,
  Error = 2,
}

type N = {
  id: string;
  overrideText?: string;
};

interface SuccessNotification extends N {
  explorerHref: string;
  type: NotificationType.MintSuccessful;
}

interface PendingNotification extends N {
  explorerHref?: string;
  type: NotificationType.MintPending;
}

interface ErrorNotification extends N {
  type: NotificationType.Error;
}

export type Notification =
  | SuccessNotification
  | PendingNotification
  | ErrorNotification;

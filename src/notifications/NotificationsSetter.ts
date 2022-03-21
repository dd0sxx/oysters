import { Notification } from "./Notification";

export type NotificationsSetter = (
  arg: ((prevState: Notification[]) => Notification[]) | Notification[],
) => void;

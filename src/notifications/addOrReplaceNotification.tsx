import { Notification } from "./Notification";
import { NotificationsSetter } from "./NotificationsSetter";

export const addOrReplaceNotification = ({
  newNotification,
  setNotifications,
}: {
  newNotification: Notification;
  setNotifications: NotificationsSetter;
}) => {
  setNotifications((prevState: Notification[]) => {
    let replaced = false;

    const newState = prevState.map(item => {
      if (item.id !== newNotification.id) {
        return item;
      }

      replaced = true;
      return newNotification;
    });

    if (!replaced) {
      newState.push(newNotification);
    }
    return newState;
  });
};

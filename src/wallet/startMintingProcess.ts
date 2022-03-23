import { Contract } from "ethers";

import { addOrReplaceNotification } from "../notifications/addOrReplaceNotification";
import { NotificationType } from "../notifications/Notification";
import { NotificationsSetter } from "../notifications/NotificationsSetter";
import { generateUUID } from "../utils/generateUUID";

import { connectWallet } from "./connectWallet";
import { getCorrectNetName } from "./getCorrectNetName";
import { isCorrectNet } from "./isCorrectNet";
import { mintNFT } from "./mintNFT";

export const startMintingProcess = async ({
  setNotifications,
  contract,
}: {
  contract: Contract;
  setNotifications: NotificationsSetter;
}): Promise<boolean> => {
  const notificationID: string = generateUUID();

  const acc = (await connectWallet())?.walletAddr;
  if (!acc) {
    addOrReplaceNotification({
      newNotification: { id: notificationID, type: NotificationType.Error },
      setNotifications,
    });
    return false;
  }

  const correctNet = await isCorrectNet();
  if (!correctNet) {
    addOrReplaceNotification({
      newNotification: {
        id: notificationID,
        overrideText: `Please connect to Ethereum ${getCorrectNetName()}`,
        type: NotificationType.Error,
      },
      setNotifications,
    });
    return false;
  }

  addOrReplaceNotification({
    newNotification: { id: notificationID, type: NotificationType.MintPending },
    setNotifications,
  });

  return mintNFT({
    contract,
    notificationID,
    setNotifications,
  });
};

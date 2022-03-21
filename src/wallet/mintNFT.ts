import { addOrReplaceNotification } from "../notifications/addOrReplaceNotification";
import { NotificationType } from "../notifications/Notification";
import { NotificationsSetter } from "../notifications/NotificationsSetter";
import { generateUUID } from "../utils/generateUUID";

import { Account } from "./Account";
import { askContractToMintNFT } from "./askContractToMintNFT";
import { connectWallet } from "./connectWallet";
import { ensureCorrectNet } from "./ensureCorrectNet";
import { getContractThroughEthereumProvider } from "./getContractThroughEthereumProvider";
import { getCorrectNetName } from "./getCorrectNetName";

const isPositiveInteger = (str: string) => {
  return /^([1-9]\d*)$/.test(str);
};

export const mintNFT = async ({
  currentAccount,
  setCurrentAccount,
  tokensCount: tokensCountStr,
  setNotifications,
  setIsCorrectNet,
}: {
  currentAccount: Account;
  setCurrentAccount: (acc: Account) => void;
  setIsCorrectNet: (b: boolean) => void;
  setNotifications: NotificationsSetter;
  tokensCount: string;
}): Promise<boolean> => {
  let acc: Account | undefined = currentAccount;

  const notificationID: string = generateUUID();

  if (!acc) {
    acc = await connectWallet({ setCurrentAccount });
    if (!acc) {
      addOrReplaceNotification({
        newNotification: { id: notificationID, type: NotificationType.Error },
        setNotifications,
      });
      return false;
    }
  }

  const isCorrectNet = await ensureCorrectNet({
    setIsCorrectNet,
  });
  if (!isCorrectNet) {
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

  const connectedContract = await getContractThroughEthereumProvider();
  if (!connectedContract) {
    addOrReplaceNotification({
      newNotification: { id: notificationID, type: NotificationType.Error },
      setNotifications,
    });
    return false;
  }

  if (tokensCountStr.length > 0 && !isPositiveInteger(tokensCountStr)) {
    console.error("only non-negative integers are allowed");
    addOrReplaceNotification({
      newNotification: { id: notificationID, type: NotificationType.Error },
      setNotifications,
    });
    return false;
  }

  const tokensCount = tokensCountStr.length > 0 ? parseInt(tokensCountStr) : 1;

  return askContractToMintNFT({
    notificationID,
    setNotifications,
    tokensCount,
  });
};

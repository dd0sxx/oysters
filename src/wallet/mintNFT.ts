import { addOrReplaceNotification } from "../notifications/addOrReplaceNotification";
import { NotificationType } from "../notifications/Notification";
import { NotificationsSetter } from "../notifications/NotificationsSetter";
import { generateUUID } from "../utils/generateUUID";

import { askContractToMintNFT } from "./askContractToMintNFT";
import { connectWallet } from "./connectWallet";
import { getContractThroughEthereumProvider } from "./getContractThroughEthereumProvider";
import { getCorrectNetName } from "./getCorrectNetName";
import { isCorrectNet } from "./isCorrectNet";
import { WalletAddr } from "./Wallet";

const isPositiveInteger = (str: string) => {
  return /^([1-9]\d*)$/.test(str);
};

export const mintNFT = async ({
  currentAccount,
  tokensCount: tokensCountStr,
  setNotifications,
}: {
  currentAccount: WalletAddr;
  setCurrentAccount: (acc: WalletAddr) => void;
  setIsCorrectNet: (b: boolean) => void;
  setNotifications: NotificationsSetter;
  tokensCount: string;
}): Promise<boolean> => {
  let acc: WalletAddr | undefined = currentAccount;

  const notificationID: string = generateUUID();

  if (!acc) {
    acc = (await connectWallet())?.walletAddr;
    if (!acc) {
      addOrReplaceNotification({
        newNotification: { id: notificationID, type: NotificationType.Error },
        setNotifications,
      });
      return false;
    }
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

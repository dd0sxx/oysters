import { Contract, ethers } from "ethers";

import { addOrReplaceNotification } from "../notifications/addOrReplaceNotification";
import { NotificationType } from "../notifications/Notification";
import { NotificationsSetter } from "../notifications/NotificationsSetter";

import { checkIfPremintPhase } from "./checkIfPremintPhase";
import { getExplorerHref } from "./getExplorerHref";
import { redeemTokenForWhitelisted } from "./redeemTokenForWhitelisted";

const tokenPriceDecimal = "0.2";

export const mintNFT = async ({
  notificationID,
  setNotifications,
  contract,
}: {
  contract: Contract;
  notificationID: string;
  setNotifications: NotificationsSetter;
}): Promise<boolean> => {
  if (contract === null) {
    addOrReplaceNotification({
      newNotification: { id: notificationID, type: NotificationType.Error },
      setNotifications,
    });
    return false;
  }

  const isPremintPhase = await checkIfPremintPhase({ contract });

  try {
    //  Going to pop wallet now to pay gas...
    let nftTxn: any;
    if (isPremintPhase) {
      nftTxn = await redeemTokenForWhitelisted({ contract });
    } else {
      nftTxn = await contract.mint(1, {
        value: ethers.utils.parseEther(tokenPriceDecimal), // ether in this case MUST be a string
      });
    }

    const explorerHref = getExplorerHref({ transactionHash: nftTxn.hash });
    if (!explorerHref) {
      setNotifications([{ id: notificationID, type: NotificationType.Error }]);
      return false;
    }

    addOrReplaceNotification({
      newNotification: {
        explorerHref,
        id: notificationID,
        type: NotificationType.MintPending,
      },
      setNotifications,
    });

    // Mining... please wait.
    await nftTxn.wait();

    addOrReplaceNotification({
      newNotification: {
        explorerHref,
        id: notificationID,
        type: NotificationType.MintSuccessful,
      },
      setNotifications,
    });
    return true;
  } catch (error: any) {
    let errorText: string | undefined = undefined;
    if (error.code === "INSUFFICIENT_FUNDS") {
      errorText = "insufficient funds";
    }
    if (error.error?.message === "execution reverted: already claimed") {
      errorText = "only one token per wallet allowed in the premint phase";
    }

    addOrReplaceNotification({
      newNotification: {
        id: notificationID,
        overrideText: errorText,
        type: NotificationType.Error,
      },
      setNotifications,
    });
    console.error(error);
  }

  return false;
};

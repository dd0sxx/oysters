import { Decimal } from "decimal.js";
import { ethers } from "ethers";

import { addOrReplaceNotification } from "../notifications/addOrReplaceNotification";
import { NotificationType } from "../notifications/Notification";
import { NotificationsSetter } from "../notifications/NotificationsSetter";

import { getContractThroughEthereumProvider } from "./getContractThroughEthereumProvider";
import { getExplorerHref } from "./getExplorerHref";

const tokenPriceDecimal = new Decimal("0.01");

export const askContractToMintNFT = async ({
  tokensCount,
  notificationID,
  setNotifications,
}: {
  notificationID: string;
  setNotifications: NotificationsSetter;
  tokensCount: number;
}): Promise<boolean> => {
  const connectedContract = await getContractThroughEthereumProvider();
  if (connectedContract === null) {
    addOrReplaceNotification({
      newNotification: { id: notificationID, type: NotificationType.Error },
      setNotifications,
    });
    return false;
  }

  const price = tokenPriceDecimal.times(tokensCount).toString();

  try {
    const overrides = {
      value: ethers.utils.parseEther(price), // ether in this case MUST be a string
    };

    //  Going to pop wallet now to pay gas...
    const nftTxn = await connectedContract.mint(tokensCount, overrides);

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
  } catch (error) {
    addOrReplaceNotification({
      newNotification: { id: notificationID, type: NotificationType.Error },
      setNotifications,
    });
    console.error(error);
  }

  return false;
};

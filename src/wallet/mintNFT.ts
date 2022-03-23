import { Decimal } from "decimal.js";
import { Contract, ethers } from "ethers";

import { addOrReplaceNotification } from "../notifications/addOrReplaceNotification";
import { NotificationType } from "../notifications/Notification";
import { NotificationsSetter } from "../notifications/NotificationsSetter";

import { checkIfPremintPhase } from "./checkIfPremintPhase";
import { getContractThroughEthereumProvider } from "./getContractThroughEthereumProvider";
import { getExplorerHref } from "./getExplorerHref";

const tokenPriceDecimal = new Decimal("0.1");

export const mintNFT = async ({
  notificationID,
  setNotifications,
  contract,
}: {
  contract: Contract;
  notificationID: string;
  setNotifications: NotificationsSetter;
}): Promise<boolean> => {
  const connectedContract = await getContractThroughEthereumProvider();
  if (connectedContract === null) {
    addOrReplaceNotification({
      newNotification: { id: notificationID, type: NotificationType.Error },
      setNotifications,
    });
    return false;
  }

  const isPremintPhase = await checkIfPremintPhase({ contract });

  const price = isPremintPhase ? "0" : tokenPriceDecimal.toString();

  try {
    const overrides = {
      value: ethers.utils.parseEther(price), // ether in this case MUST be a string
    };

    //  Going to pop wallet now to pay gas...
    const nftTxn = await connectedContract.mint(overrides);

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
    console.log({ error });

    addOrReplaceNotification({
      newNotification: {
        id: notificationID,
        overrideText:
          error.code === "INSUFFICIENT_FUNDS"
            ? "insufficient funds"
            : undefined,
        type: NotificationType.Error,
      },
      setNotifications,
    });
    console.error(error);
  }

  return false;
};

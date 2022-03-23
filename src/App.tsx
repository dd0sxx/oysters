import { Contract } from "ethers";
import React, { useState } from "react";

import { Main } from "./components/Main/Main";
import { SocialBar } from "./components/SocialBar/SocialBar";
import { addOrReplaceNotification } from "./notifications/addOrReplaceNotification";
import { Notification, NotificationType } from "./notifications/Notification";
import { AppStage, AppState } from "./state/AppState";
import { generateUUID } from "./utils/generateUUID";
import { checkIfCanMint } from "./wallet/checkIfCanMint";
import { connectWallet } from "./wallet/connectWallet";
import { getContractThroughEthereumProvider } from "./wallet/getContractThroughEthereumProvider";
import { isCorrectNet } from "./wallet/isCorrectNet";
import { startMintingProcess } from "./wallet/startMintingProcess";

export const App = () => {
  const [appState, setAppState] = useState<AppState>({
    contract: null,
    stage: AppStage.disconnected,
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const connectWalletAndHandleResult = async () => {
    if (!process.env.REACT_APP_CONTRACT_ADDRESS) {
      throw new Error("missing contract address env var");
    }

    const wallet = await connectWallet();

    if (wallet) {
      if (!(await isCorrectNet())) {
        alert("is not a correct net");
      }

      const contract = await getContractThroughEthereumProvider();
      if (!contract) {
        addOrReplaceNotification({
          newNotification: {
            id: generateUUID(),
            type: NotificationType.Error,
          },
          setNotifications,
        });
        return;
      }

      if (await checkIfCanMint({ contract })) {
        setAppState(oldVal => ({
          ...oldVal,
          contract,
          stage: AppStage.connected,
        }));
        return;
      }
      setAppState(oldVal => ({
        ...oldVal,
        contract,
        stage: AppStage.notOnPreMintList,
      }));
    }
  };

  return (
    <>
      <SocialBar />
      <Main
        appState={appState}
        connectWalletAndHandleResult={connectWalletAndHandleResult}
        startMintingProcess={() =>
          startMintingProcess({
            contract: appState.contract as Contract,
            setNotifications,
          })
        }
        notifications={notifications}
        contract={appState.contract as Contract}
      />
    </>
  );
};

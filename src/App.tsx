import { Contract } from "ethers";
import React, { useState } from "react";

import { Main } from "./components/Main/Main";
import { SocialBar } from "./components/SocialBar/SocialBar";
import { Setter } from "./helpers/types";
import { addOrReplaceNotification } from "./notifications/addOrReplaceNotification";
import { Notification, NotificationType } from "./notifications/Notification";
import { AppStage, AppState } from "./state/AppState";
import { generateUUID } from "./utils/generateUUID";
import { checkIfCanMint } from "./wallet/checkIfCanMint";
import { connectWallet } from "./wallet/connectWallet";
import { getContractThroughEthereumProvider } from "./wallet/getContractThroughEthereumProvider";
import { getCorrectNetName } from "./wallet/getCorrectNetName";
import { isCorrectNet } from "./wallet/isCorrectNet";
import { startMintingProcess } from "./wallet/startMintingProcess";

let _resetAppState = () => {};
export const resetAppState = () => _resetAppState();

export const App = () => {
  const [appState, setAppState] = useState<AppState>({
    contract: null,
    stage: AppStage.disconnected,
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  _resetAppState = () => {
    setAppState({ contract: null, stage: AppStage.disconnected });
  };

  const connectWalletAndHandleResult = async () => {
    if (!process.env.REACT_APP_CONTRACT_ADDRESS) {
      throw new Error("missing contract address env var");
    }

    const wallet = await connectWallet();

    if (wallet) {
      if (!(await isCorrectNet())) {
        addOrReplaceNotification({
          newNotification: {
            id: generateUUID(),
            overrideText: `please connect to Ethereum ${getCorrectNetName()}`,
            type: NotificationType.Error,
          },
          setNotifications,
        });
        return;
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
        startMintingProcess={({
          setHowManyTokensLeft,
        }: {
          setHowManyTokensLeft: Setter<number | null>;
        }) =>
          startMintingProcess({
            contract: appState.contract as Contract,
            setHowManyTokensLeft,
            setNotifications,
          })
        }
        notifications={notifications}
        contract={appState.contract as Contract}
      />
    </>
  );
};

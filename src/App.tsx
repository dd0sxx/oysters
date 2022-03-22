/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";

import { Main } from "./components/Main/Main";
import { SocialBar } from "./components/SocialBar/SocialBar";
import { Notification } from "./notifications/Notification";
import { AppStage, AppState } from "./state/AppState";
import { checkIfCanMint } from "./wallet/checkIfCanMint";
import { checkSilentlyIfConnectedToWallet } from "./wallet/checkSilentlyIfConnectedToWallet";
import { connectWallet } from "./wallet/connectWallet";

export const App = () => {
  const [appState, setAppState] = useState<AppState>({
    stage: AppStage.disconnected,
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const connectWalletAndHandleResult = async () => {
    const wallet = await connectWallet();
    if (wallet) {
      if (checkIfCanMint(wallet)) {
        setAppState(oldVal => ({ ...oldVal, stage: AppStage.connected }));
        return;
      }
      setAppState(oldVal => ({
        ...oldVal,
        stage: AppStage.notOnPreMintList,
      }));
    }
  };

  useEffect(() => {
    checkSilentlyIfConnectedToWallet().then(connected => {
      if (connected) {
        connectWalletAndHandleResult();
      }
    });
  }, []);

  return (
    <>
      <SocialBar />
      <Main
        appState={appState}
        connectWalletAndHandleResult={connectWalletAndHandleResult}
      />
    </>
  );
};

/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";

import { Main } from "./components/Main/Main";
import { SocialBar } from "./components/SocialBar/SocialBar";
import { Notification } from "./notifications/Notification";
import { AppStage, AppState } from "./state/AppState";
import { Account } from "./wallet/Account";
import { checkIfWalletIsConnected } from "./wallet/checkIfWalletIsConnected";

export const App = () => {
  const [appState, setAppState] = useState<AppState>({
    stage: AppStage.disconnected,
  });
  const [currentAccount, setCurrentAccount] = useState<Account>("");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isCorrectNet, setIsCorrectNet] = useState<boolean>(true);

  useEffect(() => {
    checkIfWalletIsConnected({
      setCurrentAccount,
      setIsCorrectNet: setIsCorrectNet,
    });
  }, []);

  return (
    <>
      <SocialBar />
      <Main
        appState={appState}
        setCurrentAccount={setCurrentAccount}
        currentAccount={currentAccount}
      />
    </>
  );
};

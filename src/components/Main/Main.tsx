import { FC } from "react";

import { Setter } from "../../helpers/types";
import { AppStage, AppState } from "../../state/AppState";
import { Account } from "../../wallet/Account";
import { connectWallet } from "../../wallet/connectWallet";

const contentByAppStage: Record<
  AppStage,
  {
    BelowHeader: FC<{ connectWallet: () => Promise<void> }>;
    Header: FC;
    className: string;
    imgSrc: string;
  }
> = {
  [AppStage.connected]: {
    BelowHeader: () => (
      <>the wallet you have connected isn’t on our premint list</>
    ),
    Header: () => <>{"432 left..."}</>,
    className: "connected",
    imgSrc: "/imgs/zap_multicolor_no-bg.gif",
  },
  [AppStage.disconnected]: {
    BelowHeader: ({ connectWallet }) => (
      <button className="button-under-header" onClick={connectWallet}>
        Connect Wallet
      </button>
    ),
    Header: () => <>{"tiramisu recipe..."}</>,
    className: "disconnected",
    imgSrc: "/imgs/rainbow-EX.gif",
  },
  [AppStage.notOnPreMintList]: {
    BelowHeader: () => <></>,
    Header: () => <>{"sorry..."}</>,
    className: "notOnPreMintList",
    imgSrc: "/imgs/rotten_no--bg.gif",
  },
};

const MainImg: FC<{ appState: AppState }> = ({ appState }) => {
  return (
    <>
      <img
        className={contentByAppStage[appState.stage].className}
        src={contentByAppStage[appState.stage].imgSrc}
      />
      <style jsx>{`
        .connected {
          width: 266px;
        }
        .disconnected {
          width: 273px;
          margin: 0 0 -55px;
        }
        .notOnPreMintList {
          width: 288px;
        }
      `}</style>
    </>
  );
};

export const Main: FC<{
  appState: AppState;
  currentAccount: Account;
  setCurrentAccount: Setter<Account>;
}> = ({ appState, setCurrentAccount }) => {
  const { BelowHeader, Header } = contentByAppStage[appState.stage];

  return (
    <>
      <div className="main-wrapper">
        <main>
          <MainImg appState={appState} />
          <h1>
            <Header />
          </h1>
          <BelowHeader
            connectWallet={async () => {
              return connectWallet({ setCurrentAccount }) as Promise<void>;
            }}
          />
        </main>
      </div>

      <style jsx>{`
        .main-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          flex: 1;
        }
        main {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        :global(.button-under-header) {
          margin-top: 25px;
        }
      `}</style>
    </>
  );
};

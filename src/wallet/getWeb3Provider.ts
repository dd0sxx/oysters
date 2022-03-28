import {
  ExternalProvider,
  Web3Provider,
} from "@ethersproject/providers/src.ts/web3-provider";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { ethers } from "ethers";

import { resetAppState } from "../App";

let provider: ExternalProvider | null = null;
let ethersProvider: Web3Provider | null = null;

const reset = async ({
  walletConnectProvider,
  doDisconnect,
}: {
  doDisconnect: boolean;
  walletConnectProvider?: WalletConnectProvider;
}) => {
  if (walletConnectProvider && doDisconnect) {
    await walletConnectProvider.disconnect();
  }

  provider = null;
  ethersProvider = null;

  resetAppState();
};

const getWalletConnectProvider = async () => {
  const walletConnectProvider = new WalletConnectProvider({
    infuraId: "585c1bd97fdb4faf9c7eb3288c320aa1",
  });

  await walletConnectProvider.enable();
  return walletConnectProvider;
};

export const getWeb3Provider = async (): Promise<Web3Provider | null> => {
  let isWalletConnect = false;

  if (!ethersProvider) {
    if (!provider) {
      provider = window?.ethereum || window?.web3?.currentProvider || null;
    }

    if (!provider) {
      try {
        provider = await getWalletConnectProvider();
        isWalletConnect = true;
      } catch (e) {
        console.error(e);
        return null;
      }
    }

    ethersProvider = new ethers.providers.Web3Provider(provider, "any");

    if (!ethersProvider) {
      return null;
    }

    (provider as any).on("chainChanged", (chainId: number) => {
      console.log("chainChanged", { chainId });
      reset({
        doDisconnect: true,
        walletConnectProvider: isWalletConnect
          ? (provider as WalletConnectProvider)
          : undefined,
      });
    });

    (provider as any).on("accountsChanged", () => {
      console.log("accountsChanged");
      reset({
        doDisconnect: true,
        walletConnectProvider: isWalletConnect
          ? (provider as WalletConnectProvider)
          : undefined,
      });
    });

    (provider as any).on("disconnect", (code: number, reason: string) => {
      console.log("disconnect", { code, reason });
      reset({
        doDisconnect: false,
        walletConnectProvider: isWalletConnect
          ? (provider as WalletConnectProvider)
          : undefined,
      });
    });
  }

  return ethersProvider;
};

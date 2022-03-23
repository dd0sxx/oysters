import { Web3Provider } from "@ethersproject/providers/src.ts/web3-provider";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { ethers } from "ethers";

import { resetAppState } from "../App";

let provider = window?.ethereum || window?.web3?.currentProvider || null;
let ethersProvider: Web3Provider | null = provider
  ? new ethers.providers.Web3Provider(provider)
  : null;

const getWalletConnectProvider = async () => {
  const walletConnectProvider = new WalletConnectProvider({
    infuraId: "585c1bd97fdb4faf9c7eb3288c320aa1",
  });

  const reset = async () => {
    await walletConnectProvider.disconnect();

    provider = null;
    ethersProvider = null;

    resetAppState();
  };

  // Subscribe to chainId change
  walletConnectProvider.on("chainChanged", (chainId: number) => {
    console.log("chainChanged", { chainId });
    reset();
  });

  // Subscribe to session disconnection
  walletConnectProvider.on("disconnect", (code: number, reason: string) => {
    console.log("disconnect", { code, reason });
    provider = null;
    ethersProvider = null;
    resetAppState();
  });

  await walletConnectProvider.enable();
  return walletConnectProvider;
};

export const getWeb3Provider = async (): Promise<Web3Provider | null> => {
  if (!ethersProvider) {
    if (!provider) {
      provider = window?.ethereum || window?.web3?.currentProvider || null;
    }

    if (!provider) {
      try {
        provider = await getWalletConnectProvider();
      } catch (e) {
        console.error(e);
        return null;
      }
    }

    ethersProvider = new ethers.providers.Web3Provider(provider);
  }

  return ethersProvider;
};

import { Web3Provider } from "@ethersproject/providers/src.ts/web3-provider";
import { ethers } from "ethers";

let provider = window?.ethereum || window?.web3?.currentProvider || null;
let ethersProvider: Web3Provider | null = provider
  ? new ethers.providers.Web3Provider(provider)
  : null;

export const getWeb3Provider = (): Web3Provider | null => {
  if (!ethersProvider) {
    if (!provider) {
      provider = window?.ethereum || window?.web3?.currentProvider || null;
    }

    if (provider) {
      ethersProvider = new ethers.providers.Web3Provider(provider);
    }
  }

  return ethersProvider;
};

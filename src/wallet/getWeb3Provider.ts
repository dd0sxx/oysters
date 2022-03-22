import { Web3Provider } from "@ethersproject/providers/src.ts/web3-provider";
import { ethers } from "ethers";

export const getWeb3Provider = (): Web3Provider | null => {
  const web3Provider = window.ethereum || window.web3?.currentProvider || null;
  if (!web3Provider) {
    return null;
  }
  return new ethers.providers.Web3Provider(web3Provider);
};

import { getWeb3Provider } from "./getWeb3Provider";

export const checkSilentlyIfConnectedToWallet = async (): Promise<boolean> => {
  const provider = await getWeb3Provider();
  if (!provider) {
    console.error("web3Provider doesn't exist!");
    return false;
  }

  const addresses = await provider.listAccounts();

  return addresses && addresses?.length > 0;
};

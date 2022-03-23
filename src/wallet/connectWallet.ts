import { getWeb3Provider } from "./getWeb3Provider";

export const connectWallet = async (): Promise<{
  walletAddr: string;
} | null> => {
  try {
    const provider = getWeb3Provider();
    if (!provider) {
      console.error("web3Provider doesn't exist!");
      return null;
    }
    /*
     * Fancy method to request access to account.
     */
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    return { walletAddr: await signer.getAddress() };
  } catch (error) {
    console.error(error);
  }

  return null;
};

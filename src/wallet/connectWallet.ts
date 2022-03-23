import { getWeb3Provider } from "./getWeb3Provider";

export const connectWallet = async (): Promise<{
  walletAddr: string;
} | null> => {
  try {
    const provider = await getWeb3Provider();
    if (!provider) {
      console.error("web3Provider doesn't exist!");
      return null;
    }
    /*
     * Fancy method to request access to account.
     */
    try {
      await provider.send("eth_requestAccounts", []);
    } catch (error) {
      console.error(error);
    }

    const signer = await provider.getSigner();
    return { walletAddr: await signer.getAddress() };
  } catch (error) {
    console.error(error);
  }

  return null;
};

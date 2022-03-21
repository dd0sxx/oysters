import { Account } from "./Account";

export const connectWallet = async ({
  setCurrentAccount,
}: {
  setCurrentAccount: (acc: Account) => void;
}): Promise<string | undefined> => {
  try {
    const { ethereum } = window;

    if (!ethereum) {
      console.error("Ethereum object doesn't exist!");
      return undefined;
    }

    /*
     * Fancy method to request access to account.
     */
    const accounts = await ethereum.request<Account[]>({
      method: "eth_requestAccounts",
    });

    if (accounts && accounts.length > 0) {
      setCurrentAccount(accounts[0] as Account);
      return accounts[0];
    }
  } catch (error) {
    console.error(error);
  }

  return undefined;
};

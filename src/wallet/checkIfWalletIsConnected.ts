import { Account } from "./Account";
import { ensureCorrectNet } from "./ensureCorrectNet";

export const checkIfWalletIsConnected = async ({
  setCurrentAccount,
  setIsCorrectNet,
}: {
  setCurrentAccount: (acc: Account) => void;
  setIsCorrectNet: (b: boolean) => void;
}): Promise<boolean> => {
  const { ethereum } = window;

  if (!ethereum) {
    console.error("Ethereum object doesn't exist!");
    return false;
  }

  /*
   * Check if we're authorized to access the user's wallet
   */
  const accounts = await ethereum.request<Account[]>({
    method: "eth_accounts",
  });

  const isCorrectNet = await ensureCorrectNet({
    setIsCorrectNet,
  });

  if (!isCorrectNet) {
    return false;
  }

  /*
   * User can have multiple authorized accounts, we grab the first one if its there!
   */
  if (accounts && accounts.length > 0) {
    setCurrentAccount(accounts[0] as Account);
    return true;
  } else {
    return false;
  }
};

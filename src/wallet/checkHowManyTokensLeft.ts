import { Contract } from "ethers";

export const checkHowManyTokensLeft = async ({
  contract,
}: {
  contract: Contract;
}): Promise<number | null> => {
  return contract.getTokensLeft();
};

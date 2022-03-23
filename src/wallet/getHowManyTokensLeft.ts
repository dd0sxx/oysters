import { Contract } from "ethers";

export const getHowManyTokensLeft = async ({
  contract,
}: {
  contract: Contract;
}): Promise<number | null> => {
  return contract.getTokensLeft();
};

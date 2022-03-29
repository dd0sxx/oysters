import { Contract } from "ethers";

export const checkIfPremintPhase = async ({
  contract,
}: {
  contract: Contract;
}): Promise<boolean> => {
  return contract.premintPhase();
};

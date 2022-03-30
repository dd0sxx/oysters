import { Contract } from "ethers";

import { premintAddresses } from "../consts/premintAddresses";

import { checkIfPremintPhase } from "./checkIfPremintPhase";

export const checkIfCanMint = async ({
  contract,
}: {
  contract: Contract;
}): Promise<boolean> => {
  const isPremintPhase = await checkIfPremintPhase({ contract });
  if (!isPremintPhase) {
    return true;
  }

  const userWalletAddress = await contract.signer.getAddress();

  console.log(
    premintAddresses,
    userWalletAddress,
    premintAddresses.includes(userWalletAddress),
  );

  return premintAddresses
    .map(addr => addr.toLowerCase())
    .includes(userWalletAddress?.toLowerCase());
};

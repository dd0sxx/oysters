import { Contract, ethers } from "ethers";

import { getProof } from "../helpers/merkleTree";

export const redeemTokenForWhitelisted = async ({
  contract,
}: {
  contract: Contract;
}): Promise<any> => {
  const proof = await getProof({ contract });
  return contract.redeem(proof, {
    value: ethers.utils.parseEther("0"), // ether in this case MUST be a string
  });
};

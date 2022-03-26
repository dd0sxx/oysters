import { Contract } from "ethers";
import keccak256 from "keccak256";
import { MerkleTree } from "merkletreejs";

import { premintAddresses } from "../consts/premintAddresses";

const leaves = premintAddresses.map(x => keccak256(x));
const merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });

export const getProof = async ({
  contract,
}: {
  contract: Contract;
}): Promise<string[]> => {
  const userWalletAddr = await contract.signer.getAddress();
  const addressHash = keccak256(userWalletAddr);
  return merkleTree.getHexProof(addressHash);
};

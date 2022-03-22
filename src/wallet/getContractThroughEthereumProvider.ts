import { ethers } from "ethers";

import SilhouettePunksTest from "../abi/development/SilhouettePunks.json";
import SilhouettePunksProd from "../abi/production/SilhouettePunks.json";

import { getWeb3Provider } from "./getWeb3Provider";

export const getContractThroughEthereumProvider =
  async (): Promise<ethers.Contract | null> => {
    const { REACT_APP_CONTRACT_ADDRESS, REACT_APP_ENV } = process.env;

    if (!REACT_APP_CONTRACT_ADDRESS) {
      console.error("incorrect REACT_APP_CONTRACT_ADDRESS value", {
        REACT_APP_CONTRACT_ADDRESS,
      });
      return null;
    }

    try {
      const provider = getWeb3Provider();
      if (!provider) {
        console.error("web3Provider doesn't exist!");
        return null;
      }

      const signer = provider.getSigner();

      let abi: any;
      if (REACT_APP_ENV !== "production") {
        abi = SilhouettePunksTest.abi;
      } else {
        abi = SilhouettePunksProd.abi;
      }

      return new ethers.Contract(
        REACT_APP_CONTRACT_ADDRESS as string,
        abi,
        signer,
      );
    } catch (error) {
      console.error(error);
    }
    return null;
  };

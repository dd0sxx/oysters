import { ethers } from "ethers";

import SilhouettePunksTest from "../abi/development/SilhouettePunks.json";
import SilhouettePunksProd from "../abi/production/SilhouettePunks.json";

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
      const { ethereum } = window;

      if (!ethereum) {
        console.error("Ethereum object doesn't exist!");
        return null;
      }

      const provider = new ethers.providers.Web3Provider(ethereum as any);

      const signer = provider.getSigner();

      let abi: any;
      if (REACT_APP_ENV === "test") {
        abi = SilhouettePunksTest.abi;
      } else if (REACT_APP_ENV === "prod") {
        abi = SilhouettePunksProd.abi;
      } else {
        console.error("incorrect REACT_APP_ENV value", { REACT_APP_ENV });
        return null;
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

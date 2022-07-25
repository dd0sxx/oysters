import { ethers } from "ethers";

import TiramisuDev from "../artifacts/development/OYSTER.json";
import TiramisuProd from "../artifacts/production/OYSTER.json";

import { getWeb3Provider } from "./getWeb3Provider";

export const getContractThroughEthereumProvider =
  async (): Promise<ethers.Contract | null> => {
    const { REACT_APP_CONTRACT_ADDRESS, REACT_APP_ENV } = process.env;
    console.log(REACT_APP_CONTRACT_ADDRESS);
    if (!REACT_APP_CONTRACT_ADDRESS) {
      console.error("incorrect REACT_APP_CONTRACT_ADDRESS value", {
        REACT_APP_ENV,
      });
      return null;
    }

    try {
      const provider = await getWeb3Provider();
      if (!provider) {
        console.error("web3Provider doesn't exist!");
        return null;
      }

      const signer = await provider.getSigner();

      let abi: any;
      if (REACT_APP_ENV !== "production") {
        abi = TiramisuDev.abi;
      } else {
        abi = TiramisuProd.abi;
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

import { ethers } from "ethers";

export const ensureCorrectNet = async ({
  setIsCorrectNet,
}: {
  setIsCorrectNet: (b: boolean) => void;
}): Promise<boolean> => {
  const { REACT_APP_ENV } = process.env;

  const { ethereum } = window;
  const provider = new ethers.providers.Web3Provider(ethereum as any);
  const { chainId } = await provider.getNetwork();

  if (
    (REACT_APP_ENV === "prod" && chainId === 1) ||
    (REACT_APP_ENV !== "prod" && chainId === 4)
  ) {
    setIsCorrectNet(true);
    return true;
  }

  setIsCorrectNet(false);
  return false;
};

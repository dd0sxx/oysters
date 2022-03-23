import { getWeb3Provider } from "./getWeb3Provider";

export const isCorrectNet = async (): Promise<boolean> => {
  const { REACT_APP_ENV } = process.env;

  const provider = await getWeb3Provider();
  if (!provider) {
    return false;
  }
  const { chainId } = await provider.getNetwork();
  return (
    (REACT_APP_ENV === "production" && chainId === 1) ||
    (REACT_APP_ENV !== "production" && chainId === 4)
  );
};

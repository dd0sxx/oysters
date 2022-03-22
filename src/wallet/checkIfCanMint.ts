import { Wallet } from "./Wallet";

export const checkIfCanMint = (_: Wallet): boolean => {
  const { REACT_APP_PREMINT_ONLY } = process.env;
  return REACT_APP_PREMINT_ONLY === "false";
};

export const getCorrectNetName = () => {
  const { REACT_APP_ENV } = process.env;
  return REACT_APP_ENV === "production" ? "Mainnet" : "Rinkeby";
};

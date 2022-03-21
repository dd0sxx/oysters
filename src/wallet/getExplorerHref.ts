export const getExplorerHref = ({
  transactionHash,
}: {
  transactionHash: string;
}) => {
  const { REACT_APP_ENV } = process.env;

  let hrefPrefix: any;
  if (REACT_APP_ENV === "test") {
    hrefPrefix = "https://rinkeby.etherscan.io/tx/";
  } else if (REACT_APP_ENV === "prod") {
    hrefPrefix = "https://etherscan.io/tx/";
  } else {
    console.error("incorrect REACT_APP_ENV value", { REACT_APP_ENV });
    return undefined;
  }

  return `${hrefPrefix}${transactionHash}`;
};

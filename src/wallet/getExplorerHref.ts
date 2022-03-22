export const getExplorerHref = ({
  transactionHash,
}: {
  transactionHash: string;
}) => {
  const { REACT_APP_ENV } = process.env;

  let hrefPrefix: any;
  if (REACT_APP_ENV !== "production") {
    hrefPrefix = "https://rinkeby.etherscan.io/tx/";
  } else if (REACT_APP_ENV === "production") {
    hrefPrefix = "https://etherscan.io/tx/";
  }

  return `${hrefPrefix}${transactionHash}`;
};

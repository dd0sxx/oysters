import {ethers} from 'hardhat';

const CONTRACT_ADDRESS = "0xdED6483cB6cCCE2AE8271c808Bd384b99d44b55E";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  const [deployer] = await ethers.getSigners();
  console.log("Changing phase with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  // We get the contract to deploy
  const contract = await ethers.getContractAt("Tiramisu", CONTRACT_ADDRESS, deployer)
  console.log('1')

  await contract.setIsPremintPhase(false)
  console.log("Phase updated");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });

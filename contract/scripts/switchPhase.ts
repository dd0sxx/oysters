import {ethers} from 'hardhat';

const CONTRACT_ADDRESS = "0x41D64aE504121e4a1Adb850651BDb4409B58C05d";

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

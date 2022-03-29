// We import Chai to use its asserting functions here.
const { expect } = require("chai");

import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/src/signers';
import {ContractFactory} from 'ethers';
// @ts-ignore
import { ethers } from "hardhat";
// @ts-ignore
import keccak256 from 'keccak256';
import {MerkleTree} from 'merkletreejs';
import {Tiramisu} from '../typechain-types/Tiramisu';

// `describe` receives the name of a section of your test suite, and a callback.
// The callback must define the tests of that section. This callback can't be
// an async function.
describe("Token contract", function () {
  // Mocha has four functions that let you hook into the the test runner's
  // lifecyle. These are: `before`, `beforeEach`, `after`, `afterEach`.

  // They're very useful to setup the environment for tests, and to clean it
  // up after they run.

  // A common pattern is to declare some variables, and assign them in the
  // `before` and `beforeEach` callbacks.

  let token: ContractFactory;
  let hardhatToken: Tiramisu;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;
  let addrs: SignerWithAddress[];

  // `beforeEach` will run before each test, re-deploying the contract every
  // time. It receives a callback, which can be async.
  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    token = await ethers.getContractFactory("Tiramisu");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners() as any[];

    // To deploy our contract, we just have to call Token.deploy() and await
    // for it to be deployed(), which happens once its transaction has been
    // mined.

    const leaves = [owner, addr1, addr2, ...addrs].map((x) => keccak256(x.address));
    const merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });
    hardhatToken = await token.deploy("", merkleTree.getHexRoot()) as Tiramisu;
    await hardhatToken.deployed();
  });

  // You can nest describe calls to create subsections.
  describe("Deployment", function () {
    // `it` is another Mocha function. This is the one you use to define your
    // tests. It receives the test name, and a callback function.

    it("Should set the right owner", async function () {
      expect(await hardhatToken.owner()).to.equal(owner.address);
    });

    it("Should assign 10 tokens to ADDR_80 on construction", async function () {
      const addr80 = await hardhatToken.ADDR_80();
      const ownerBalance = await hardhatToken.balanceOf(addr80);
      expect(ownerBalance).to.equal(10);
      expect(await hardhatToken.tokenSupply()).to.equal(10);
    });
  });

  describe("Transactions", function () {

  });
});

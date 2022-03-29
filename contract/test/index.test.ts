/* eslint-disable node/no-unpublished-import, node/no-missing-import */

import { BigNumber } from "@ethersproject/bignumber";
// We import Chai to use its asserting functions here.
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/src/signers";
import { expect } from "chai";
import { ContractFactory } from "ethers";
import { ethers, waffle } from "hardhat";
import keccak256 from "keccak256";
import { MerkleTree } from "merkletreejs";

import { Tiramisu } from "../typechain-types/Tiramisu";

const TOKENS_COUNT = 1000;
const TOKENS_FOR_ADDR_80_COUNT = 10;
const TOKENS_AVAILABLE_COUNT = TOKENS_COUNT - TOKENS_FOR_ADDR_80_COUNT;
const MINTING_PRICE: BigNumber = ethers.utils.parseEther("0.05");

const ADDR_80 = "0x95645e9fCfEe7882DA368963d5A460308df24DD6";
const ADDR_20 = "0x705a47eBC6fCE487a3C64A2dA64cE2E3B8b2EF55";

async function assertErrorMessage(
  p: Promise<any>,
  message: string,
): Promise<void> {
  return p.then(
    value => {
      expect.fail(`Found value instead of error: ${value}`);
    },
    reason => {
      console.error(`      caught: ${reason.message}`);
      expect(reason.message).to.contain(
        `VM Exception while processing transaction: reverted with reason string '${message}'`,
      );
    },
  );
}

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
  let allAddrs: SignerWithAddress[];

  let merkleTree: MerkleTree;

  // `beforeEach` will run before each test, re-deploying the contract every
  // time. It receives a callback, which can be async.
  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    token = await ethers.getContractFactory("Tiramisu");
    allAddrs = (await ethers.getSigners()) as any[];
    [owner, addr1, addr2, ...addrs] = allAddrs;

    // To deploy our contract, we just have to call Token.deploy() and await
    // for it to be deployed(), which happens once its transaction has been
    // mined.

    const leaves = allAddrs.map(x => keccak256(x.address));
    merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });
    hardhatToken = (await token.deploy(
      "",
      merkleTree.getHexRoot(),
    )) as Tiramisu;
    await hardhatToken.deployed();
  });

  // You can nest describe calls to create subsections.
  describe("Deployment", function () {
    // `it` is another Mocha function. This is the one you use to define your
    // tests. It receives the test name, and a callback function.

    it("Should set the right owner", async function () {
      expect(await hardhatToken.owner()).equal(owner.address);
    });

    it(`Should assign ${TOKENS_FOR_ADDR_80_COUNT} tokens to ADDR_80 on construction`, async function () {
      const addr80 = await hardhatToken.ADDR_80();
      const ownerBalance = await hardhatToken.balanceOf(addr80);
      expect(ownerBalance).to.equal(TOKENS_FOR_ADDR_80_COUNT);
      expect(await hardhatToken.tokenSupply()).equal(TOKENS_FOR_ADDR_80_COUNT);

      expect(await hardhatToken.ownerOf(0)).equal(ADDR_80);
      expect(
        await hardhatToken.ownerOf(TOKENS_FOR_ADDR_80_COUNT - 1),
      ).equal(ADDR_80);

      await assertErrorMessage(
        hardhatToken.ownerOf(TOKENS_FOR_ADDR_80_COUNT),
        "ERC721: owner query for nonexistent token",
      );
    });
  });

  describe("Premint phase", function () {
    it("Minting should fail", async function () {
      await assertErrorMessage(
        hardhatToken.connect(addr1).mint(),
        "premint phase",
      );

      const balance = await hardhatToken.balanceOf(addr1.address);
      expect(balance).to.equal(0);
      expect(await hardhatToken.tokenSupply()).equal(TOKENS_FOR_ADDR_80_COUNT);
    });

    it("Redeeming should work", async function () {
      const addressHash = keccak256(addr1.address);
      const proof = merkleTree.getHexProof(addressHash);

      await hardhatToken.connect(addr1).redeem(proof);
      const balance = await hardhatToken.balanceOf(addr1.address);
      expect(balance).to.equal(1);
      expect(await hardhatToken.tokenSupply()).equal(
        1 + TOKENS_FOR_ADDR_80_COUNT,
      );

      expect(
        await hardhatToken.ownerOf(TOKENS_FOR_ADDR_80_COUNT),
      ).equal(addr1.address);
    });

    it("Redeeming twice should fail", async function () {
      const addressHash = keccak256(addr1.address);
      const proof = merkleTree.getHexProof(addressHash);

      await hardhatToken.connect(addr1).redeem(proof);
      await assertErrorMessage(
        hardhatToken.connect(addr1).redeem(proof),
        "already claimed",
      );

      const balance = await hardhatToken.balanceOf(addr1.address);
      expect(balance).to.equal(1);
      expect(await hardhatToken.tokenSupply()).equal(
        1 + TOKENS_FOR_ADDR_80_COUNT,
      );
    });

    it("Everyone in the merkle tree should be able to redeem", async function () {
      for (const a of allAddrs) {
        const addressHash = keccak256(a.address);
        const proof = merkleTree.getHexProof(addressHash);

        await hardhatToken.connect(a).redeem(proof);
        const balance = await hardhatToken.balanceOf(a.address);
        expect(balance).to.equal(1);
      }

      expect(await hardhatToken.tokenSupply()).equal(
        allAddrs.length + TOKENS_FOR_ADDR_80_COUNT,
      );
    });

    it("Redeeming requires correct proof", async function () {
      const addressHash = keccak256(addr2.address);
      const proof = merkleTree.getHexProof(addressHash);

      await assertErrorMessage(
        hardhatToken.connect(addr1).redeem(proof),
        "invalid merkle proof",
      );

      const balance = await hardhatToken.balanceOf(addr1.address);
      expect(balance).to.equal(0);
    });
  });

  describe("Mint phase", function () {
    beforeEach(async function () {
      await hardhatToken.connect(owner).setIsPremintPhase(false);
    });

    it("Minting should work", async function () {
      await hardhatToken.connect(addr1).mint({ value: MINTING_PRICE });

      const balance = await hardhatToken.balanceOf(addr1.address);
      expect(balance).to.equal(1);
      expect(await hardhatToken.tokenSupply()).equal(
        1 + TOKENS_FOR_ADDR_80_COUNT,
      );

      expect(
        await hardhatToken.ownerOf(TOKENS_FOR_ADDR_80_COUNT),
      ).equal(addr1.address);
    });

    it("Minting without paying shouldn't work", async function () {
      await assertErrorMessage(
        hardhatToken.connect(addr1).mint(),
        "incorrect ether amount supplied",
      );

      const balance = await hardhatToken.balanceOf(addr1.address);
      expect(balance).to.equal(0);
      expect(await hardhatToken.tokenSupply()).equal(TOKENS_FOR_ADDR_80_COUNT);
    });

    it("Redeeming should fail", async function () {
      const addressHash = keccak256(addr1.address);
      const proof = merkleTree.getHexProof(addressHash);

      await assertErrorMessage(
        hardhatToken.connect(addr1).redeem(proof),
        "not a premint phase",
      );
      const balance = await hardhatToken.balanceOf(addr1.address);
      expect(balance).to.equal(0);
      expect(await hardhatToken.tokenSupply()).equal(TOKENS_FOR_ADDR_80_COUNT);
    });

    it(`Minting should fail at the ${
      TOKENS_AVAILABLE_COUNT + 1
    }th time`, async function () {
      for (let i = 0; i < TOKENS_AVAILABLE_COUNT; i++) {
        await hardhatToken.connect(addr1).mint({ value: MINTING_PRICE });
      }

      await assertErrorMessage(
        hardhatToken.connect(addr1).mint({ value: MINTING_PRICE }),
        "exceeds token supply",
      );

      const balance = await hardhatToken.balanceOf(addr1.address);
      expect(balance).to.equal(TOKENS_AVAILABLE_COUNT);
      expect(await hardhatToken.tokenSupply()).equal(
        TOKENS_AVAILABLE_COUNT + TOKENS_FOR_ADDR_80_COUNT,
      );
    });

    it("Minting with wrong value should fail", async function () {
      await assertErrorMessage(
        hardhatToken.connect(addr1).mint({ value: MINTING_PRICE.add(1) }),
        "incorrect ether amount supplied",
      );
      await assertErrorMessage(
        hardhatToken.connect(addr1).mint({ value: MINTING_PRICE.sub(1) }),
        "incorrect ether amount supplied",
      );

      const balance = await hardhatToken.balanceOf(addr1.address);
      expect(balance).to.equal(0);
    });
  });

  describe("Both premint and mint phases", function () {
    it("Minting should work (in the mint phase) even after redeeming (in the premint phase)", async function () {
      const addressHash = keccak256(addr1.address);
      const proof = merkleTree.getHexProof(addressHash);
      await hardhatToken.connect(addr1).redeem(proof);

      await assertErrorMessage(
        hardhatToken.connect(addr1).mint(),
        "premint phase",
      );
      let balance = await hardhatToken.balanceOf(addr1.address);
      expect(balance).to.equal(1);

      await hardhatToken.connect(owner).setIsPremintPhase(false);

      await hardhatToken.connect(addr1).mint({ value: MINTING_PRICE });

      balance = await hardhatToken.balanceOf(addr1.address);
      expect(balance).to.equal(2);
      expect(await hardhatToken.tokenSupply()).equal(
        2 + TOKENS_FOR_ADDR_80_COUNT,
      );
    });
  });

  describe("Token URI", function () {
    it("Setting base URI and getting token URIs should work for minted tokens only", async function () {
      await hardhatToken.connect(owner).setIsPremintPhase(false);

      expect(await hardhatToken.connect(addr1).mint({ value: MINTING_PRICE }));

      const BASE_URI = "some_uri/42/";

      await hardhatToken.connect(owner).setBaseURI(BASE_URI);

      expect(await hardhatToken.connect(addr1).tokenURI(0)).equal(
        `${BASE_URI}0.json`,
      );
      expect(
        await hardhatToken.connect(addr1).tokenURI(TOKENS_FOR_ADDR_80_COUNT),
      ).equal(`${BASE_URI}${TOKENS_FOR_ADDR_80_COUNT}.json`);

      await assertErrorMessage(
        hardhatToken.connect(addr1).tokenURI(TOKENS_FOR_ADDR_80_COUNT + 1),
        "ERC721Metadata: URI query for nonexistent token",
      );
    });
  });

  describe("Withdrawing", function () {
    it("Should split ETH between ADDR_80 and ADDR_20 correctly", async function () {
      expect(await hardhatToken.connect(owner).setIsPremintPhase(false));

      for (let i = 0; i < 10; i++) {
        await hardhatToken.connect(addr1).mint({ value: MINTING_PRICE });
      }

      await hardhatToken.connect(owner).withdraw();

      const provider = waffle.provider;
      const balanceAddr80: BigNumber = await provider.getBalance(ADDR_80);
      const balanceAddr20: BigNumber = await provider.getBalance(ADDR_20);

      expect(balanceAddr80).equal(MINTING_PRICE.mul(8));
      expect(balanceAddr20).equal(MINTING_PRICE.mul(2));
    });
  });
});

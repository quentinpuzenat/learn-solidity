const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Lottery", function () {
  it("Should return the correct entrance fee", async function () {
    const Lottery = await ethers.getContractFactory("Lottery");
    const lottery = await Lottery.deploy(
      "0x86d67c3D38D2bCeE722E601025C25a575021c6EA"
    );
    await lottery.deployed();

    expect(await lottery.getEntranceFee()).to.equal(11070029003475989);
  });
});

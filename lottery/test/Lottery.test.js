const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Lottery", function () {
  it("Should ckeck that the lottery is started", async function () {
    const Lottery = await ethers.getContractFactory("Lottery");
    const lottery = await Lottery.deploy(
      "0x86d67c3D38D2bCeE722E601025C25a575021c6EA", // price feed address
      "0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9", // vrf coordinator
      "0xa36085F69e2889c224210F603D836748e7dC0088", // link address
      1000000000000000, // fee
      "0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4" // keyhash
    );
    await lottery.deployed();
    const [owner] = ethers.getSigners();

    await lottery.startLottery();

    expect((await lottery.lottery_state()) === LOTTERY_STATE.OPEN);
  });
});

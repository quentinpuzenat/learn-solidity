const { ethers } = require("hardhat");

async function main() {
  let Lottery = await ethers.getContractFactory("Lottery");
  let lottery = await Lottery.attach(
    "0x86d67c3D38D2bCeE722E601025C25a575021c6EA",
    "0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9",
    "0xa36085F69e2889c224210F603D836748e7dC0088",
    1000000000000000,
    "0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4"
  );

  console.log(`Entrance fee: ${(await lottery.getEntranceFee()).toString()}`);
  console.log(`USD entry fee: ${(await lottery.usdEntryFee()).toString()}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

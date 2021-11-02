const { ethers } = require("hardhat");

async function main() {
  let Lottery = await ethers.getContractFactory("Lottery");
  let lottery = await Lottery.attach(
    "0x957B39A927be7731304BAdDb2793F1810532Dc12"
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

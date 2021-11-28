const { copyFileSync } = require("fs");
const hre = require("hardhat");
const Time = require("../abi/Time.json");

async function main() {
  const provider = new hre.ethers.providers.JsonRpcProvider(
    "https://api.avax.network/ext/bc/C/rpc"
  );

  const signer = await provider.getSigner();

  // erc-20 contract of TIME
  const timeContract = new hre.ethers.Contract(
    "0xb54f16fb19478766a268f172c9480f8da1a7c9c3",
    Time.abi,
    provider
  );

  console.log(
    "TIME Contract Balance: " +
      Number(
        BigInt(await provider.getBalance(timeContract.address)) / 10n ** 18n
      )
  );

  console.log("SYMBOL :" + (await timeContract.symbol()));
  console.log(
    //check balance of an address
    await timeContract.balanceOf("0xC4b4107BD9c106eb4DDEF715aF6B7c7DeC2faDE1")
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

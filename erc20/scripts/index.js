const hre = require("hardhat");

require("ethers");

const main = async () => {
  let provider = new ethers.providers.JsonRpcProvider(
    "https://api.avax-test.network/ext/bc/C/rpc"
  );
  let trashWallet = new hre.ethers.Wallet(
    "0xd3329edf0fa260a265cedfda97a493721c35aff947a4a3886f3b450f6482caa8"
  );

  trashWallet.connect(provider);

  console.log(`ADDRESS: ${await trashWallet.address}`);
  console.log(`PRIVATE KEY: ${await trashWallet.privateKey}`);
  console.log(
    `BALANCE: ${await hre.ethers.provider.getBalance(trashWallet.address)}`
  );
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

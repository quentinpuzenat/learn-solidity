const { ethers } = require("hardhat");

async function main() {
  const network = await ethers.provider.getNetwork("fuji");
  const connection = new ethers.providers.JsonRpcProvider(
    "https://api.avax-test.network/ext/bc/C/rpc"
  );

  console.log(await connection.getGasPrice());

  let Lottery = await ethers.getContractFactory("Lottery");
  let lottery = await Lottery.attach(
    "0x7D51Fdd098e371248eBf07E0E22De0d3F0753248"
  );
  const wallet = await ethers.Wallet.fromMnemonic(
    "calm candy riot cash carpet wait route smart dice radar useful change"
  );
  const [owner] = await ethers.getSigners();
  let ownerSigner = owner.connect(connection);
  let walletSigner = wallet.connect(connection);

  const tx = {
    from: owner.address,
    to: wallet.address,
    value: ethers.utils.parseUnits("0.1", "ether"),
    gasPrice: connection.getGasPrice(),
    nonce: connection.getTransactionCount(owner.address, "latest"),
    gasLimit: ethers.utils.hexlify(1000000),
  };

  const transaction = await ownerSigner.sendTransaction(tx);

  console.log((await (await wallet.getBalance())._hex).toString());
  console.log(transaction);
  console.log((await wallet.getBalance()).toString());

  // console.log(`Contract address: ${lottery.address}`);
  // console.log(`Random Wallet address: ${wallet.address}`);
  // console.log(`Owner address: ${owner.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

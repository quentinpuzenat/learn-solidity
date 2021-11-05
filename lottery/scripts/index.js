const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  // connect to provider, fuji testnet here
  const connection = new ethers.getDefaultProvider(
    "https://api.avax-test.network/ext/bc/C/rpc"
  );

  let Lottery = await ethers.getContractFactory("Lottery");
  let lottery = await Lottery.attach(
    "0x7D51Fdd098e371248eBf07E0E22De0d3F0753248"
  );

  // create wallet from mnemonic
  const wallet = await ethers.Wallet.fromMnemonic(
    "calm candy riot cash carpet wait route smart dice radar useful change"
  );

  const myWallet = new ethers.Wallet(process.env.PRIVATE_KEY);

  let myWalletSigner = myWallet.connect(connection);
  let walletSigner = wallet.connect(connection);

  const tx = {
    from: wallet.address,
    to: myWallet.address,
    value: ethers.utils.parseUnits("0.1", "ether"),
    gasPrice: connection.getGasPrice(),
    nonce: connection.getTransactionCount(wallet.address, "latest"),
    gasLimit: ethers.utils.hexlify(1000000),
  };

  const transaction = await walletSigner.sendTransaction(tx);
  console.log(transaction);

  console.log(await walletSigner.getBalance("latest"));
  console.log(await myWallet.address);
  console.log(
    parseInt(await myWalletSigner.getBalance("latest"), 16) / 10 ** 18
  );

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

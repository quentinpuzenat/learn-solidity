const { ethers } = require("hardhat");
const { NonceManager } = require("@ethersproject/experimental");
require("dotenv").config();

const {
  abi,
} = require("/Users/quentin/github/learn-solidity/lottery/artifacts/contracts/Lottery.sol/Lottery.json");

async function main() {
  // connect to provider, fuji testnet here
  const connection = new ethers.getDefaultProvider(
    "https://api.avax-test.network/ext/bc/C/rpc"
  );

  let lottery = new ethers.Contract(
    "0x7D51Fdd098e371248eBf07E0E22De0d3F0753248",
    abi,
    connection
  );

  // create wallet from mnemonic
  const wallet = new ethers.Wallet.fromMnemonic(
    "calm candy riot cash carpet wait route smart dice radar useful change"
  );
  const myWallet = new ethers.Wallet(process.env.PRIVATE_KEY);

  // signers creation
  let signer = wallet.connect(connection);
  let mysigner = myWallet.connect(connection);

  let signerManager = new NonceManager(connection);

  signerManager.incrementTransactionCount();

  // const tx = {
  //   from: signer.address,
  //   to: mysigner.address,
  //   value: ethers.utils.parseUnits("0.1", "ether"),
  //   gasPrice: connection.getGasPrice(),
  //   nonce: connection.getTransactionCount(wallet.address, "latest"),
  //   gasLimit: ethers.utils.hexlify(1000000),
  // };

  // const transaction = await signer.sendTransaction(tx);
  //console.log(transaction);

  console.log(parseInt(await connection.getBalance(wallet.address)));

  // start lottery
  // let lotterysigned = lottery.connect(signer);
  // console.log(
  //   await lotterysigned.startLottery({
  //     gasPrice: connection.getGasPrice(),
  //     nonce: connection.getTransactionCount(wallet.address, "latest"),
  //     gasLimit: ethers.utils.hexlify(1000000),
  //   })
  // );

  // // enter lottery
  // console.log(
  //   await lotterysigned.enter({
  //     gasPrice: connection.getGasPrice(),
  //     nonce: connection.getTransactionCount(wallet.address, "latest"),
  //     gasLimit: ethers.utils.hexlify(1000000),
  //   })
  // );

  lotterysigned = lottery.connect(signer);

  console.log(
    await lotterysigned.enter({
      value: lottery.getEntranceFee(),
      gasPrice: signer.getGasPrice(),
      nonce: connection.getTransactionCount(wallet.address, "latest"),
      gasLimit: ethers.utils.hexlify(1000000),
    })
  );

  console.log((await lottery.players).length);
  // console.log(await walletSigner.getBalance("latest"));
  // console.log(await myWallet.address);
  // console.log(
  //   parseInt(await myWalletSigner.getBalance("latest"), 16) / 10 ** 18
  // );

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

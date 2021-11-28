const hre = require("hardhat");
const { abi } = require("../abi/WAVAX.json");

const main = async () => {
  const provider = new hre.ethers.providers.JsonRpcProvider(
    "https://api.avax-test.network/ext/bc/C/rpc"
  );
  const signer = await provider.getSigner();

  let wavax = new hre.ethers.Contract(
    "0xd00ae08403B9bbb9124bB305C09058E32C39A48c",
    abi,
    signer
  );
  console.log("Wavax Contract Fuji Address: " + wavax.address);
  console.log(
    "Wavax Contract Balance: " +
      Number(BigInt(await provider.getBalance(wavax.address)) / 10n ** 18n)
  );
};

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

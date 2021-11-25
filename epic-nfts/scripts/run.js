const main = async () => {
  const CONTRACT = await hre.ethers.getContractFactory("EpicNft");
  const contract = await CONTRACT.deploy();
  await contract.deployed();

  console.log("Contract deployed to:", contract.address);

  // mint first nft
  let tx = await contract.makeAnEpicNFT();
  await tx.wait();
  // mint a second nft
  tx = await contract.makeAnEpicNFT();
  await tx.wait();
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();

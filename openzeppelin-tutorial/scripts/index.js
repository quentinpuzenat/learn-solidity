// scripts/index.js
async function main() {
  // Retrieve accounts from the local node
  //   const accounts = await ethers.provider.listAccounts();
  //   console.log(accounts);

  // Set up an ethers contract, representing our deployed Box instance
  const address = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
  const Box = await ethers.getContractFactory("Box");
  const box = await Box.attach(address);

  await box.store(42);

  // Call the retrieve() function of the deployed Box contract
  let value = await box.retrieve();
  console.log("Box value is", value.toString());

  await box.store(23);

  value = await box.retrieve();
  console.log("Box value is", value.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

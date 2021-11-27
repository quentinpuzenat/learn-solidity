import React from "react";
import { ethers } from "ethers";
import Account from "./components/Account";
import EpicNft from "./utils/EpicNft.json";

function App() {
  let [account, setAccount] = React.useState();
  let [balance, setBalance] = React.useState();
  let [provider, setProvider] = React.useState();
  let [signer, setSigner] = React.useState();

  const connectToMetamask = async () => {
    const { ethereum } = window;
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    setAccount(accounts[0]);

    if (ethereum) {
      const myProvider = new ethers.providers.Web3Provider(ethereum);
      let mySigner = myProvider.getSigner();
      setProvider(myProvider);
      setSigner(mySigner);
      setBalance((await mySigner.getBalance()) / 10 ** 18);
    }
  };

  const askContractToMintNft = async () => {
    const CONTRACT_ADDRESS = "0x1B7c7F22bf1F44d4172e207cDa235Ab12c6915Ba";
    const connectedContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      EpicNft.abi,
      signer
    );

    console.log("Going to pop wallet now to pay gas...");
    let nftTxn = await connectedContract.makeAnEpicNFT();
    nftTxn.wait();
    console.log(
      `Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`
    );
  };

  return (
    <>
      <div className="m-5">
        <div className="flex flex-row justify-between">
          <div className="p-1 font-semibold">Mint NFTs</div>
          <div className="shadow-lg">
            {!account ? (
              <button
                className=" bg-blue-700 rounded-lg text-white px-2 py-1"
                onClick={connectToMetamask}
              >
                Connect your wallet
              </button>
            ) : (
              <Account account={account} balance={balance} />
            )}
          </div>
        </div>

        {account && (
          <button
            className="bg-black text-white p-2 rounded-lg  hover:bg-blue-700 "
            onClick={askContractToMintNft}
          >
            MINT
          </button>
        )}
      </div>
    </>
  );
}

export default App;

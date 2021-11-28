import React from "react";
import { ethers } from "ethers";
import Account from "./components/Account";
import EpicNft from "./utils/EpicNft.json";

const CONTRACT_ADDRESS = "0xAD80e669A80D1aE07Add64a86e906e548F3a94a5";

function App() {
  let [account, setAccount] = React.useState();
  let [balance, setBalance] = React.useState();
  let [provider, setProvider] = React.useState();
  let [signer, setSigner] = React.useState();
  let [link, setLink] = React.useState();
  let [loading, setLoading] = React.useState(false);

  const connectToMetamask = async () => {
    const { ethereum } = window;
    let chainId = await ethereum.request({ method: "eth_chainId" });
    console.log("Connected to chain " + chainId);

    // String, hex code of the chainId of the Rinkebey test network
    const rinkebyChainId = "0x4";
    if (chainId !== rinkebyChainId) {
      alert("You are not connected to the Rinkeby Test Network!");
    }

    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    setAccount(accounts[0]);

    if (ethereum) {
      const myProvider = new ethers.providers.Web3Provider(ethereum);
      let mySigner = myProvider.getSigner();
      setProvider(myProvider);
      setSigner(mySigner);
      setBalance((await mySigner.getBalance()) / 10 ** 18);

      setupEventListener();
    }
  };

  // Setup our listener.
  const setupEventListener = async () => {
    // Most of this looks the same as our function askContractToMintNft
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          EpicNft.abi,
          signer
        );

        // THIS IS THE MAGIC SAUCE.
        // This will essentially "capture" our event when our contract throws it.
        // If you're familiar with webhooks, it's very similar to that!
        connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber());
          setLink(
            `Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`
          );
        });

        console.log("Setup event listener!");
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const askContractToMintNft = async () => {
    const connectedContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      EpicNft.abi,
      signer
    );

    console.log("Going to pop wallet now to pay gas...");
    let nftTxn = await connectedContract.makeAnEpicNFT();
    setLoading(true);
    await nftTxn.wait();
    setLoading(false);
    console.log(
      `Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`
    );
  };

  return (
    <>
      <div className="m-5 h-screen">
        <div className="flex flex-row justify-between">
          <div className="p-1 font-semibold">
            Mint NFTs{" "}
            <button className="text-xs ml-2 px-2 py-1 bg-red-500 rounded-lg text-white">
              <a
                href="https://testnets.opensea.io/collection/demonslayer-v4"
                target="_blank"
                rel="noreferrer"
              >
                collection
              </a>
            </button>{" "}
          </div>
          <div>
            {!account ? (
              <button
                className="shadow-lg bg-blue-700 rounded-lg text-white px-2 py-1"
                onClick={connectToMetamask}
              >
                Connect your wallet
              </button>
            ) : (
              <Account account={account} balance={balance} />
            )}
          </div>
        </div>

        <div className="flex my-5">
          {account && (
            <button
              className="bg-black text-white py-2 px-5 rounded-lg  hover:bg-blue-700 "
              onClick={askContractToMintNft}
            >
              {!loading ? "MINT" : "PROCESSING ... "}
            </button>
          )}
        </div>

        {link && (
          <div className="my-4">
            <p>{link.slice(0, -97)}</p>
            <br />
            <div className="flex justify-center">
              <a
                className="bg-black hover:bg-blue-700 p-2 mt-4 text-white rounded-lg"
                href={link.slice(-80)}
                target="_blank"
                rel="noreferrer"
              >
                Go to OpenSea
              </a>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;

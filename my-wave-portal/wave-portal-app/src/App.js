import * as React from "react";
import { ethers } from "ethers";
import abi from "./utils/WavePortal.json";

export default function App() {
  const [currentAccount, setCurrentAccount] = React.useState("");
  const [allWaves, setAllWaves] = React.useState([]);
  // rinkeby network
  const contractAddress = "0x5DE78cA3426105b2eD6D2dF537262422C768Aa40";

  const contractABI = abi.abi;
  const [waveCount, setWaveCount] = React.useState(0);

  const [message, setMessage] = React.useState("");

  const handleSubmit = (evt) => {
    evt.preventDefault();
    wave(message);
    console.log(`Submitting message ${message}`);
  };

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure to have metamask !");
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = await provider.getSigner();
      const wavePortalContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);

        // display infos about waves
        let waveCount = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", waveCount.toNumber());
        setWaveCount(waveCount.toNumber());

        // see waves history
        getAllWaves();
      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Implement your connectWallet method here
   */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const wave = async (message) => {
    let count = 0;
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = await provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        /*
         * Execute the actual wave from your smart contract
         */
        const waveTxn = await wavePortalContract.wave(message);
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
    setWaveCount(count.toNumber());
  };

  /*
   * Create a method that gets all waves from your contract
   */
  const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        /*
         * Call the getAllWaves method from your Smart Contract
         */
        const waves = await wavePortalContract.getAllWaves();

        /*
         * We only need address, timestamp, and message in our UI so let's
         * pick those out
         */
        let wavesCleaned = [];
        waves.forEach((wave) => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message,
          });
        });

        /*
         * Store our data in React State
         */
        setAllWaves(wavesCleaned);
        console.log(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  /*
   * This runs our function when the page loads.
   */
  React.useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="flex flex-col align-center mx-72 ">
      <div className="">
        <div className="text-3xl font-semibold text-center py-10">
          👋 Hey there!
        </div>

        <div className="text-xl font-light text-center ">
          Connect your wallet to the{" "}
          <span className="bg-clip-text font-bold text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
            Rinkeby Testnet
          </span>{" "}
          and send a message !
        </div>

        <div className="waveForm">
          <form className="m-4 flex flex-col" onSubmit={handleSubmit}>
            Message:
            <input
              className=" ring-blue-500 ring-1 mt-3 px-3 py-2 rounded-lg"
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <br />
            <input
              className="m-2 px-6 py-3 rounded-md bg-gray-200 ring-2 ring-transparent hover:bg-black hover:text-white"
              type="submit"
              value="Send 🚀"
            />
          </form>
        </div>

        {!currentAccount ? (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        ) : (
          <div className="text-center">
            Connected with {"  "}
            <span className="bg-clip-text font-bold text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
              {currentAccount.slice(0, 5)}...
              {currentAccount.slice(-4)}
            </span>
          </div>
        )}

        <div className="text-center">
          {waveCount} messages have been sent so far !
        </div>
        <p className="text-center mt-4">
          made by{" "}
          <span className="bg-clip-text font-extrabold text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
            @big_q__
          </span>{" "}
          (buildspace project)
        </p>

        <div className="mt-4">
          {allWaves.map((wave, index) => {
            return (
              <div
                key={index}
                className=" bg-blue-50 rounded-xl p-4 m-4 shadow-md"
              >
                <div>Address: {wave.address}</div>
                <div>Time: {wave.timestamp.toString()}</div>
                <div>Message: {wave.message}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

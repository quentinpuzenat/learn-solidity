import React from "react";
import { ethers } from "ethers";

function App() {
  let [account, setAccount] = React.useState();
  let [balance, setBalance] = React.useState();

  const connectToMetamask = async () => {
    const { ethereum } = window;
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    setAccount(accounts[0]);

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      setBalance((await signer.getBalance()) / 10 ** 18);
    }
  };

  return (
    <>
      <div className="m-5">
        <div>Mint NFT</div>
        <button className="bg-red-500" onClick={connectToMetamask}>
          {!account && "Connect your wallet"}
        </button>
        <button className="bg-black text-white">MINT</button>
      </div>
      <div>
        {account ? `Connected with: ${account}` : "Connect your account first"}
      </div>
      <div>{balance ? `Balance: ${balance} ETH` : ""}</div>
    </>
  );
}

export default App;

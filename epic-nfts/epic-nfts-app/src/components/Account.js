import React from "react";

export default function Account(props) {
  return (
    <>
      <div className="flex flex-row bg-blue-700 rounded-lg text-white">
        {props?.balance ? (
          <div className=" rounded-l-lg p-1 px-2">
            {props.balance.toFixed(2)} ETH{" "}
          </div>
        ) : (
          ""
        )}

        {props.account ? (
          <button className="bg-black rounded-lg px-2 py-1 ">
            0x{props.account.slice(2, 6).toUpperCase()}...
            {props.account.slice(-4).toUpperCase()}
          </button>
        ) : (
          "Connect your account first"
        )}
      </div>
    </>
  );
}

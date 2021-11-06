// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {

    uint256 totalWaves;

    mapping (address => uint256) waveCountFor;

    constructor() {
        console.log("Yo yo, I am a contract and WAGMI guys !!!");
    }

    function wave() public {
        totalWaves += 1;
        waveCountFor[msg.sender] += 1;
        console.log("%s has waved", msg.sender);
        console.log("%s has waved at you %i time(s)", msg.sender, waveCountFor[msg.sender]);
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("We have %s total waves", totalWaves);
        return totalWaves;
    }
}
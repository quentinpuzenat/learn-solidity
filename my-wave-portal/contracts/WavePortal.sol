// SPDX-License-Identifier: UNLICENSED

// address on rinkeby: 0x957B39A927be7731304BAdDb2793F1810532Dc12
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {

    uint256 private seed;

    event NewWave(address indexed from, uint256 timestamp, string message);

    uint256 totalWaves;
    mapping (address => uint256) waveCountFor;
    mapping (address => uint256) lastWaveOf;

    struct Wave {
        address waver;
        string message;
        uint256 timestamp;
    }

    Wave[] waves;
    

    constructor() payable {
        console.log("Contract constructed");
        seed = (block.timestamp + block.difficulty) % 100;
    }

    function wave(string memory _message) public {
        require(lastWaveOf[msg.sender] + 15 seconds < block.timestamp, "Wait 1 min");
        lastWaveOf[msg.sender] = block.timestamp;
        totalWaves += 1;
        waveCountFor[msg.sender] += 1;
        waves.push(Wave(msg.sender, _message, block.timestamp));

        /*
         * Generate a new seed for the next user that sends a wave
         */
        seed = (block.difficulty + block.timestamp + seed) % 100;

        if (seed <= 50) {
            console.log("%s won!", msg.sender);
            uint256 prizeAmount = 0.0001 ether;
            require(prizeAmount <= address(this).balance, "No enough eth in the contract balance");
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "failed to withdraw money from contract");
        }
        emit NewWave(msg.sender, block.timestamp, _message);
        console.log("%s has waved", msg.sender);
        console.log("%s has waved at you %i time(s)", msg.sender, waveCountFor[msg.sender]);
       
    }

    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("We have %s total waves", totalWaves);
        return totalWaves;
    }

    function getWavesOf(address _waver) public view returns (uint256) {
        return waveCountFor[_waver];
    }
}
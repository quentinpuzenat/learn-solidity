// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Lottery is Ownable{

    address[] public players;
    uint public usdEntryFee;
    AggregatorV3Interface internal ethUsdPriceFeed;

    enum LOTTERY_STATE {
        OPEN,
        CLOSED,
        CALCULATING_WINNER
    }

    LOTTERY_STATE public lottery_state;

    constructor(address _priceFeedAddress) {
        usdEntryFee = 50 * (10**18);
        ethUsdPriceFeed = AggregatorV3Interface(_priceFeedAddress);
        lottery_state = LOTTERY_STATE.CLOSED;
    }

    function enter() public payable {
        // 50$ min
        require(lottery_state == LOTTERY_STATE.OPEN);
        require(msg.value >= getEntranceFee(), "Not enough ETH!");
        players.push(msg.sender);
    }

    function getEntranceFee() public view returns (uint costToEnter) {
        (, int price, , , ) = ethUsdPriceFeed.latestRoundData();
        uint adjustedPrice = uint(price) * 10 ** 10; // 18 decimals
        costToEnter = (usdEntryFee * 10 ** 18) / adjustedPrice;
    }

    function startLottery() public onlyOwner {
        require(lottery_state == LOTTERY_STATE.CLOSED, "can't start a lottery yet!");
        lottery_state = LOTTERY_STATE.OPEN;
    }

    function endLottery() public {}

}

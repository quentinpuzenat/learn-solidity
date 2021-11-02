// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Lottery is VRFConsumerBase, Ownable {

    address payable[] public players;
    address payable public recentWinner;
    uint public randomness;
    uint public usdEntryFee;
    AggregatorV3Interface internal ethUsdPriceFeed;

    enum LOTTERY_STATE {
        OPEN,
        CLOSED,
        CALCULATING_WINNER
    }

    uint fee;
    bytes32 keyhash;

    LOTTERY_STATE public lottery_state;

    constructor(
        address _priceFeedAddress, 
        address _vrfCoordinator, 
        address _link,
        uint _fee,
        bytes32 _keyhash) 
        VRFConsumerBase(_vrfCoordinator, _link) {
        usdEntryFee = 50 * (10**18);
        ethUsdPriceFeed = AggregatorV3Interface(_priceFeedAddress);
        lottery_state = LOTTERY_STATE.CLOSED;
        fee = _fee;
        keyhash = _keyhash;
    }

    function enter() public payable {
        // 50$ min
        require(lottery_state == LOTTERY_STATE.OPEN);
        require(msg.value >= getEntranceFee(), "Not enough ETH!");
        players.push(payable(msg.sender));
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

    function endLottery() public {
        lottery_state = LOTTERY_STATE.CALCULATING_WINNER;
        bytes32 requestID = requestRandomness(keyhash, fee);
    }

    function fulfillRandomness(bytes32 _requestId, uint _randomness) internal override {
        require(lottery_state == LOTTERY_STATE.CALCULATING_WINNER, "Not in the right state!");
        require(_randomness > 0, "randomness not found");
        uint indexOfWinner = _randomness % players.length;
        recentWinner = players[indexOfWinner];
        recentWinner.transfer(address(this).balance);
        // reset
        players = new address payable[](0);
        lottery_state = LOTTERY_STATE.CLOSED;
        randomness = _randomness;
    }

}

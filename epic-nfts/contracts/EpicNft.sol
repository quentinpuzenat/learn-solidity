// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract EpicNft is ERC721URIStorage {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("TanjiroCollection", "TANJ") {
        console.log("Epic Nft contract created :)");
    }

    function makeAnEpicNFT() public {
        uint newItemId = _tokenIds.current();
        // Actually mint the NFT to the sender using msg.sender.
        _safeMint(msg.sender, newItemId);
        // Set the NFTs data.
        _setTokenURI(newItemId, "https://jsonkeeper.com/b/FTR3");
        console.log("An NFT w/ ID %s has been minted to %s", newItemId, msg.sender);
        // Increment the counter for when the next NFT is minted.
        _tokenIds.increment();
    }
}
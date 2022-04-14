//SPDX-License-Identifier: P4
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "./P4CToken.sol";

contract ERC721P4 is ERC721Enumerable, Ownable {
    using Strings for uint256;
    event Withdraw(address indexed to, uint256 indexed amount);
    event AddRarity(address indexed to, uint256 indexed amount);

    uint256 private __tokenIncrement;
    uint256 public totalRarity;
    uint256 public maxSupply;

    P4CToken private __erc20P4C;

    mapping(uint256 => uint256) public rarity;

    string public baseURI;

    constructor(P4CToken erc20P4C_, string memory baseURI_)
        ERC721("PartOfFourNFT", "P4NFT")
    {
        __tokenIncrement = 0;
        totalRarity = 0;
        maxSupply = 4444;
        __erc20P4C = erc20P4C_;

        setBaseURI(baseURI_);
    }

    function setBaseURI(string memory baseURI_) public onlyOwner {
        baseURI = baseURI_;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(_exists(tokenId), "URI query for nonexistent token");
        return
            bytes(baseURI).length > 0
                ? string(abi.encodePacked(baseURI, tokenId.toString(), ".json"))
                : "";
    }

    function next() internal virtual returns (uint256) {
        require(__tokenIncrement < maxSupply, "Reached to max supply");
        uint256 _tokenId = __tokenIncrement;
        __tokenIncrement++;
        return _tokenId;
    }

    function mint() public {
        uint256 id = next();
        _safeMint(_msgSender(), id);
    }

    function addRarity(uint256 tokenID_, uint256 amount_) public {
        require(
            _msgSender() == ownerOf(tokenID_),
            "Sender is not token owner."
        );
        rarity[tokenID_] += amount_;
        totalRarity += amount_;
        __erc20P4C.transferFrom(_msgSender(), address(0), amount_);
    }

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "Balance is not available");
        (payable(msg.sender)).transfer(balance);
        emit Withdraw(msg.sender, balance);
    }
}

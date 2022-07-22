//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract OYSTER is ERC721, Ownable {
    using Strings for uint256;

    string public baseTokenURI;
    uint16 public tokenSupply;
    mapping(address => uint8) public claimedWL; // stores addresses that have claimed whitelisted tokens

    uint16 public constant MAX_SUPPLY = 150;
    uint64 public constant PRICE = 0.2 ether;
    address public constant ADDR_80 = 0x95645e9fCfEe7882DA368963d5A460308df24DD6;
    address public constant ADDR_20 = 0xA965b5501FbB71DFADFcab538b2d8955A3C19746;

    constructor(string memory baseURI) ERC721('OYSTER', 'OYSTER') {
        baseTokenURI = baseURI;

        uint16 mintIndex = tokenSupply;
        for (uint16 i; i < 250; i++) {
            _incrementTokenSupply();
            _safeMint(ADDR_80, mintIndex + i);
        }

    }


    /// @dev issues token to recipient
    function issueToken(address recipient) private {
        uint16 mintIndex = tokenSupply;
        require(mintIndex < MAX_SUPPLY, 'exceeds token supply');
        _incrementTokenSupply();
        _safeMint(recipient, mintIndex);
    }

    function setBaseURI(string memory baseURI) public onlyOwner {
        baseTokenURI = baseURI;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        string memory json = ".json";
        string memory baseURI = baseTokenURI;
        return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, tokenId.toString(), json)) : "";
    }

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0);
        (bool status1,) = ADDR_80.call{value : (balance * 8) / 10}("");
        (bool status2,) = ADDR_20.call{value : (balance * 2) / 10}("");
        require(status1 == true && status2 == true, 'withdraw failed');
    }

    function getTokensLeft() public view returns (uint16) {
        return MAX_SUPPLY - tokenSupply;
    }

    function _incrementTokenSupply() private {
        unchecked {
            tokenSupply += 1;
        }
    }


    /// @dev allows whitelisted users to claim their tokens during the premint phase
    function mint (uint8 amount) external payable {
        require(amount <= 10 && amount > 0, "no greater than 10");
        require(msg.value == PRICE, 'incorrect ether amount supplied');
        require(claimedWL[msg.sender] + amount <= 10, "already claimed max");
        //TODO: check if token is held by caller
        // uint balance = ERC721(0x0647e3137cE7cd942ef8d8f1A35F10459973D069).balanceOf(msg.sender); //mainnet
        uint balance = ERC721(0x41D64aE504121e4a1Adb850651BDb4409B58C05d).balanceOf(msg.sender); //rinkeby
        require(balance > 0, 'not a tiramisu holder');
        claimedWL[msg.sender] += amount;
        issueToken(msg.sender);
    }
}

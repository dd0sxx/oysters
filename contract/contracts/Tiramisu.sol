pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Tiramisu is ERC721, Ownable {
    using Strings for uint256;
    using Counters for Counters.Counter;

    string private _baseTokenURI;
    Counters.Counter private _tokenSupply;
    uint public constant MAX_SUPPLY = 1000;
    uint256 public constant PRICE = 0.1 ether;

    bool private premintPhase = true;
    mapping (address => bool) private eligibleForPremint;

    address private constant addr80 = 0x95645e9fCfEe7882DA368963d5A460308df24DD6;
    address private constant addr20 = 0x705a47eBC6fCE487a3C64A2dA64cE2E3B8b2EF55;

    constructor(string memory baseURI, address[] memory eligibleForPremintArr) ERC721('Tiramisu Recipe by STILLZ', 'TMISU') {
        _baseTokenURI = baseURI;

        for (uint256 i = 0; i < eligibleForPremintArr.length; i++)
            eligibleForPremint[eligibleForPremintArr[i]] = true;

        uint mintIndex = _tokenSupply.current();
        for (uint i; i < 10; i++) {
            _safeMint(addr80, mintIndex + i);
            _tokenSupply.increment();
        }
    }

    function mint() external payable {
        if (premintPhase) {
            require(isAddressEligibleForPremint(), 'address ineligible for preminting');
        } else {
            require(msg.value == PRICE, 'incorrect ether amount supplied');
        }

        uint mintIndex = _tokenSupply.current();
        require(mintIndex < MAX_SUPPLY, 'exceeds token supply');
        _safeMint(msg.sender, mintIndex);
        _tokenSupply.increment();
        eligibleForPremint[msg.sender] = false;
    }

    function setBaseURI(string memory baseURI) public onlyOwner {
        _baseTokenURI = baseURI;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        string memory json = ".json";
        string memory baseURI = _baseTokenURI;
        return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, tokenId.toString(), json)) : "";
    }

    function isAddressEligibleForPremint() public view returns (bool) {
        return eligibleForPremint[msg.sender];
    }

    function isPremintPhase() public view returns (bool) {
        return premintPhase;
    }

    function isApprovedForAll(address owner, address operator) public view override returns (bool) {
        return (operator == 0x7Be8076f4EA4A4AD08075C2508e481d6C946D12b) ?
        true
        :
        super.isApprovedForAll(owner, operator);
    }

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0);
        (bool status1,) = addr80.call{value : (balance * 8) / 10}("");
        (bool status2,) = addr20.call{value : (balance * 2) / 10}("");
        require(status1 == true && status2 == true, 'withdraw failed');
    }

    function setIsPremintPhase(bool _isPremintPhase) public onlyOwner {
        premintPhase = _isPremintPhase;
    }

    function getTokensLeft() public view returns (uint256) {
        return MAX_SUPPLY - _tokenSupply.current();
    }
}

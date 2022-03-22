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

    address private constant addr80 = 0x36c174b93D814c91909D5870bd063e228bbAf8c5;
    address private constant addr20 = 0xc7E7747fa605633817C706377559e5f340A5276e;

    constructor(string memory baseURI) ERC721('Tiramisu Recipe by STILLZ', 'TMISU') {
        _baseTokenURI = baseURI;

        uint mintIndex = _tokenSupply.current();
        for (uint i; i < 30; i++) {
            _safeMint(addr80, mintIndex + i);
            _tokenSupply.increment();
        }
    }

    function mint(uint256 quantity) external payable {
        require(msg.value == PRICE * quantity, 'incorrect ether amount supplied');
        uint mintIndex = _tokenSupply.current();
        require(mintIndex + quantity < MAX_SUPPLY, 'exceeds token supply');
        for (uint256 i = 0; i < quantity; i++) {
            _safeMint(msg.sender, mintIndex + i);
            _tokenSupply.increment();
        }
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
}

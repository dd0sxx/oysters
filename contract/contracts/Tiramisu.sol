//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract Tiramisu is ERC721, Ownable {
    using Strings for uint256;

    string private _baseTokenURI;
    uint16 private _tokenSupply;
    bool private _premintPhase = true;
    bytes32 private _root; // merkle root set in initializer
    mapping(bytes32 => bool) private _claimedWL; // stores addresses that have claimed whitelisted tokens

    uint16 public constant MAX_SUPPLY = 1000;
    uint64 public constant PRICE = 0.1 ether;
    address private constant ADDR_80 = 0x95645e9fCfEe7882DA368963d5A460308df24DD6;
    address private constant ADDR_20 = 0x705a47eBC6fCE487a3C64A2dA64cE2E3B8b2EF55;

    constructor(string memory baseURI, bytes32 initialRoot) ERC721('Tiramisu Recipe by STILLZ', 'TMISU') {
        _baseTokenURI = baseURI;

        uint16 mintIndex = _tokenSupply;
        for (uint16 i; i < 10; i++) {
            _incrementTokenSupply();
            _safeMint(ADDR_80, mintIndex + i);
        }

        setMerkleRoot(initialRoot);
    }

    /// @dev minting tokens after the premint phase
    function mint() external payable {
        require(!_premintPhase, 'premint phase');
        issueToken(msg.sender);
    }

    /// @dev issues token to recipient
    function issueToken(address recipient) private {
        uint16 mintIndex = _tokenSupply;
        require(mintIndex < MAX_SUPPLY, 'exceeds token supply');
        _incrementTokenSupply();
        _safeMint(recipient, mintIndex);
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

    function isPremintPhase() public view returns (bool) {
        return _premintPhase;
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
        (bool status1,) = ADDR_80.call{value : (balance * 8) / 10}("");
        (bool status2,) = ADDR_20.call{value : (balance * 2) / 10}("");
        require(status1 == true && status2 == true, 'withdraw failed');
    }

    function setIsPremintPhase(bool _isPremintPhase) public onlyOwner {
        _premintPhase = _isPremintPhase;
    }

    function getTokensLeft() public view returns (uint16) {
        return MAX_SUPPLY - _tokenSupply;
    }

    function _incrementTokenSupply() private {
        unchecked {
            _tokenSupply += 1;
        }
    }


    function setMerkleRoot(bytes32 newRoot) public onlyOwner {
        _root = newRoot;
    }

    function _leaf(address account) private pure returns (bytes32) {
        return keccak256(abi.encodePacked(account));
    }

    function _verify(bytes32 leaf, bytes32[] memory proof) private view returns (bool) {
        return MerkleProof.verify(proof, _root, leaf);
    }

    /// @dev allows whitelisted users to claim their tokens during the premint phase
    function redeem(bytes32[] calldata proof) external {
        require(_premintPhase, 'not a premint phase');
        require(_verify(_leaf(msg.sender), proof), "invalid merkle proof");
        bytes32 hash = keccak256(abi.encodePacked(msg.sender));
        require(!_claimedWL[hash], "already claimed");
        _claimedWL[hash] = true;
        issueToken(msg.sender);
    }
}

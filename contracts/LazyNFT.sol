//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;


import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";


contract LazyNFT is ERC721URIStorage, EIP712 {


  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
  string private constant SIGNING_DOMAIN = "LazyNFT-Voucher";
  string private constant SIGNATURE_VERSION = "1";
 address public signer;

//signer is minter

  constructor(address payable _minter)
    ERC721("LazyNFT", "LAZ") 
    EIP712(SIGNING_DOMAIN, SIGNATURE_VERSION) {
    signer = _minter;
    
    }

    event Minted(address indexed to, uint256 tokenId);
  
 struct NFTVoucher {
  
    uint256 tokenId;
    uint256 price;
    string uri;
    bytes signature;
    }



  function redeem(NFTVoucher calldata voucher) public payable  {
    require(signer == _verify(voucher),"wrong signature" );// make sure that the signer is authorized to mint NFTs
    require(msg.value >= voucher.price, "Insufficient funds to redeem");

    
     _safeMint(msg.sender, voucher.tokenId);
     _setTokenURI(voucher.tokenId, voucher.uri);
    
     emit Minted(msg.sender, voucher.tokenId);

  }


function _verify(NFTVoucher calldata voucher) internal view returns(address s){
 bytes32 digest = _hashTypedDataV4(keccak256(abi.encode(
            //function selector
            keccak256("NFTVoucher(uint256 tokenId,uint256 price,string uri)"),
            voucher.tokenId,
            voucher.price,
            keccak256(bytes(voucher.uri))
     )));
     return s= ECDSA.recover(digest,  voucher.signature);
}
 
     function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721URIStorage) returns (bool){
        return ERC721.supportsInterface(interfaceId) || supportsInterface(interfaceId);
    }

   
}



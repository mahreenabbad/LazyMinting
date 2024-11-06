//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";

contract LazyNFT is ERC721URIStorage, EIP712, AccessControl {
//   using ECDSA for bytes32;

  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
  string private constant SIGNING_DOMAIN = "LazyNFT-Voucher";
  string private constant SIGNATURE_VERSION = "1";
 

//signer is minter
//medium ,dev,
  constructor(address payable minter)
    ERC721("LazyNFT", "LAZ") 
    EIP712("LazyNFT-Voucher", "1") {
      grantRole(MINTER_ROLE, minter);
    
    }

    event Minted(address indexed to, uint256 tokenId);
  
 struct NFTVoucher {
  
    uint256 tokenId;
    uint256 price;
    string uri;
    bytes signature;
    }



  function redeem(NFTVoucher calldata voucher) public payable  {
     address signer =  _verify(voucher); // make sure signature is valid and get the address of the signer
    require(hasRole(MINTER_ROLE, signer), "Signature invalid or unauthorized"); // make sure that the signer is authorized to mint NFTs
    require(msg.value >= voucher.price, "Insufficient funds to redeem");

    
     _safeMint(signer, voucher.tokenId);
     _setTokenURI(voucher.tokenId, voucher.uri);
    
     emit Minted(signer, voucher.tokenId);

  }




 
   function _hash(NFTVoucher calldata voucher) internal view returns(bytes32){
        return _hashTypedDataV4(keccak256(abi.encode(
            //function selector
            keccak256("NFTVoucher(uint256 tokenId,uint256 price,string uri)"),
            voucher.tokenId,
            voucher.price,
            keccak256(bytes(voucher.uri))
        )));
    }
     
      function _verify(NFTVoucher calldata voucher) internal view returns(address){
        bytes32 digest = _hash(voucher);
        //returns signer
        return ECDSA.recover(digest, voucher.signature);
    }

     function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721URIStorage,AccessControl) returns (bool){
        return ERC721.supportsInterface(interfaceId) || AccessControl.supportsInterface(interfaceId);
    }

   
}
//////////////////////////////////////////////////////////////////////////////////////////////

const {
    time,
    loadFixture,
  } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
  const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
  const { expect } = require("chai");
const {createVoucher} = require("../utils/lazy_index")


//     let LazyNFT, lazyNFT;
//     let deployer, minter, redeemer;
//     let contractAddress;
  
//     before(async function () {
//       // Get signers
//       [deployer, minter, redeemer] = await ethers.getSigners();
  
//       // Deploy LazyNFT contract
//       LazyNFT = await ethers.getContractFactory('LazyNFT');
//       lazyNFT = await LazyNFT.deploy(minter.address);
//       await lazyNFT.deployed();
//       contractAddress = lazyNFT.address;
//     });
  
//     it('Should create and redeem a voucher', async function () {
//       // Define voucher details
//       const tokenId = 1;
//       const uri = "https://example.com/metadata/1";
//       const minPrice = ethers.parseEther('0.1'); // Minimum price in wei
  
//       // Create a voucher off-chain using the minter's signer
//       const voucherData = await createVoucher(minter, contractAddress, tokenId, uri, minPrice);
  
//       // Redeem the voucher on-chain with the redeemer
//       await expect(
//         lazyNFT.connect(redeemer).redeem(redeemer.address, {
//           ...voucherData.voucher,
//           signature: voucherData.signature
//         }, { value: minPrice })
//       ).to.emit(lazyNFT, 'Transfer').withArgs(minter.address, redeemer.address, tokenId);
  
//       // Verify the redeemer owns the token
//       expect(await lazyNFT.ownerOf(tokenId)).to.equal(redeemer.address);
//     });
//   });
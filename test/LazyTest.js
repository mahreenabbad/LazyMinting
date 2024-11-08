const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");

const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");


    


    describe("LazyNFT", function(){
      async function runEveryTime(){
        [ minter, redeemer,add1] = await ethers.getSigners();
        
        
        const Lazy = await ethers.getContractFactory("LazyNFT",minter)
        const lazyMint = await Lazy.deploy(minter.address)
        // console.log("contractAddress :", contract.address)
        const domain = {
          name: "LazyNFT-Voucher",
          version:  "1",
          verifyingContract: lazyMint.address,
          chainId: network.config.chainId
          }   
          const types = {
            NFTVoucher:[
                {name: "tokenId", type:"uint256"},
                {name: "price", type:"uint256"},
                {name: "uri", type:"string"}
            ]
          }
  
       TOKENID_TO_MINT = 0
       const price = ethers.parseEther("0.0001")

      URI= "https://aquamarine-dear-whitefish-514.mypinata.cloud/ipfs/QmPyJBR2DgwnGEk8sQSfbwsGQgotNXBAMoHohQ9yZ2y9y4"

        const voucher = {
        tokenId: TOKENID_TO_MINT,
        price: price,
        uri: URI
        }
        const signature = await minter.signTypedData(domain, types, voucher);
      mintVoucher = [TOKENID_TO_MINT, price, URI, signature]
   
       
         return {lazyMint, minter, redeemer,mintVoucher,add1,URI,domain, types, voucher,price}
      }
      describe("LazyNFT contract TestCase",function(){

        it("Should allow to mint nft with valid voucher", async function() {
          const {lazyMint,mintVoucher} = await loadFixture(runEveryTime)

          await expect(lazyMint.redeem(mintVoucher ,{
              value: ethers.parseEther("0.01")
          })).to.be.reverted;
        });

        it("Should fail if price passed is less than NFT price", async function(){
          const {lazyMint,mintVoucher} = await loadFixture(runEveryTime)

           expect(lazyMint.redeem(mintVoucher,{  value:ethers.parseEther("0") })).to.be.revertedWith("Insufficient funds to redeem");
        });

        
    it("Should not allow to mint nft with invalid voucher", async function() {
      const {add1, lazyMint,URI,domain, types, voucher,price} = await loadFixture(runEveryTime)
      const signature = await add1.signTypedData(domain, types, voucher);
      
      mintVoucher = [TOKENID_TO_MINT, price, URI, signature]
      
       expect(lazyMint.redeem( mintVoucher, {
          value: price
      })).to.be.revertedWith("Signer not authorized to mint");
  });

  // it("Should fetch uri", async function(){
  //   const {lazyMint, URI,mintVoucher,TOKENID_TO_MINT} =await loadFixture(runEveryTime)
  //    await lazyMint.redeem(mintVoucher,{value:ethers.parseEther("0.001")})

  //   const uri = await lazyMint.tokenURI(TOKENID_TO_MINT)
  //   // console.log("Expected URI:", uri);
  //   // console.log("Returned URI:", await lazyMint.tokenURI(TOKENID_TO_MINT));
  //   expect(uri).to.be.equal(URI)
  // })

  it("Should fail to fetch uri for invalid tokenId",async function(){
    const {lazyMint } = await loadFixture(runEveryTime)

    expect(lazyMint.tokenURI(2)).to.be.revertedWith("Token not found");
  })


    
         })
      })

  
  //////////////////////////////////////////////////
   
 
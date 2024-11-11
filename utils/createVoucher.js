const { ethers, network ,artifacts} = require("hardhat");
require("dotenv").config()

//defines the structure of the data (token ID, price, and URI) 
//Defining the EIP-712 Types for Voucher
const MINTER_PRIVATE_KEY = process.env.MINTER_PRIVATE_KEY; 

const rpcUrl = "https://eth-sepolia.g.alchemy.com/v2/Auy-_mNgq1B1FrqTe9cFJnUCNiorWnZC";
const provider = new ethers.JsonRpcProvider(rpcUrl,undefined, {
    staticNetwork: true});
// console.log("Provider:", provider);

const lazyMinting =async()=>{


     uri= "https://aquamarine-dear-whitefish-514.mypinata.cloud/ipfs/QmPyJBR2DgwnGEk8sQSfbwsGQgotNXBAMoHohQ9yZ2y9y4"
    
   
    const signer = new ethers.Wallet(MINTER_PRIVATE_KEY,provider);
    
    //  console.log("Signer:", signer);
    

// console.log("Does signTypedData exist?", typeof signer.signTypedData === "function");
    const SIGNING_DOMAIN = "LazyNFT-Voucher";
    const SIGNING_VERSION = "1";
    
     
    const lazyNFTArtifact = await artifacts.readArtifact("LazyNFT");// Console the ABI
    const lazyNFTAbi = lazyNFTArtifact.abi; 
    // console.log("LazyNFT ABI:", JSON.stringify(lazyNFTAbi, null, 2));
   
    
 

     // instance of contract 
     const contractAddress ="0x4e601fF214fa9E6AC3f7C01e2b0562Bf25B9C8Bf"
    const lazyMint =  new ethers.Contract(contractAddress,lazyNFTAbi,signer)
    //retrieving a deployed instance of the LazyNFT smart contract
     const price = ethers.parseEther("0.0001")

     const types = {
      NFTVoucher:[
        {name: "tokenId", type:"uint256"},
        {name: "price", type:"uint256"},
        {name: "uri", type:"string"}
    ]
}
 
    //domain contains information to link the signature to the specific contract, network, and version.
    const domain = {
    name: SIGNING_DOMAIN,
    version: SIGNING_VERSION,
    verifyingContract: lazyMint.address,
    chainId: network.config.chainId
    } 

  
    const tokenId =0;

const voucher = {
    tokenId: tokenId,
    price: price,
    uri: uri
}


 
// EIP712 signature
const signature = await signer.signTypedData(domain, types, voucher);
//  console.log("Signature:", signature);


// Verify the EIP712 signature and recover the signer address from the signature and message
// let eip712Signer = ethers.verifyTypedData(domain, types, voucher, signature)
//  console.log("EIP712 Signer: ", eip712Signer);

// minting an NFT using a voucher in a (lazyminting) process
const mintVoucher = {tokenId, price, uri, signature};
// try {
    
    
    const receipt = await lazyMint.redeem( mintVoucher,{ //0.09 Ether along with the transaction to 
        //cover the price required to mint the NFT. It ensures that the redeemer pays enough to mint the NFT as required by the contract.
        value: ethers.parseEther("0.001") ,
        gasLimit: 100000,
      
    });
    
     console.log("receipt :", receipt);
     

// } catch (error) {
//     console.error("Transaction failed:",  error.message || error);
// }
}

lazyMinting().then(() => process.exit(0)).catch((err) => {
    console.log(err);
    process.exit(1);
})








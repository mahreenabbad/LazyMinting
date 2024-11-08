const { ethers, network } = require("hardhat");
// const {artifacts} = require("hardhat")


URI= "https://aquamarine-dear-whitefish-514.mypinata.cloud/ipfs/QmPyJBR2DgwnGEk8sQSfbwsGQgotNXBAMoHohQ9yZ2y9y4"

const TOKENID_TO_MINT =0;
//defines the structure of the data (token ID, price, and URI) 
//Defining the EIP-712 Types for Voucher
const types = {
    NFTVoucher:[
        {name: "tokenId", type:"uint256"},
        {name: "price", type:"uint256"},
        {name: "uri", type:"string"}
    ]
}
const MINTER_PRIVATE_KEY = "fc88db1c3738099ff0798fca7c2859116f540019015e4c51fc074ca96671bf14"; 
///

const lazyMinting =async()=>{

    const signer = new ethers.Wallet(MINTER_PRIVATE_KEY, ethers.provider);
    
     console.log("Signer:", signer);
    

// console.log("Does signTypedData exist?", typeof signer.signTypedData === "function");
    const SIGNING_DOMAIN = "LazyNFT-Voucher";
    const SIGNING_VERSION = "1";
    
     
    // const lazyNFTArtifact = await artifacts.readArtifact("LazyNFT");// Console the ABI
    // const lazyNFTAbi = lazyNFTArtifact.abi; 
    // console.log("LazyNFT ABI:", JSON.stringify(lazyNFTAbi, null, 2));
   
    // const lazyMintContract = await ethers.getContractFactory("LazyNFT");
    // const lazyMint = await lazyMintContract.deploy(signer); 
    // console.log("lazyMint :",lazyMint)
 
  const lazyMint = await ethers.getContractAt("LazyNFT", "0xD40e98cA5873087f36345A7156857Edc888AF81d");

    //retrieving a deployed instance of the LazyNFT smart contract
     const price = ethers.parseEther("0.0001")

     
     //domain contains information to link the signature to the specific contract, network, and version.
    const domain = {
    name: SIGNING_DOMAIN,
    version: SIGNING_VERSION,
    verifyingContract: lazyMint.address,
    chainId: network.config.chainId
    } 



const voucher = {
    tokenId: TOKENID_TO_MINT,
    price: price,
    uri: URI
}


 
// EIP712 signature
const signature = await signer.signTypedData(domain, types, voucher);
console.log("Signature:", signature);


// Verify the EIP712 signature and recover the signer address from the signature and message
let eip712Signer = ethers.verifyTypedData(domain, types, voucher, signature)
console.log("EIP712 Signer: ", eip712Signer);




// minting an NFT using a voucher in a (lazyminting) process
const mintVoucher = [TOKENID_TO_MINT, price, URI, signature];
try {
    
    const mintTxn = await lazyMint.redeem( mintVoucher,{ //0.09 Ether along with the transaction to 
        //cover the price required to mint the NFT. It ensures that the redeemer pays enough to mint the NFT as required by the contract.
        value: price ,
        gasLimit: 210000
    });
    const receipt = await mintTxn.wait(1);
    console.log("receipt :", receipt)
} catch (error) {
    console.error("Transaction failed:", error);
}

// const newMintEvent = receipt.events.find(e => e.event === "Minted");
// console.log(`Minted new NFT to address: ${newMintEvent.args['signer']} | TokenID: ${newMintEvent.args.tokenId.toString()}`)

}

lazyMinting().then(() => process.exit(0)).catch((err) => {
    console.log(err);
    process.exit(1);
})






///////////////////////////////////////////////////
// const buyer = new ethers.Wallet("f1cdd843a12b8e3ca694679c0da3e0ae8dd143c2e012cc693043b5fb0206a24c", ethers.provider);

// const lazyMintConnected = lazyMint.connect(buyer); // Connect contract instance to buyer's wallet

// const mintTxn = await lazyMintConnected.redeem(mintVoucher, {
    //     value: ethers.parseEther("0.09")
    // });



    //     const mintEvent = receipt.events?.find(event => event.event === "Minted");
    // if (mintEvent) {
    //   console.log(`Minted new NFT to address: ${mintEvent.args['signer']} | TokenID: ${mintEvent.args.tokenId.toString()}`);
    // } else {
    //   console.log("Minted event not found in receipt.");
    // }
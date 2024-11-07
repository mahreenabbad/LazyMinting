const { ethers, network } = require("hardhat");



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
    // const MINTER = signer.address;

    // const lazyMint = await ethers.getContract("LazyNFT");
    // const lazyMintContract = await ethers.getContractFactory("LazyNFT");
    // const lazyMint = await lazyMintContract.deploy(MINTER); 
    const lazyMint ="0xBB0bB5288ed7aCE530A33fE940A7c194Ba8ada0C"
    //retrieving a deployed instance of the LazyNFT smart contract
     const price = ethers.parseEther("0.001")

     
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



// const signedVoucher = await createVoucher(MINTER, domain, voucher)
 
// EIP712 signature
const signature = await signer.signTypedData(domain, types, voucher);
console.log("Signature:", signature);
// Signature: 0xaa351afc93f0c52626f104cb35926a98c91f4a2aaa49f9dd660fcd3972699d09376f63142215dbe78302e51e1b686d0146e7d2742c01d6bd386ba8439b5cf82a1b

// Verify the EIP712 signature and recover the signer address from the signature and message
let eip712Signer = ethers.verifyTypedData(domain, types, voucher, signature)
console.log("EIP712 Signer: ", eip712Signer)

// minting an NFT using a voucher in a (lazyminting) process
const mintVoucher = [TOKENID_TO_MINT, price, URI, signature];

const mintTxn = await lazyMint.redeem( mintVoucher,{ //0.09 Ether along with the transaction to 
                                                                    //cover the price required to mint the NFT. It ensures that the redeemer pays enough to mint the NFT as required by the contract.
    value: ethers.parseEther("0.09") 
});
const receipt = await mintTxn.wait(1);
console.log(receipt)
// const newMintEvent = receipt.events.find(e => e.event === "Minted");
// console.log(`Minted new NFT to address: ${newMintEvent.args['signer']} | TokenID: ${newMintEvent.args.tokenId.toString()}`)

}

lazyMinting().then(() => process.exit(0)).catch((err) => {
    console.log(err);
    process.exit(1);
})
const { ethers } = require("hardhat");
// const { TypedDataUtils } = require('ethers-eip712')


URI= "https://aquamarine-dear-whitefish-514.mypinata.cloud/ipfs/QmPyJBR2DgwnGEk8sQSfbwsGQgotNXBAMoHohQ9yZ2y9y4"

const TOKENID_TO_MINT =0;
//defines the structure of the data (token ID, price, and URI) 
//that will be signed according to the EIP-712 standard for typed data signatures.
const types = {
    NFTVoucher:[
        {name: "tokenId", type:"uint256"},
        {name: "price", type:"uint256"},
        {name: "uri", type:"string"}
    ]
}
const MINTER_PRIVATE_KEY = "e8762f3ab439ec175dc523df551b5fc6960ff552302ed7ec6252a5dd67cb4928"; 
//signs the voucher data in compliance with EIP-712.

 async function createVoucher (signer, domain, voucher) {
    const signature = await signer._signTypedData(domain, types, voucher);
    return signature
}

////////////////////////////////////////////

const lazyMinting =async()=>{

    const signer = new ethers.Wallet(MINTER_PRIVATE_KEY, ethers.provider);
    // const [signer] = await ethers.getSigners();
     console.log("Signer:", signer);
    

// console.log("Does signTypedData exist?", typeof signer.signTypedData === "function");
    const SIGNING_DOMAIN = "LazyNFT-Voucher";
    const SIGNING_VERSION = "1";
    const MINTER = signer.address;

    // const lazyMint = await ethers.getContract("LazyNFT");
    const lazyMintContract = await ethers.getContractFactory("LazyNFT");
    const lazyMint = await lazyMintContract.deploy(MINTER); 
    //retrieving a deployed instance of the LazyNFT smart contract
    const price = ethers.parseEther("0.1")

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



const signedVoucher = await createVoucher(MINTER, domain, voucher)

// minting an NFT using a voucher in a (lazyminting) process
const mintVoucher = [TOKENID_TO_MINT, price, URI, signedVoucher];

const mintTxn = await lazyMint.redeem( mintVoucher,{ //0.2 Ether along with the transaction to 
                                                                    //cover the price required to mint the NFT. It ensures that the redeemer pays enough to mint the NFT as required by the contract.
    value: ethers.utils.parseEther("0.15") 
});
const receipt = await mintTxn.wait(1);
console/log(receipt)
// const newMintEvent = receipt.events.find(e => e.event === "Minted");
// console.log(`Minted new NFT to address: ${newMintEvent.args['signer']} | TokenID: ${newMintEvent.args.tokenId.toString()}`)

}

lazyMinting().then(() => process.exit(0)).catch((err) => {
    console.log(err);
    process.exit(1);
})
const { network, artifacts } = require("hardhat");
const { ethers } = require("ethers");
const fs = require("fs");
require("dotenv").config();

//defines the structure of the data (token ID, price, and URI)
//Defining the EIP-712 Types for Voucher
const MINTER_PRIVATE_KEY = process.env.MINTER_PRIVATE_KEY;

const rpcUrl =
  "https://eth-sepolia.g.alchemy.com/v2/Auy-_mNgq1B1FrqTe9cFJnUCNiorWnZC";
const provider = new ethers.JsonRpcProvider(rpcUrl, undefined, {
  staticNetwork: true,
});

// let x = 7;

const lazyMinting = async () => {
  const tokenData = JSON.parse(fs.readFileSync("utils/tokenId.json", "utf8"));
  let tokenId = tokenData.tokenId;

  uri =
    "https://aquamarine-dear-whitefish-514.mypinata.cloud/ipfs/QmPyJBR2DgwnGEk8sQSfbwsGQgotNXBAMoHohQ9yZ2y9y4";

  const signer = new ethers.Wallet(MINTER_PRIVATE_KEY, provider);
  //  console.log("Signer:", signer);

  const SIGNING_DOMAIN = "LazyNFT-Voucher";
  const SIGNING_VERSION = "1";

  const lazyNFTArtifact = await artifacts.readArtifact("LazyNFT"); // Console the ABI
  const lazyNFTAbi = lazyNFTArtifact.abi;
  // console.log("LazyNFT ABI:", JSON.stringify(lazyNFTAbi, null, 2));

  // instance of contract
  const contractAddress = "0xc45C3662d3e6d5D13b940c778E9344325042598D";
  const lazyMint = new ethers.Contract(contractAddress, lazyNFTAbi, signer);
  //retrieving a deployed instance of the LazyNFT smart contract
  const price = ethers.parseEther("0.00001");

  const types = {
    NFTVoucher: [
      { name: "tokenId", type: "uint256" },
      { name: "price", type: "uint256" },
      { name: "uri", type: "string" },
    ],
  };

  //domain contains  information to link the signature to the specific contract, network, and version.
  const domain = {
    name: SIGNING_DOMAIN,
    version: SIGNING_VERSION,
    verifyingContract: lazyMint.target,
    chainId: network.config.chainId,
  };

  //   console.log("Domain", domain);

  const voucher = {
    tokenId: tokenId,
    price: price,
    uri: uri,
  };

  // EIP712 signature

  const signature = await signer.signTypedData(domain, types, voucher);
  //   console.log("Signature:", signature);

  //Verify the EIP712 signature and recover the signer address from the signature and message
  let eip712Signer = ethers.verifyTypedData(domain, types, voucher, signature);
  console.log("EIP712 Signer: ", eip712Signer);

  // minting an NFT using a voucher in a (lazyminting) process
  const mintVoucher = [tokenId, price, uri, signature];
  //   console.log("mintVoucher", mintVoucher);
  try {
    const receipt = await lazyMint.redeem(mintVoucher, {
      //cover the price required to mint the NFT. msg.value.
      value: price,
    });

    console.log("receipt :", receipt);
    tokenData.tokenId += 1;
    fs.writeFileSync("utils/tokenId.json", JSON.stringify(tokenData, null, 2));
  } catch (error) {
    console.error("Transaction failed:", error.message || error);
  }
};

lazyMinting()
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });

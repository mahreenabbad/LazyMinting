const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    const LazyNFT = await ethers.getContractFactory("LazyNFT");

    // Deploying the contract with deployer as the minter
    const lazyNFT = await LazyNFT.deploy(deployer.address);
    await lazyNFT.deployed();

    console.log("LazyNFT deployed to:", lazyNFT.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

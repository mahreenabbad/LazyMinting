# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node


```
//COMPILE
npx hardhat compile

//DEPLOY
 npx hardhat ignition deploy ./ignition/modules/LazyNFT.js --network sepolia  

 //CREATE VOUCHER
  npx hardhat run ./utils/createVoucher.js --network sepolia



const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const minter = "0x117230682974d73f2DB5C21F0268De2fACB0119f"


module.exports = buildModule("LazyNFTModule", (m) => {
    


  const lazyNft = m.contract("LazyNFT", [minter]);

  return { lazyNft };
});




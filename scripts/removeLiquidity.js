const hre = require("hardhat");
require('dotenv').config();
const UniswapV2RouterABI = require('../ABI/uniswapRouterABI.json');
const LPPairABI = require('../ABI/LPPairABI.json');

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    const LPTokenAddress = "0x041604E8b3DeB28EE8Ae44972E5bBD843a0A9Bf7"
    const tokenAddress = "0x5058D91f30A3AFa27aDf58B6Af497dFd6042b8E5";

    // Initialize contracts
    const LPPair = new hre.ethers.Contract(LPTokenAddress, LPPairABI, deployer);
    const uniswapV2RouterAddress = "0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008";
    const uniswapV2Router = new hre.ethers.Contract(uniswapV2RouterAddress, UniswapV2RouterABI, deployer);

    // Get deployer's token balance to calculate the liquidity amount
    const deployerBalance = await LPPair.balanceOf(deployer.address);

    // Approve Uniswap router to spend tokens from deployers account
    await LPPair.connect(deployer).approve(uniswapV2RouterAddress, deployerBalance);
    
    const tx = await uniswapV2Router.removeLiquidityETH(
        tokenAddress,
        deployerBalance,
        0,
        0,
        deployer.address,
        Math.floor(Date.now() / 1000) + 60 * 10, // 10 minute deadline in seconds
      );
      const receipt = await tx.wait();
      console.log("Liquidity removed", receipt);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

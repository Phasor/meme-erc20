const hre = require("hardhat");
const { ethers } = hre;
require('dotenv').config();
const UniswapV2RouterABI = require('../ABI/uniswapRouterABI.json');
const TokenABI = require('../ABI/TokenABI.json');

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    const tokenAddress = "0x5058D91f30A3AFa27aDf58B6Af497dFd6042b8E5";

    // Initialize contracts
    const meme = new hre.ethers.Contract(tokenAddress, TokenABI, deployer);
    const uniswapV2RouterAddress = "0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008";
    const uniswapV2Router = new hre.ethers.Contract(uniswapV2RouterAddress, UniswapV2RouterABI, deployer);

    // Get deployer's token balance to calculate the liquidity amount
    const deployerBalance = await meme.balanceOf(deployer.address);
    const tokenAmount = (deployerBalance * BigInt(95)) / BigInt(100);

    // Approve Uniswap router to spend tokens from deployers account
    await meme.connect(deployer).approve(uniswapV2RouterAddress, tokenAmount);
    
    // Specify ETH amount for liquidity
    const ethAmount = 5000000000000000 //0.005 eth

    // Add liquidity to Uniswap pool
    const tx = await uniswapV2Router.addLiquidityETH(
        tokenAddress, 
        tokenAmount, // amountTokenDesired
        0, // amountTokenMin
        0, // amountETHMin
        deployer.address, // where LP tokens are sent
        Math.floor(Date.now() / 1000) + 60 * 10, // 10 minute deadline in seconds
        { value: ethAmount }
    );
    const receipt = await tx.wait();
    console.log(receipt);

    // get the pool address
    const WETHAddress = "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9" //sepolia
    const poolAddress = await uniswapV2Router.getPair(tokenAddress, WETHAddress);
    console.log("Pool Address:", poolAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

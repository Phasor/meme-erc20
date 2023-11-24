// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
// import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// interface IUniswapV2Router02 {
//     function addLiquidityETH(
//         address token,
//         uint amountTokenDesired,
//         uint amountTokenMin,
//         uint amountETHMin,
//         address to,
//         uint deadline
//     ) external payable returns (uint amountToken, uint amountETH, uint liquidity);
// } 

contract Meme is ERC20, Ownable {
    constructor(address initialOwner, uint256 initialSupply)
        ERC20("Meme", "MEME")
        Ownable(initialOwner)
    {
        mint(initialOwner,initialSupply);
    }

    // address private constant ROUTER = 0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008; // For Sepolia only - https://ethereum.stackexchange.com/questions/150654/uniswap-v2-router-factory-on-sepolia-test-network

    // event Log(string message, uint256 val);

    // function addLiquidity() external onlyOwner() {
    //     // create router instance
    //     IUniswapV2Router02 uniswapV2Router = IUniswapV2Router02(ROUTER); 

    //     // approve router in token
    //     IERC20(address(this)).approve(ROUTER,balanceOf(address(this)));

    //     // get token balance of this contract 
    //     uint256 balanceOfAddress = IERC20(address(this)).balanceOf(address(this));

    //     // calulate 95% of the contracts token balance
    //     uint amountTokenDesired = ( balanceOfAddress* 95) / 100;  // 95% of the contract's token balance

    //     // send this to the new pool
    //     uniswapV2Router.addLiquidityETH{value: 0.005 ether}(address(this),amountTokenDesired,0,0,owner(),block.timestamp + 120);
    // }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

     // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Function to withdraw Ether from this contract
    function withdrawEther() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
    
}
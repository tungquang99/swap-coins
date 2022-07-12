import {  abiBalanceVic, abiBalanceVicGem, abiPool, contractAddress, pancakeABI } from "../../constants/constants";
import { toast } from "../../shared/toast/toast";
import { contract, web3 } from "../contract";
import Web3 from 'web3';


export const getBalnceFrom = async (address, account) => {
    const contracts = await contract(address)
    const response = await contracts.methods.balanceOf(account).call()
    return response;
}

export const getBalnceTo = async (address, account) => {
    const contracts = await contract(address)
    const response = await contracts.methods.balanceOf(account).call()
    return response;
}

export const checkSellPrice = async() => {
    const contracts = await contract(contractAddress.checkBuySell, abiPool)
    const response = await contracts.methods.checkSellPrice(1).call()
    return response;
}

export const swapCoin = async (account, amountFrom, amountTo, routeAddress) => {
    const contracts = await contract(contractAddress.spender);
    // const isApprovedForAll = await approvalForAll(contracts, account);
    const amountIn = web3.utils.toWei(amountFrom.toString(), 'ether');
    const amountOut = web3.utils.toWei(amountTo.toString(), 'ether');
    const addressArray = routeAddress;
    const timestamp = Date.now();
    
    const tx = {
        from: account,
        to: contractAddress.spender,
        data: contracts.methods.swapExactTokensForTokensSupportingFeeOnTransferTokens(
            amountIn, 0, addressArray, account, timestamp
        ).encodeABI()
    };
    const gasEst = await web3.eth.estimateGas(tx);
    const response = await contracts.methods.swapExactTokensForTokensSupportingFeeOnTransferTokens(
        amountIn, amountOut, addressArray, account, timestamp
    ).send({
        from: account,
        gasPrice: 5000000000,
        gasLimit: gasEst,
        value:'0',
    }).then(data => console.log(data)).catch(err => {
        console.log(err.message);
        toast('error', err.message)
    })
  
    return response;
}

 const approvalForAll = async ( contracts, account) => {
    return await contracts.methods.setApprovalForAll(contractAddress.spender, true).send({from: account})
       .then(data => data)
       .catch(err => toast('error', err.message));
 }
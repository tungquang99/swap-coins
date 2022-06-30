import {  abiBalanceVic, abiBalanceVicGem, abiPool, contractAddress } from "../../constants/constants";
import { contract } from "../contract";



export const getBalanceVic = async (address) => {
    const contracts = await contract(contractAddress.balanceVic, abiBalanceVic)
    const response = await contracts.methods.balanceOf(address).call()
    return response;
}

export const getBalanceVicGem = async (address) => {
    const contracts = await contract(contractAddress.balanceVicGem, abiBalanceVicGem)
    const response = await contracts.methods.balanceOf(address).call()
    return response;
}

export const checkSellPrice = async() => {
    const contracts = await contract(contractAddress.checkBuySell, abiPool)
    const response = await contracts.methods.checkSellPrice(1).call()
    return response;
}
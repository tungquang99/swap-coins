import {  abiBalanceVic, abiBalanceVicGem, abiPool, contractAddress } from "../../constants/constants";
import { contract } from "../contract";



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
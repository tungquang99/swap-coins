
import Web3 from 'web3';
import { abiApprove, contractAddress, abiContract } from '../constants/constants';
import { walletConnect } from './connectors';
const provider = walletConnect.walletConnectProvider
console.log(provider);
export const web3 =  new Web3('https://bsc-dataseed.binance.org/');


export const contract = async (address = contractAddress.approve_Vim, abi = abiContract) => { 
    const web3 =  new Web3('https://bsc-dataseed.binance.org/');
    if (localStorage.getItem('wallet') === 'mtm') {
        web3.eth.setProvider(Web3.givenProvider);
    } 
    return new web3.eth.Contract(abi, address);
}
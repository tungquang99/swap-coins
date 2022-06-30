
import Web3 from 'web3';
import { abiApprove, contractAddress } from '../constants/constants';
import { walletConnect } from './connectors';
export const web3 =  new Web3(localStorage.getItem('wallet') === 'wc' ? walletConnect.walletConnectProvider : 'https://bsc-dataseed.binance.org/');


export const contract = async (address = contractAddress.approve_Vim, abi = abiApprove) => { 
    const web3 =  new Web3(localStorage.getItem('wallet') === 'wc' ? walletConnect.walletConnectProvider : 'https://bsc-dataseed.binance.org/');
    if (localStorage.getItem('wallet') === 'mtm') {
        web3.eth.setProvider(Web3.givenProvider);
    }
    return new web3.eth.Contract(abi, address);
}

import { toast } from '../../shared/toast/toast';
import { contractAddress } from '../../constants/constants';
import { approvalForAll } from './approveVim';
import { contract } from '../contract';




export const checkApproveVim = async (address, account) => {
    const contractApproveVim = await contract(address);
    console.log(contractApproveVim);
    console.log(await contractApproveVim.methods.allowance(account, contractAddress.spender).call());
    return await contractApproveVim.methods.allowance(account, contractAddress.spender).call();  
}
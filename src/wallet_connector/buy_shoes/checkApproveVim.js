
import { toast } from '../../shared/toast/toast';
import { contractAddress } from '../../constants/constants';
import { approvalForAll } from './approveVim';
import { contract } from '../contract';




export const checkApproveVim = async (address, account) => {
    const contractApproveVim = await contract(address);
    return await contractApproveVim.methods.allowance(account, contractAddress.spender).call();  
}

import { toast } from '../../shared/toast/toast';
import { contractAddress } from '../../constants/constants';
import { approvalForAll } from './approveVim';
import { contract } from '../contract';




export const checkApproveVim = async (account, library) => {
    const contractApproveVim = await contract();
    const response = await contractApproveVim.methods.allowance(account, contractAddress.approve_Vim).call();
    if (Number(response) <= 0 ) {
        toast('error', 'Your wallet has not approved Vim', 1.5)
        toast('loading', "Please wait a moment, approval is coming to your wallet.", 3)
        return await approvalForAll(account, library);
    } else {
        return true;
    }
}
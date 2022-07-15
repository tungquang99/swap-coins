import { abiApproveVICGEMNFT, contractAddress } from "../../constants/constants";
import { contract, web3 } from "../contract";
import { toast } from '../../shared/toast/toast';




export const approvalForAll = async ( account, library) => {
   const contractNFT = await contract(contractAddress.approveNFT, abiApproveVICGEMNFT)
   const isApproval = await contractNFT.methods.setApprovalForAll(contractAddress.approveNFT, true).send({from: account})
      .then(data => data)
      .catch(err => toast('error', err.message));
   if (isApproval) {
      return await approveVim(contractNFT, account);
   }
}

export async function approveVim(address, account, currency ) {
   currency = currency == 0 ?  1 : currency;
   const contractApproveVim = await contract(address);
   const amount = web3.utils.toWei(String(Number(currency) + (currency*20/100)), 'ether');
   return await contractApproveVim.methods.approve(contractAddress.spender, amount).send({from: account}).then(data => data)
   .catch(err => toast('error', err.message));
}
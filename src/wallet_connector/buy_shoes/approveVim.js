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

async function approveVim(contractNFT, account) {
   const buy = '1200';
   const amount = web3.utils.toWei(buy, 'ether');
   return await contractNFT.methods.approve(contractAddress.approveNFT, amount).send({from: account});
}
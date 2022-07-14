import { JSBI, Percent, Router, TradeType } from "@pancakeswap/sdk"
import { useWeb3React } from "@web3-react/core"
import { Contract } from "ethers"
import { useMemo } from "react"
import { BIPS_BASE, contractAddress } from "../constants/constants"
import { contract } from "../wallet_connector/contract"
const IPanckeRouter02 =  require('../abi/IPancakeRouter02.json')

export async function SwapCallArguments(trade, allowedSlippage, account, library, recipientAddress = null) {
    const recipient = recipientAddress === null ? account : recipientAddress
    function getSigner(library, account) {
        return library.getSigner(account).connectUnchecked()
    }

    function getProviderOrSigner(library, account) {
        return account ? getSigner(library, account) : library
    }
    function getContract(address, ABI, signer) {
        return new Contract(address, ABI, signer ?? 'https://bsc-dataseed.binance.org/')
    }
    const contracts = getContract( contractAddress.spender,IPanckeRouter02, getProviderOrSigner(library, account))
   
    const deadline = Date.now();
    const swapMethods = []
    swapMethods.push(
      Router.swapCallParameters(trade, {
        feeOnTransfer: false,
        allowedSlippage: new Percent(JSBI.BigInt(allowedSlippage), BIPS_BASE),
        recipient,
        deadline: deadline,
      }),
    )

    if (trade.tradeType === TradeType.EXACT_INPUT) {
      swapMethods.push(
        Router.swapCallParameters(trade, {
          feeOnTransfer: true,
          allowedSlippage: new Percent(JSBI.BigInt(allowedSlippage), BIPS_BASE),
          recipient,
          deadline: deadline,
        }),
      )
    }

    return swapMethods.map((parameters) => ({ parameters, contracts }))
  }
  
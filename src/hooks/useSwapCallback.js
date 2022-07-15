import { useWeb3React } from "@web3-react/core";
import { notification } from "antd";
import { BigNumber } from "ethers";
import JSBI from "jsbi";
import { useMemo } from "react";
import { contractAddress, SwapCallbackState } from "../constants/constants";
import { toast } from "../shared/toast/toast";
import { contract, web3 } from "../wallet_connector/contract";
import isZero from "./isZero";
import { SwapCallArguments } from "./useSwapCallbackArgument";
export async function SwapCallback(trade, allowedSlippage, account, chainId, library, recipientAddress = null) {
    const contractsABI = await contract(contractAddress.spender);
    const timestamp = Date.now()
    const swapCalls = await SwapCallArguments(trade, allowedSlippage, account, library, recipientAddress);
    const recipient = recipientAddress === null ? account : recipientAddress
    const gasPrice = 5000000000;
    const btn = (param => <a href={`https://bscscan.com/tx/${param}`} target="_blank">
            View Transaction
      </a>
      );
    if (!trade || !library || !account || !chainId) {
        return { state: SwapCallbackState.INVALID, callback: null, error: 'Missing dependencies' }
    }
    if (!recipient) {
        if (recipientAddress !== null) {
          return { state: SwapCallbackState.INVALID, callback: null, error: 'Invalid recipient' }
        }
        return { state: SwapCallbackState.LOADING, callback: null, error: null }
    }

    const estimatedCalls = await Promise.all(
        swapCalls.map(async (call) => {
            const {
                parameters: { methodName, args, value },
                contracts,
            } = call
            const options = !value || isZero(value) ? {} : { value }
            // let gasEst;
            // try {
            //     const tx = {
            //         from: account,
            //         to: contractAddress.spender,
            //         data: contractsABI.methods[methodName](...args, options).encodeABI()
            //     };
            //     console.log(await web3.eth.estimateGas(tx));
            //     gasEst = await web3.eth.estimateGas(tx);
            // } catch (error) {
            //     gasEst = null;
            // }
            return contracts.estimateGas[methodName](...args, options)
                .then((gasEstimate) => {
                return {
                    call,
                    gasEstimate,
                }
                })
                .catch((gasError) => {
                    console.error('Gas estimate failed, trying eth_call to extract error', call)
                })
        })
    )
    console.log(estimatedCalls);
    //a successful estimation is a bignumber gas estimate and the next call is also a bignumber gas estimate
    const successfulEstimation = estimatedCalls.find((el, ix, list) => {
        if (list.includes(undefined)) {
            if (el !== undefined) {
                return 'gasEstimate' in el
            } 
        } else if (el !== undefined) {
            return 'gasEstimate' in el && (ix === list.length - 1 || (list[ix + 1] !== undefined && 'gasEstimate' in list[ix + 1]))
        } else {
            toast('error', 'Unexpected error. Could not estimate gas for the swap.')
        }
    })

    if (!successfulEstimation) {
        toast('error', 'Unexpected error. Could not estimate gas for the swap.')
        return false;
    } else {
        const {
            call: {
              contracts,
              parameters: { methodName, args, value },
            },
            gasEstimate,
        } = successfulEstimation
        return contracts[methodName](...args, {
            gasLimit: gasEstimate,
            gasPrice,
            ...(value && !isZero(value) ? { value, from: account } : { from: account }),
        }).then(res => notification.open({
                        message: 'Visit the Binance Smart Chain page to view transaction details',
                        description: '',
                        btn: btn(res.hash), 
                        placement: 'top'
                    })
          )
        .catch(err => {
            if (err?.code === 4001) {
                toast('error', 'Transaction rejected.');
              } else {
                // otherwise, the error was unexpected and we need to convey that
                toast('error', [`Swap failed`, err, methodName, args, value]);
              }
            })
    }
}
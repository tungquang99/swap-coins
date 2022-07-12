
import { useWeb3React } from '@web3-react/core';
import { useEffect } from 'react';
import { injected, walletConnect } from '../wallet_connector/connectors';
export const useEagerConnect = () => {
    const {active, deactivate, library, error, chainId, account, activate} = useWeb3React();
    useEffect(() => {
        if (localStorage.getItem('wallet') === 'mtm') {
            injected.isAuthorized().then(isAuthorized => {
               if (isAuthorized) {
                   activate(injected, undefined, true)
               }
            });
        } else if (localStorage.getItem('wallet') === 'wc') {
            activate(walletConnect)
           
        }
    }, [activate])
    return {active, deactivate, library, error, chainId, account, activate};
}
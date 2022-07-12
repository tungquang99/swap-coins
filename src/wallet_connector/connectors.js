import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { toast } from '../shared/toast/toast';

const RPC_URLS = {
	1: 'https://mainnet.infura.io/v3/55d040fb60064deaa7acc8e320d99bd4',
	4: 'https://rinkeby.infura.io/v3/55d040fb60064deaa7acc8e320d99bd4'
};

//metamask
export const injected = new InjectedConnector({
    supportedChainIds: [1, 3, 4, 5, 42, 56, 137]
})

export const walletConnect = new WalletConnectConnector({
    rpc: {
        56: "https://bsc-dataseed.binance.org/",
    },
    qrcode: true,
    pollingInterval: 5000
});

export function resetWalletConnector(connector) {
    if (connector && connector instanceof WalletConnectConnector) {
        connector.walletConnectProvider = undefined;
    }
} 

export const checkConnect = (isActive) => {
    if (!isActive) {
        toast('warning', 'Please connect your wallet to continue');
        return true;
    }
}

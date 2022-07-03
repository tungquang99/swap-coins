import { Button, Modal } from "antd";
import { useContext } from "react";
import { layoutContext } from "./../../layout/Layout";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { getWallet } from "./../../hooks/wallet";
import { injected, walletConnect } from "../../wallet_connector/connectors";
import { ethers } from "ethers";
export function SelectWalletModal({ isOpen, closeModal }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { active, account, activate } = useContext(layoutContext);
   const connectMetamaskSimple = async (activate, location, navigate, active) => {
      try {
            await activate(injected);
            setWalletActive('mtm', location, navigate)
      } catch (error) {
            console.log(error);
          }
      }

    const connectWalletConnectSimple = async (activate, location, navigate, active) => {
        try {
            await activate(walletConnect);
            if (await walletConnect.getAccount()) {
                setWalletActive('wc', location, navigate)
            }
        } catch (error) {
          console.log(error);
        }
    }

    function setWalletActive(val, location, navigate) {
        localStorage.setItem('wallet', val);
        navigate(location.pathname);
    }

    // const signMessage = async () => {
    //   try {
    //       if (window.ethereum) {
    //           await window.ethereum.send("eth_requestAccounts");
    //           const provider = new ethers.providers.Web3Provider(walletConnect.walletConnectProvider ? walletConnect.walletConnectProvider : window.ethereum);
    //           const signer = provider.getSigner();
    //           const signature = await signer.signMessage('Connect wallet');
    //       }
    //   } catch (error) {
    //       console.log(error);
    //   }
    // } 
  return (
    <Modal title="Select Wallet" visible={isOpen} onCancel={closeModal}>
      {!getWallet() && (
        <div>
          <Button
            onClick={() => {
              connectWalletConnectSimple(activate, location, navigate, active);
            }}
          >
            Wallet Connect
          </Button>
          <Button
            onClick={() => {
              connectMetamaskSimple(activate, location, navigate, active);
            }}
          >
            Metamask
          </Button>
          <Button
            onClick={() => {
              connectMetamaskSimple(activate, location, navigate, active);
            }}
          >
            CoinsbaseWallet
          </Button>
        </div>
      )}
      {getWallet() && 
        <div>
            <div>Wallet connected: {account}</div>
            {/* <div onClick={signMessage}>Click here to add this address to account</div> */}
        </div>}
    </Modal>
  );
}

import React, { useContext } from 'react';
import { layoutContext } from '../../layout/Layout';
import { getWallet } from '../../hooks/wallet';
import {  useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

function ConnectWallet() {
  const {deactivate, setIsModalVisible} = useContext(layoutContext);
  
  const navigate = useNavigate();
  const location = useLocation();
    const showModal = () => {
      setIsModalVisible(true);
    };

    const disconnectWallet = async () => {
       await deactivate();
      localStorage.removeItem('wallet');
      navigate(location.pathname);
    }
    return (
        <div className='connector'>
            {
              (getWallet()) &&  <div className='swap-vic__btn swap-vic__btn-action' onClick={disconnectWallet}>Disconnect Wallet</div>
            }
        </div>
    );
}

export default ConnectWallet;
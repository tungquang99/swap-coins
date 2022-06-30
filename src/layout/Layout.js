import React, { createContext, useState} from 'react';
import Navigation from '../components/Navigation/Navigation';
import './Layout.scss';
import Routers from '../routes/routes';
import { useAuthGoogle } from '../hooks/useAuthGoogle';
import { useETH, useMATIC } from '../hooks/useCoins';
import { useEagerConnect } from './../hooks/useEagerConnect';
import { SelectWalletModal } from '../components/Modal/SelectWalletModal';
import SelectToken from '../components/Modal/SelectToken';

export const layoutContext = createContext();
function Layout() {
    useAuthGoogle();
    const {active, deactivate, library, error, chainId, account, activate} = useEagerConnect();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalSelectToken, setModalSelectToken] = useState(false);
    const {coinsETH} = useETH();
    const {coinsMATIC} = useMATIC();
    const value = {
        coinsETH : coinsETH,
        coinsMATIC: coinsMATIC,
        active: active,
        library: library,
        error: error,
        chainId: chainId,
        account: account,
        deactivate: deactivate,
        activate: activate,
        setIsModalVisible: setIsModalVisible,
        setModalSelectToken: setModalSelectToken
    }

    const handleCancel = () => {
        setIsModalVisible(false);
        setModalSelectToken(false);
    };

    return (
        <layoutContext.Provider value={value}>
            <div className='container'>
                <Routers /> 
            </div>
            <SelectWalletModal isOpen={isModalVisible} closeModal={handleCancel} />
            <SelectToken isOpen={isModalSelectToken} closeModal={handleCancel} />
        </layoutContext.Provider>
    );
}

export default Layout;
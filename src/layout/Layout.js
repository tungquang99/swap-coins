import React, { createContext, useEffect, useState} from 'react';
import Navigation from '../components/Navigation/Navigation';
import './Layout.scss';
import Routers from '../routes/routes';
import { useAuthGoogle } from '../hooks/useAuthGoogle';
import { useETH, useMATIC } from '../hooks/useCoins';
import { useEagerConnect } from './../hooks/useEagerConnect';
import { SelectWalletModal } from '../components/Modal/SelectWalletModal';
import SelectToken from '../components/Modal/SelectToken';
import SelectTokenTo from '../components/Modal/SelectTokenTo';

export const layoutContext = createContext();
function Layout() {
    useAuthGoogle();
    const {active, deactivate, library, error, chainId, account, activate} = useEagerConnect();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalSelectToken, setModalSelectToken] = useState(false);
    const [isModalSelectTokenTo, setModalSelectTokenTo] = useState(false);
    const [addressContract, setAddressContract] = useState('')
    const [coin, setCoin] = useState(null)
    const [addressContract2, setAddressContract2] = useState('')
    const [coin2, setCoin2] = useState(null)
    const [exchanges, setExchange] = useState(null)
    const [exchangesTo, setExchangeTo] = useState(null)
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
        setModalSelectToken: setModalSelectToken,
        setModalSelectTokenTo: setModalSelectTokenTo,
        addressContract: addressContract,
        setAddressContract: setAddressContract,
        setCoin: setCoin,
        coin: coin,
        addressContract2: addressContract2,
        setAddressContract2: setAddressContract2,
        setCoin2: setCoin2,
        coin2: coin2,
        exchanges,
        setExchange,
        exchangesTo,
        setExchangeTo
    }

    const handleCancel = () => {
        setIsModalVisible(false);
        setModalSelectToken(false);
        setModalSelectTokenTo(false);
    };

    return (
        <layoutContext.Provider value={value}>
            <div className='container'>
                <Routers /> 
            </div>
            <SelectWalletModal isOpen={isModalVisible} closeModal={handleCancel} />
            <SelectToken isOpen={isModalSelectToken} closeModal={handleCancel}/>
            <SelectTokenTo isOpen={isModalSelectTokenTo} closeModal={handleCancel}/>
        </layoutContext.Provider>
    );
}

export default Layout;
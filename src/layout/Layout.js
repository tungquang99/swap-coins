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
    const [coin, setCoin] = useState(null)
    const [coin2, setCoin2] = useState(null)
    const [coins, setCoins] = useState([])
    const [idCoin, setIdCoin] = useState([])
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
        coins: coins, setCoins: setCoins,
        idCoin: idCoin, setIdCoin: setIdCoin,
        setCoin: setCoin,
        coin: coin,
        setCoin2: setCoin2,
        coin2: coin2,
    }

    const handleCancel = () => {
        setIsModalVisible(false);
        setModalSelectToken(false);
        setModalSelectTokenTo(false);
    };

    useEffect(() => {
        getAllCoins();
        getIdCoin();
        async function getAllCoins() {
            fetch(`https://tokens.pancakeswap.finance/coingecko.json`).then(response => response.json())
            .then(data => {
                setCoins(data.tokens)
            }).catch(err => err);
        }
        async function getIdCoin() {
            fetch(`https://s3.coinmarketcap.com/generated/core/crypto/cryptos.json`).then(response => response.json())
            .then(data => {
                setIdCoin(data.values)
            }).catch(err => err);
        }
    }, [])
    

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
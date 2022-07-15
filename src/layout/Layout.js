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
import { Token } from '@pancakeswap/sdk';
import { getPair } from '../hooks/getPair';
import { ethers } from 'ethers';
import { tokenDefault } from '../constants/constants';

export const layoutContext = createContext();

function Layout() {
    const VICG = {
        "name": "VICGEM",
        "symbol": "VICG",
        "address": "0xEA81FA66ee53Ecb4C06Cd292a300A529A6be1180",
        "chainId": 56,
        "decimals": 18,
        "logoURI": "https://assets.coingecko.com/coins/images/25963/thumb/vic.png?1654939840"
      }
    useAuthGoogle();
    useEffect(() => {
       
    }, [])
    
    const {active, deactivate, library, error, chainId, account, activate} = useEagerConnect();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalSelectToken, setModalSelectToken] = useState(false);
    const [isModalSelectTokenTo, setModalSelectTokenTo] = useState(false);
    const [coin, setCoin] = useState(null)
    const [coin2, setCoin2] = useState(null)
    const [coins, setCoins] = useState([])
    const [idCoin, setIdCoin] = useState([])
    const [allPairsDefault, setAllPairsDefault] = useState([])
    const value = {
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
        allPairsDefault: allPairsDefault
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
                data.tokens.push(VICG)
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

    useEffect(() => {
      async function getAllPairDefault() {
        const pair_default = await Promise.all(
            tokenDefault.map(async (item) => {
                return await Promise.all(tokenDefault.map(async (item0) => {
                        if (!item.equals(item0)) {
                            return await getPair(item, item0)
                        } else {
                            return null
                        }
                    }))
            })
        )
        setAllPairsDefault(pair_default);
       }

       getAllPairDefault();
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
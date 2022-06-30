
import { useEffect, useState } from 'react';
import { changeBNB } from '../api/changeBNB';

export const useETH = () => {
    const [coinsETH, setCoinsETH] = useState();
    useEffect(() => {
        async function getCoins() {
            const price = await changeBNB('https://api.binance.com/api/v3/ticker/price?symbol=BNBETH');
            setCoinsETH(price);
        }
        getCoins();

        setInterval(() => {
            getCoins();
        }, 5000);
    }, [])
    return {coinsETH, setCoinsETH };
}

export const useMATIC = () => {
    const [coinsMATIC, setCoinsMATIC] = useState();
    useEffect(() => {
        async function getCoins() {
            const price = await changeBNB('https://api.binance.com/api/v3/ticker/price?symbol=MATICBNB');
            setCoinsMATIC(price);
        }
        getCoins();

        setInterval(() => {
            getCoins();
        }, 5000);
    }, [])
    return {coinsMATIC, setCoinsMATIC };
}
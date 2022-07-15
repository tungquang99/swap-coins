import React, { Fragment, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getToken } from "../../Auth/token";
import { RENDER_IMAGE } from "../../constants/render-image";
import { getWallet } from "../../hooks/wallet";
import { layoutContext } from "../../layout/Layout";
import { web3 } from "../../wallet_connector/contract";
import {
  checkSellPrice,
  getBalnceFrom,
  getBalnceTo,
  SwapCoin,
  swapCoin,
} from "../../wallet_connector/balance/getBalance";
import "./Vicgempool.scss";
import { checkApproveVim } from "../../wallet_connector/buy_shoes/checkApproveVim";
import { toast } from "../../shared/toast/toast";
import ConnectWallet from "../Navigation/ConnectWallet";
import { approveVim } from "../../wallet_connector/buy_shoes/approveVim";
import { walletConnect } from "../../wallet_connector/connectors";
import {  CurrencyAmount, JSBI, Pair, Percent, Token, TokenAmount, Trade } from '@pancakeswap/sdk'
import { ethers } from "ethers";
import { getPair } from "../../hooks/getPair";
import { contractAddress, tokenDefault } from "../../constants/constants";
import { SwapCallback } from "../../hooks/useSwapCallback";
import { parseUnits } from "ethers/lib/utils";
import { pools_Default } from "../../constants/coins";
const token_default = require('../../abi/default.json')

function SwapVicGem({ isChart, setIsChart }) {
  const {
    account,
    setIsModalVisible,
    library,
    setModalSelectToken,
    setModalSelectTokenTo,
    coins,
    coin,
    setCoin,
    coin2,
    setCoin2,
    idCoin, 
    allPairsDefault,
    chainId
  } = useContext(layoutContext);
  const [currencyFrom, setCurrencyFrom] = useState(0);
  const [base1, setBase1] = useState([]);
  const [base2, setBase2] = useState([]);
  const [currencyTo, setCurrencyTo] = useState(0);
  const [balacneFrom, setBalanceFrom] = useState(0);
  const [balacneTo, setBalacneTo] = useState(0);
  const [token1, setToken1] = useState(null);
  const [token2, setToken2] = useState(null);
  const [router, setRouter] = useState(null);
  const [routerAddress, setRouterAddress] = useState([]);
  const [priceImpact, setPriceImpact] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(0);
  const [exchangeRateTo, setExchangeRateTo] = useState(0);
  const [VAT, setVAT] = useState(3);
  const [status, setStatus] = useState(true);
  const [swap, setSwap] = useState(false);
  const [checkSwap, setCheckSwap] = useState(false);
  const [enableBtn, setEnableBtn] = useState("disabled");
  const [isApprove, setIsApprove] = useState(true);
  const [isBtn, setIsBtn] = useState(false)
  const MAX_HOPS = 3;
  const typingTimeoutRef = useRef(null); 
  const VIC = {
    "name": "VICSTEP",
      "symbol": "VIC",
      "address": "0x53F542f581cA69076eB2c08f8E2aab97C07d21Dd",
      "chainId": 56,
      "decimals": 18,
      "logoURI": "https://assets.coingecko.com/coins/images/25963/thumb/vic.png?1654939840"
  }
 
  function setPool(coin1, coin2) {
    if ((coin1.symbol === 'BNB' && coin2.symbol === 'VICG') || (coin1.symbol === 'VIC' && coin2.symbol === 'VICG')) {
      if (!token_default.some(item => item.symbol === 'VIC')) {
        token_default.push(VIC)
       
      }
    } else {
      const idx_token_df = token_default.findIndex(item => item.symbol === 'VIC')
      if (idx_token_df > 0) {
        token_default.splice(idx_token_df, 1)
      }
    }
    setCoin(coin1)
    setCoin2(coin2);
    setCurrencyFrom(0)
    setCurrencyTo(0)
    setSwap(false)
    setIsBtn(false)
  }
  //* Get balance and check Approve Toekn from
  useEffect(() => {
    async function getBalance() {
      if (Number(await checkApproveVim(coin.address, account )) === 0 && !token_default.some(item => item.address === coin.address)) {
        setIsApprove(false);
      } else {
        setIsApprove(true);
      }
      if (coin.address) {
        console.log(token_default);
        const {token, pair} = await setPairToken(coin)
        setToken1(token)
        setBase1(pair)
        if (currencyFrom > 0) {
          const bestTradeSoFar = getInfoPair(token, token2, currencyFrom)
          if (bestTradeSoFar !== null) setCurrencyTo(bestTradeSoFar.outputAmount.toSignificant(6))
        }
        if (!coin.isNetwork) {
          let value = web3.utils.fromWei(
            await getBalnceFrom(coin.address, account),
            "ether"
          );
          setBalanceFrom(convertNumber(value));
        }
      }

      if (coin && coin.symbol === 'BNB') {
          const balance = await web3.eth.getBalance(account).then(
            (balance) => web3.utils.fromWei(balance, 'ether')
          );
          setBalanceFrom(Number(balance).toFixed(5));
      }
    }
    if ((account) && coin) {
      getBalance();
    }
   // setcoinId(idCoin.filter(item => item[2].toLowerCase() === coin.symbol.toLowerCase()))
  }, [coin, account, coin2]);

   //* Get balance and check Approve Toekn to
  useEffect(() => {
    async function getBalance() {
      if (coin2.address) {
        const {token, pair} = await setPairToken(coin2)
        setToken2(token)
        setBase2(pair)
        if (currencyFrom > 0) {
          const bestTradeSoFar = getInfoPair(token1, token, currencyFrom)
          if (bestTradeSoFar !== null) setCurrencyTo(bestTradeSoFar.outputAmount.toSignificant(6))
        }
        const allPairs = [...base1, ...base2, ...allPairsDefault.flat(1)].filter(item => item !== null);

        if (!coin2.isNetwork) {
          let value = web3.utils.fromWei(
            await getBalnceTo(coin2.address, account),
            "ether"
          );  
          setBalacneTo(convertNumber(value));
        }
      }

      if (coin2 && coin2.symbol === 'BNB') {
        const balance = await web3.eth.getBalance(account).then(
          (balance) => web3.utils.fromWei(balance, 'ether')
          );
        setBalacneTo(Number(balance).toFixed(5));
      }
    }
    if (account && coin2) {
      getBalance();
    }
   // setConvertId(idCoin.filter(item => item[2].toLowerCase() === coin2.symbol.toLowerCase()))
  }, [coin2, account]);

  const setPairToken = async (coin) => {
    const tokenDefault = token_default.map((item) => {
      return  new Token(56, item.address, 18, item.symbol, item.name);
    })
    const token = new Token(56, coin.address, 18, coin.symbol, coin.name)
    const pair = await Promise.all(tokenDefault.map(async (item) => {
      return await getPair(token, item);
    }))
    return {token, pair};
  }

  const handleInputFrom = async (value) => {
    setCurrencyFrom(value);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    typingTimeoutRef.current = setTimeout(async() => {
      if (account) {
        if (value !== '' && value > 0  && coin2 && coin2.address) { 
          const bestTradeSoFar = getInfoPair(token1, token2, value)
          if (bestTradeSoFar !== null) setCurrencyTo(bestTradeSoFar.outputAmount.toSignificant(6));
        }
      }
    }, 800)

    value !== '' ? setIsBtn(true) : setIsBtn(false)
  };

  const handleInputTo = async (value) => {
    setCurrencyTo(value);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    typingTimeoutRef.current = setTimeout(async() => {
      if (value !== '' && value > 0 && account && coin && coin.address) {
        const bestTradeSoFar =  getInfoPair(token2, token1, value)
          if (bestTradeSoFar !== null) setCurrencyFrom(bestTradeSoFar.outputAmount.toSignificant(6))
      }
      if (swap) {
          setCheckSwap(true)
      }
    }, 800)

    value !== '' ? setIsBtn(true) : setIsBtn(false)
  };

  const getInfoPair = (currencyAmountIn, currencyOut, value, isTrade = true) => {  
    if (base2) {
      const allPairs = [...base1, ...base2, ...allPairsDefault.flat(1)].filter(item => item !== null);
      console.log(base1);
      console.log(base2);
      let bestTradeSoFar = null
        for (let i = 1; i <= MAX_HOPS; i++) {
          const currentTrade =
          (isTrade ? Trade.bestTradeExactIn(allPairs, getAmountIn(value, currencyAmountIn), currencyOut, { maxHops: i, maxNumResults: 1 })[0] :
          Trade.bestTradeExactOut(allPairs, currencyAmountIn,  getAmountIn(value, currencyOut), { maxHops: i, maxNumResults: 1 })[0]) ?? null
          bestTradeSoFar = currentTrade
      }
      if (bestTradeSoFar !== null) {
        const symbol = bestTradeSoFar['route']['path'].map(item => item.symbol)
        setRouterAddress(bestTradeSoFar['route']['path'].map(item => item.address))
        setRouter(symbol.join(" > "));
        setPriceImpact(bestTradeSoFar['priceImpact'].toFixed(2))
        setExchangeRate(bestTradeSoFar.executionPrice.toSignificant(6));
        setExchangeRateTo(bestTradeSoFar.executionPrice.invert().toSignificant(6));
      }
    
      return bestTradeSoFar; 
    }
  }

  function getAmountIn(value, currency) {
    return  token_default.some(item => item.address === currency.address && item.symbol !== 'VIC') ? CurrencyAmount.ether(parseUnits(value, currency.decimals).toString()) 
      : new TokenAmount(currency, web3.utils.toWei(value.toString(), 'ether'))
  }

  const handleEnableVic = async () => {
    //* checkApprove
    const isApprove = await approveVim(!swap ? coin.address : coin2.address, account, !swap ? currencyFrom : currencyTo);
    setIsApprove(isApprove.status);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleSwap = async () => {
    setSwap(!swap)
    if (!swap && coin2.address) {
        if (Number(await checkApproveVim(coin2.address, account)) === 0 && !token_default.some(item => item.address === coin2.address)) {
            setIsApprove(false);
        } else {
            setIsApprove(true);
        }
        if (currencyTo != 0) {
          const bestTradeSoFar = getInfoPair(token2, token1, currencyFrom, false)
          if (bestTradeSoFar !== null) setCurrencyTo(bestTradeSoFar.inputAmount.toExact(9))
        }
    } else {
        if (Number(await checkApproveVim(coin.address, account)) === 0 && !token_default.some(item => item.address === coin.address)) {
            setIsApprove(false);
        } else {
            setIsApprove(true);
        }
        if (currencyTo != 0) {
          const bestTradeSoFar = getInfoPair(token1, token2, currencyFrom)
          if (bestTradeSoFar !== null) setCurrencyTo(bestTradeSoFar.outputAmount.toSignificant(6))
        }
    }

    if (checkSwap) { 
        setCheckSwap(false)
    }
  }

  const showModelSelectToken = (value) => {
    if (value === "from") {
      setModalSelectToken(true);
    }

    if (value === "to") setModalSelectTokenTo(true);
  };

  const handleAutoSlippage = () => {
    setStatus(!status);
    setVAT(9);
  };

  function convertNumber(value) {
    return Number.isInteger(Number(value)) && value > 0
      ? Number(value)
      : Number(value).toFixed(3);
  }
  const OnSubmitSwapCoin = async () => {
    const bestTradeSoFar = !swap ? getInfoPair(token1, token2, currencyFrom) : getInfoPair(token2, token1, currencyTo)
    setIsBtn(false)
    if (bestTradeSoFar !== null) await SwapCallback(bestTradeSoFar, VAT*100, account, chainId, library)
    setIsBtn(true)
    let count = 0;
    const a = setInterval(async () => {
      count++;
      if (!coin.isNetwork) {
        let value = web3.utils.fromWei(
          await getBalnceFrom(coin.address, account),
          "ether"
        );
        setBalanceFrom(convertNumber(value));
      }

      if (!coin2.isNetwork) {
        let value = web3.utils.fromWei(
          await getBalnceTo(coin2.address, account),
          "ether"
        );  
        setBalacneTo(convertNumber(value));
      }

      if (coin && coin.symbol === 'BNB') {
        const balance = await web3.eth.getBalance(account).then(
          (balance) => web3.utils.fromWei(balance, 'ether')
        );
        setBalanceFrom(Number(balance).toFixed(5));
      }

      if (coin2 && coin2.symbol === 'BNB') {
        const balance = await web3.eth.getBalance(account).then(
          (balance) => web3.utils.fromWei(balance, 'ether')
          );
        setBalacneTo(Number(balance).toFixed(5));
      }
      if (count === 8) {
        clearInterval(a);
      }
    }, 2000);
  }

  return (
    <div className="swap-vic">
      <div className="swap-vic__header">
        <div className="swap-vic__header--title">
          <div className="swap-vic__auto">
            Auto selected:{" "}
            <a href="https://pancakeswap.finance/swap" target="_blank">
              Pancake v2
            </a>
          </div>
          <div className="swap-vic__auto">Select Pools: 
          </div>
          <div className="pool">
            <span className="pool-item" onClick={() => setPool(token_default[0], pools_Default[0])}> 
                <span><img src={token_default[0].logoURI} alt='' width="15px" /> {token_default[0].symbol}/</span> 
                <span><img src={pools_Default[0].logoURI} alt='' width="20px" /> {pools_Default[0].symbol}</span>
              </span>
              <span className="pool-item" onClick={() => setPool(token_default[0], pools_Default[1])}> 
                <span><img src={token_default[0].logoURI} alt='' width="15px" /> {token_default[0].symbol}/</span> 
                <span><img src={pools_Default[1].logoURI} alt='' width="15px" /> {pools_Default[1].symbol}</span>
              </span>
              <span className="pool-item" onClick={() => setPool(pools_Default[0], pools_Default[1])}> 
                <span><img src={pools_Default[0].logoURI} alt='' width="20px" /> {pools_Default[0].symbol}/</span> 
                <span><img src={pools_Default[1].logoURI} alt='' width="15px" /> {pools_Default[1].symbol}</span>
              </span>
          </div>
        </div>
      </div>
      <div className="swap-vic__body">
        <div className="swap-vic__body--title">
          <span className="swap-vic__body--title__text"></span>
        </div>
        <div className={`swap-vic__swaps ${swap ? " reverse" : ""}`}>
          <div className="swap-vic__form" style={{position: 'relative'}}>
            <div className="swap-vic__label">
              <div className="swap-vic__label-text">
                {coin && <img src={coin.logoURI} alt={coin.logoURI} />}
                <span onClick={() => showModelSelectToken("from")}>
                  {coin ? coin.symbol : "Select Coin"}{" "}
                  <i class="bx bx-chevron-down"></i>
                </span>
              </div>
              <div className="swap-vic__label-balance">
                Balance: {balacneFrom}
              </div>
            </div>
            <input
              type="number"
              className="swap-vic__input active"
              readOnly={!coin}
              value={currencyFrom}
              onChange={(e) => handleInputFrom(e.target.value, coin.symbol)}
            />
            <button className="btn-max" onClick={() => handleInputFrom(balacneFrom)}>Max</button>
          </div>

          <div className="swap-vic__icon-swap">
            <i className="bx bx-sort-alt-2" onClick={handleSwap}></i>
          </div>

          <div className="swap-vic__form">
            <div className="swap-vic__label">
              <div className="swap-vic__label-text">
                {coin2 && <img src={coin2.logoURI} alt={coin2.logoURI} />}
                <span onClick={() => showModelSelectToken("to")}>
                  {coin2 ? coin2.symbol : "Select Coin"}{" "}
                  <i class="bx bx-chevron-down"></i>
                </span>
              </div>
              <div className="swap-vic__label-balance">
                Balance: {balacneTo}
              </div>
            </div>
            <input
              type="number"
              className="swap-vic__input"
              readOnly={!coin2}
              value={currencyTo}
              onChange={(e) => handleInputTo(e.target.value)}
            />
          </div>
        </div>

        <div className="swap-vic__slippage">
          <span>Slippage</span>
          <input
            type="number"
            className="swap-vic__input swap-vic__input--vat"
            readOnly={status}
            value={VAT}
            onChange={(e) => setVAT(e.target.value)}
          />
          <input
            type="text"
            className="swap-vic__input swap-vic__input--per"
            readOnly
            value="%"
          />
          <input
            type="text"
            className={`swap-vic__input swap-vic__input--status swap-vic__input--${status}`}
            readOnly
            value="AUTO"
            onClick={handleAutoSlippage}
          />
        </div>

        <div className="swap-vic__cost"> 
            <Fragment>
              {
                (currencyFrom != 0 || currencyTo != 0) && exchangeRate != 0 &&   <div> Price: {exchangeRate} {!swap ? coin2.symbol : coin.symbol} per 1 {!swap ? coin.symbol : coin2.symbol }</div>
              }
              {
                (currencyFrom != 0 || currencyTo != 0) && exchangeRateTo != 0 && <div> Price: {exchangeRateTo} {!swap ? coin.symbol : coin2.symbol } per 1 {!swap ? coin2.symbol : coin.symbol}</div>
              }
            </Fragment>
            {
                !checkSwap && 
                  <Fragment>
                     {
                        (currencyFrom != 0 || currencyTo != 0) && coin2 && !swap && account && <div>Minimum Received: {(currencyTo*(100 - VAT)/100).toFixed(5)}  {coin2.symbol}</div>
                     }
                     {
                        (currencyFrom != 0 || currencyTo != 0) && coin2 && swap && account && <div>Minimum Sold: {(currencyTo/((100 - VAT)/100)).toFixed(5)}  {coin2.symbol}</div>
                     }
                  </Fragment>  
            }

            {
                checkSwap && 
                  <Fragment>
                     {
                        (currencyFrom != 0 || currencyTo != 0) && coin2 && checkSwap && account && <div>Minimum Received: {(currencyTo*(100 - VAT)/100).toFixed(5)}  {coin2.symbol}</div>
                     }
                     {
                        (currencyFrom != 0 || currencyTo != 0) && coin2 && !checkSwap && account && <div>Minimum Sold: {(currencyTo/((100 - VAT)/100)).toFixed(5)}  {coin2.symbol}</div>
                     }
                  </Fragment>
                
            }
            
        </div>

        <div className="swap-vic__cost">
            {
              (currencyFrom != 0 || currencyTo != 0) && priceImpact != null &&  <div> Price Impact: {priceImpact} %</div>
            }
        </div>

        <div className="swap-vic__cost">
            {
              (currencyFrom != 0 || currencyTo != 0) && router != null &&  <div> Route: {router}</div>
            }
        </div>
      </div>

      <div className="swap-vic__footer">
        {getWallet() && (
          <Fragment>
            {!isApprove && (
              <Fragment>
                <div className="swap-vic__actions">
                  {!isApprove && (
                    <div
                      className="swap-vic__btn swap-vic__btn-enable"
                      onClick={handleEnableVic}
                    >
                      Enable VIC
                    </div>
                  )}
                  {!isApprove && (
                    <div className={`swap-vic__btn swap-vic__btn-${enableBtn}`}>
                      Swap
                    </div>
                  )}
                </div>
                <div className="swap-vic__rounded">
                  <div className="swap-vic__rounded--item full">1</div>
                  <div className={`swap-vic__bar ${enableBtn}`}></div>
                  <div className={`swap-vic__rounded--item ${enableBtn}`}>
                    2
                  </div>
                </div>
              </Fragment>
            )}
            {isApprove && (
              <div className="swap-vic__actions">
                <div
                  className={`swap-vic__btn swap-vic__btn-isapprove swap-vic__btn-${
                     coin && coin.address !== null && coin2 && coin2.address !== null && isBtn
                  }`}
                  onClick={OnSubmitSwapCoin}
                >
                  Swap
                </div>
              </div>
            )}
          </Fragment>
        )}
        {!getWallet() && (
          <Fragment>
            <div className="swap-vic__actions">
              <div
                className="swap-vic__btn swap-vic__btn-action"
                onClick={showModal}
              >
                Connect Wallet
              </div>
            </div>
          </Fragment>
        )}
      </div>

      <ConnectWallet />
    </div>
  );
}

export default SwapVicGem;

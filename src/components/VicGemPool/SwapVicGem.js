import React, { Fragment, useContext, useEffect, useState } from "react";
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
  swapCoin,
} from "../../wallet_connector/balance/getBalance";
import "./Vicgempool.scss";
import { checkApproveVim } from "../../wallet_connector/buy_shoes/checkApproveVim";
import { toast } from "../../shared/toast/toast";
import ConnectWallet from "../Navigation/ConnectWallet";
import { approveVim } from "../../wallet_connector/buy_shoes/approveVim";
import { walletConnect } from "../../wallet_connector/connectors";
import {  JSBI, Pair, Token, TokenAmount, Trade } from '@pancakeswap/sdk'
import { ethers } from "ethers";
import { getPair } from "../../hooks/getPair";
import { tokenDefault } from "../../constants/constants";
const token_default = require('../../abi/default.json')

function SwapVicGem({ isChart, setIsChart }) {
  const {
    account,
    setIsModalVisible,
    library,
    setModalSelectToken,
    setModalSelectTokenTo,
    coin,
    coin2,
    idCoin, 
    allPairsDefault
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
  const [VAT, setVAT] = useState(0.5);
  const [status, setStatus] = useState(false);
  const [swap, setSwap] = useState(false);
  const [checkSwap, setCheckSwap] = useState(false);
  const [enableBtn, setEnableBtn] = useState("disabled");
  const [isApprove, setIsApprove] = useState(true);
  const walletconnect =  localStorage.getItem('walletconnect') ? JSON.parse(localStorage.getItem('walletconnect')).accounts[0] : null;
  const MAX_HOPS = 3;

  //* Get balance and check Approve Toekn from
  useEffect(() => {
    async function getBalance() {
      if (Number(await checkApproveVim(coin.address, account ? account : walletconnect)) === 0 && !token_default.some(item => item.address === coin.address)) {
        setIsApprove(false);
      } else {
        setIsApprove(true);
      }
      if (coin.address) {
        const {token, pair} = await setPairToken(coin)
        setToken1(token)
        setBase1(pair)
        let value = web3.utils.fromWei(
          await getBalnceFrom(coin.address, account ? account : walletconnect),
          "ether"
        );
        setBalanceFrom(convertNumber(value));
      }

      if (coin && coin.isNetwork) {
        const balance = await web3.eth.getBalance(account).then(
            (balance) => web3.utils.fromWei(balance, 'ether')
            );
        setBalanceFrom(Number(balance).toFixed(5));
      }
    }
    if ((account || walletconnect) && coin) {
      getBalance();
    }
   // setcoinId(idCoin.filter(item => item[2].toLowerCase() === coin.symbol.toLowerCase()))
  }, [coin]);

   //* Get balance and check Approve Toekn to
  useEffect(() => {
    async function getBalance() {
      if (coin2.address) {
        const {token, pair} = await setPairToken(coin2)
        setToken2(token)
        setBase2(pair)
        const allPairs = [...base1, ...base2, ...allPairsDefault.flat(1)].filter(item => item !== null);
        let value = web3.utils.fromWei(
          await getBalnceTo(coin2.address,  account ? account : walletconnect),
          "ether"
        );
        setBalacneTo(convertNumber(value));
      }

      if (coin2 && coin2.isNetwork) {
        const balance = await web3.eth.getBalance(account).then(
            (balance) => web3.utils.fromWei(balance, 'ether')
            );
        setBalacneTo(Number(balance).toFixed(5));
      }
    }
    if ((account || walletconnect) && coin2) {
      getBalance();
    }
   // setConvertId(idCoin.filter(item => item[2].toLowerCase() === coin2.symbol.toLowerCase()))
  }, [coin2]);

  const setPairToken = async (coin) => {
    const token = new Token(56, coin.address, 18, coin.symbol, coin.name)
    const pair = await Promise.all(tokenDefault.map(async (item) => {
      return await getPair(token, item);
    }))
    return {token, pair};
  }

  const handleInputFrom = async (value) => {
    setCurrencyFrom(value);
    if (value !== '') {
      const bestTradeSoFar = getInfoPair(token1, token2)
      setCurrencyTo(value * bestTradeSoFar['route'].midPrice.toSignificant(6));
    }
  };

  const handleInputTo = async (value) => {
    setCurrencyTo(value);
    if (swap) {
        setCheckSwap(true)
        if (value !== '') {
          const bestTradeSoFar = getInfoPair(token2, token1)
          setCurrencyFrom(value * bestTradeSoFar['route'].midPrice.toSignificant(6));
        }
    }
  };

  const getInfoPair = (currencyAmountIn, currencyOut) => {
    if (base2) {
      const allPairs = [...base1, ...base2, ...allPairsDefault.flat(1)].filter(item => item !== null);
      let bestTradeSoFar = null
        for (let i = 1; i <= MAX_HOPS; i++) {
          const currentTrade =
            Trade.bestTradeExactIn(allPairs, new TokenAmount(currencyAmountIn, '1000000000000000'), currencyOut, { maxHops: i, maxNumResults: 3 })[0] ??
            null
          bestTradeSoFar = currentTrade
      }
      const symbol = bestTradeSoFar['route']['path'].map(item => item.symbol)
      setRouterAddress(bestTradeSoFar['route']['path'].map(item => item.address))
      setRouter(symbol.join(" > "));
      setPriceImpact(bestTradeSoFar['priceImpact'].toFixed(2))
      setExchangeRate(bestTradeSoFar.executionPrice.toSignificant(6));
      setExchangeRateTo(bestTradeSoFar.executionPrice.invert().toSignificant(6));
      return bestTradeSoFar; 
    }
  }

  const handleEnableVic = async () => {
    //* checkApprove
    const isApprove = await approveVim(coin.address, account, currencyFrom);
    setIsApprove(isApprove.status);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleSwap = async () => {
    setSwap(!swap)
    if (!swap && coin2.address) {
        if (Number(await checkApproveVim(coin2.address, account ? account : walletconnect)) === 0 && !token_default.some(item => item.address === coin.address)) {
            setIsApprove(false);
        } else {
            setIsApprove(true);
        }
        const bestTradeSoFar = getInfoPair(token2, token1)
        if (currencyTo != 0) {
          setCurrencyTo(bestTradeSoFar.executionPrice.invert().toSignificant(6))
        }
    } else {
        if (Number(await checkApproveVim(coin.address, account ? account : walletconnect)) === 0 && !token_default.some(item => item.address === coin.address)) {
            setIsApprove(false);
        } else {
            setIsApprove(true);
        }
        const bestTradeSoFar = getInfoPair(token1, token2)
        if (currencyTo != 0) {
          setCurrencyTo(bestTradeSoFar.executionPrice.toSignificant(6))
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
    setVAT(0.5);
  };

  function convertNumber(value) {
    return Number.isInteger(Number(value)) && value > 0
      ? Number(value)
      : Number(value).toFixed(3);
  }

  const onSubmitSwapCoin =  () => {
    setInterval(async () => {
      const {token: token1, pair: pair1} = await setPairToken(coin);
      setToken1(token1)
      setBase1(pair1)
      const {token: token2, pair: pair2} = await setPairToken(coin2);
      setToken2(token2)
      setBase2(pair2)
      
    }, 500000);

    if ((coin && coin['isNetwork']) || (coin2 && coin2['isNetwork'])) {
        swapCoin(account, currencyFrom, (currencyTo*(100 - VAT)/100).toFixed(5), routerAddress)
    } else {
        if (!swap) {
          setInterval(() => {
            const bestTradeSoFar = getInfoPair(currencyFrom, currencyTo)
            setCurrencyTo(bestTradeSoFar.executionPrice.toSignificant(6))
          }, 500000);
          swapCoin(account, currencyFrom, (currencyTo*(100 - VAT)/100).toFixed(5), routerAddress)
        } else {
            setInterval(() => {
              const bestTradeSoFar = getInfoPair(currencyTo, currencyFrom)
              setCurrencyTo(bestTradeSoFar.executionPrice.invert().toSignificant(6))
            }, 500000);
            swapCoin(account, (currencyTo/((100 - VAT)/100)).toFixed(5), currencyFrom, routerAddress)
        }
    }
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
        </div>
      </div>
      <div className="swap-vic__body">
        <div className="swap-vic__body--title">
          <span className="swap-vic__body--title__text"></span>
        </div>
        <div className={`swap-vic__swaps ${swap ? " reverse" : ""}`}>
          <div className="swap-vic__form">
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
                        (currencyFrom != 0 || currencyTo != 0) && coin2 && !swap && <div>Minimum Received: {(currencyTo*(100 - VAT)/100).toFixed(5)}  {coin2.symbol}</div>
                     }
                     {
                        (currencyFrom != 0 || currencyTo != 0) && coin2 && swap && <div>Minimum Sold: {(currencyTo/((100 - VAT)/100)).toFixed(5)}  {coin2.symbol}</div>
                     }
                  </Fragment>  
            }

            {
                checkSwap && 
                  <Fragment>
                     {
                        (currencyFrom != 0 || currencyTo != 0) && coin2 && checkSwap && <div>Minimum Received: {(currencyTo*(100 - VAT)/100).toFixed(5)}  {coin2.symbol}</div>
                     }
                     {
                        (currencyFrom != 0 || currencyTo != 0) && coin2 && !checkSwap && <div>Minimum Sold: {(currencyTo/((100 - VAT)/100)).toFixed(5)}  {coin2.symbol}</div>
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
                    currencyFrom != 0 || currencyTo != 0
                  }`}
                  onClick={onSubmitSwapCoin}
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

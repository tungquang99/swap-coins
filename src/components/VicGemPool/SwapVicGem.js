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
} from "../../wallet_connector/balance/getBalance";
import "./Vicgempool.scss";
import { checkApproveVim } from "../../wallet_connector/buy_shoes/checkApproveVim";
import { toast } from "../../shared/toast/toast";
import ConnectWallet from "../Navigation/ConnectWallet";
import { approveVim } from "../../wallet_connector/buy_shoes/approveVim";

function SwapVicGem({ isChart, setIsChart }) {
  const {
    account,
    setIsModalVisible,
    library,
    setModalSelectToken,
    setModalSelectTokenTo,
    coin,
    coin2,
    idCoin
  } = useContext(layoutContext);
  const [currencyFrom, setCurrencyFrom] = useState(0);
  const [currencyTo, setCurrencyTo] = useState(0);
  const [balacneFrom, setBalanceFrom] = useState(0);
  const [balacneTo, setBalacneTo] = useState(0);
  const [coinId, setcoinId] = useState(0);
  const [convertId, setConvertId] = useState(0);
  const [exchangeRate, setExchangeRate] = useState(0);
  const [VAT, setVAT] = useState(0.5);
  const [status, setStatus] = useState(false);
  const [swap, setSwap] = useState(false);
  const [checkSwap, setCheckSwap] = useState(false);
  const [enableBtn, setEnableBtn] = useState("disabled");
  const [isApprove, setIsApprove] = useState(true);

  //* Get balance and check Approve Toekn from
  useEffect(() => {
    async function getBalance() {
      console.log('a');
      if (Number(await checkApproveVim(coin.address, account)) === 0) {
        setIsApprove(false);
      } else {
        setIsApprove(true);
      }
      if (coin.address) {
        let value = web3.utils.fromWei(
          await getBalnceFrom(coin.address, account),
          "ether"
        );
        setBalanceFrom(convertNumber(value));
      }
    }
 
    if (account && coin.address) {
      getBalance();
    }
    setcoinId(idCoin.filter(item => item[2].toLowerCase() === coin.symbol.toLowerCase()))
  }, [coin]);

   //* Get balance and check Approve Toekn to
  useEffect(() => {
    async function getBalance() {
      if (coin2.address) {
        let value = web3.utils.fromWei(
          await getBalnceTo(coin2.address, account),
          "ether"
        );
        setBalacneTo(convertNumber(value));
      }
    }
    if (account && coin2.address) {
      getBalance();
    }
    setConvertId(idCoin.filter(item => item[2].toLowerCase() === coin2.symbol.toLowerCase()))
  }, [coin2]);

  useEffect(() => {
    if (coinId.length > 0 && convertId.length > 0) {
      priceConversion(1, coinId[0][0], convertId[0][0]);
    }
  }, [coinId, convertId])
  

  const handleInputFrom = async (value, symbol) => {
    setCurrencyFrom(value);
    priceConversion(value, coinId[0][0], convertId[0][0], false);
  };

  const handleInputTo = async (value) => {
    setCurrencyTo(value);
    if (swap) {
        setCheckSwap(true)
    }
    priceConversion(value, convertId[0][0], coinId[0][0], false, true);
  };

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
      setCurrencyTo((currencyTo*(100 - VAT)/100).toFixed(5))
      priceConversion((currencyTo*(100 - VAT)/100).toFixed(5), convertId[0][0], coinId[0][0], false, true);
        if (Number(await checkApproveVim(coin2.address, account)) === 0) {
            setIsApprove(false);
        } else {
            setIsApprove(true);
        }
    } else {
        setIsApprove(true);
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
      : Number(value).toFixed(2);
  }

  function priceConversion(amount, id, coinvertId, isFirstCall = true, isSwap = false) {
    fetch(`https://api.coinmarketcap.com/data-api/v3/tools/price-conversion?amount=${amount}&convert_id=${coinvertId}&id=${id}`).then(response => response.json())
        .then(data => {
          if (isFirstCall) {
            setExchangeRate(Number((data.data.quote[0].price)).toFixed(5));
          } else {
            if (!isSwap) {
              setCurrencyTo((data.data.quote[0].price).toFixed(5));
            } else {
              setCurrencyFrom((data.data.quote[0].price).toFixed(5));
            }
          }
        }).catch(err => err);
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
            {
              (currencyFrom != 0 || currencyTo != 0) && exchangeRate != 0 &&  <div> Price: {exchangeRate} {coin2.symbol} per 1 {coin.symbol}</div>
            }
            {
              (currencyFrom != 0 || currencyTo != 0) && exchangeRate != 0 && <div> Price: {(1 / exchangeRate).toFixed(5)} {coin.symbol} per 1 {coin2.symbol}</div>
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

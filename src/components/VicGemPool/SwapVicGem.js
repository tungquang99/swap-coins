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
    addressContract,
    coin2,
    addressContract2,
    exchanges,
    exchangesTo,
  } = useContext(layoutContext);
  const [currencyFrom, setCurrencyFrom] = useState(0);
  const [currencyTo, setCurrencyTo] = useState(0);
  const [balacneFrom, setBalanceFrom] = useState(0);
  const [balacneTo, setBalacneTo] = useState(0);
  const [exchangeRate, setExchangeRate] = useState(0);
  const [VAT, setVAT] = useState(0.5);
  const [status, setStatus] = useState(false);
  const [swap, setSwap] = useState(false);
  const [enableBtn, setEnableBtn] = useState("disabled");
  const [isApprove, setIsApprove] = useState(true);

  useEffect(() => {
    async function getBalance() {
      if (Number(await checkApproveVim(addressContract, account)) === 0) {
        setIsApprove(false);
      } else {
        setIsApprove(true);
      }
      if (addressContract) {
        let value = web3.utils.fromWei(
          await getBalnceFrom(addressContract, account),
          "ether"
        );
        setBalanceFrom(convertNumber(value));
      }
    }
    if (account && addressContract) {
      getBalance();
    }
  }, [coin, addressContract]);

  useEffect(() => {
    async function getBalance() {
      if (addressContract2) {
        let value = web3.utils.fromWei(
          await getBalnceTo(addressContract2, account),
          "ether"
        );
        setBalacneTo(convertNumber(value));
      }
    }
    if (account && addressContract2) {
      getBalance();
    }
  }, [addressContract2, coin2]);

  const handleInputSwapFrom = async (value) => {
    setCurrencyFrom(value);
    setCurrencyTo((exchanges['bnb']*value / exchangesTo['bnb']).toFixed(2));
  };

  const handleInputSwapTo = async (value) => {
    setCurrencyTo(value);
  };

  const handleEnableVic = async () => {
    //* checkApprove
    const isApprove = await approveVim(addressContract, account, currencyFrom);
    setIsApprove(isApprove.status);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

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
                {coin && <img src={coin.thumb} alt={coin.thumb} />}
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
              onChange={(e) => handleInputSwapFrom(e.target.value)}
            />
          </div>

          <div className="swap-vic__icon-swap">
            <i className="bx bx-sort-alt-2" onClick={() => setSwap(!swap)}></i>
          </div>

          <div className="swap-vic__form">
            <div className="swap-vic__label">
              <div className="swap-vic__label-text">
                {coin2 && <img src={coin2.thumb} alt={coin2.thumb} />}
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
              onChange={(e) => handleInputSwapTo(e.target.value)}
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

        {/* <div className="swap-vic__cost">
                    {vic != 0 && swap && <div>Maximum cost: {vic} - {(vic/VAT).toFixed(5)} VIC</div>}
                    {vic != 0 && !swap && <div>Minimum receive: {(vic*VAT).toFixed(5)} - {vic} VIC</div>} 
                </div> */}
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

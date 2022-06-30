import React, { useState } from 'react';
import './GearList.scss'
import { getToken } from './../../Auth/token';
import { useNavigate } from 'react-router-dom';
import { checkConnect } from '../../wallet_connector/connectors';
import { useEffect, useContext } from 'react';
import { layoutContext } from './../../layout/Layout';
import { getWallet } from './../../hooks/wallet';
import { checkApproveVim } from '../../wallet_connector/buy_shoes/checkApproveVim';
import { toHex } from '../../wallet_connector/utils';
import { networkParams } from '../../wallet_connector/network';
import buyVicShoes from '../../wallet_connector/buy_shoes/buyVicShoes';





function GearList() {
    const coinsDefault = 0.002;
    const {active, account,  chainId, coinsETH, coinsMATIC, library,} = useContext(layoutContext);
    const [optionsState, setOptionsState] = useState(56)
    const [coinsBNB, setCoinsBNB] = useState(coinsDefault)
    const [amount, setAmount] = useState(1)
    const navigate = useNavigate();
    useEffect(() => {
        if (getWallet()) {
            if (!active) {
                setOptionsState(56);
            } else {
                setOptionsState(chainId);
                handleSelectNetwork(chainId);
            }
        } else {
            setCoinsBNB(coinsDefault)
            setOptionsState(56)
        }
    }, [getWallet(), active])
    
    const handleSelectNetwork = async (val) => {
        const value = Number(val);
        if (getWallet()) {
            switch (value) {
                case 56:
                    if (await switchNetwork(56, library)) {
                        setCoinsBNB(coinsDefault);
                        setOptionsState(value);
                    }
                    break;
                case 1:
                    if (await switchNetwork(1, library)) {
                        setCoinsBNB((coinsETH * coinsDefault).toFixed(5))
                        setOptionsState(value);
                    };
                    break;
                case 137:
                    if (await switchNetwork(137, library)) {
                        setCoinsBNB((coinsMATIC / coinsDefault).toFixed(5))
                        setOptionsState(value)
                    };
                    break;
                default:
                    break;
            }
        } else {
            checkConnect(false);
        }
    };

    // * switch network
    const switchNetwork = async (chainId, library) => {
        try {
            await library.provider.request({
                method: "wallet_switchEthereumChain",
                params: [{chainId: toHex(chainId)}]
            });
            return true;
        } catch (error) {
            if (error.code === 4001) {
               return false;
            }
            if (error.code === 4902) {
                try {
                    await library.provider.request({
                        method: "wallet_addEthereumChain",
                        params: [networkParams[toHex(chainId)]]
                    })
                    
                } catch (error) {
                    console.log(error);
                }
            }
            
        }
    }

    // *Buy box
    const handleBuyBox = async (item) => {
        if (!getToken()) {
            navigate('/login');
            return true;
        }
        if (!getWallet()) {
            checkConnect(false);
            return true;
        }

        //* checkApprove
        const isApprove = await checkApproveVim(account, library);
        if (isApprove) {
            buyVicShoes();
        }
    }
    return (
        <>
           <select value={optionsState} onChange={(e) => handleSelectNetwork(e.target.value)}>
                <option value="56">BNB</option>
                <option value="1">ETH</option>
                <option value="137">POLY</option>
            </select>
            <div className="gear-list">
                <div className="gear-box">
                    <div className="gear-item">
                        <div className="title">
                            HYPER SNEAKER
                        </div>
                        <img src="" alt="" />
                        <span>
                            {coinsBNB} {optionsState === 1 ? 'ETH' : optionsState === 137 ? "MATIC" : ""}
                        </span>
                    </div>
                    <div className="gear-action">
                        <input type="number" name="" id="" defaultValue={amount} min="1" max="10" onChange={(e) => setAmount(e.target.value)}/>
                        <button className="btn btn-buy" onClick={() => handleBuyBox('hyper')}>BUY</button>
                    </div>
                </div>
                <div className="gear-box">
                    <div className="gear-item">
                        <div className="title">
                            TECHNO SNEAKER
                        </div>
                        <img src="" alt="" />
                        <span>
                            {coinsBNB} {optionsState === 1 ? 'ETH' : optionsState === 137 ? "MATIC" : ""}
                        </span>
                    </div>
                    <div className="gear-action">
                        <input type="number" name="" id="" defaultValue={amount} min="1" max="10" onChange={(e) => setAmount(e.target.value)}/>
                        <button className="btn btn-buy" onClick={() => handleBuyBox('techno')}>BUY</button>
                    </div>
                </div>
                <div className="gear-box">
                    <div className="gear-item">
                        <div className="title">
                            CLASSIC SNEAKER
                        </div>
                        <img src="" alt="" />
                        <span>
                            0.00 BNB
                        </span>
                    </div>
                    <div className="gear-action">
                        <input type="number" name="" id="" />
                        <button className="btn btn-buy">BUY</button>
                    </div>
                </div>
                <div className="gear-box">
                    <div className="gear-item">
                        <div className="title">
                            FUTURE SNEAKER
                        </div>
                        <img src="" alt="" />
                        <span>
                            0.00 BNB
                        </span>
                    </div>
                    <div className="gear-action">
                        <input type="number" name="" id="" />
                        <button className="btn btn-buy">BUY</button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default GearList;
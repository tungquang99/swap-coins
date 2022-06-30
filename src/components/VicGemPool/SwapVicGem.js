import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getToken } from '../../Auth/token';
import { RENDER_IMAGE } from '../../constants/render-image';
import { getWallet } from '../../hooks/wallet';
import { layoutContext } from '../../layout/Layout';
import { web3 } from '../../wallet_connector/contract';
import { checkSellPrice, getBalanceVic, getBalanceVicGem } from '../../wallet_connector/balance/getBalance';
import './Vicgempool.scss';
import { checkApproveVim } from '../../wallet_connector/buy_shoes/checkApproveVim';
import { toast } from '../../shared/toast/toast';
import ConnectWallet from '../Navigation/ConnectWallet';

function SwapVicGem({isChart, setIsChart}) {
    const {account, setIsModalVisible, library, setModalSelectToken} = useContext(layoutContext); 
    const [vic, setVic] = useState("0.00");
    const [vicgem, setVicgem] = useState(0);
    const [banlanceVic, setBalanceVic] = useState(0);
    const [banlanceVicgame, setBanlanceVicgem] = useState(0);
    const [VAT, setVAT] = useState(0.91);
    const [status, setStatus] = useState("auto");
    const [swap, setSwap] = useState(false);
    const [allprice, setAllPrice] = useState(0);
    const [enableBtn, setEnableBtn] = useState('disabled');

    useEffect(() => {
        async function getBalance() {
            const totalVic = web3.utils.fromWei(await checkSellPrice(), 'ether');
            setAllPrice(Number(totalVic).toFixed(3))
            setBalanceVic(await getBalanceVic(account));
            setBanlanceVicgem(await getBalanceVicGem(account));
        }
        if (account) {
            getBalance();
        }
    }, [account])
    
    const handleInputSwap = async (value) => {
        if (value.includes("-")) {
            setVicgem(0)
            setVic(0);
            return;
        }
        setVicgem(value);
        value = web3.utils.fromWei(String(value * (await checkSellPrice())), 'ether')
        setVic(Number(value).toFixed(3));
    }

    const handleEnableVic = async () => {
         if (vicgem === 0) {
            toast('warning', "Please check value enter in the VICGEM amount input.", 2);
            return;
         }

         //* checkApprove
         const isApprove = await checkApproveVim(account, library);
         if (isApprove) {
            setEnableBtn('enable');
         }
    }

    const showModal = () => {
        setIsModalVisible(true);
      };

    return (
        <div className='swap-vic'>
            <div className="swap-vic__header">
                <div className="swap-vic__header--title">
                    <div className="swap-vic__tab">
                        <div className='swap-vic__tab--item active'>Auto</div>
                        <div className='swap-vic__tab--item'>Pancake v1</div>
                        <div className='swap-vic__tab--item'>Pancake v2</div>
                    </div>
                    <div className='swap-vic__auto'>Auto selected: <a href='https://pancakeswap.finance/swap' target="_blank">Pancake v2</a></div>
                </div>
            </div>
            <div className="swap-vic__body">
                <div className="swap-vic__body--title">
                   <span className='swap-vic__body--title__text'></span>
                </div>
                <div className={`swap-vic__swaps ${swap ? ' reverse' : ''}`}>
                    
                    <div className="swap-vic__form">
                        <div className="swap-vic__label">
                            <div className="swap-vic__label-text">
                                <span onClick={() => setModalSelectToken(true)}>Vic <i class='bx bx-chevron-down'></i></span>
                            </div>
                            <div className="swap-vic__label-balance">
                                Balance: 0
                            </div>
                        </div>
                        <input type="number" className="swap-vic__input active" value={vicgem} onChange={(e) => handleInputSwap(e.target.value)}/>
                    </div>
                    
                    <div className="swap-vic__icon-swap">
                        <i className='bx bx-sort-alt-2' onClick={() =>  setSwap(!swap)}></i>
                    </div>

                    <div className="swap-vic__form">
                        <div className="swap-vic__label">
                            <div className="swap-vic__label-text">
                                <span onClick={() => setModalSelectToken(true)}>BNB <i class='bx bx-chevron-down'></i></span>
                            </div>
                            <div className="swap-vic__label-balance">
                                Balance: 0
                            </div>
                        </div>
                        <input type="number" className="swap-vic__input" />
                    </div>
                </div>

                <div className="swap-vic__slippage">
                    <span>Slippage</span>
                    <input type="text" className="swap-vic__input swap-vic__input--vat" value={100 - (VAT*100)} />
                    <input type="text" className="swap-vic__input swap-vic__input--per" readOnly value='%' />
                    <input type="text" className="swap-vic__input swap-vic__input--status" readOnly value={status} />
                </div>

                <div className="swap-vic__cost">
                    {vic != 0 && swap && <div>Maximum cost: {vic} - {(vic/VAT).toFixed(5)} VIC</div>}
                    {vic != 0 && !swap && <div>Minimum receive: {(vic*VAT).toFixed(5)} - {vic} VIC</div>} 
                </div>
            </div>

            <div className="swap-vic__footer">
               {
                getWallet() && <Fragment>
                    <div className="swap-vic__actions">
                        <div className="swap-vic__btn swap-vic__btn-enable" onClick={handleEnableVic}>Enable VIC</div>
                        <div className={`swap-vic__btn swap-vic__btn-${enableBtn}`}>Swap</div>
                    </div>

                    <div className="swap-vic__rounded">
                        <div className="swap-vic__rounded--item full">1</div>
                        <div className={`swap-vic__bar ${enableBtn}`}></div>
                        <div className={`swap-vic__rounded--item ${enableBtn}`}>2</div>
                    </div>
                </Fragment>
               }
               {
                !getWallet() && <Fragment>
                     <div className="swap-vic__actions">
                        <div className="swap-vic__btn swap-vic__btn-action" onClick={showModal}>Connect Wallet</div>
                    </div>
                </Fragment>
               }
            </div>

            <ConnectWallet />
        </div>
    );
}

export default SwapVicGem;
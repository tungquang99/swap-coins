import { Modal, Select } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import SelectSearch, { fuzzySearch } from 'react-select-search';
import { layoutContext } from '../../layout/Layout';
import './index.scss';

const { Option } = Select;

const SelectToken = ({ isOpen, closeModal }) => {
    const [coins, setCoins] = useState([])
    const [address, setAddress] = useState([]);
    const [search, setSearch] = useState('');
    const { setAddressContract2, setCoin2, setExchangeTo } = useContext(layoutContext);

     async function getCoins(query) {
        let coinsInfo = [];
        const coins = await fetch(`https://api.coingecko.com/api/v3/search?query=${query}`).then(response => response.json())
        .then(data => data).catch(err => err);
        if (coins.coins) {
            coinsInfo = await Promise.all(
                coins.coins.map(async (item) => {
                    return await getSearchAddress(item.id)
                })
              );
        }
        return { coins, coinsInfo }
      }

        async function getSearchAddress(id) {
        const data = await fetch(`https://api.coingecko.com/api/v3/coins/${id}`).then(response => response.json()).then(data => data).catch(err => err);
        setExchangeTo(data.market_data['current_price'])
        return data.contract_address;
      }
      
      
      const onSearch = async (value) => {
        setSearch(value);
        setTimeout(async() => {
            if (value !== '') {
                const {coins, coinsInfo} = await getCoins(value);
                    setCoins(coins.coins)
                    setAddress(coinsInfo);
            
            }
        }, 2000);

        if (value === "") {
            setCoins([])
            setAddress([])
        }
      };

      const selectAddress = (address, coin) => {
        setAddressContract2(address);
        setCoin2(coin);
        setCoins([])
        setAddress([])
        closeModal();
        setSearch('')
      }

    return (
        <Modal title="Select Token" visible={isOpen} onCancel={closeModal} footer={null}>
           
            <div className="dropdown">
                <input type="text" placeholder="Enter token name/ address..." id="myInput" value={search}  onChange={(e) => onSearch(e.target.value)} />
                <div id="myDropdown" className="dropdown-content">
                    {
                         coins.length > 0 && coins.map((item, i) => (
                                <div className='dropdown-item' key={i} onClick={() => selectAddress(address[i], item)}> 
                                    <div className='dropdown-title'>
                                        <img src={item.thumb} alt={item.thumb} />
                                        <div className='dropdown-name'>{item.name} ({item.symbol})</div>
                                    </div>
                                    <div className='dropdown-address'>{address[i]}</div>
                                </div>
                        ))
                    }

                    {
                        coins.length === 0 && 
                            <div>
                                <div className='dropdown-item dropdown-no-item'> 
                                    No options
                                </div>
                            </div>
                    }
                </div>

              </div>
        </Modal>
    );
};

export default SelectToken;
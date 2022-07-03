import { Modal, Select } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import SelectSearch, { fuzzySearch } from 'react-select-search';
import { layoutContext } from '../../layout/Layout';
import './index.scss';

const { Option } = Select;

const SelectToken = ({ isOpen, closeModal }) => {
    const [listCoins, setListCoins] = useState([])
    const [address, setAddress] = useState([]);
    const [search, setSearch] = useState('');
    const typingTimeoutRef = useRef(null);
    const { setCoin, setExchange, coins } = useContext(layoutContext);

    //  async function getCoins(query) {
    //     let coinsInfo = [];
    //     const coins = await fetch(`https://api.coingecko.com/api/v3/search?query=${query}`).then(response => response.json())
    //     .then(data => data).catch(err => err);
    //     if (coins.coins) {
    //         coinsInfo = await Promise.all(
    //             coins.coins.map(async (item) => {
    //                 return await getSearchAddress(item.id)
    //             })
    //           );
    //     }
    //     const addressList = coinsInfo.map(item => item.contract_address)
    //     return { coins, addressList }
    //   }

    //     async function getSearchAddress(id) {
    //     const data = await fetch(`https://api.coingecko.com/api/v3/coins/${id}`).then(response => response.json()).then(data => data).catch(err => err);
    //     setExchange(data.market_data['current_price'])
    //     return data;
    //   }
      
      
      const onSearch = async (value) => {
          setSearch(value);
          if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
          }


          typingTimeoutRef.current = setTimeout(async() => {
            if (value !== '') {
               setListCoins(coins.filter(item => item.symbol.toLowerCase().includes(value.toLowerCase()) || item.name.toLowerCase().includes(value.toLowerCase())))
            }
            }, 300);

        if (value === "") {
            setListCoins([])
            setAddress([])
        }
      };

      const selectAddress = async (coin) => {
        setCoin(coin);
        setListCoins([])
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
                         listCoins.length > 0 && listCoins.map((item, i) => (
                                <div className='dropdown-item' key={i} onClick={() => selectAddress(item)}> 
                                    <div className='dropdown-title'>
                                        <img src={item.logoURI} alt={item.logoURI} />
                                        <div className='dropdown-name'>{item.name} ({item.symbol})</div>
                                    </div>
                                    <div className='dropdown-address'>{item.address}</div>
                                </div>
                        ))
                    }

                    {
                        listCoins.length === 0 && 
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
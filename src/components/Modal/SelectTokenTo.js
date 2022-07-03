import { Modal, Select } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import SelectSearch, { fuzzySearch } from 'react-select-search';
import { coinNetwork } from '../../constants/coins';
import { layoutContext } from '../../layout/Layout';
import './index.scss';

const { Option } = Select;

const SelectToken = ({ isOpen, closeModal }) => {
    const [listCoins, setListCoins] = useState([])
    const [address, setAddress] = useState([]);
    const [search, setSearch] = useState('');
    const [isSelect, setIsSelect] = useState(false)
    const typingTimeoutRef = useRef(null);
    const { setCoin2, setExchangeTo, coins } = useContext(layoutContext);

      const onSearch = async (value) => {
        setSearch(value);
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current)
        }


        typingTimeoutRef.current = setTimeout(async() => {
          if (value !== '') {
            const data = coins.filter(item => item.symbol.toLowerCase().includes(value.toLowerCase()) || item.name.toLowerCase().includes(value.toLowerCase()))
            if (data.length === 0) {
                setIsSelect(true);
            } else {
                setIsSelect(false)
            }
             setListCoins(data)
          }
          }, 300);

      if (value === "") {
          setListCoins([])
          setAddress([])
      }
    };

    const selectAddress = async (coin) => {
        setCoin2(coin);
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
                        isSelect && listCoins.length === 0 && 
                            <div className='dropdown-item'>
                                <div className=' dropdown-no-item'> 
                                    No options
                                </div>
                            </div>
                    }
                </div>
                <div id="myDropdown" className="dropdown-content">
                    {
                         coinNetwork.map((item, i) => (
                                <div className='dropdown-item' key={i} onClick={() => selectAddress(item)}> 
                                    <div className='dropdown-title'>
                                        <img src={item.logoURI} alt={item.logoURI} />
                                        <div className='dropdown-name'>{item.name} ({item.symbol})</div>
                                    </div>
                                    <div className='dropdown-address'>{item.address}</div>
                                </div>
                        ))
                    }
                </div>
              </div>
        </Modal>
    );
};

export default SelectToken;
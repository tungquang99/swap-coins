import { Modal, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import SelectSearch, { fuzzySearch } from 'react-select-search';
const { Option } = Select;

const SelectToken = ({ isOpen, closeModal }) => {
    const [data, setData] = useState([])
    const [address, setAddress] = useState([])
    
     async function getCoins(query) {
        let coinsInfo;
        const coins = await fetch(`https://api.coingecko.com/api/v3/search?query=${query}`).then(response => response.json())
        .then(data => data).catch(err => err);
        if (coins.coins) {
            coinsInfo = await fetch(`https://api.coingecko.com/api/v3/coins/${coins.coins[0].id}`).then(response => response.json()).then(data => data).catch(err => err);
        }
        return { coins, coinsInfo }
      }
      
      
      const onSearch = (value) => {
        if (value !== '') {
            setTimeout(async () => {
                const {coins, coinsInfo} = await getCoins(value) ;
                setData(coins);
                setAddress(coinsInfo['contract_address']);
            }, 200);
        }
      };

    return (
        <Modal title="Select Token" visible={isOpen} onCancel={closeModal} footer={null}>
           
            <div className="dropdown">
                <input type="text" placeholder="Search.." id="myInput" onKeyUp={(e) => onSearch(e.target.value)} />
                <div id="myDropdown" className="dropdown-content">
                    <a>{address}</a>
                </div>
              </div>
        </Modal>
    );
};

export default SelectToken;
import { Modal, Select } from 'antd';
import React, { useEffect, useState } from 'react';
const { Option } = Select;

const SelectToken = ({ isOpen, closeModal }) => {
    const [data, setData] = useState([])
    const [address, setAddress] = useState([])
    const onChange = (value) => {
        console.log(`selected ${value}`);
      };

      useEffect(async () => {
        const coins = await fetch(`https://api.coingecko.com/api/v3/search?query=`).then(response => response.json())
        console.log(coins);
      }, [])
      
    
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
                setAddress(coinsInfo);
                console.log(data);
                console.log(address);
            }, 2000);
        }
      };

    return (
        <Modal title="Select Token" visible={isOpen} onCancel={closeModal} footer={null}>
            <a>{address['contract_address']}</a>
            <Select
                showSearch
                placeholder="Select a person"
                optionFilterProp="children"
                onChange={onChange}
                onSearch={onSearch}
               
            >
               <Option>{address['contract_address']}</Option>
            </Select>
        </Modal>
    );
};

export default SelectToken;
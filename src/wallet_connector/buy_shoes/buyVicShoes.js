import { abiBuyVicShoes, contractAddress } from '../../constants/constants';
import { contract } from '../contract';

export default async function buyVicShoes() {
    const contractBuy = await contract(contractAddress.buy_vic_shoes, abiBuyVicShoes);
    const response = await contractBuy.methods.BuyVicShose(1).call();   
}
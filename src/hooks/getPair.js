import { Pair, TokenAmount } from "@pancakeswap/sdk";
import { ethers } from "ethers";
import { web3Provider } from "../constants/constants";
const IPancakePair = require('../abi/IPancakePair.json')
export async function getPair(token_1, token_2) {
    try {
        const pairAddress = Pair.getAddress(token_1, token_2)
        const pairContract = new ethers.Contract(
            pairAddress,
            IPancakePair,
            web3Provider,
        );
        const reserves = await pairContract.getReserves();
        const [reserve0, reserve1] = reserves;
        const tokens = [token_1, token_2]
        const [token0, token1] = tokens[0].sortsBefore(tokens[1]) ? tokens : [tokens[1], tokens[0]]
        const pair = new Pair(new TokenAmount(token0, reserve0), new TokenAmount(token1, reserve1))
        return pair;
    } catch (error) {
        return null;
    }
}
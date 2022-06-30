export const networkParams = {
  eth: {
    chainId: `0x${Number(1).toString(16)}`,
    chainName: "Ethereum Mainnet",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18
    },
    rpcUrls: [
      "https://api.mycryptoapi.com/eth",
      "https://cloudflare-eth.com"
    ],
    blockExplorerUrls: ["https://etherscan.io"]
  },
  bsc: {
    chainId: `0x${Number(56).toString(16)}`,
    chainName: "Binance Smart Chain Mainnet",
    nativeCurrency: {
      name: "Binance Chain Native Token",
      symbol: "BNB",
      decimals: 18
    },
    rpcUrls: [
     "https://bsc-dataseed.binance.org/",
     "https://rpc.ankr.com/bsc",
     "https://data-seed-prebsc-1-s1.binance.org:8545/",
    ],
    blockExplorerUrls: ["https://bscscan.com"]
  },
  polygon: {
    chainId: `0x${Number(137).toString(16)}`,
    chainName: "Polygon Mainnet",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18
    },
    rpcUrls: ["https://polygon-rpc.com/"],
    blockExplorerUrls: ["https://polygonscan.com/"]
  },
  };
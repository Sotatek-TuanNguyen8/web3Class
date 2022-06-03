import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { BscConnector } from '@binance-chain/bsc-connector'


export const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42],
});


export const BSCWallet = new BscConnector({
  supportedChainIds: [56, 97]
})

export const CoinbaseWallet = new WalletLinkConnector({
  url: `https://mainnet.infura.io/v3/9b05d6eb4d8841a4b0b7ccc591854513`,
  appName: "Web3-react Demo",
  supportedChainIds: [1, 3, 4, 5, 42],
});
export const walletConnect = new WalletConnectConnector({
  
  supportedChainIds: [4],
  rpc: {
    4: `https://rinkeby.infura.io/v3/9b05d6eb4d8841a4b0b7ccc591854513`,
  },
  bridge: "https://bridge.walletconnect.org",
  qrcode: false,
});

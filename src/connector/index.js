import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

export const injected = new InjectedConnector({
  supportedChainIds: [4],
});

export const walletconect = new WalletConnectConnector({
  supportedChainIds: [4],
  rpc: {
    4: `https://rinkeby.infura.io/v3/9b05d6eb4d8841a4b0b7ccc591854513`,
  },
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
});

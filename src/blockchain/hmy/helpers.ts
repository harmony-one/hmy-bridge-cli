// import { Wallet } from '@harmony-js/account';
type Harmony = any;

export type TConnectToOneWallet = (
  walletExtension: any,
  hmy: Harmony,
  wallet: any,
  addr: string,
  reject: (reason: string) => void
) => Promise<any>;

export const connectToBrowserWallet: TConnectToOneWallet = async (
  walletExtension: any,
  hmy: any,
  wallet: any,
  addrHex: any,
  reject: any
) => {
  return null;
  // let userAddress = addrHex;

  // if (!userAddress) {
  //   let { address } = await walletExtension.getAccount();

  //   userAddress = hmy.crypto.getAddress(address).checksum;
  // }

  // wallet.defaultSigner = userAddress;

  // wallet.signTransaction = async (tx: any) => {
  //   try {
  //     tx.from = userAddress;

  //     const signTx = await walletExtension.signTransaction(tx);

  //     return signTx;
  //   } catch (e) {
  //     reject(e);
  //   }

  //   return null;
  // };
};

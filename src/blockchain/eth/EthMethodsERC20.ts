import { Contract } from 'web3-eth-contract';
const getAddress = (str: any) => ({ checksum: str });
import Web3 from 'web3';
import { withDecimals } from '../utils';
import MyERC20Abi from '../out/MyERC20';
import { getTokenConfig, networks } from '../../configs';
const BN = require('bn.js');
// import { abi as ProxyERC20Abi } from '../out/ProxyERC20Abi';
import { abi as ProxyERC721Abi } from '../out/ProxyERC721Abi';
import { TOKEN } from '../../configs/interfaces';

export interface IEthMethodsInitParams {
  web3: Web3;
  ethManagerContract: Contract;
  ethManagerAddress: string;
  gasPrice: number;
  gasLimit: number;
  gasApiKey: string;
}

export class EthMethodsERC20 {
  private web3: Web3;
  private ethManagerContract: Contract;
  private ethManagerAddress: string;
  private useMetamask = false;

  gasPrice: number;
  gasLimit: number;
  gasApiKey: string;

  constructor(params: IEthMethodsInitParams) {
    this.web3 = params.web3;
    this.ethManagerContract = params.ethManagerContract;
    this.ethManagerAddress = params.ethManagerAddress;

    this.gasPrice = params.gasPrice;
    this.gasLimit = params.gasLimit;
    this.gasApiKey = params.gasApiKey;
  }

  setUseMetamask = (value: boolean) => (this.useMetamask = value);

  approveEthManger = async (
    erc20Address: string,
    amount: number,
    decimals: number,
    sendTxCallback?: (hash: string) => void
  ) => {
    let accounts;
    if (this.useMetamask) {
      // @ts-ignore
      accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    }

    const erc20Contract = new this.web3.eth.Contract(MyERC20Abi, erc20Address);

    // return await erc20Contract.methods
    //   .approve(this.ethManagerAddress, withDecimals(amount, decimals))
    //   .send({
    //     from: this.useMetamask ? accounts[0] : this.web3.eth.defaultAccount,
    //     gas: this.gasLimit,
    //     gasPrice: new BN(await this.web3.eth.getGasPrice()).mul(new BN(1)),
    //   })
    //   .on('transactionHash', (hash: string) => sendTxCallback(hash));

    return await erc20Contract.methods
      .approve(
        getTokenConfig(erc20Address).proxyERC20,
        withDecimals(amount, decimals),
      )
      .send({
        from: this.useMetamask ? accounts[0] : this.web3.eth.defaultAccount,
        gas: this.gasLimit,
        gasPrice: new BN(await this.web3.eth.getGasPrice()).mul(new BN(1)),
      })
      .on('transactionHash', (hash: string) => sendTxCallback(hash));
  };

  lockToken = async (
    erc20Address: string,
    userAddr: string,
    amount: number,
    decimals: number,
    sendTxCallback?: (hash: string) => void
  ) => {
    let accounts;
    if (this.useMetamask) {
      // @ts-ignore
      accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    }

    const hmyAddrHex = getAddress(userAddr).checksum;

    // const transaction = await this.ethManagerContract.methods
    //   .lockToken(erc20Address, withDecimals(amount, decimals), hmyAddrHex)
    //   .send({
    //     from: this.useMetamask ? accounts[0] : this.web3.eth.defaultAccount,
    //     gas: this.gasLimit,
    //     gasPrice: new BN(await this.web3.eth.getGasPrice()).mul(new BN(1)),
    //   })
    //   .on('transactionHash', (hash: string) => sendTxCallback(hash));

    // return transaction.events.Locked;

    const token = getTokenConfig(erc20Address);

    const proxyContract = new this.web3.eth.Contract(
      ProxyERC721Abi as any,
      token.proxyERC20,
    );

    // const - 500k gasLimit
    const adapterParams = token.adapterParams || token.adapterParamsEth ||
      '0x0001000000000000000000000000000000000000000000000000000000000007a120';

    const sendFee = await proxyContract.methods
      .estimateSendFee(
        networks.HARMONY.layerzero.chainId,
        hmyAddrHex, // to user address
        withDecimals(amount, decimals),
        false,
        adapterParams,
      )
      .call();

    let value;

    switch (token.token) {
      case TOKEN.ETH:
        value = withDecimals(amount, decimals).add(new BN(sendFee.nativeFee));
        break;

      default:
        value = sendFee.nativeFee;
    }

    let estimateGas = 0;

    try {
      estimateGas = await proxyContract.methods.sendFrom(
        this.useMetamask ? accounts[0] : this.web3.eth.defaultAccount,
        networks.HARMONY.layerzero.chainId,
        hmyAddrHex, // to user address
        withDecimals(amount, decimals),
        this.useMetamask ? accounts[0] : this.web3.eth.defaultAccount,
        '0x0000000000000000000000000000000000000000', // const
        adapterParams
      )
        .estimateGas({
          value,
          from: this.useMetamask ? accounts[0] : this.web3.eth.defaultAccount,
        });
    } catch (e) {
      console.error(e);
    }

    const gasLimit = Math.max(estimateGas, 500000, this.gasLimit);

    const res = await proxyContract.methods
      .sendFrom(
        this.useMetamask ? accounts[0] : this.web3.eth.defaultAccount,
        networks.HARMONY.layerzero.chainId,
        hmyAddrHex, // to user address
        withDecimals(amount, decimals),
        this.useMetamask ? accounts[0] : this.web3.eth.defaultAccount,
        '0x0000000000000000000000000000000000000000', // const
        adapterParams,
      )
      .send({
        value,
        from: this.useMetamask ? accounts[0] : this.web3.eth.defaultAccount,
        gas: gasLimit,
        gasPrice: new BN(await this.web3.eth.getGasPrice()).mul(new BN(1)),
      })
      .on('transactionHash', (hash: string) => sendTxCallback(hash));

    return res;
  };

  checkEthBalance = async (erc20Address: string, addr: string) => {
    const erc20Contract = new this.web3.eth.Contract(MyERC20Abi, erc20Address);

    return await erc20Contract.methods.balanceOf(addr).call();
  };

  tokenDetails = async (erc20Address: string) => {
    if (!this.web3.utils.isAddress(erc20Address)) {
      throw new Error('Invalid token address');
    }

    const erc20Contract = new this.web3.eth.Contract(MyERC20Abi, erc20Address);

    const name = await erc20Contract.methods.name().call();
    const symbol = await erc20Contract.methods.symbol().call();
    const decimals = await erc20Contract.methods.decimals().call();

    return { name, symbol, decimals, erc20Address };
  };

  setApprovalForAllEthManger = async (
    erc20Address: string,
    sendTxCallback?: (hash: string) => void
  ) => {
    let accounts;
    if (this.useMetamask) {
      // @ts-ignore
      accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    }
    // @ts-ignore
    const erc20Contract = new this.web3.eth.Contract(MyERC20Abi, erc20Address);

    const res = await erc20Contract.methods
      .isApprovedForAll(
        this.useMetamask ? accounts[0] : this.web3.eth.defaultAccount,
        this.ethManagerAddress
      )
      .call();

    if (!res) {
      return await erc20Contract.methods
        .setApprovalForAll(this.ethManagerAddress, true)
        .send({
          from: this.useMetamask ? accounts[0] : this.web3.eth.defaultAccount,
          gas: this.gasLimit,
          gasPrice: new BN(await this.web3.eth.getGasPrice()).mul(new BN(1)),
        })
        .on('transactionHash', (hash: string) => sendTxCallback(hash));
    } else {
      sendTxCallback('skip');
    }
  };

  lockTokens = async (
    erc20Address: string,
    userAddr: string,
    amount: number | number[],
    sendTxCallback?: (hash: string) => void
  ) => {
    let accounts;
    if (this.useMetamask) {
      // @ts-ignore
      accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    }

    const hmyAddrHex = getAddress(userAddr).checksum;

    const estimateGas = await this.ethManagerContract.methods
      .lockTokens(erc20Address, amount, hmyAddrHex)
      .estimateGas({ from: this.useMetamask ? accounts[0] : this.web3.eth.defaultAccount });

    const gasLimit = Math.max(estimateGas + estimateGas * 0.3, Number(this.gasLimit));

    const transaction = await this.ethManagerContract.methods
      .lockTokens(erc20Address, amount, hmyAddrHex)
      .send({
        from: this.useMetamask ? accounts[0] : this.web3.eth.defaultAccount,
        gas: gasLimit.toFixed(0),
        gasPrice: new BN(await this.web3.eth.getGasPrice()).mul(new BN(1)),
      })
      .on('transactionHash', (hash: string) => sendTxCallback(hash));

    return transaction;
  };

  tokenDetailsERC721 = async (erc20Address: string) => {
    if (!this.web3.utils.isAddress(erc20Address)) {
      throw new Error('Invalid token address');
    }

    // @ts-ignore
    const erc20Contract = new this.web3.eth.Contract(MyERC20Abi, erc20Address);

    const name = await erc20Contract.methods.name().call();
    const symbol = await erc20Contract.methods.symbol().call();
    // const decimals = await erc20Contract.methods.decimals().call();

    return { name, symbol, erc20Address };
  };
}

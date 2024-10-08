import { NETWORK_TYPE } from "./interfaces";
import { NetworkConfig } from "./interfaces";

const numberToHex = (value: number): string => {
    return '0x' + value.toString(16);
};

export const networks: Record<NETWORK_TYPE, NetworkConfig> = {
    [NETWORK_TYPE.HARMONY]: {
        chainId: numberToHex(parseInt('1666600000', 10)),
        chainName: 'Harmony',
        name: 'Harmony',
        icon: '/one.png',
        nativeCurrency: {
            name: 'ONE',
            symbol: 'ONE',
            decimals: 18,
        },
        rpcUrls: ['https://harmony-0-rpc.gateway.pokt.network/'],
        blockExplorerUrls: ['https://explorer.harmony.one'],
        layerzero: {
            endpoint: '0x9740FF91F1985D8d2B71494aE1A2f723bb3Ed9E4',
            chainId: 116,
        },
        erc20Token: 'HRC20',
        prefix: '1'
    },
    [NETWORK_TYPE.ETHEREUM]: {
        chainId: numberToHex(parseInt('1', 10)),
        chainName: 'Ethereum Mainnet',
        name: 'Ethereum',
        icon: '/eth.svg',
        nativeCurrency: {
            name: 'ETH',
            symbol: 'ETH',
            decimals: 18,
        },
        rpcUrls: ['https://mainnet.infura.io/v3/'],
        blockExplorerUrls: ['https://etherscan.io/'],
        layerzero: {
            endpoint: '0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675',
            chainId: 101,
        },
        erc20Token: 'ERC20',
        prefix: '1'
    },
    [NETWORK_TYPE.BINANCE]: {
        chainId: numberToHex(parseInt('56', 10)),
        chainName: 'Binance Smart Chain',
        name: 'Binance',
        icon: '/binance.png',
        nativeCurrency: {
            name: 'BNB',
            symbol: 'BNB',
            decimals: 18,
        },
        rpcUrls: ['https://bsc-dataseed.binance.org/'],
        blockExplorerUrls: ['https://bscscan.com'],
        layerzero: {
            endpoint: '0x3c2269811836af69497E5F486A85D7316753cf62',
            chainId: 102,
        },
        erc20Token: 'BEP20',
        prefix: 'bsc'
    },
    [NETWORK_TYPE.ARBITRUM]: {
        chainId: numberToHex(parseInt('42161', 10)),
        chainName: 'Arbitrum One',
        name: 'Arbitrum',
        icon: '/arbitrum.png',
        nativeCurrency: {
            name: 'ETH',
            symbol: 'ETH',
            decimals: 18,
        },
        rpcUrls: ['https://arb1.arbitrum.io/rpc'],
        blockExplorerUrls: ['https://arbiscan.io/'],
        layerzero: {
            endpoint: '0x3c2269811836af69497E5F486A85D7316753cf62',
            chainId: 110,
        },
        erc20Token: 'ERC20',
        prefix: 'arb'
    },
    [NETWORK_TYPE.LINEA]: {
        chainId: numberToHex(parseInt('59144', 10)),
        chainName: 'Linea Mainnet',
        name: 'Linea',
        icon: '/linea.svg',
        nativeCurrency: {
            name: 'ETH',
            symbol: 'ETH',
            decimals: 18,
        },
        rpcUrls: ['https://rpc.linea.build'],
        blockExplorerUrls: ['https://lineascan.build'],
        layerzero: {
            endpoint: '0xb6319cC6c8c27A8F5dAF0dD3DF91EA35C4720dd7',
            chainId: 183,
        },
        erc20Token: 'ERC20',
        prefix: 'linea'
    },
    [NETWORK_TYPE.BASE]: {
        chainId: numberToHex(parseInt('8453', 10)),
        chainName: 'Base Mainnet',
        name: 'Base',
        icon: '/base.svg',
        nativeCurrency: {
            name: 'ETH',
            symbol: 'ETH',
            decimals: 18,
        },
        rpcUrls: ['https://developer-access-mainnet.base.org'],
        blockExplorerUrls: ['https://basescan.org'],
        layerzero: {
            endpoint: '0xb6319cC6c8c27A8F5dAF0dD3DF91EA35C4720dd7',
            chainId: 184,
        },
        erc20Token: 'ERC20',
        prefix: 'base'
    }
}

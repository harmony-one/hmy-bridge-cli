#!/usr/bin/env node

import { findTokenConfigByName, networks } from "./configs";

const { Command } = require('commander');
const program = new Command();

const { BridgeSDK, TOKEN, EXCHANGE_MODE } = require('.');
const configs = require('./configs');

const operationCall = async (params: {
    token: string,
    network: string,
    amount: string,
    pk: string,
    to?: string,
}) => {
    const bridgeSDK = new BridgeSDK({ logLevel: 2 }); // 2 - full logs, 1 - only success & errors, 0 - logs off

    await bridgeSDK.init(configs.mainnet);

    if (!params.pk) {
        console.error('Wrong pk')
        return
    }

    await bridgeSDK.addEthWallet(params.pk);

    const network = networks[params.network];

    if (!network) {
        console.error('Wrong network')
        return;
    }

    const tokenConfig = findTokenConfigByName(params.token, params.network);

    if (!tokenConfig) {
        console.error('Wrong token')
        return;
    }

    try {
        await bridgeSDK.sendToken(
            {
                type: EXCHANGE_MODE.ETH_TO_ONE,
                network: params.network,
                token: TOKEN.ERC20,
                amount: params.amount,
                // oneAddress: params.to,
                erc20Address: tokenConfig.erc20Address,
                hrc20Address: tokenConfig.hrc20Address
            },
            (id: any) => { }
        );
    } catch (e) {
        console.log('Error: ', e.message);
    }

    process.exit();
};

program
    .name('harmony-bridge-util')
    .description('CLI to Bridge ERC20 tokens to Harmony')
    .version('0.1.0');

program.command('send')
    .description('Send erc20 token from external chain to harmony')
    .option('-n <string>', 'network', '')
    .option('-t <string>', 'token', '')
    .option('-a <string>', 'amount', '')
    .option('-pk <string>', 'pk', '')
    .option('-to <string>', 'to', '')
    .action((options: any) => {
        // console.log(options);
        operationCall({
            token: options.t,
            amount: options.a,
            network: options.n,
            pk: options.Pk,
            // to: options.To || undefined
        });
    });

program.parse();
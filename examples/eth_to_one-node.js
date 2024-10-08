const { BridgeSDK, TOKEN, EXCHANGE_MODE, STATUS, NETWORK_TYPE } = require('..');
const configs = require('../lib/configs');

const operationCall = async () => {
  const bridgeSDK = new BridgeSDK({ logLevel: 2 }); // 2 - full logs, 1 - only success & errors, 0 - logs off

  await bridgeSDK.init(configs.mainnet);

  await bridgeSDK.addEthWallet('');

  let operationId;

  // display operation status
  let intervalId = setInterval(async () => {
    if (operationId) {
      const operation = await bridgeSDK.api.getOperation(operationId);

      /*
      console.log(operation.status);
      console.log(
        'Action: ',
        operation.actions.filter(a => a.status === STATUS.IN_PROGRESS)
      );
      */

      if (operation.status !== STATUS.IN_PROGRESS) {
        clearInterval(intervalId);
      }
    }
  }, 4000);

  try {
    await bridgeSDK.sendToken(
      {
        type: EXCHANGE_MODE.ETH_TO_ONE,
        network: NETWORK_TYPE.BASE,
        token: TOKEN.ERC20,
        amount: 0.012,
        oneAddress: '0xcDF2A6446cd43B541fC768195eFE1f82c846F953',
        ethAddress: '0xcDF2A6446cd43B541fC768195eFE1f82c846F953',
        erc20Address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
        hrc20Address: '0xC8468C26345dcC4DaE328BeFA0e8cF4Dd968BEa9'
      },
      id => (operationId = id)
    );
  } catch (e) {
    console.log('Error: ', e.message);
  }

  process.exit();
};

operationCall();

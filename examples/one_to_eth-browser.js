const { BridgeSDK, TOKEN, EXCHANGE_MODE, STATUS } = require('..');
const configs = require('../lib/configs');

const operationCall = async () => {
  const bridgeSDK = new BridgeSDK({ logLevel: 2 }); // 2 - full logs, 1 - only success & errors, 0 - logs off

  await bridgeSDK.init(configs.testnet);

  await bridgeSDK.setUseOneWallet(true);

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
        process.exit();
      }
    }
  }, 4000);

  try {
    await bridgeSDK.sendToken(
      {
        type: EXCHANGE_MODE.ONE_TO_ETH,
        token: TOKEN.BUSD,
        amount: 0.01,
        oneAddress: 'one1we0fmuz9wdncqljwkpgj79k49cp4jrt5hpy49j',
        ethAddress: '0xc491a4c5c762b9E9453dB0A9e6a4431057a5fE54',
      },
      id => (operationId = id)
    );
  } catch (e) {
    console.log('Error: ', e.message);
  }

  process.exit();
};

operationCall();

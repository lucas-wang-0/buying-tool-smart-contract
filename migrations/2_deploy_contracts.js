const args = require('../scripts/libs/args')
const KyberConfig = require('../scripts/libs/kyber_config');
var BuyToolsAgent = artifacts.require("BuyToolsAgent");
var KyberAgent = artifacts.require("KyberAgent");

function deployKyber(deployer, network) {

  let kyberNetwork = KyberConfig[network];
  if (!kyberNetwork) {
    console.error("unkown kyberNetwork address", network);
    return;
  }
  let kyberNetworkAddr = kyberNetwork.network;
  deployer.deploy(KyberAgent, kyberNetworkAddr)
}

module.exports = function (deployer, network) {

  let flags = args.parseArgs();
  switch (flags.contract) {
    case 'kyber': {
      return deployKyber(deployer, network);
    };
    case 'shapeshfit': return deployer.deploy(BuyToolsAgent);
  }
};

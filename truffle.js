var HDWalletProvider = require("truffle-hdwallet-provider");
var prompt = require('prompt-sync')();

var mnemonics = {};
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
      development: {
          host: "127.0.0.1",
          port: 7545,
          network_id: "*" // Match any network id
      },
      rinkeby: {
          provider: function() {
              mnemonics.rinkeby = mnemonics.rinkeby || prompt.hide('network rinkeby mnemonic: ');
              return new HDWalletProvider(mnemonics.rinkeby, "https://rinkeby.infura.io/qajYHKaGssZt5WrdfzGP");
          },
          network_id: 3
      }
  }
};

var HDWalletProvider = require("truffle-hdwallet-provider");
var prompt = require('password-prompt')

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
              let mnemonic = prompt('mnemonic: ')
              return new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/qajYHKaGssZt5WrdfzGP");
          },
          network_id: 3
      }
  }
};

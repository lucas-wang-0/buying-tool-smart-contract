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
              mnemonics.rinkeby = process.env.MNEMONICS || mnemonics.rinkeby || prompt('network rinkeby mnemonic: ');
              return new HDWalletProvider(mnemonics.rinkeby, "https://rinkeby.infura.io/qajYHKaGssZt5WrdfzGP");
          },
          network_id: 3
      },
      kovan: {
          provider: function() {
              mnemonics.kovan = process.env.MNEMONICS || mnemonics.kovan || prompt('network kovan mnemonic: ');
              return new HDWalletProvider(mnemonics.kovan, "https://kovan.infura.io/qajYHKaGssZt5WrdfzGP");
          },
          gasPrice:20000000000,
          network_id: 3
      },
      ropsten:{
          provider: function () {
              mnemonics.ropsten = process.env.MNEMONICS || mnemonics.ropsten || prompt('network ropsten mnemonic: ');
              return new HDWalletProvider(mnemonics.ropsten, "https://ropsten.infura.io/qajYHKaGssZt5WrdfzGP");
          },
          network_id: 3
      }
  }
};

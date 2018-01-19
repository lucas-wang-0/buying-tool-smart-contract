var BuyToolsAgent = artifacts.require("BuyToolsAgent");

var account_owner = '0x627306090abaB3A6e1400e9345bC60c78a8BEf57';
var account_customer = '0xf17f52151EbEF6C7334FAD080c5704D77216b732';

module.exports = function (callback) {
    BuyToolsAgent.deployed()
        .then(function (instance) {
            return instance.buy("em", { value: web3.toWei(0.11) });
        })
        .then(function (result) {
            for (var i = 0; i < result.logs.length; i++) {
                var log = result.logs[i];
                if (log.event == "OnBuy") {
                    console.log(
                        'from:', log.args.customer,
                        "symbol:", web3.toAscii(log.args.symbol),
                        "value:", web3.fromWei(log.args.ethMount.toNumber())
                    );
                }
            }
        })
}
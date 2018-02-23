var BuyToolsAgent = artifacts.require("BuyToolsAgent");

module.exports = function (callback) {
    BuyToolsAgent.deployed()
        .then(function (instance) {
            return instance.buy("em", { value: web3.toWei(0.03) });
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
        .catch(reason => {
            console.log(reason);
        });
}
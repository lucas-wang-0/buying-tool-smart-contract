var BuyToolsAgent = artifacts.require("BuyToolsAgent");
var ShapeShiftClient = require('../libs/shapeshfit')
var Index = require('../libs/index')

var account_owner = '0x627306090abaB3A6e1400e9345bC60c78a8BEf57';
var account_customer = '0xf17f52151EbEF6C7334FAD080c5704D77216b732';

module.exports = function (callback) {

    BuyToolsAgent.deployed()
        .then(function (instance) {

            instance.OnBuy({}, { fromBlock: 'latest', toBlock: 'latest' }, function (error, log) {

                if (error) {
                    console.error('filter:OnBuy err', error)
                    return
                }

                let amount = log.args.ethMount;

                console.info(
                    "from:", log.args.customer,
                    "symbol:", web3.toAscii(log.args.symbol),
                    "value:", web3.fromWei(amount)
                );

                let symbol = web3.toAscii(log.args.symbol);
                let pairs = Index.pairs[symbol];
                if (!pairs) {
                    console.warn("not found symbol:", symbol);
                    return
                }

                // get deposit address and limit
                ShapeShiftClient.shifts_limits(log.args.customer, pairs)
                    .then(result => {

                        let deposits = result.map(r => r.deposit);

                        let mins = result.map(r => r.limit.min);
                        let avg_amount = amount.div(result.length);
                        let amounts = result.map((r, i) => {

                            let big_limit = web3.toBigNumber(web3.toWei(r.limit.limit));
                            if (avg_amount.cmp(big_limit) == 1) {
                                return big_limit;
                            }

                            if (avg_amount.cmp(mins[i]) != 1) {
                                return 0;
                            }
                            return avg_amount;
                        });

                        console.log("deposits = ", deposits);
                        console.log("amounts = ", amounts);
                        return instance.onShapeShiftOracleResponse(log.args.customer, deposits, amounts);
                    }).then(result => {

                        for (var i = 0; i < result.logs.length; i++) {
                            var log = result.logs[i];
                            console.log(log.args);
                        }
                    })
            });
        });
}
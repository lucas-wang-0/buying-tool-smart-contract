const BuyToolsAgent = artifacts.require("BuyToolsAgent");
const ShapeShiftClient = require('../libs/shapeshift')
const Index = require('../libs/index')
const DBHelper = require('../libs/db_helper')
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

var account_owner = '0x627306090abaB3A6e1400e9345bC60c78a8BEf57';
var account_customer = '0xf17f52151EbEF6C7334FAD080c5704D77216b732';

//TODO: configurable
var dbUrl = 'mongodb://localhost:27017';
var dbName = 'shapeshift';


var eventWatchBlockColl = 'event_watch_block';

const onBuyEventName = 'onBuy';

module.exports = function (callback) {


    function listen(db) {

        DBHelper.getWatchFromBlock(db, onBuyEventName)
            .then((fromBlock) => {

                BuyToolsAgent.deployed()
                    .then(function (instance) {

                        instance.OnBuy({}, { fromBlock: fromBlock, toBlock: 'latest' }, function (error, log) {

                            if (error) {
                                console.error('filter:OnBuy err', error)
                                return
                            }

                            let amount = log.args.ethMount;
                            let blockNumber = log.blockNumber;
                            let transactionHash = log.transactionHash;
                            let logIndex = log.logIndex;
                            let symbol = web3.toAscii(log.args.symbol).replace(/\u0000/g, '');

                            console.info("new event => ", "transactionHash:", transactionHash, "blockNumber:", blockNumber, "logIndex:", 1, "from:", log.args.customer, "symbol:", symbol, "value:", web3.fromWei(amount.toNumber()));

                            DBHelper.saveWatchFromBlock(db, onBuyEventName, blockNumber)
                                .then(() => {
                                    return DBHelper.findsertEvent(db, transactionHash, log.logIndex, 'onBuy');
                                })
                                .then((event) => {

                                    if (event.status !== 'pending') {
                                        return;
                                    }

                                    let pairs = Index.pairs[symbol];
                                    if (!pairs) {
                                        console.warn("not found symbol:", symbol, "customer:", log.args.customer,"amount:",web3.fromWei(amount.toNumber()));
                                        //TODO: refund
                                        return
                                    }

                                    // get deposit address and limit
                                    return ShapeShiftClient.shifts_limits(log.args.customer, pairs)
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

                                            let logs = [];
                                            logs.push('customer:', log.args.customer);
                                            logs.push('deposits:[', deposits.join(', '),']');
                                            logs.push('amounts:[', amounts.map(a => { return web3.fromWei(a.toNumber()); }).join(', '),']');
                                            console.info("start onShapeShiftOracleResponse => ", logs.join(' '));

                                            return instance.onShapeShiftOracleResponse(log.args.customer, deposits, amounts);
                                        })
                                        .then(result => {
                                            console.log("end onShapeShiftOracleResponse => ", "transactionHash:", result.tx);
                                            if (result.receipt.status === 1) {
                                                return DBHelper.updateEventStatus(db, event._id, "success");
                                            }
                                        }).catch(reason => {
                                            console.error("handle event failed:", reason);
                                       })
                                }).catch(res => {
                                    console.error("handle event failed:", res);
                                })
                        });
                    });
            })
    };

    MongoClient.connect(dbUrl, (err, client) => {
        assert.equal(null, err);
        console.log("Connected successfully to db server");
        const db = client.db(dbName);
        listen(db)
    });
}
const KyberAgent = artifacts.require("KyberAgent");
const KyberConfig = require('../libs/kyber_config');
const args = require('../libs/args')

module.exports = function (callback, network) {

    let flags = args.parseArgs();
    let config = KyberConfig[flags["--network"]];
    if (!config) {
        console.error("not found config ", flags["--network"]);
        return;
    }

    var method = flags["method"];
    if (method === 'buy') {

        KyberAgent.deployed()
            .then((instance) => {
                return instance.buy("KOE", { value: web3.toWei(0.3) });
            })
            .then(function (result) {
                console.log(JSON.stringify(result));
            })
            .catch((reason) => {
                console.log(reason);
            })
    } else if (method === 'getPrice') {
        KyberAgent.deployed()
            .then((instance) => {
                return instance.getExpectedRate(config.tokens.KNC.address, web3.toWei(0.11));
            })
            .then(function (result) {
                result.forEach(i => { console.log(i.toNumber() / 1e18); })
            })
            .catch((reason) => {
                console.log(reason);
            })
    } else if (method === 'addShares') {
        KyberAgent.deployed()
            .then(instance => {
                return instance.addShares("KOE", [config.tokens.KNC.address, config.tokens.OMG.address, config.tokens.EOS.address], [33, 33, 34]);
            })
            .then(function (result) {
                console.log(JSON.stringify(result));
            })
            .catch((reason) => {
                console.log(reason);
            })
    } else if (method === 'getShares') {
        KyberAgent.deployed()
            .then(instance => {
                return instance.getShares("KOE");
            })
            .then(function (result) {
                console.log(JSON.stringify(result));
            })
            .catch((reason) => {
                console.log(reason);
            })
    }
    else {
        console.log("no method found, using method=buy please !");
    }
}

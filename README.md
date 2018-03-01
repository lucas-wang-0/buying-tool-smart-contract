# Buying Tool Smart Contract

This repository is the main buying tool contracts, it intergrations with others vendors to buy ERC20 tokens, currently it includes shapeshift and kyberNetwork.

## Main function

Both of the two contracts using buy function to buy tokens.
```js
function buy(bytes32 symbol)
    public
    payable
```

The `symbol` is pre-defined, eg. the symbol `KOE` is the combine of `KNC`, `OMG` and `EOS`, it will take `a` ether to buy `KNC`, `b` ether to buy `OMG` and `c` ether to buy `EOS`, and `a+b+c=msg.value`. It will send tokens to `msg.sender` if buying successful, or it will refund when failed.

## Testnet deployment

### install truffle and node packages

```
npm install -g truffle
npm install
```

### compile and deploy

```bash
truffle compile
truffle deploy
```

### deploy to rinkeby testnet

First run cmd:
```
truffle --network=rinkeby deploy
```
Then input mnemonics to continue deploy

### Listen OnBuy event

If buying token from shapeshift, we need to run a backend server, it will call shapeshift API to make order and call the contract oracle function whthin send ether to shapeshift deposit address, a database is need to maintain state. First run cmd:

```bash
truffle exec scripts/listen_on_buy.js
```

Then run follow cmd to buy, the above OnBuy event will be fire:

```bash
truffle exec scripts/shapeshift_buy.js
```

## ShapeShift version

### Tech functions

- [x] Oraclized smart contract
- [x] send ether to other address
- [x] send ERC20 token to other address

### Architecture

**work flow**

```
user               contract                                  server     ShapeShift
    <send ether>
 |----- && ---------> |
   <invoke *buy*>
                <process *buy*>
                <invoke *getRatesFromOurServer*> ------------> |
                rates data <---------------------------------- |
                <invoke *sendEthersToShapeShift*> -----------------------> |
receive tokens | <---------------------------------------------------------|
```

**main logic**

*buy* function contains main logic in the contract.

```
function buy (sender address, amount uint) {
  const tradingPairs = [...];

  // step 1
  // get rates from our ShapeShift server
  let rates = getRatesFromOurServer(tradingPairs);

  // step 2
  // verify data
  bool isValided = verifyData(rates, amount);

  // step 3
  // send ethers to ShapeShift
  sendEthersToShapeShift(tradingPairs, amount);

  // step 4
  // [this one first] ShapeShift sends ERC20 tokens to user

  // [need more logic] or sends to this Contract then we send back to user
  sendERC20TokensToUser(sender);
}
```

### KyberNetwork version

**main logic**

In the contract for the kyberNetwork, there is a function `addShare` to configure the symbol, which will setting the shares of each tokens to buy. 

```
function addShare(bytes32 _symbol, ERC20[] _sources, uint[] _shares)
```

The `buy` function call kyberNetwork's trade for each shares in the symbol.
```
function buy(symbol){
  for share in symbol:
    kyberNetwork.trade(msg.value * share)
}
```

# Index Smart Contract

# Get Start

## install truffle and ganache local testnet

```
npm install -g truffle
```

download ganache: http://truffleframework.com/ganache/

## install node packages

```
npm install
```

## compile

```
truffle compile
```

## deploy to local testnet

```
truffle deploy
```

## deploy to rinkeby testnet

first run cmd:
```
truffle --network=rinkeby deploy
```
then input mnemonics to continue deploy

## listen OnBuy event 

first run cmd:
```bash
truffle exec scripts/listen_on_buy.js
```

then run follow cmd to buy, the above OnBuy event will be fire:
```bash
truffle exec scripts/main.js
```

# index smart contract

## Stage 1 - one-source index

### ShapeShift version

#### Tech functions

- [ ] Oraclized smart contract
- [ ] send ether to other address
- [ ] send ERC20 token to other address

#### Architecture

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

<<<<<<< HEAD
# Index Smart Contract
=======
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

## deploy to testnet

```
truffle deploy
```

# index smart contract
>>>>>>> master

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

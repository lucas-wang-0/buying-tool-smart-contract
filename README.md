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

- [ ] Oraclized smart contract
- [ ] send ether to other address
- [ ] send ERC20 token to other address

### 0x version

- [ ] integrate with 0x

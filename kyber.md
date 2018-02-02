## deploy KyberAgent
```
truffle deploy --network=kovan contract=kyber
```

## add index share 
```
truffle exec --network=kovan scripts/exec/kyber_buy.js method=addShares
```

## trade
**Need add index share first**
```
truffle exec --network=kovan scripts/exec/kyber_buy.js method=buy
```

## address
contract at: https://kovan.etherscan.io/address/0x32494813687973fe9c2519f1b3bb21653a0ab35e
success tx: https://kovan.etherscan.io/tx/0x42ff6bcd34dcc61ad0b0095ca00977710d43d8d721f146b9022c258f4061785a

pragma solidity ^0.4.17;

import './ERC20Interface.sol';

contract KyberNetwork {

    function getExpectedRate(ERC20 src, ERC20 dest, uint srcQty)
        public view returns (uint expectedRate, uint slippageRate);

    function trade(
        ERC20 source,
        uint srcAmount,
        ERC20 dest,
        address destAddress,
        uint maxDestAmount,
        uint minConversionRate,
        address walletId)
        public payable returns(uint);
}

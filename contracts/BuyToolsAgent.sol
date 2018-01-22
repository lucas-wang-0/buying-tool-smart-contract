pragma solidity ^0.4.17;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';
import './Oracle.sol';

contract BuyToolsAgent is Ownable, Oracle {

    mapping(address => uint) funds;

    event OnBuy(address indexed customer, bytes symbol, uint256 ethMount);

    function BuyToolsAgent() public { }

    // customer send eth
    function buy(bytes symbol) 
    public
    payable
    {
        // TODO: check valid symbol
        funds[msg.sender] += msg.value;
        OnBuy(msg.sender, symbol, msg.value);
    }

    function refund()
    public
    {
        var fund = funds[msg.sender];
        if (fund > 0) {
            funds[msg.sender] = 0;
            msg.sender.transfer(fund);
        }
    }

    // oracle callback
    function onShapeShiftOracleResponse(address customer, address[] deposits, uint256[] amounts)
    public
    onlyOracle
    {
        require(deposits.length > 0 && deposits.length < 10);
        require(deposits.length == amounts.length);

        for (uint8 i = 0; i < deposits.length; i++) {

            if (amounts[i] == 0) {
                continue;
            }

            if (funds[customer] >= amounts[i]) {
                funds[customer] -= amounts[i];
                deposits[i].transfer(amounts[i]);
            }
        }

        var left = funds[customer];
        if (left > 0) {
            funds[customer] = 0;
            customer.transfer(left);
        }
    }
}

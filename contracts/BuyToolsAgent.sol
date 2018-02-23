pragma solidity ^0.4.17;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';
import './Oracle.sol';

contract BuyToolsAgent is Ownable, Oracle {

    mapping(address => uint) funds;

    event OnBuy(address indexed customer, bytes32 symbol, uint256 ethMount);

    function BuyToolsAgent() public { }

    // customer send eth
    function buy(bytes32 symbol)
    public
    payable
    {
        // TODO: check valid symbol
        funds[msg.sender] += msg.value;
        OnBuy(msg.sender, symbol, msg.value);
    }

    function balanceOf(address sender)
    public
    view
    returns(uint256)
    {
        return funds[sender];
    }

    function refund(address sender)
    public
    onlyOwner
    {
        var fund = funds[sender];
        if (fund > 0) {
            funds[sender] = 0;
            sender.transfer(fund);
        }
    }

    // oracle callback
    function onShapeShiftOracleResponse(address customer, address[] deposits, uint256[] amounts)
    public
    onlyOracle
    {
        require(deposits.length > 0 && deposits.length < 10);
        require(deposits.length == amounts.length);

        for (uint i = 0; i < deposits.length; i++) {

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

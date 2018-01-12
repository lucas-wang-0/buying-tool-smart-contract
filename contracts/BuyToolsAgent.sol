pragma solidity ^0.4.17;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';
import './Oracle.sol';

contract BuyToolsAgent is Ownable, Oracle {

    mapping(address => uint) funds;

    event OnBuy(address indexed customer, bytes sybmol, uint256 ethMount);

    function BuyToolsAgent() public {
    }

    // customer send eth
    function buy(bytes sybmol) 
    public
    payable
    {
        // TODO: Lock
        funds[msg.sender] = msg.value;
        OnBuy(msg.sender, sybmol, msg.value);
    }

    // oracle callback
    function onShapeShiftOracleResponse(address customer, address deposit, uint256 limit, uint256 min)
    public
    onlyOracle
    {

        require(limit > min);
        uint256 fund = funds[customer];
        require(fund > 0);

        // if fund less then min, refund
        if (fund < min) {
            funds[customer] = 0;
            customer.transfer(fund);
            return;
        }

        uint256 refund = 0;
        uint256 orderPayFund = min;

        if (fund < limit) {
            orderPayFund = fund;
        } else {
            orderPayFund = limit;
            refund = fund - limit;
        }

        // if fund great then limit, first we send limit to deposit address, then refund
        // TODO: use SafeMath
        funds[customer] = funds[customer] - orderPayFund;
        deposit.transfer(orderPayFund);

        if ( refund > 0) {
            funds[customer] = 0;
            customer.transfer(refund);
        }
        return;
    }
}

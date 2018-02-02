pragma solidity ^0.4.17;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';
import './ERC20Interface.sol';
import './KyberNetwork.sol';

contract KyberAgent is Ownable {

    ERC20 constant ETH_TOKEN_ADDRESS = ERC20(0x00eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee);
    uint constant MAX_UINT = 2**256 - 1;

    KyberNetwork kyberNetwork;

    struct Share {
        ERC20 source;
        uint8 share; // less then 100
    }
    mapping(bytes32 => Share[]) public shares; // sum of share equal 100
    bytes32[] public symbols;

    function KyberAgent(KyberNetwork _kyberNetwork)
    public
    { 
        kyberNetwork = _kyberNetwork;
    }

    function setKyberNetwork(KyberNetwork _kyberNetwork)
    public
    onlyOwner
    {
        kyberNetwork = _kyberNetwork;
    }

    function getExpectedRate(ERC20 dst,uint amount)
    public
    view
    returns (uint expectedRate, uint slippageRate)
    {
        return  kyberNetwork.getExpectedRate(ETH_TOKEN_ADDRESS, dst, amount);
    }


    event OnAddShares(bytes32 _symbol, ERC20[] _sources, uint8[] _shares);

    function addShares(
        bytes32 _symbol,
        ERC20[] _sources,
        uint8[] _shares
    )
    public
    onlyOwner
    {
        require(_sources.length < 10);
        require(_shares.length < 10);
        require(_sources.length == _shares.length);

        for (uint8 i = 0; i < symbols.length; i++) {
            require(_symbol != symbols[i]);
        }

        for (i = 0; i < _sources.length; i++) {
            require(_sources[i] != address(0));
        }

        uint8 sum = 0;
        for (i = 0; i < _shares.length; i++) {
            require(_shares[i] < 100 && _shares[i] > 0);
            sum += _shares[i];
        }
        require(sum == 100);

        symbols.push(_symbol);
        for (i = 0; i < _shares.length; i++) {
            shares[_symbol].push(Share(_sources[i],_shares[i]));
        }
        OnAddShares(_symbol, _sources, _shares);
    }
    // TODO: updateShares & deleteShares & getShares

    event OnBuy(address indexed sender, bytes32 symbol, uint srcAmount, uint[] destAmounts);

    function buy(bytes32 symbol)
    public
    payable
    {
        require(msg.value > 0);
        var ps = shares[symbol];
        require(ps.length != 0);

        uint sum = 0;
        uint expect = 0;
        uint slippage = 0;
        uint[] memory srcAmounts = new uint[](ps.length);
        uint[] memory destAmounts = new uint[](ps.length);

        for (uint8 i = 0; i < ps.length - 1; i++) {
            var amount = (msg.value * ps[i].share) / 100;
            require(amount > 0);
            srcAmounts[i] = amount;
            sum += amount;
        }
        srcAmounts[srcAmounts.length-1] = msg.value - sum;

        for (i = 0; i < srcAmounts.length; i++) {

            (expect, slippage) = kyberNetwork.getExpectedRate(ETH_TOKEN_ADDRESS, ps[i].source, srcAmounts[i]);
            require(slippage > 0);

            var destAmount = kyberNetwork.trade.value(srcAmounts[i])(
                ETH_TOKEN_ADDRESS, // source
                srcAmounts[i], // srcAmount
                ps[i].source, // dest
                msg.sender, // destAddress
                2**256 - 1, // maxDestAmount
                slippage, // minConversionRate
                address(0) // throwOnFailure
            );
            require(destAmount > 0);
            destAmounts[i] = destAmount;
        }

        OnBuy(msg.sender, symbol, msg.value, destAmounts);
    }
}

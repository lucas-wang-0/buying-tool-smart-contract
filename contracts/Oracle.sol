pragma solidity ^0.4.17;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

contract Oracle is Ownable {

	address oracle;

	function Oracle() public {
		// set default oracle
		oracle = msg.sender;
	}

	function setOracle(address newOracle) 
		public 
		onlyOwner
	{
		require(newOracle != address(0));
		oracle = newOracle;
	}

	modifier onlyOracle {
		require(msg.sender == oracle);
		_;
	}
}


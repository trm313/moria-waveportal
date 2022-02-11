import React from 'react';
import MiningSpinner from './MiningSpinner';

const lotrNames = ['Gimli', 'Frodo', 'Merry', 'Pippin', 'Legolas', 'Sam', 'Boromir', 'Aragorn'];

const TransactionConfirmation = ({ txnHash, isTxnMining }) => {
	return (
		<div className="infoSection monospace text-sm">
			{isTxnMining ? <MiningSpinner /> : (
				<p>
					Great work, {lotrNames[Math.floor(Math.random() * lotrNames.length)]}!
				</p>
			)}
			
			<div className="">
					<strong>Txn Hash: </strong>
					<a href={`https://rinkeby.etherscan.io/tx/${txnHash}`} target="__blank">
					{txnHash}
					</a>
			</div>
		</div>
	)
}

export default TransactionConfirmation;
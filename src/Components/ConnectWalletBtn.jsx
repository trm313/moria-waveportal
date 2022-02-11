import React from 'react';

const ConnectWalletBtn = ({ onSetAccount }) => {
	const connectWallet = async () => {
	try {
		const { ethereum } = window;
		if (!ethereum) {
			alert("Get MetaMask!");
			return;
		}

		const accounts = await ethereum.request({ method: "eth_requestAccounts" });

		console.log("Connected", accounts[0]);
		onSetAccount(accounts[0]);

	} catch (error) {
		console.log(error);
	}
}

	return (
		<div className="waveForm">
			<button className="waveButton" onClick={connectWallet}>
				Connect Wallet to Enter Moria
			</button>
		</div>
	)
}

export default ConnectWalletBtn;
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from "./utils/WavePortal.json";

// Components
import Header from './Components/Header';
import Gandalf from './Components/Gandalf';
import BeginnerInfo from './Components/BeginnerInfo';
import ConnectWalletBtn from './Components/ConnectWalletBtn';
import WaveCount from './Components/WaveCount';
import Waves from './Components/Waves';
import WaveAtGandalf from './Components/WaveAtGandalf';
import TransactionConfirmation from './Components/TransactionConfirmation';

// Constants
const contractAddress = "0x2d423c756Cf9eDf61f293c29a5901bd61C474949";
const contractABI = abi.abi;

// Helper Functions
// ...

export default function App() {
	const [currentAccount, setCurrentAccount] = useState("");
	const [allWaves, setAllWaves] = useState([]);
	const [totalWaveCount, setTotalWaveCount] = useState(null);
	const [isTxnMining, setIsTxnMining] = useState(false);
	const [txnHash, setTxnHash] = useState(null);
	

	const checkIfWalletIsConnected = async () => {
		try {
			const { ethereum } = window;

			if (!ethereum) {
				console.log("Make sure you have metamask!");
				return;
			} else {
				console.log("We have the ethereum object", ethereum);
			}

			/**
			 * Check if we're authorized to access the user's wallet
			 */
			const accounts = await ethereum.request({ method: "eth_accounts" });

			if (accounts.length !== 0) {
				const account = accounts[0];
				console.log("Found an authorized account: ", account);
				setCurrentAccount(account)
			} else {
				console.log("No authorized account found")
			}

		} catch (error) {
			console.log(error);
		}
		
	}

	const getTotalWaves = async () => {
		try {
			const { ethereum } = window;
			if (!ethereum) {
				console.log("Ethereum object does not exist");
				return;
			}

			const provider = new ethers.providers.Web3Provider(ethereum);
			const signer = provider.getSigner();
			const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

			let count = await wavePortalContract.getTotalWaves();
			setTotalWaveCount(count.toNumber()); 
			console.log('getTotalWaves', count.toNumber());
		} catch (error) {
			console.log(error);
		}
	}

	const getAllWaves = async () => {
		try {
			const { ethereum } = window;
			if (!ethereum) {
				console.log("Ethereum object does not exist");
				return;
			}

			const provider = new ethers.providers.Web3Provider(ethereum);
			const signer = provider.getSigner();
			const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

			const waves = await wavePortalContract.getAllWaves();

			const wavesCleaned = waves.map(wave => {
        return {
          address: wave.waver,
          timestamp: new Date(wave.timestamp * 1000),
          message: wave.message,
        };
      });

			setAllWaves(wavesCleaned);
			console.log('getAllWaves', wavesCleaned);

		} catch (error) {
			console.log(error)
		}
	}
	

  const wave = async (message) => {
    try {
			const { ethereum } = window;
			if (!ethereum) {
				console.log("Ethereum object does not exist");
				return;
			}

			const provider = new ethers.providers.Web3Provider(ethereum);
			const signer = provider.getSigner();
			const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

			// Sets minimum gas limit of 300,000 - user will be refunded for any unused gas
			const waveTxn = await wavePortalContract.wave(message, { gasLimit: 300000 });
			setIsTxnMining(true);
			setTxnHash(waveTxn.hash);

			console.log("Mining...", waveTxn.hash);
			await waveTxn.wait();
			console.log("Mined -- ", waveTxn.hash);
			setIsTxnMining(false);

		} catch (error) {
			console.log(error);
		}
  }
  
	useEffect(() => {
		checkIfWalletIsConnected();
	}, [])

	// Listen for emitter events in contract
	useEffect(() => {
		let wavePortalContract;
		const onNewWave = (from, timestamp, message) => {
			console.log("NewWave", from, timestamp, message);
			setAllWaves(prevState => [
				...prevState,
				{
					address: from,
					timestamp: new Date(timestamp * 1000),
					message: message
				}
			])
			getTotalWaves();
		}

		if (window.ethereum) {
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = provider.getSigner();

			wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
			wavePortalContract.on("NewWave", onNewWave);
		}

		return () => {
			if (wavePortalContract) {
				wavePortalContract.off("NewWave", onNewWave)
			}
		}
	}, [])

	// Once an account is connected, get the contract's data
	useEffect(() => {
		if (currentAccount) {
			getTotalWaves();
			getAllWaves();
		}
	}, [currentAccount])

  return (
    <div className="mainContainer">
			<Header />

      <div className="dataContainer">
				<Gandalf />
        {currentAccount && (
					<WaveAtGandalf onWave={wave} disabled={isTxnMining} />
				)}
				{!currentAccount && (
					<ConnectWalletBtn onSetAccount={setCurrentAccount} />
				)}
      </div>

			<div className="dataContainer">
				<WaveCount count={totalWaveCount} />
			</div>

			{ txnHash && (
					<TransactionConfirmation txnHash={txnHash} isTxnMining={isTxnMining} />
			)}

			<div className="infoSection monospace text-sm">
				<strong>Contract Address:</strong> <a href={`https://rinkeby.etherscan.io/address/${contractAddress}`} target="__blank">{contractAddress}</a>
			</div>

			<BeginnerInfo />
			
			{ allWaves.length > 0 && 
				<Waves allWaves={allWaves} />
			}
    </div>
		
  );
}

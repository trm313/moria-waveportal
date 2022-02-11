import React, { useState } from 'react';

const WaveAtGandalf = ({ onWave, disabled }) => {
	const [input, setInput] = useState("");
	const [error, setError] = useState(null);

	const submit = () => {
		if (!input) {
			setError(`Fool of a Took!\nHelp Gandalf with the password.`)
		} else {
			onWave(input);
			setInput("");
			setError(null);
		}
	}

	return (
		<div className="waveForm">
			<input 
				className="moria-password" 
				placeholder="Speak the password"
				onChange={e => setInput(e.target.value)}
				 />
			<button 
				className="waveButton" 
				onClick={() => submit()} 
				disabled={disabled}
			>
			👋 Help Gandalf
			</button>
			{ error && (<p className="error">{error}</p>) }
		</div>
	)
}

export default WaveAtGandalf;
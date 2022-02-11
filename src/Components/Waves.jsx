import React from 'react';

const Waves = ({ allWaves }) => {
	console.log(allWaves);
	return (
		<div className="infoSection">
			{allWaves.map((wave, index) => {
          return (
            <div className="waveItem" key={index}>
							<div><strong>Message:</strong> {wave.message}</div>
              <div><strong>Address:</strong> <a href={`https://rinkeby.etherscan.io/address/${wave.address}`} target="__blank">{wave.address}</a></div>
              <div><strong>Time:</strong> {wave.timestamp.toString()}</div>
            </div>)
        })}
		</div>
	)
}

export default Waves;
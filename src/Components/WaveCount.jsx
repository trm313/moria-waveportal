import React from 'react';

const WaveCount = ({ count }) => {
	if (!count) {
		return (
			<div className="text">
				Join fellow heros on a mighty quest.
			</div>
		)
	}
	
	return (
		<div className="text">
			Join {count} fellow heros on a mighty quest.
		</div>
	)
}

export default WaveCount
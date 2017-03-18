export default () => {
	const ws = new WebSocket('ws://localhost:8000/connect');
	ws.binaryType = 'arraybuffer';

	let closed = false;

	ws.onopen = () => {
		console.log('ONOPEN');
	};

	ws.onclose = () => {
		console.log('ONCLOSE');
		closed = true;
	};

	ws.onmessage = (e) => {
		const dv = new DataView(e.data);

		const numVals = dv.byteLength / 2;

		const vals = [];
		for (let i = 0; i < numVals; i += 2) {
			vals.push({
				x: dv.getInt16(i * 2, true),
				y: dv.getInt16((i + 1) * 2, true)
			});
		}

		window.drawPoints(vals);
	};

	ws.onerror = (e) => {
		console.error(e);
		closed = true;
	};

	return ws;
};

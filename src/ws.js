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

		const byteSize = 4;
		const numVals = dv.byteLength / byteSize;

		const vals = [];
		for (let i = 0; i < numVals; i += 3) {
			vals.push({
				x: dv.getInt32(i * byteSize, true),
				y: dv.getInt32((i + 1) * byteSize, true),
				color: dv.getInt32((i + 2) * byteSize, true)
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

export default class GameServer {
	constructor () {
		this.ws = new WebSocket('ws://localhost:8000/connect');
		this.ws.binaryType = 'arraybuffer';

		this.msgListener = () => {};

		this.ws.onopen = () => {
			console.log('ONOPEN');
		};

		this.ws.onclose = () => {
			console.log('ONCLOSE');
		};

		this.ws.onmessage = (e) => {
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

			this.msgListener(vals);
		};

		this.ws.onerror = (e) => {
			console.error(e);
		};
	}

	setMessageListener (fn) {
		this.msgListener = fn;
	}

	send (data) {
		this.ws.send(data);
	}
}

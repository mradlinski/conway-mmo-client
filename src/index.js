const PIXI = require('pixi.js');
import WS from './ws';
import Board from './board';
import BrushPicker from './brushPicker';

const ws = new WS();

const renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, {
	autoResize: true,
	transparent: true,
	resolution: 1
});

document.body.appendChild(renderer.view);

const brushPicker = new BrushPicker(
	document.getElementById('palette-button'),
	document.getElementById('palette'),
	document.getElementById('palette-overlay')
);
const board = new Board(renderer);
board.setStageClickListener((coords) => {
	const currentBrush = brushPicker.getCurrentBrush();

	board.drawBrushPoints(coords.x, coords.y, currentBrush);

	ws.send(JSON.stringify({
		coords: coords,
		cells: currentBrush
	}));
});

ws.setMessageListener((pts) => {
	board.drawLivingPoints(pts);
});

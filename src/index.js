const PIXI = require('pixi.js');
import WS from './ws';
import Board from './board';

const ws = WS();

const renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, {
	autoResize: true,
	transparent: true,
	resolution: 1
});

document.body.appendChild(renderer.view);

const board = new Board(renderer, ws);
board.init();

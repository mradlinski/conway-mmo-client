const PIXI = require('pixi.js');
import WS from './ws';

const ws = WS();

const GAME_SIZE = {
	x: 1000,
	y: 1000,
	grid: 20
};

const renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, {
	autoResize: true,
	transparent: true,
	resolution: 1
});

document.body.appendChild(renderer.view);

const stage = new PIXI.Container();

const resize = () => {
	const w = window.innerWidth * 4;
	const h = window.innerHeight * 4;

	renderer.view.style.width = `${w}px`;
	renderer.view.style.height = `${h}px`;

	renderer.resize(w, h);

	const ratioX = w / (GAME_SIZE.x * GAME_SIZE.grid);
	const ratioY = h / (GAME_SIZE.y * GAME_SIZE.grid);

	stage.scale.x = stage.scale.y = Math.max(ratioX, ratioY);
};

window.addEventListener('resize', resize);

resize();

stage.interactive = true;
stage.on('pointerup', (e) => {
	const coords = e.data.getLocalPosition(stage);

	const gridCoords = {
		x: Math.floor(coords.x / GAME_SIZE.grid),
		y: Math.floor(coords.y / GAME_SIZE.grid)
	};

	const cells = Array.apply(null, Array(8))
		.map(() => {
			return Array.apply(null, Array(8))
				.map(() => 0);
		});

	cells[0][2] = cells[1][2] = cells[2][2] = cells[2][1] = cells[1][0] = 1;

	ws.send(JSON.stringify({
		coords: gridCoords,
		cells
	}));
});

const drawBackground = () => {
	const bg = new PIXI.Graphics();
	bg.beginFill(256, 0.05);
	bg.drawRect(0, 0, GAME_SIZE.x * GAME_SIZE.grid, GAME_SIZE.y * GAME_SIZE.grid);
	bg.endFill();

	stage.addChild(bg);
};

const drawGrid = () => {
	const grid = new PIXI.Graphics();

	grid.lineStyle(1, 0, 0.05);

	for (let x = 0, xSize = GAME_SIZE.x; x < xSize; ++x) {
		grid.drawRect(x * GAME_SIZE.grid, 0, 0, GAME_SIZE.y * GAME_SIZE.grid);
	}

	for (let y = 0, ySize = GAME_SIZE.y; y < ySize; ++y) {
		grid.drawRect(0, y * GAME_SIZE.grid, GAME_SIZE.x * GAME_SIZE.grid, 0);
	}

	stage.addChild(grid);
};

drawBackground();
drawGrid();

// const points = new PIXI.Graphics();
// const drawPoints = () => {
// 	points.clear();

// 	for (let x = 0, xSize = GAME_SIZE.x; x < xSize; ++x) {
// 		for (let y = 0, ySize = GAME_SIZE.y; y < ySize; ++y) {
// 			if (game[x][y]) {
// 				points.beginFill(0, 1);
// 				points.drawRect(x * GAME_SIZE.grid, y * GAME_SIZE.grid, GAME_SIZE.grid, GAME_SIZE.grid);
// 				points.endFill();
// 			}
// 		}
// 	}
// };
// stage.addChild(points);

const points = new PIXI.Graphics();
const drawPoints = window.drawPoints = (filled) => {
	points.clear();

	for (let i = 0, len = filled.length; i < len; ++i) {
		var x = filled[i].x;
		var y = filled[i].y;
		points.beginFill(0, 1);
		points.drawRect(x * GAME_SIZE.grid, y * GAME_SIZE.grid, GAME_SIZE.grid, GAME_SIZE.grid);
		points.endFill();
	}
};
stage.addChild(points);

// const numNeighbours = (x, y) => {
// 	let num = 0;

// 	for (let i = -1; i <= 1; ++i) {
// 		for (let j = -1; j <= 1; ++j) {
// 			let nX = x + i;
// 			let nY = y + j;
// 			if (nX >= 0 && nX < GAME_SIZE.x && nY >= 0 && nY < GAME_SIZE.y && !(i === 0 && j === 0) && game[nX][nY] === 1) {
// 				num += 1;
// 			}
// 		}
// 	}

// 	return num;
// };

const loop = () => {
	requestAnimationFrame(() => {
		// const newGame = [];

		// for (let x = 0, xSize = GAME_SIZE.x; x < xSize; ++x) {
		// 	newGame[x] = [];
		// 	for (let y = 0, ySize = GAME_SIZE.y; y < ySize; ++y) {
		// 		let neighbours = numNeighbours(x, y);

		// 		if (game[x][y] && (neighbours < 2 || neighbours > 3)) {
		// 			newGame[x][y] = 0;
		// 		} else if (game[x][y] && (neighbours === 2 || neighbours === 3)) {
		// 			newGame[x][y] = 1;
		// 		} else if (!game[x][y] && neighbours === 3) {
		// 			newGame[x][y] = 1;
		// 		} else {
		// 			newGame[x][y] = 0;
		// 		}
		// 	}
		// }

		// game = newGame;

		// drawPoints();
		renderer.render(stage);
		setTimeout(loop, 1000);
	});
};

loop();



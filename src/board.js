const PIXI = require('pixi.js');
import CONSTS from './consts';

function Board (renderer, ws) {
	this.renderer = renderer;
	this.stage = new PIXI.Container();

	this.init = () => {
		window.addEventListener('resize', this.resize);

		this.resize();

		this.setupStageInteractions();

		this.drawBackground();
		this.drawGrid();

		this.render();
	};

	this.render = (() => {
		let rerenderRequested = false;
		return () => {
			if (rerenderRequested) {
				return;
			}

			rerenderRequested = true;
			requestAnimationFrame(() => {
				rerenderRequested = false;
				renderer.render(this.stage);
			});
		};
	})();

	this.resize = () => {
		const w = window.innerWidth;
		const h = window.innerHeight;

		renderer.view.style.width = `${w}px`;
		renderer.view.style.height = `${h}px`;

		renderer.resize(w, h);

		const ratioX = w / (CONSTS.GAME_SIZE * CONSTS.GRID_SIZE);
		const ratioY = h / (CONSTS.GAME_SIZE * CONSTS.GRID_SIZE);

		this.stage.scale.x = this.stage.scale.y = Math.max(ratioX, ratioY);

		this.render();
	};

	this.setupStageInteractions = () => {
		this.stage.interactive = true;

		let pressed = false;
		let lastPos = null;
		let totalDiff = 0;

		this.stage.on('pointerdown', (e) => {
			pressed = true;

			lastPos = e.data.global;
			console.log(lastPos);
		});

		this.stage.on('pointermove', (e) => {
			if (pressed) {
				const {
					x, y
				} = e.data.global;

				const diffX = (x - lastPos.x) * 1;
				const diffY = (y - lastPos.y) * 1;

				totalDiff += Math.abs(diffX) + Math.abs(diffY);

				lastPos = {
					x, y
				};

				if (totalDiff >= CONSTS.DRAG_THRESHOLD) {
					this.stage.x += diffX;
					this.stage.y += diffY;

					this.render();
				}
			}
		});

		this.stage.on('pointerup', (e) => {
			if (totalDiff < CONSTS.DRAG_THRESHOLD) {
				this.onStageClick(e);
			}

			pressed = false;
			lastPos = null;
			totalDiff = 0;
		});
	};

	this.onStageClick = (e) => {
		const coords = e.data.getLocalPosition(this.stage);

		const gridCoords = {
			x: Math.floor(coords.x / CONSTS.GRID_SIZE),
			y: Math.floor(coords.y / CONSTS.GRID_SIZE)
		};

		const cells = Array.apply(null, Array(8))
			.map(() => {
				return Array.apply(null, Array(8))
					.map(() => 0);
			});

		cells[0][2] = cells[1][2] = cells[2][2] = cells[2][1] = cells[1][0] = 1;

		const points = [];
		cells.forEach((cc, i) => {
			cc.forEach((c, j) => {
				if (c) {
					points.push({
						x: gridCoords.x + i,
						y: gridCoords.y + j,
						color: 0xDDDDDD
					});
				}
			});
		});

		this.drawTempPoints(points);

		ws.send(JSON.stringify({
			coords: gridCoords,
			cells
		}));
	};

	this.drawBackground = () => {
		const bg = new PIXI.Graphics();
		bg.beginFill(255, 0.05);
		bg.drawRect(0, 0, CONSTS.GAME_SIZE * CONSTS.GRID_SIZE, CONSTS.GAME_SIZE * CONSTS.GRID_SIZE);
		bg.endFill();

		this.stage.addChild(bg);
	};

	this.drawGrid = () => {
		const grid = new PIXI.Graphics();

		grid.lineStyle(1, 0, 0.05);

		for (let x = 0, xSize = CONSTS.GAME_SIZE; x < xSize; ++x) {
			grid.drawRect(x * CONSTS.GRID_SIZE, 0, 0, CONSTS.GAME_SIZE * CONSTS.GRID_SIZE);
		}

		for (let y = 0, ySize = CONSTS.GAME_SIZE; y < ySize; ++y) {
			grid.drawRect(0, y * CONSTS.GRID_SIZE, CONSTS.GAME_SIZE * CONSTS.GRID_SIZE, 0);
		}

		this.stage.addChild(grid);
	};


	const tempPoints = new PIXI.Graphics();
	this.drawTempPoints = (filled) => {
		for (let i = 0, len = filled.length; i < len; ++i) {
			var x = filled[i].x;
			var y = filled[i].y;
			tempPoints.beginFill(filled[i].color, 0.9);
			tempPoints.drawRect(x * CONSTS.GRID_SIZE, y * CONSTS.GRID_SIZE, CONSTS.GRID_SIZE, CONSTS.GRID_SIZE);
			tempPoints.endFill();
		}

		this.render();
	};
	this.stage.addChild(tempPoints);

	const points = new PIXI.Graphics();
	this.drawPoints = window.drawPoints = (filled) => {
		points.clear();
		tempPoints.clear();

		for (let i = 0, len = filled.length; i < len; ++i) {
			var x = filled[i].x;
			var y = filled[i].y;
			points.beginFill(filled[i].color, 0.9);
			points.drawRect(x * CONSTS.GRID_SIZE, y * CONSTS.GRID_SIZE, CONSTS.GRID_SIZE, CONSTS.GRID_SIZE);
			points.endFill();
		}

		this.render();
	};
	this.stage.addChild(points);

}

export default Board;

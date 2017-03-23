const PIXI = require('pixi.js');
import CONSTS from './consts';

class Board {
	constructor (renderer) {
		this.renderer = renderer;
		this.stage = new PIXI.Container();

		this.rerenderRequested = false;

		this.stageClickListener = () => {};
		this.setupStageInteractions();

		this.drawBackground();
		this.drawGrid();

		this.brushPoints = new PIXI.Graphics();
		this.livingPoints = new PIXI.Graphics();
		this.stage.addChild(this.brushPoints);
		this.stage.addChild(this.livingPoints);

		window.addEventListener('resize', () => this.resize());

		this.resize();

		this.render();
	}

	render () {
		if (this.rerenderRequested) {
			return;
		}

		this.rerenderRequested = true;
		requestAnimationFrame(() => {
			this.rerenderRequested = false;
			this.renderer.render(this.stage);
		});
	}

	resize () {
		const w = window.innerWidth;
		const h = window.innerHeight;

		this.renderer.view.style.width = `${w}px`;
		this.renderer.view.style.height = `${h}px`;

		this.renderer.resize(w, h);

		const ratioX = w / (CONSTS.GAME_SIZE * CONSTS.GRID_SIZE);
		const ratioY = h / (CONSTS.GAME_SIZE * CONSTS.GRID_SIZE);

		this.stage.scale.x = this.stage.scale.y = Math.max(ratioX, ratioY);

		this.constrainMapToScreen();
		this.render();
	}

	constrainMapToScreen () {
		if (this.stage.x > 0) {
			this.stage.x = 0;
		} else if (this.stage.x < window.innerWidth - (CONSTS.GAME_SIZE * CONSTS.GRID_SIZE * this.stage.scale.x)) {
			this.stage.x = window.innerWidth - (CONSTS.GAME_SIZE * CONSTS.GRID_SIZE * this.stage.scale.x);
		}

		if (this.stage.y > 0) {
			this.stage.y = 0;
		} else if (this.stage.y < window.innerHeight - (CONSTS.GAME_SIZE * CONSTS.GRID_SIZE * this.stage.scale.y)) {
			this.stage.y = window.innerHeight - (CONSTS.GAME_SIZE * CONSTS.GRID_SIZE * this.stage.scale.y);
		}
	}

	setupStageInteractions () {
		this.stage.interactive = true;

		let pressed = false;
		let lastPos = null;
		let totalDiff = 0;

		this.stage.on('pointerdown', (e) => {
			pressed = true;

			lastPos = e.data.global;
		});

		this.stage.on('pointermove', (e) => {
			if (pressed) {
				const {
					x,
					y
				} = e.data.global;

				const diffX = (x - lastPos.x) * 1;
				const diffY = (y - lastPos.y) * 1;

				totalDiff += Math.abs(diffX) + Math.abs(diffY);

				lastPos = {
					x,
					y
				};

				if (totalDiff >= CONSTS.DRAG_THRESHOLD) {
					this.stage.x += diffX;
					this.stage.y += diffY;

					this.constrainMapToScreen();

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
	}

	setStageClickListener (fn) {
		this.stageClickListener = fn;
	}

	onStageClick (e) {
		const coords = e.data.getLocalPosition(this.stage);

		const gridCoords = {
			x: Math.floor(coords.x / CONSTS.GRID_SIZE),
			y: Math.floor(coords.y / CONSTS.GRID_SIZE)
		};

		this.stageClickListener(gridCoords);
	}

	drawBackground () {
		const bg = new PIXI.Graphics();
		bg.beginFill(255, 0.05);
		bg.drawRect(0, 0, CONSTS.GAME_SIZE * CONSTS.GRID_SIZE, CONSTS.GAME_SIZE * CONSTS.GRID_SIZE);
		bg.endFill();

		this.stage.addChild(bg);
	}

	drawGrid () {
		const grid = new PIXI.Graphics();

		grid.lineStyle(1, 0, 0.05);

		for (let x = 0, xSize = CONSTS.GAME_SIZE; x < xSize; ++x) {
			grid.drawRect(x * CONSTS.GRID_SIZE, 0, 0, CONSTS.GAME_SIZE * CONSTS.GRID_SIZE);
		}

		for (let y = 0, ySize = CONSTS.GAME_SIZE; y < ySize; ++y) {
			grid.drawRect(0, y * CONSTS.GRID_SIZE, CONSTS.GAME_SIZE * CONSTS.GRID_SIZE, 0);
		}

		this.stage.addChild(grid);
	}

	drawPoints (gfx, points) {
		points.forEach((pt) => {
			var x = pt.x;
			var y = pt.y;
			gfx.beginFill(pt.color, 0.9);
			gfx.drawRect(x * CONSTS.GRID_SIZE, y * CONSTS.GRID_SIZE, CONSTS.GRID_SIZE, CONSTS.GRID_SIZE);
			gfx.endFill();
		});

		this.render();
	}

	drawBrushPoints (x, y, brush) {
		const pts = [];

		brush.forEach((row, i) => {
			row.forEach((cell, j) => {
				if (cell !== 0) {
					pts.push({
						x: x + i,
						y: y + j,
						color: 0xDDDDDD
					});
				}
			});
		});

		this.drawPoints(this.brushPoints, pts);
	}

	drawLivingPoints (pts) {
		this.livingPoints.clear();
		this.brushPoints.clear();

		this.drawPoints(this.livingPoints, pts);
	}
}

export default Board;

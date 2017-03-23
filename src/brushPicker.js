import _ from 'lodash';
import Brushes from './brushes';

const BRUSH_PALETTE_TEMPLATE = window.doT.template(`
<div id="palette" class="palette">
	{{~it.brushes :val:idx}}
		<div>
			<div class="brush-container">
				{{~val :row}}
					<div>
						<div class="brush-row">
							{{~row :cell}}
								<div class="brush-cell" style="{{? cell === 1}} background-color: black;{{?}}">
								</div>
							{{~}}
						</div>
					</div>
				{{~}}
			</div>
		</div>
	{{~}}
</div>
`);

class BrushPicker {
	constructor (button, palette, overlay) {
		this.currentBrushIdx = 0;

		this.brushPaletteButton = button;
		this.brushPaletteContainer = palette;
		this.brushPaletteOverlay = overlay;
		this.brushPaletteShown = false;

		this.renderBrushPalette();

		this.brushPaletteButton.onclick = () => this.showBrushPalette();
		this.brushPaletteOverlay.onclick = () => this.hideBrushPalette();
	}

	renderBrushPalette () {
		const html = BRUSH_PALETTE_TEMPLATE({
			currentBrush: this.currentBrushIdx,
			brushes: Brushes
		});
		this.brushPaletteContainer.innerHTML = html;

		_.forEach(
			this.brushPaletteContainer.getElementsByClassName('brush-container'),
			(b, idx) => {
				b.onclick = () => {
					this.setCurrentBrush(idx);
					this.hideBrushPalette();
				};
			});
	}

	toggleBrushPalette () {
		if (this.brushPaletteShown) {
			this.hideBrushPalette();
		} else {
			this.showBrushPalette();
		}
	}

	showBrushPalette () {
		this.brushPaletteContainer.classList.remove('invisible');
		this.brushPaletteContainer.classList.remove('slide-out');
		this.brushPaletteContainer.classList.add('slide-in');

		this.brushPaletteButton.classList.remove('roll-in');
		this.brushPaletteButton.classList.add('roll-out');

		this.brushPaletteOverlay.classList.remove('invisible');

		this.brushPaletteShown = true;
	}

	hideBrushPalette () {
		this.brushPaletteContainer.classList.remove('slide-in');
		this.brushPaletteContainer.classList.add('slide-out');

		this.brushPaletteButton.classList.remove('roll-out');
		this.brushPaletteButton.classList.add('roll-in');

		this.brushPaletteOverlay.classList.add('invisible');

		this.brushPaletteShown = false;
	}

	setCurrentBrush (idx) {
		this.currentBrushIdx = idx;
	}

	getCurrentBrush () {
		return Brushes[this.currentBrushIdx];
	}
}

export default BrushPicker;

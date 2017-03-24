import _ from 'lodash';
import Brushes from './brushes';

const BRUSH_PALETTE_TEMPLATE = window.doT.template(`
<div class="palette-overlay"></div>
<div class="palette-container">
	<div class="palette-rotate-button fa-stack fa-2x palette-button">
		<i class="fa fa-circle fa-stack-2x palette-button-bg"></i>
		<i class="fa fa-repeat fa-stack-1x"></i>
	</div>
	<div class="palette">
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
</div>
`);

class BrushPicker {
	constructor (button, paletteControl) {
		this.currentBrushIdx = 0;

		this.togglePaletteButton = button;
		this.paletteControl = paletteControl;

		this.renderBrushPalette();

		this.togglePaletteButton.onclick = () => this.showBrushPalette();
	}

	renderBrushPalette () {
		const html = BRUSH_PALETTE_TEMPLATE({
			currentBrush: this.currentBrushIdx,
			brushes: Brushes.list
		});
		this.paletteControl.innerHTML = html;

		this.brushPaletteShown = false;

		this.paletteControl.getElementsByClassName('palette-overlay')[0]
			.onclick = () => this.hideBrushPalette();

		this.paletteControl.getElementsByClassName('palette-rotate-button')[0]
			.onclick = () => {
				Brushes.rotateRight();
				this.renderBrushPalette();
			};

		_.forEach(
			this.paletteControl.getElementsByClassName('brush-container'),
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
		this.paletteControl.classList.remove('invisible');
		this.paletteControl.classList.remove('slide-out');
		this.paletteControl.classList.add('slide-in');

		this.togglePaletteButton.classList.remove('roll-in');
		this.togglePaletteButton.classList.add('roll-out');

		this.brushPaletteShown = true;
	}

	hideBrushPalette () {
		this.paletteControl.classList.remove('slide-in');
		this.paletteControl.classList.add('slide-out');

		this.togglePaletteButton.classList.remove('roll-out');
		this.togglePaletteButton.classList.add('roll-in');

		this.brushPaletteShown = false;
	}

	setCurrentBrush (idx) {
		this.currentBrushIdx = idx;
	}

	getCurrentBrush () {
		return Brushes.list[this.currentBrushIdx];
	}
}

export default BrushPicker;

import Konva from "konva"
import { Subject } from "rxjs"
import VisualLayer from "./VisualLayer"
import Square from './Square'

const WHITE = "#212121";
const GREY = "#222222"

export default class GridLayer extends VisualLayer {
	gridColors = [
		[WHITE, GREY],
		[GREY, WHITE]
	];

	width = 300;
	height = 300;

	layer = new Konva.Layer();
	bounds = new Subject();

  constructor() {
    super();

    this.bounds.subscribe((bounds) => {   
      this.layer.destroyChildren();
      console.log("DESTROYED");
      this.computeLayerShapes(bounds);
      console.log("COMPUTING LAYER SHAPES")
      this.layer.draw();
      console.log("DRAWING")
    })
  }

	checkBounds(stage) {

    console.log("CHECKING BOUNDS")

		const startX =
			Math.floor((-stage.x() - stage.width()) / this.width) * this.width;
		const endX =
			Math.floor((-stage.x() + stage.width() * 2) / this.width) * this.width;

		const startY =
			Math.floor((-stage.y() - stage.height()) / this.height) * this.height;
		const endY =
			Math.floor((-stage.y() + stage.height() * 2) / this.height) * this.height;

		this.bounds.next({ startX, endX, startY, endY });
	}

	computeLayerShapes({ startX, endX, startY, endY }) {
    console.log("COMPUTING LAYER SHAPES", { startX, endX, startY, endY });
		for (var x = startX; x < endX; x += this.width) {
			for (var y = startY; y < endY; y += this.height) {
				const ix =
					(x / this.width + this.gridColors.length * this.width) % this.gridColors.length;

				const iy =
					(y / this.height + this.gridColors[0].length * this.height) %
					this.gridColors[0].length;

				const square = new Square(
					x,
					y,
					this.width,
					this.height,
					this.gridColors[ix][iy]
				);
				this.layer.add(square.render());
        this.layer.add(square.renderText());
        console.log('added square at ', x, y)
			}
		}
    console.log("EXITING")
    return
	}
}

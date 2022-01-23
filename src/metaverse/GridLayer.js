import Konva from "konva";
import { Subject } from "rxjs";

const WHITE = "#ffffff"
const GREY = "#fafafa"

export default class GridLayer {
	gridColors = [
		[WHITE, GREY],
		[GREY, WHITE]
	];

	width = 300;
	height = 300;

	layer = new Konva.Layer()
  bounds = new Subject()

	checkBounds(stage) {
		const startX =
			Math.floor((-stage.x() - stage.width()) / this.width) * this.width;
		const endX =
			Math.floor((-stage.x() + stage.width() * 2) / this.width) * this.width;

		const startY =
			Math.floor((-stage.y() - stage.height()) / this.height) * this.height;
		const endY =
			Math.floor((-stage.y() + stage.height() * 2) / this.height) * this.height;

		this.bounds.next({ sx: startX, ex: endX, sy: startY, ey: endY });
	}

  computeLayerShapes() {
    const { startX, endX, startY, endY } = this.checkBounds();

    for (var x = startX; x < endX; x += this.width) {
      for (var y = startY; y < endY; y += this.height) {
        const ix =
					(x / this.width + gridColors.length * this.width) % gridColors.length;

        const iy = (y / this.height + gridColors[0].length * this.height) %
					gridColors[0].length;
      }
    }
  }

	reDraw() {
    this.layer.destroyChildren()
    this.computeLayerShapes()
    this.layer.draw()
  }
}

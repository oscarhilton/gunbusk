import Konva from "konva"
import { Subject } from "rxjs"
import VisualLayer from "./VisualLayer"
import Square from './Square'

const WHITE = "#f5f5f5";
const GREY = "#ffffff"

export default class GridLayer extends VisualLayer {
	gridColors = [
		[WHITE, GREY],
		[GREY, WHITE]
	];

	width = 300;
	height = 300;

	layer = new Konva.Layer();
	bounds = new Subject();

	constructor(startX, startY) {
		super();

		this.startX = startX;
		this.startY = startY;

		this.bounds.subscribe(async (bounds) => {
			this.layer.destroyChildren();
			await this.computeLayerShapes(bounds);
			this.layer.draw();
			console.log("DRAWING");
		});
	}

	checkBounds(stage) {
		console.log("CHECKING BOUNDS");

		const startX =
			Math.floor((-stage.x() - stage.width()) / this.width) * this.width;
		const endX =
			Math.floor((-stage.x() + stage.width() * 2) / this.width) * this.width;

		const startY =
			Math.floor((-stage.y() - stage.height()) / this.height) * this.height;
		const endY =
			Math.floor((-stage.y() + stage.height() * 2) / this.height) * this.height;

		console.log(stage.x(), stage.y());

		this.bounds.next({
			startX,
			endX,
			startY,
			endY,
			stageBoundX: stage.x() + stage.width(),
			stageBoundY: stage.y() + stage.height()
		});
	}

	async computeLayerShapes({ startX, endX, startY, endY, stageBoundX, stageBoundY }) {
		for (var x = startX; x < endX; x += this.width) {
			for (var y = startY; y < endY; y += this.height) {
				const ix =
					((x / this.width + this.gridColors.length * this.width) + this.startX) %
					this.gridColors.length;

				const iy =
					((y / this.height + this.gridColors[0].length * this.height) + this.startY) %
					this.gridColors[0].length;

					console.log(x, y, "<<<<<<")

				const square = new Square(
					x,
					y,
					this.width,
					this.height,
					this.gridColors[ix][iy]
				);

				// if(x > stageBoundX && y < stageBoundY) {
				// 	await square.getDataFromGun()
				// }
				this.layer.add(square.render());
				this.layer.add(square.renderText());
			}
		}
		return;
	}
}

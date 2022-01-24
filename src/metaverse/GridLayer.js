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
		const startX =
			Math.floor((-stage.x() - stage.width()) / this.width) * this.width;
		const endX =
			Math.floor((-stage.x() + stage.width() * 2) / this.width) * this.width;

		const startY =
			Math.floor((-stage.y() - stage.height()) / this.height) * this.height;
		const endY =
			Math.floor((-stage.y() + stage.height() * 2) / this.height) * this.height;

		console.log(stage.absolutePosition(), "stage")

		this.bounds.next({
			startX,
			endX,
			startY,
			endY,
			stage: {
				x: -stage.x(),
				w: stage.width(),
				y: -stage.y(),
				h: stage.height()
			}
		});
	}

	async computeLayerShapes({
		startX,
		endX,
		startY,
		endY,
		stage
	}) {
		for (var x = startX; x < endX; x += this.width) {
			for (var y = startY; y < endY; y += this.height) {
				const ix =
					(x / this.width + this.gridColors.length * this.width + this.startX) %
					this.gridColors.length;

				const iy =
					(y / this.height +
						this.gridColors[0].length * this.height +
						this.startY) %
					this.gridColors[0].length;

				const square = new Square(
					x,
					y,
					this.width,
					this.height,
					this.gridColors[ix][iy]
				);

				const normalizeX = (x) => ((x - startX) / this.width);
				const normalizeY = (y) => ((y - startY) / this.height);

				const isBoundedByLeftTop = (normalizeX(x + this.width) > normalizeX(stage.x - this.width)) && (normalizeY(y + this.height) > (normalizeY(stage.y - this.height)))
				const isBoundedByRightBottom = (normalizeY(stage.x + stage.w) > normalizeX(x)) && (normalizeY(y + stage.h) > (normalizeY(y)))
				
				this.layer.add(square.rect);
				this.layer.add(square.text);

				if (isBoundedByLeftTop && isBoundedByRightBottom) {
					square.getDataFromGun();
				}
			}
		}
		return;
	}
}

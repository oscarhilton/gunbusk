import Konva from "konva"
import GridLayer from "./GridLayer"

export default class Metaverse {
	constructor(container, startLat, startLng) {
		this.startLat = startLat;
		this.startLng = startLng;

		this.stage = new Konva.Stage({
			container,
			width: window.innerWidth,
			height: window.innerHeight,
			draggable: true,
			x: 0,
			y: 0
		});

    console.log(this.stage)

		this.layers = [];
		this.images = [];

		this.grid = new GridLayer();
		// this.mouse = new MouseLayer();
	}

	loadAllImages() {
		if (!this.layers.length) return;

		const allImages = this.layers.map((l) => l.images);

		for (const path of allImages) {
			const image = new Image();
			image.src = path;
			this.images.push(image);
		}

		function imageIsLoaded(image) {
			return new Promise((resolve) => {
				image.onload = () => resolve();
				image.onerror = () => resolve();
			});
		}

		return Promise.all(this.images.map(imageIsLoaded));
	}

	async init() {
    console.log("INITING !")

		await this.loadAllImages();

    console.log("CHECKING BOUNDS")
    this.grid.checkBounds(this.stage);
    this.layers.push(this.grid);
    // this.layers.add(this.mouse);

    console.log("CONSTRUCTING LAYERS")
    for (var l of this.layers) {
      this.stage.add(l.layer)
      l.layer.batchDraw()
    }

    this.stage.on('load', () => console.log("LOADED"))
		this.stage.on("dragend", this.handleDragEnd.bind(this));

    console.log("DRAWING STAGE")
    this.stage.draw();


    return this
	}

	handleDragEnd() {
    console.log("DRAG END")
		this.grid.checkBounds(this.stage);
	}
}

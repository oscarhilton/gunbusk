import Konva from "konva"
import GridLayer from "gridlayer"

export default class Metaverse {
	constructor({ startLat, startLng }) {
		this.startLat = startLat
		this.startLng = startLng

		this.stage = new Konva.Stage()

    this.layers = []
    this.images = []

    this.layers.add(new GridLayer());
    this.layers.add(new MouseLayer());
	}

  loadAllImages() {
    if (!this.layers.length) return

    const allImages = this.layers.map(l => l.images)

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

  handleDragEnd() {
    
  }

  async init() {
    await this.loadAllImages()

    this.stage.on('dragend', this.handleDragEnd)
  }
}

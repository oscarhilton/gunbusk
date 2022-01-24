import Konva from 'konva';
import { gun } from '../gun/init-gun'
export default class Square {
  constructor(x, y, width, height, fill) {
    this.rect = new Konva.Rect({
			x,
			y,
			width,
			height,
			fill,
		});

    this.text = new Konva.Text({
			x,
			y,
			text: `${x}, ${y}`
		});
  }

  async getDataFromGun() {
    const before = this.rect.fill()
    this.rect.fill('red')
    const square = await gun
      .get("public")
      .get("square")
      .get(this.x)
      .get(this.y)
      .once(r => r)

    this.data = square
    this.rect.fill(before)
  }
}
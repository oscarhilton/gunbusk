import Konva from 'konva';
import { gun } from '../gun/init-gun'
export default class Square {
  constructor(x, y, width, height, fill) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.fill = fill
    this.data = null
  }

  async getDataFromGun() {
    console.log("Getting data for: ", this.x, this.y)
    const square = await gun
      .get("public")
      .get("square")
      .get(this.x)
      .get(this.y)
      .once(r => r)

    this.data = square
    console.log(this.data, "<<<")
  }

  render() {
    return new Konva.Rect({
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      fill: this.fill
    })
  }

  renderText() {
    return new Konva.Text({
			x: this.x,
			y: this.y,
			text: `${this.x}, ${this.y}`
		});
  }
}
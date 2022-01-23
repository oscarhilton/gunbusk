import Konva from 'konva';

export default class Square {
  constructor(x, y, width, height, fill) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.fill = fill;
  }

  render() {
    console.log(this.x, this.y, this.fill, this.width, this.height);
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
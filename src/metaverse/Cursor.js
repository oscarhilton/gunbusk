import Konva from "konva";

export default () =>
	new Konva.Image({
		x: -9,
		y: -8,
		image: images[1],
		width: 28,
		height: 28,
		listening: false
	});

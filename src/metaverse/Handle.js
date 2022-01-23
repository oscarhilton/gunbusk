import Konva from "konva";

export default (text) => new Konva.Text({
	x: 18,
	y: 18,
	text,
	fontSize: 12,
	listening: false,
	fill: "#f1f1f1",
	opacity: 0.5,
	shadowEnabled: true,
	shadowOffset: { x: 1, y: 1 },
	shadowColor: "#212121",
	shadowOpacity: 0.5
});

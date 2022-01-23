import Konva from "konva"
import { Subject } from "rxjs"
import Handle from './Handle'
import Cursor from './Cursor'

export default class Pointer {
  handle
	pointerImage

  handle = Handle();
  pointerImage = Cursor();

	pointer = new Konva.Group();

  alias = new Subject();
	alive = new Subject();
	xy = new Subject();

	init() {
		// Add handle
		this.pointer.add(this.handle);
		this.pointer.add(this.pointerImage);

		this.xy.subscribe((xy) =>
			this.pointer.absolutePosition({ x: xy.x, y: xy.y })
		);
		this.alias.subscribe((name) => (this.handle = Handle(name)));
	}

	updatePosition(x, y) {
		this.xy.next({ x, y });
	}

	updateAlias(newAlias) {
		this.alias.next(newAlias);
	}

	addSelf() {
		this.layer.add(this.pointer);
	}

	removeSelf() {
		this.pointer.destroy();
	}
}

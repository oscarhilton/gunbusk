import Pointer from "./Pointer";

const DOMAIN_STATES = {
	POSITION: "position",
	CURSOR: "cursor"
};

export default class UserCursor {
	constructor(domain, alias, user) {
		this.domain = domain;
		this.alias = alias;
		this.publicKey = user.pub;
		this.domainState = this.domain.get("users").get(this.publicKey);
		this.cursor = "open";
		this.pointer = new Pointer(alias);
	}

	updateCursor(newCursor) {
		this.domainState.get(DOMAIN_STATES.CURSOR).put(newCursor);
	}

	updatePosition(x, y) {
		this.domainState.get(DOMAIN_STATES.POSITION).put({ x, y });
	}

	join() {
		console.log("Joinging! ", this.domainName);
		this.domain.get("users").set(this.publicKey);
	}

	leave() {
		console.log("leaving! ", this.domainName);
		this.pointer.removeSelf();
		this.domain.get("users").get(this.publicKey).put(null);
	}
}

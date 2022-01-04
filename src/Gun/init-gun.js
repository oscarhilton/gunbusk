const GUN_SERVER_URI = "http:localhost:8000/gun";

import Gun from "gun/gun";
import "gun/sea";
import "gun/lib/radix";
import "gun/lib/radisk";
import "gun/lib/store";
import "gun/lib/rindexed";

let gun = new Gun({
	peers: [GUN_SERVER_URI],
	axe: false,
	localStorage: false,
	radisk: true
});

let user = gun.user().recall({ sessionStorage: true });

export { gun, user }
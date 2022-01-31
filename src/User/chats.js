import { gun } from '../gun/init-gun';
import { Observable } from "rxjs";

export const chatsList = () =>
	new Observable((subscriber) => {
		gun
			.user()
			.get("chats")
			.on((chats, _) => {
				for (let publicKey in chats) {
					try {
						let chatDetails = JSON.parse(chats[publicKey]);

						if (chatDetails) {
							subscriber.next({
								roomId: chatDetails.roomId,
								pub: chatDetails.pub,
								latestMessage: chatDetails.latestMessage
							});
						}
					} catch (err) {}
				}
			});
	});

export const chatDialogue = async (roomId, callback = () => {}) => {
	await gun.user().get("messages").get(roomId).on(foo => callback(foo));
}

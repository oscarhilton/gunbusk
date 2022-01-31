import { v4 } from "uuid";
import { gun, user } from '../gun/init-gun'

export default class UserLibrary {
	static async generateFriendRequestsCertificate() {
		let certificate = await gun.user().get("certificates").get("friendRequests").once(r => r);

		if (certificate) {
			return certificate;
		}

		certificate = await SEA.certify(
			["*"],
			[{ "*": "friendRequests" }],
			await gun.user().pair(),
			null
		);

		await gun
			.user()
			.get("certificates")
			.get("friendRequests")
			.put(certificate, ({ err }) => {
				if (err) return console.warn(err);
				return certificate
			});

		return certificate;
	}

	static async generateAddFriendCertificate(publicKey) {
		let certificate = await gun.user().get("certificates").get(publicKey).get("addFriend").once(r => r);

		if (certificate) return certificate;

		certificate = await SEA.certify([publicKey], [{ "*": "friends" }], await gun.user().pair(), null);

		return await gun.user().get("certificates").get(publicKey).get("addFriend").put(
			certificate,
			({ err }) => {
				if (err) return console.warn(err);
				return certificate;
			});
	}

	static async addFriendRequest(publicKey) {
		let certificate = await gun
			.user(publicKey)
			.get("certificates")
			.get("friendRequests");

		if (!certificate) {
			return console.warn("No add friend certificate found")
		}

		await gun
			.user(publicKey)
			.get("friendRequests")
			.set(
				user.is.pub,
				({ err }) => {
					if (err) return console.warn(err);

					try {
						UserLibrary.generateAddFriendCertificate(
							publicKey,
						);
					} catch (e) {
						console.log("ERROR", e)
					}
				},
				{ opt: { cert: certificate } }
			);
	}

	static async acceptFriendRequest(key, publicKey) {

		console.log("TRYING TO ACCEPT A FRIEND OVER HERE")

		await gun.user().get("friendRequests").get(key).put(null, async ({ err }) => { if (err) return console.warn(err) });

		let certificate = await gun.user(publicKey).get("certificates").get(user.is.pub).get("addFriend");

		if (!certificate) {
			return console.warn('No AddFriend Certificate')
		}

		await gun.user(publicKey).get("friends").set(user.is.pub, async ({ err }) => { if (err) return console.warn(err) });

		await gun.user().get("friends").set(
			publicKey,
			({ err }) => { if (err) return console.warn(err) },
			{ opt: { cert: certificate } }
		);
	}

	static async createChatsCertificate(publicKey) {
		let certificate = await gun.user().get("certificates").get(publicKey).get("chats").once(r => r);

		console.log(certificate);

		if (certificate) return certificate;

		certificate = await SEA.certify([publicKey], [{ "*": "chats" }], await gun.user().pair(), null);

		await gun.user().get("certificates").get(publicKey).get("chats").put(certificate, ({ err }) => { if (err) return console.warn(err) });

		return certificate;	
	}

	static async createChat(publicKey) {
		await gun.user().get("chats").get(publicKey).once(async (chatExists) => {
				if (chatExists) return JSON.parse(chatExists);

				let friend = await gun.user(publicKey).once(r => r);
				let userPub = await gun.user().pair().pub;				

				if (!userPub) return console.warn("Could not find pub.");
				if (!friend) return console.warn("Could not find friend.");

				let chatCertificate = await gun.user(publicKey).get("certificates").get(userPub).get("chats");

				if (!chatCertificate) return console.warn("Could not find chat certificate of user.");

				let roomId = v4();

				console.log("ROOM ID!!", roomId);

				await gun.user(publicKey).get("chats").get(userPub).put(
					JSON.stringify({
						pub: userPub,
						roomId,
						latestMessage: {}
					}),
					({ err }) => { if (err) return console.warn(err) });

							gun
								.user()
								.get("chats")
								.get(publicKey)
								.put(
									JSON.stringify({
										pub: friend.pub,
										roomId,
										latestMessage: {}
									}),
									({ err }) => {
										if (err) return console.warn(err);
									},
									{ opt: { cert: chatCertificate } }
								);
						}
					);

				return roomId;
			});
	}

	static async createMessagesCertificate(publicKey) {
		let certificateExists = await gun
			.user()
			.get("certificates")
			.get(publicKey)
			.get("messages")
			.once(r => r);

		if (certificateExists) return;

		let certificate = await SEA.certify(
			[publicKey],
			[{ "*": "messages" }],
			await gun.user().pair(),
			null
		);

		gun
			.user()
			.get("certificates")
			.get(publicKey)
			.get("messages")
			.put(certificate, ({ err }) => {
				if (err)
					return {
						errMessage: err,
						errCode: "messages-certificate-creation-error",
						success: undefined
					};
				else
					return {
						errMessage: undefined,
						errCode: undefined,
						certificate,
						success: "Generated new messages certificate."
					};
			});
	}

	static async sendMessage(roomId, publicKey, message, callback = () => {}) {
		try {
			let userPub = await gun.user().pair().pub;
			let userPair = await gun.user()._.sea;
			let friend = await gun.user(publicKey);

			console.log(roomId, "ROOM ID");

			if (!userPub) return console.warn("Could not find pub.");

			let chatCertificate = await gun
				.user(publicKey)
				.get("certificates")
				.get(userPub)
				.get("chats");

			if (!chatCertificate) {
				chatCertificate = await UserLibrary.createChat(publicKey);
			}

			let messageCertificate = await gun
				.user(publicKey)
				.get("certificates")
				.get(userPub)
				.get("messages");

			if (!messageCertificate) {
				messageCertificate = await UserLibrary.createMessagesCertificate(
					publicKey
				);
			}

			let messageId = v4();
			let timeSent = Date.now();

			let secret = await SEA.secret(friend.epub, userPair);
			let encryptedMessage = await SEA.encrypt(
				JSON.stringify({
					id: messageId,
					content: message,
					timeSent,
					sender: userPub,
					type: "text"
				}),
				secret
			);

			gun
				.user()
				.get("chats")
				.get(roomId)
				.get("latestMessage")
				.put(encryptedMessage);
			gun
				.user(publicKey)
				.get("chats")
				.get(roomId)
				.get("latestMessage")
				.put(encryptedMessage, null, { opt: { cert: messageCertificate } });
			gun
				.user()
				.get("messages")
				.get(roomId)
				.set(encryptedMessage, ({ err }) => {
					if (err) return console.warn(err);

					gun
						.user(publicKey)
						.get("messages")
						.get(roomId)
						.set(encryptedMessage, ({ err }) => {
							if (err) return console.warn(err);
							return encryptedMessage;
						});
				});

			console.log(encryptedMessage, "RES");
			return encryptedMessage;
		} catch (e) {
			console.log(e);
		}
	}
}
import { v4 } from "uuid";
import { gun } from '../gun/init-gun'

export default class UserLibrary {
	static async createChatsCertificate(publicKey) {
		let certificate = await gun.user().get("certificates").get(publicKey).get("chats").once();
		if (certificate) return certificate;
    
    certificate = await SEA.certify([publicKey], [{ "*": "chats" }], await gun.user().pair(), null);

		return gun.user().get("certificates").get(publicKey).get("chats").put(
      certificate,
      ({ err }) => {
				if (err) return new Error(err);
        return certificate; 
			});
	}

	static async createChat(publicKey) {
		gun
			.user()
			.get("chats")
			.get(publicKey)
			.once(async (chatExists) => {
				if (chatExists) return JSON.parse(chatExists);

				let friend = await gun.user(publicKey).once();
				let userPub = await gun.user().pair().pub;

				if (!userPub) return new Error("Could not find pub.");
				if (!friend) return new Error("Could not find friend.");

				let chatCertificate = await gun.user(publicKey).get("certificates").get(userPub).get("chats");

        console.log(chatCertificate, "<<<<");

				if (!chatCertificate) {
          console.log("MAKING A NEW CERT FOR CHAT")
					const { certificate } = await UserLibrary.createChatsCertificate(publicKey);
					chatCertificate = certificate
				}

				let roomId = v4();

        console.log("ROOM ID!!", roomId);

        console.log(chatCertificate, "<$<$<$$<");

				await gun
					.user(publicKey)
					.get("chats")
					.get(userPub)
					.put(
						JSON.stringify({
							pub: userPub,
							roomId,
							latestMessage: {}
						}),
						({ err }) => {
							if (err) return new Error(err);

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
										if (err) return new Error(err);
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
			.once();

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

			if (!userPub) return new Error("Could not find pub.");

			let chatCertificate = await gun.user(publicKey).get("certificates").get(userPub).get("chats");

			if (!chatCertificate) {
        chatCertificate = await UserLibrary.createChat(publicKey);
      } 

      let messageCertificate = await gun
				.user(publicKey)
				.get("certificates")
				.get(userPub)
				.get("messages");

			if (!messageCertificate) {
				messageCertificate = await UserLibrary.createMessagesCertificate(publicKey);
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
				.put(
          encryptedMessage,
          null,
          { opt: { cert: messageCertificate }}
        );
			gun
				.user()
				.get("messages")
				.get(roomId)
				.set(encryptedMessage, ({ err }) => {
					if (err) return new Error(err);

					gun
						.user(publicKey)
						.get("messages")
						.get(roomId)
						.set(encryptedMessage, ({ err }) => {
							if (err) return new Error(err);
							return encryptedMessage;
						});
				});

      console.log(encryptedMessage, "RES")
      return encryptedMessage;
		} catch (e) {
			console.log(e);
		}
	}
}
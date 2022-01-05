import LocationStream from "../LocationStreaming/index";
import VideoStream from '../VideoStreaming/new-stream';
import { Subject, Observable } from "rxjs";
import { v4 } from "uuid";
import { friendRequests, friendsList } from "./friends";
import { chatsList } from './chats';
import { gun, user } from '../Gun/init-gun';
export default class User {
	constructor() {
    this.alias = new Subject();
    this.pub = new Subject();
		/**
		 * This contains a subscribable function that will return a boolean of whether or not the user is authenticated or not.
		 */
		this.isAuthenticated = new Subject();

    this.videoStream = new Subject();
		this.location = new Subject();

		// FRIENDS
		this.friendRequests = friendRequests(gun);
		this.friendsList = friendsList(gun);

		// CHATS
		this.chatsList = chatsList(gun);

    this.init();
	}

	init() {
		gun.on("auth", () => this.isAuthenticated.next(true));
    user.once(({ alias, pub, ...rest }) => {
			console.log({ alias, pub, ...rest });
			this.alias.next(alias);
      this.pub.next(pub);
		});

		user.get("certificates").once((res) => console.log(res));
  }

  initVideo(pub, send, recieve) {
    return this.videoStream.next(
			new VideoStream(gun, pub, send, recieve)
		);
    // this.location.next(new LocationStream(gun, pub));
  }

	/**
	 * This function will check and see whether the user is authenticated or not.
	 */
	checkAuth(user) {
		if (user.is) return this.isAuthenticated.next(true);
		else return this.isAuthenticated.next(false);
	}

  /**
   * This function will authenticate a user who has registered.
   *
   * @param {Object} credentials The users authentication credentials that they used when registering.
   * @param credentials.username
   * @param credentials.password
   *
   * @param {Function} callback The callback function returns error messages or a success message.
   */
  loginUser(credentials = {}, callback = () => {}) {
    user.auth(credentials.username, credentials.password, ({ err, pub }) => {
      if (err) return callback({ errMessage: err, errCode: "gun-auth-error" });
      else
        return callback({
          errMessage: undefined,
          errCode: undefined,
          pub,
          message: "Successfully authenticated user."
        });
    });
  };

	/**
	 * This function will create a user.
	 *
	 * @param {Object} credentials The users authentication credentials that they want to use when logging in.
	 * @param credentials.username
	 * @param credentials.password
	 *
	 * @param {Function} callback The callback function returns error messages or a success message.
	 */
	registerUser(credentials = {}, callback = () => {}) {
		(async () => {
			if (await this.checkUsernameInUse(credentials.username))
				return callback({
					errMessage: "Username in use.",
					errCode: "username-inuse"
				});
			else {
				user.create(
					credentials.username,
					credentials.password,
					({ err, pub }) => {
						if (err)
							return callback({ errMessage: err, errCode: "gun-auth-error" });
						else
							return callback({
								errMessage: undefined,
								errCode: undefined,
								pub,
								message: "Successfully created user."
							});
					}
				);
			}
		})();
	};

	/**
	 * This function will check to see if the email is already in use.
	 *
	 * @param {string} username
	 * @returns Promise<boolean>
	 */
	async checkUsernameInUse(username) {
		let user = await gun.get(`~@${username}`);

		return user !== undefined;
	}

	logout() {
		gun.user().leave();
		isAuthenticated.next(false);
	};

	async generateFriendRequestsCertificate(callback = () => {}) {
		let certificateExists = await gun
			.user()
			.get("certificates")
			.get("friendRequests")
			.once();

		if (certificateExists) return;

		let certificate = await SEA.certify(
			["*"],
			[{ "*": "friendRequests" }],
			await gun.user().pair(),
			null
		);

		gun
			.user()
			.get("certificates")
			.get("friendRequests")
			.put(certificate, ({ err }) => {
				if (err)
					return callback({
						errMessage: err,
						errCode: "gun-put-error",
						success: undefined
					});
				else
					return callback({
						errMessage: undefined,
						errCode: undefined,
						certificate,
						success: "Generated new friend requests certificate."
					});
			});
	}

	async generateAddFriendCertificate(publicKey, callback = () => {}) {
		let certificateExists = await gun
			.user()
			.get("certificates")
			.get(publicKey)
			.get("addFriend")
			.once();

		if (certificateExists) return;

		let certificate = await SEA.certify(
			[publicKey],
			[{ "*": "friends" }],
			await gun.user().pair(),
			null
		);

		gun
			.user()
			.get("certificates")
			.get(publicKey)
			.get("addFriend")
			.put(certificate, ({ err }) => {
				if (err)
					return callback({
						errMessage: err,
						errCode: "gun-put-error",
						success: undefined
					});
				else
					return callback({
						errMessage: undefined,
						errCode: undefined,
						certificate,
						success:
							"Generated certificate for requested friend to add user back."
					});
			});
	}

	async createChatsCertificate(publicKey, callback = () => {}) {
		let certificateExists = await gun
			.user()
			.get("certificates")
			.get(publicKey)
			.get("chats")
			.once();

		if (certificateExists) return;

		let certificate = await SEA.certify(
			[publicKey],
			[{ "*": "chats" }],
			await gun.user().pair(),
			null
		);

		gun
			.user()
			.get("certificates")
			.get(publicKey)
			.get("chats")
			.put(certificate, ({ err }) => {
				if (err)
					return callback({
						errMessage: err,
						errCode: "chats-certificate-creation-error",
						success: undefined
					});
				else
					return callback({
						errMessage: undefined,
						errCode: undefined,
						certificate,
						success: "Generated new chats certificate."
					});
			});
	}

	async createMessagesCertificate(publicKey, callback = () => {}) {
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
					return callback({
						errMessage: err,
						errCode: "messages-certificate-creation-error",
						success: undefined
					});
				else
					return callback({
						errMessage: undefined,
						errCode: undefined,
						certificate,
						success: "Generated new messages certificate."
					});
			});
	}

	async addFriendRequest(publicKey, callback = () => {}) {
		let addFriendRequestCertificate = await gun
			.user(publicKey)
			.get("certificates")
			.get("friendRequests");

		console.log(addFriendRequestCertificate, "CERT");

		gun
			.user(publicKey)
			.get("friendRequests")
			.set(
				user.is.pub,
				({ err }) => {
					if (err)
						return callback({
							errMessage: err,
							errCode: "friend-request-error",
							success: undefined
						});
					else {
						this.generateAddFriendCertificate(
							publicKey,
							({ errMessage, errCode, success }) => {
								if (errMessage)
									return callback({ errMessage, errCode, success });
								else
									return callback({
										errMessage: undefined,
										errCode: undefined,
										success: "Friend request sent successfully."
									});
							}
						);
					}
				},
				{ opt: { cert: addFriendRequestCertificate } }
			);
	}

	acceptFriendRequest({ key, publicKey }, callback = () => {}) {
		console.log(key, publicKey);
		gun
			.user()
			.get("friendRequests")
			.get(key)
			.put(null, async ({ err }) => {
				if (err)
					return callback({
						errMessage: err,
						errCode: "accept-friend-request-failed",
						success: undefined
					});
				else {
					let addFriendCertificate = await gun
						.user(publicKey)
						.get("certificates")
						.get(user.is.pub)
						.get("addFriend");

					gun
						.user(publicKey)
						.get("friends")
						.set(
							user.is.pub,
							({ err }) => {
								if (err)
									return callback({
										errMessage: err,
										errCode: "add-friend-failed",
										success: undefined
									});
								else
									gun
										.user()
										.get("friends")
										.set(publicKey, ({ err }) => {
											if (err)
												return callback({
													errMessage: err,
													errCode: "add-friend-failed",
													success: undefined
												});
											else
												return callback({
													errMessage: undefined,
													errCode: undefined,
													success: "Added friend successfully."
												});
										});
							},
							{
								opt: { cert: addFriendCertificate }
							}
						);
				}
			});
	}

	rejectFriendRequest(key, callback = () => {}) {
		gun
			.user()
			.get("friendRequests")
			.get(key)
			.put(null, async ({ err }) => {
				if (err)
					return callback({
						errMessage: err,
						errCode: "reject-friend-request-failed",
						success: undefined
					});
				else
					return callback({
						errMessage: undefined,
						errCode: undefined,
						success: "Friend request removed successfully."
					});
			});
	}

	async createChat(publicKey, callback = () => {}) {
		gun
			.user()
			.get("chats")
			.get(publicKey)
			.once(async (chatExists) => {
				if (chatExists) {
					return callback({
						errMessage: "The chat already exists. Opening it now.",
						errCode: "chat-already-exists",
						chat: JSON.parse(chatExists),
						success: undefined
					});
				}

				let friend = await gun.user(publicKey).once();

				let userPub = await gun.user().pair().pub;

				if (!userPub)
					return callback({
						errMessage: "Could not find pub.",
						errCode: "failed-to-find-pub",
						success: undefined
					});

				if (!friend)
					return callback({
						errMessage: "Could not find friend.",
						errCode: "failed-to-find-friend",
						success: undefined
					});

				let createChatsCertificate = await gun
					.user(publicKey)
					.get("certificates")
					.get(userPub)
					.get("chats");

				if (!createChatsCertificate)
					return callback({
						errMessage: "Could not find friend certificate to create chat",
						errCode: "failed-to-find-friend-chats-certificate",
						success: undefined
					});

				let roomId = v4();

				gun
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
							if (err)
								return callback({
									errMessage: err,
									errCode: "chat-creation-error",
									success: undefined
								});
							else
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
											if (err)
												return callback({
													errMessage: err,
													errCode: "chat-creation-error",
													success: undefined
												});
											else
												return callback({
													errMessage: undefined,
													errCode: undefined,
													chat: {
														pub: friend.pub,
														roomId
													},
													success: "Created a chat with friend."
												});
										}
									);
						},
						{ opt: { cert: createChatsCertificate } }
					);
			});
	}

	messageList = (roomId, pub) =>
		new Observable(async (subscriber) => {
			let userPair = await gun.user()._.sea;
			let friend = await gun.user(pub);

			gun
				.user()
				.get("messages")
				.get(roomId)
				.once((messages) => {
					(async () => {
						let initial = [];

						for (let key in messages) {
							let message = messages[key].toString();

							let decryptSecretFriend = await SEA.secret(friend.epub, userPair);
							let decryptedMessageFriend = await SEA.decrypt(
								message,
								decryptSecretFriend
							);

							if (decryptedMessageFriend) {
								let individual = {
									...decryptedMessageFriend,
									encrypted: true
								};

								let exists =
									initial.filter(
										(current) => current.id === individual.id
									)[0] !== undefined;

								console.log(exists);

								if (!exists) initial.push(individual);
							}
						}

						subscriber.next({ initial, individual: undefined });

						gun
							.user()
							.get("messages")
							.get(roomId)
							.map()
							.once(async (message) => {
								if (message.toString().startsWith("SEA")) {
									let decryptSecretFriend = await SEA.secret(
										friend.epub,
										userPair
									);
									let decryptedMessageFriend = await SEA.decrypt(
										message,
										decryptSecretFriend
									);

									if (decryptedMessageFriend) {
										let individual = {
											...decryptedMessageFriend,
											encrypted: true
										};

										let exists =
											initial.filter(
												(current) => current.id === individual.id
											)[0] !== undefined;

										if (!exists)
											return subscriber.next({
												initial: undefined,
												individual
											});
									}
								}
							});
					})();
				});
		});

  sendMessage(roomId, publicKey, message, callback = () => {}) {
    (async (callback = () => {}) => {
      let userPub = await gun.user().pair().pub;
      let userPair = await gun.user()._.sea;
      let friend = await gun.user(publicKey);

      if (!userPub)
        return callback({
          errMessage: "Could not find pub.",
          errCode: "failed-to-find-pub",
          success: undefined,
        });

      let createMessagesCertificate = await gun
        .user(publicKey)
        .get("certificates")
        .get(userPub)
        .get("messages");

      if (!createMessagesCertificate)
        return callback({
          errMessage: "Could not find friend certificate to create message",
          errCode: "failed-to-find-friend-messages-certificate",
          success: undefined,
        });

      let updateMetaCertificate = await gun
        .user(publicKey)
        .get("certificates")
        .get(userPub)
        .get("chats");

      if (!updateMetaCertificate)
        return callback({
          errMessage: "Could not find friend certificate to add meta to chat",
          errCode: "failed-to-find-friend-chats-certificate",
          success: undefined,
        });

      let messageId = v4();
      let timeSent = Date.now();

      let secret = await SEA.secret(friend.epub, userPair);
      let encryptedMessage = await SEA.encrypt(
        JSON.stringify({
          id: messageId,
          content: message,
          timeSent,
          sender: userPub,
          type: "text",
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
        .put(encryptedMessage, null, { opt: { cert: updateMetaCertificate } });

      gun
        .user()
        .get("messages")
        .get(roomId)
        .set(encryptedMessage, ({ err }) => {
          if (err)
            return callback({
              errMessage: err,
              errCode: "message-creation-error",
              success: undefined,
            });
          else
            gun
              .user(publicKey)
              .get("messages")
              .get(roomId)
              .set(
                encryptedMessage,
                ({ err }) => {
                  if (err)
                    return callback({
                      errMessage: err,
                      errCode: "message-creation-error",
                      success: undefined,
                    });
                  else
                    return callback({
                      errMessage: undefined,
                      errCode: undefined,
                      success: "Created a message with friend.",
                    });
                },
                { opt: { cert: createMessagesCertificate } }
              );
        });
    })(callback);
  };
}
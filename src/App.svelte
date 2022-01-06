<script>
	import { Router, Route, Link, navigate } from "svelte-navigator";
	import { fade } from 'svelte/transition';

	import LiveStream from './LiveStream.svelte';
	import LoginFrom from './LoginForm.svelte';
	import AddFriend from './AddFriend.svelte';
	import Contract from './Contract.svelte';
	import ChatRoom from './ChatRoom.svelte';
	import FriendsList from './FriendsList.svelte'; 
	import Gravatar from 'svelte-gravatar'

	// Icons
	import Icon from 'svelte-icons-pack/Icon.svelte';
  import ImFilm from 'svelte-icons-pack/im/ImFilm';
	import ImKey from 'svelte-icons-pack/im/ImKey';

	export let client;
	export let user;
	export let url = "";

	console.log(client);

	const login = (username, password) => {
		client.loginUser({ username, password }, (payload) => console.log(payload));
	};

	const register = (username, password) => {
		client.registerUser({ username, password }, (payload) => console.log(payload));
	}

	let isAuthed;
	client.isAuthenticated.subscribe(x => isAuthed = x);

	let alias;
	client.alias.subscribe(x => alias = x);

	let pub;
	client.pub.subscribe(x => pub = x);

	let fr = {};
	client.friendRequests.subscribe(x => {
		if (x && x.alias) {
			Object.assign(fr, {[x.alias]: x });
			fr = fr;
		}
	});

	let fl = {};
	client.friendsList.subscribe(x => {
		if (x && x.alias) {
			Object.assign(fl, {[x.alias]: x });
			fl = fl;
		}
	});

	const acceptFriendRequest = (pub) => {
		client.acceptFriendRequest({ key: fr.key, publicKey: fr.pub });
	}

	let chatReady = false;
	const startChat = async (pub) => {
		await client.createChatsCertificate(pub, ({ success: gotCert, ...rest }) => {
			if (!gotCert) return console.log(rest);
		})
		console.log(chatReady)
		await client.createMessagesCertificate(pub);
		await client.checkChatCertificate(pub, user.is.pub, ({ success }) => {
			client.createChat(pub, ({ success, ...rest }) => {
				if (!success) return console.log(rest);
				console.log("going to chat!")
				return navigate('/chat')
			})
		});
	}

</script>

<Router url="{url}">
  <header class="navigation">
		<div class="user">
			{#if pub}
				<div class="keys">
					<div class='icon'>
						<Icon src={ImKey} size="1em" />
					</div>
					<Gravatar email={pub} default="identicon" />
				</div>
				 {alias}
			{/if}
		</div>
    <!-- <nav>
      <Link to="/"><Icon src={ImFilm} size="2em" /></Link>
      <Link to="login"><Icon src={ImFilm} size="2em" /></Link>
      <Link to="stream"><Icon src={ImFilm} size="2em" /></Link>
      <Link to="chat"><Icon src={ImFilm} size="2em" /></Link>
    </nav> -->
  </header>

  <main style="height: calc(100% - 50px)">
		<aside>
				<FriendsList friendsList={fr} excludeFrom={{}} action={acceptFriendRequest} actionText="accept" />
				<FriendsList friendsList={fl} excludeFrom={fr} action={startChat} actionText="Chat now!" />
		</aside>
		<section>
			<Route path="/">
				<div transition:fade={{ duration: 250 }} style="height: 100%">
					{#if isAuthed && alias }
					Hello world!
					{:else}
					<h3>Login</h3>
					<LoginFrom onSubmit={login} />
					<h3>Register</h3>
					<LoginFrom onSubmit={register} />
					{/if}
				</div>
			</Route>

			<Route path="stream">
				<div transition:fade={{ duration: 250 }} style="height: 100%">
					<LiveStream pub={pub} client={client} />
				</div>
			</Route>

			<Route path='chat'>
				<ChatRoom chatReady={chatReady} chatsList={client.chatsList} sendMessage={client.sendMessage} messageList={client.messageList} />
			</Route>
		</section>
		<!-- <aside>
			<Contract sender="User" onSign={acceptFriendRequest} />
			<AddFriend client={client} />
		</aside> -->
  </main>
</Router>

<style>
	:global(body) {
		padding: 0;
		margin: 0;
		background: #f6f6f6;
		color: #212121;
		min-height: 100vh;
	}

	main {
		display: flex;
	}

	aside {
		min-width: 250px;
		max-width: 250px;
		background: rgba(255, 255, 255, 0.1);
	}

	section {
		width: 100%;
	}

	.user {
		display: flex;
		align-items: center;
	}

	.keys {
		position: relative;
		margin-right: 30px;
		border-radius: 50%;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.keys:hover > .icon {
		opacity: 1;
	}

	.icon {
		position: absolute;
		width: 30px;
		height: 30px;
		margin: auto;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		background: white;
		z-index: 1;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		opacity: 0;
	}

	.navigation {
	}
</style>
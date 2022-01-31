<script>
	import { Router, Route, Link, navigate } from "svelte-navigator";
	import { fade } from 'svelte/transition';
	import Gravatar from 'svelte-gravatar'


	import LiveStream from './LiveStream.svelte';
	import LoginFrom from './LoginForm.svelte';
	import AddFriend from './AddFriend.svelte';
	import Contract from './Contract.svelte';
	import ChatRoom from './ChatRoom.svelte';
	import FriendRequests from './FriendRequests.svelte';
	import FriendsList from './FriendsList.svelte';
	import ChatsList from './ChatsList.svelte';
	import Explore from './Explore.svelte';
	import Profile from './Profile.svelte';

	// Icons
	import Icon from 'svelte-icons-pack/Icon.svelte';
  import ImFilm from 'svelte-icons-pack/im/ImFilm';
	import ImKey from 'svelte-icons-pack/im/ImKey';

	import { gun } from './gun/init-gun'

	export let client;
	export let user;
	export let url = "";

	const login = (username, password) => {
		client.loginUser({ username, password }, (payload) => console.log(payload));
	};

	const register = (username, password) => {
		client.registerUser({ username, password }, (payload) => console.log(payload));
	}

	$: store = {
		isAuthed: false,
		alias: null,
		pub: null,
	}

	client.isAuthenticated.subscribe(x => store.isAuthed = x);
	client.alias.subscribe(x => store.alias = x);
	client.pub.subscribe(x => store.pub = x);
	

	// console.log(client, "FOOBAR")

	const acceptFriendRequest = (pub, key) => {
		client.acceptFriendRequest({ key: key, publicKey: pub });
	}

	let chatReady = false;
	const startChat = async (pub) => {
		await client.createChatsCertificate(pub, ({ success: gotCert, ...rest }) => {
			if (!gotCert) return console.log(rest);
		})
		await client.createMessagesCertificate(pub);
		client.createChat(pub, ({ success, ...rest }) => {
			if (!success) return console.log(rest);
			console.log("going to chat!")
			return navigate('/chat')
		})
	}

</script>

<Router url="{url}">
  <header class="navigation">
		<div class="user">
			{#if store.pub}
					<div class="keys">
						<div class='icon'>
							<button>
								<Icon src={ImKey} size="1em" />
							</button>
						</div>
						<Gravatar email={store.pub} default="identicon" />
					</div>
					<div>
						{store.alias}
						<span>{store.pub}</span>
					</div>
			{/if}
		</div>
    <nav>
      <Link to="/">home</Link>
      <Link to="login">login</Link>
			{#if store.pub}
				<Link to="stream">stream</Link>
				<Link to="chat">chat</Link>
				<Link to="explore">explore</Link>
				<Link to="profile">profile</Link>
			{/if}
    </nav>
  </header>

  <main style="height: calc(100% - 50px)">
		<aside>
				<FriendRequests />
				<FriendsList />
				<ChatsList />
		</aside>
		<section>
			<Route path="login">
				<div transition:fade={{ duration: 250 }} style="height: 100%">
					hello world
					{#if !store.pub }
						<h3>Login</h3>
						<LoginFrom onSubmit={login} />
						<h3>Register</h3>
						<LoginFrom onSubmit={register} />
					{/if}
				</div>
			</Route>

			<!-- <Route path="stream">
				<div transition:fade={{ duration: 250 }} style="height: 100%">
					<LiveStream pub={pub} client={client} />
				</div>
			</Route>

			<Route path='chat'>
				<ChatRoom chatReady={chatReady} chatsList={client.chatsList} sendMessage={client.sendMessage} messageList={client.messageList} />
			</Route>

			<Route path='explore'>
				<Explore chatReady={chatReady} chatsList={client.chatsList} sendMessage={client.sendMessage} messageList={client.messageList} />
			</Route>

			<Route path='profile'>
				<Profile client={client} publicKey={pub} />
			</Route> -->
		</section>
		<aside>
			<!-- <Contract sender="User" onSign={acceptFriendRequest} /> -->
			<AddFriend client={client} />
		</aside>
  </main>
</Router>

<style>
	:global(body) {
		padding: 0;
		margin: 0;
		color: #212121;
		min-height: 100vh;
		font-family: 'Work Sans', sans-serif;
		/* background: #212121; */
	}

	:global(h1) {
		font-size: 3em;
	}

	main {
		display: flex;
	}

	aside {
		min-width: 250px;
		max-width: 250px;
	}

	.logo {
		width: 100px;
	}

	.logo > svg {
		width: 100%;
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
		margin-right: 20px;
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
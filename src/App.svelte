<script>
	import { Router, Route, Link, navigate } from "svelte-navigator";
	import { fade } from 'svelte/transition';

	import LiveStream from './LiveStream.svelte';
	import LoginFrom from './LoginForm.svelte';
	import AddFriend from './AddFriend.svelte';
	import Contract from './Contract.svelte';
	import ChatBubble from './ChatBubble.svelte';
	import ChatFeedMessage from './ChatFeedMessage.svelte';

	// Icons
	import Icon from 'svelte-icons-pack/Icon.svelte';
  import ImFilm from 'svelte-icons-pack/im/ImFilm';

	export let client;
	export let user;

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

	let fr;
	client.friendRequests.subscribe(x => fr = x);
	console.log(pub, fr);

	let fl;
	client.friendsList.subscribe(x => fl = x);

	const acceptFriendRequest = () => {
		client.acceptFriendRequest({ key: fr.key, publicKey: fr.pub });
	}

	const startChat = async () => {
		await client.createChatsCertificate(fl.pub, ({ success: gotCert, ...rest }) => {
			if (!gotCert) return console.log(rest);
		})
	client.createChat(fl.pub, ({ success, ...rest }) => {
		if (!success) return console.log(rest);
		console.log("going to chat!")
		return navigate('/chat')
	})
}

</script>

<Router basepath="/">
  <footer class="navigation">
    <nav>
      <Link to="/"><Icon src={ImFilm} size="2em" /></Link>
      <Link to="login"><Icon src={ImFilm} size="2em" /></Link>
      <Link to="stream"><Icon src={ImFilm} size="2em" /></Link>
      <Link to="chat"><Icon src={ImFilm} size="2em" /></Link>
    </nav>
  </footer>

  <main style="height: calc(100% - 50px)">
    <Route path="/">
			<div style="max-width: 1000px; margin: auto">
				<ChatBubble message="Hello world!" />
				<ChatBubble message="Hello world!" />
				<ChatBubble message="Hello world!" />
				<ChatBubble message="Hello world!" />
				<ChatFeedMessage />
				<ChatBubble message='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque id nisl sit amet ligula ornare blandit in luctus nibh. Curabitur venenatis elit odio, in sagittis quam ornare id. Vestibulum ultricies ultricies augue, et lacinia dui tincidunt et. Praesent bibendum orci odio, et scelerisque odio placerat vel. Nulla varius urna sodales lectus consequat, nec eleifend nulla dapibus. Nam purus enim, eleifend sit amet vulputate non, dictum et risus. Suspendisse enim nisi, fermentum sed ullamcorper eget, efficitur in libero. Cras posuere sed lacus non semper. Pellentesque lacinia nibh sit amet est pretium fringilla. Cras arcu ante, feugiat non gravida non, finibus eu urna.' />
				<ChatBubble message="Hello world!" />
				<ChatBubble message="Hello world!" />
				<ChatBubble message="Hello world!" />
				<ChatBubble message="Hello world!" />
				<ChatBubble message="Hello world!" />
				<ChatBubble message="Hello world!" />
			</div>

			{#if isAuthed && alias }
      <h1>Hello! {alias}!</h1>

			<Contract sender="User" onSign={acceptFriendRequest} />

			{#if fr}
			{fr.alias}
			<button on:click={acceptFriendRequest}>Accept</button>
			{/if}
			<pre>{pub}</pre>

			<h2>Friends online</h2>
			{#if fl}
			{fl.alias}
			<button on:click={startChat}>Start chat</button>
			{/if}
			<AddFriend client={client} />

			{:else}
			<h3>Login</h3>
			<LoginFrom onSubmit={login} />
			<h3>Register</h3>
			<LoginFrom onSubmit={register} />
			{/if}
    </Route>

    <Route path="stream">
			<div transition:fade={{ duration: 250 }} style="height: 100%">
				<LiveStream pub={pub} client={client} />
			</div>
    </Route>

		<Route path='chat'>
			THIS IS A CHAT ROOM!
			<ChatBubble message="Hello world!" />
			<ChatBubble message="Hello world!" />
			<ChatBubble message="Hello world!" />
			<ChatBubble message="Hello world!" />
			<ChatBubble message='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque id nisl sit amet ligula ornare blandit in luctus nibh. Curabitur venenatis elit odio, in sagittis quam ornare id. Vestibulum ultricies ultricies augue, et lacinia dui tincidunt et. Praesent bibendum orci odio, et scelerisque odio placerat vel. Nulla varius urna sodales lectus consequat, nec eleifend nulla dapibus. Nam purus enim, eleifend sit amet vulputate non, dictum et risus. Suspendisse enim nisi, fermentum sed ullamcorper eget, efficitur in libero. Cras posuere sed lacus non semper. Pellentesque lacinia nibh sit amet est pretium fringilla. Cras arcu ante, feugiat non gravida non, finibus eu urna.' />
			<ChatBubble message="Hello world!" />
			<ChatBubble message="Hello world!" />
			<ChatBubble message="Hello world!" />
			<ChatBubble message="Hello world!" />
			<ChatBubble message="Hello world!" />
			<ChatBubble message="Hello world!" />
		</Route>
  </main>
</Router>

<style>

	:global(body) {
		padding: 0;
		margin: 0;
		background: #212121;
		color: white;
		min-height: 100vh;
	}
	.navigation {
		height: 50px;
		background: white;
	}
</style>
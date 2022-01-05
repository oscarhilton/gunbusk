<script>
	import { Router, Route, Link } from "svelte-navigator";
	import { fade } from 'svelte/transition';

	import LiveStream from './LiveStream.svelte';
	import LoginFrom from './LoginForm.svelte';
	import AddFriend from './AddFriend.svelte';

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

</script>

<Router>
  <footer class="navigation">
    <nav>
      <Link to="/"><Icon src={ImFilm} size="2em" /></Link>
      <Link to="login"><Icon src={ImFilm} size="2em" /></Link>
      <Link to="stream"><Icon src={ImFilm} size="2em" /></Link>
    </nav>
  </footer>

  <main style="height: calc(100% - 50px)">
    <Route path="/">
			{#if isAuthed && alias }
      <h1>Hello! {alias}!</h1>


			{#if fr}
			{fr.alias}
			<button on:click={acceptFriendRequest}>Accept</button>
			{/if}
			<pre>{pub}</pre>

			<h2>Friends online</h2>
			{#if fl}
			{fl.alias}
			<button>Start chat</button>
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
  </main>
</Router>

<style>

	:global(body) {
		padding: 0;
		margin: 0;
		background: #f5f5f5;
		min-height: 100vh;
	}
	.navigation {
		height: 50px;
		background: white;
	}
</style>
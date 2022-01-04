<script>
	import { Router, Route, Link } from "svelte-navigator";
	import LiveStream from './LiveStream.svelte';
	import LoginFrom from './LoginForm.svelte';
	import { fade } from 'svelte/transition';

	export let client;

	console.log(client);

	const login = (username, password) => {
		client.loginUser({ username, password }, (payload) => console.log(payload));
	};

	let isAuthed;
	client.isAuthenticated.subscribe(x => isAuthed = x);

	let alias;
	client.alias.subscribe(x => alias = x);

	let pub;
	client.pub.subscribe(x => pub = x);

	console.log(pub)

</script>

<Router>
  <footer class="navigation">
    <nav>
      <Link to="/">Home</Link>
      <Link to="login">Login</Link>
      <Link to="stream">Live</Link>
    </nav>
  </footer>

  <main style="height: calc(100% - 50px)">
    <Route path="/">
			{#if isAuthed && alias }
      Hello! {alias}!
			{:else}
			<LoginFrom onSubmit={login} />
			{/if}
    </Route>

    <Route path="stream">
			<div transition:fade={{ duration: 250 }} style="height: 100%">
				<LiveStream client={client} />
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
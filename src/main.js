import App from './App.svelte';
import { gun, user } from './gun/init-gun';
import User from './User';

let client = new User();

const app = new App({
	target: document.body,
	props: { gun, client, user }
});

export default app;
import App from './App.svelte';
import gun from './Gun/init-gun';

const app = new App({
	target: document.body,
	props: { gun }
});

export default app;
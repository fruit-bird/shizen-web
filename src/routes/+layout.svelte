<script>
	import '../app.pcss';
	import { ModeWatcher } from 'mode-watcher';
	import ModeToggle from '$lib/components/ui/ModeToggle.svelte';
</script>

<nav>
	<ul>
		<li><a href="/">Home</a></li>
		<li><a href="/about">About</a></li>
		<li><a href="/settings">Settings</a></li>
	</ul>
</nav>

<ModeWatcher />
<ModeToggle />

<slot />

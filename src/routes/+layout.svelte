<script lang="ts">
	import '../app.pcss';
	import { ModeWatcher } from 'mode-watcher';
	import ModeToggle from '$lib/components/ui/ModeToggle.svelte';
	import { FloatingNavbar } from '$lib/components/ui/floating-navbar';
	import { Settings, Home } from 'lucide-svelte';
	import Messages from '$lib/Messages.svelte';

	const navItems = [
		{ name: 'Home', link: '/', icon: Home },
		{ name: 'About', link: '/about' },
		{ name: 'Settings', link: '/settings', icon: Settings }
	];
</script>

<div>
	<FloatingNavbar {navItems} />
	<ModeWatcher />
	<ModeToggle />

	<main>
		<slot />
		<Messages />
	</main>

	<footer></footer>
</div>

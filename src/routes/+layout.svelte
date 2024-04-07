<script>
	import '../app.pcss';
	import { ModeWatcher } from 'mode-watcher';
	import ModeToggle from '$lib/components/ui/ModeToggle.svelte';
	import { FloatingNavbar } from '$lib/components/ui/floating-navbar';
	import { Settings } from 'lucide-svelte'

	const navItems = [
		{ name: 'Home', link: '/' },
		{ name: 'About', link: '/about' },
		{ name: 'Settings', link: '/settings', icon: Settings }
	];
</script>

<FloatingNavbar {navItems} />

<ModeWatcher />
<ModeToggle />

<slot />

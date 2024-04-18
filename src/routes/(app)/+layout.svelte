<script lang="ts">
	import '$lib/../app.pcss';
	import { ModeWatcher } from 'mode-watcher';
	import ModeToggle from '$lib/components/ui/ModeToggle.svelte';
	import { FloatingNavbar } from '$lib/components/ui/floating-navbar';
	import { Home, Settings } from 'lucide-svelte';
	import Messages from '$lib/Messages.svelte';
	import MusicPlayer from '$lib/components/music-player/MusicPlayer.svelte';
	import { audioData } from '$lib/components/music-player/audioData';

	const navItems = [
		{ name: 'Home', link: '/', icon: Home },
		{ name: 'About', link: '/about' },
		{ name: 'Settings', link: '/settings', icon: Settings },
		{ name: 'Login', link: '/login' }
	];
</script>

<div>
	<ModeWatcher />
	<header class="fixed top-0 z-10 w-full bg-gray-700 shadow-md">
		<ModeToggle class="absolute right-0 top-0 m-4" />
	</header>
	<FloatingNavbar {navItems} />

	<main class="container mx-auto mt-16 flex">
		<div class="w-[80%]">
			<slot class="fixed inset-0 overflow-auto" />
		</div>
		<!-- <Messages class="fixed right-0 top-0 m-4 h-full w-[20%] rounded-md border p-3" /> -->
		<div class="fixed right-0 top-0 h-full w-[20%] overflow-auto">
			<Messages class="h-full rounded-md border p-3" />
		</div>
	</main>
	<MusicPlayer src={audioData[1].audio_file} title={audioData[1].title} artist="your mother" />

	<footer></footer>
</div>

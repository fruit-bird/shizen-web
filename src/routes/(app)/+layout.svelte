<script lang="ts">
	import '$lib/../app.pcss';
	import { ModeWatcher } from 'mode-watcher';
	import Messages from '$lib/Messages.svelte';
	import MusicPlayer from '$lib/components/music-player/MusicPlayer.svelte';
	import { NavBar } from '$lib/components/nav';

	export let data;	
	const navItems = [
		{ title: 'Social', href: '/' },
		{ title: 'Explore', href: '/explore' },
		{ title: 'Marketplace', href: '/marketplace' },
		{ title: 'My Library', href: `${data.user ? `/user/${data.user.username}` : '/login'}` }
	];
</script>

<div class="flex min-h-screen flex-col">
	<ModeWatcher />
	<header class="fixed top-0 z-10 w-full">
		<NavBar user={data.user} {navItems} />
	</header>
	<main class="mt-16 flex flex-grow">
		<div class="flex-grow overflow-auto">
			<slot />
		</div>
		<div class="fixed bottom-16 right-0 top-20 w-[20%] overflow-hidden">
			<Messages class="h-full rounded-md border p-3" user={data.user} />
		</div>
	</main>
	<MusicPlayer user={data.user} />
	<footer></footer>
</div>

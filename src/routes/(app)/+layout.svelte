<script lang="ts">
	import '$lib/../app.pcss';
	import { ModeWatcher } from 'mode-watcher';
	import Messages from '$lib/Messages.svelte';
	import MusicPlayer from '$lib/components/music-player/MusicPlayer.svelte';
	import { NavBar } from '$lib/components/nav';

	export let data;

	const { currentSongId } = data;
	const navItems = [
		{ title: 'Social', href: '/' },
		{ title: 'Explore', href: '/explore' },
		{ title: 'Marketplace', href: '/marketplace' },
		{ title: 'My Library', href: `${data.user ? `/user/${data.user.username}` : '/login'}` }
	];
</script>

<div>
	<ModeWatcher />
	<header class="fixed top-0 z-10 w-full">
		<NavBar user={data.user} {navItems} />
	</header>

	<main class="container mx-auto mt-16 flex">
		<div>
			<slot class="fixed inset-0 overflow-auto" />
		</div>
		<div class="fixed right-0 top-0 h-full w-[20%] overflow-auto">
			<!-- <Messages class="h-full rounded-md border p-3" /> -->
		</div>
	</main>
	<MusicPlayer songId={currentSongId} />

	<footer></footer>
</div>

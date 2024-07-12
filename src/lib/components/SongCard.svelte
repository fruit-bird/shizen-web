<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { audioStore } from '$lib/stores/audioStore';
	import { cn, getImageURL } from '$lib/utils';
	import { PlusCircle } from 'lucide-svelte';
	import type { RecordModel } from 'pocketbase';
	// import { currentSongId } from '$lib/pocketbase';

	let className: string | undefined = 'w-[250px]';
	export { className as class };
	export let currentSongId: string;
	export let aspectRatio: 'portrait' | 'square' = 'square';
	export let width = 250;
	export let height = 330;
	export let song: RecordModel;

	let artistUsernames = song.expand?.artists.map((artist: RecordModel) => artist.username);

	// async function addToQueue() {
	// 	try {
	// 		await fetch('/music-queue', {
	// 			method: 'POST',
	// 			headers: { 'Content-Type': 'application/json' },
	// 			body: JSON.stringify({ songId: song.id })
	// 		});
	// 	} catch (error) {
	// 		console.error('Failed to add to queue', error);
	// 	}
	// }
	async function addToQueue() {
		// currentSongId.set(song.id);
		currentSongId = song.id;
	}

	function playSong() {
		audioStore.playSong(song.id);
	}
</script>

<div class={cn('group space-y-3', className)} {...$$restProps}>
	<div class="relative overflow-hidden rounded-md">
		<a href="/song/{song.id}" class="relative block">
			<img
				class={cn(
					'h-auto w-auto object-cover transition-all duration-300 ease-out',
					aspectRatio === 'portrait' ? 'aspect-[3/4]' : 'aspect-square'
				)}
				src={getImageURL(song.collectionId, song.id, song.coverArt)}
				alt={song.title}
				{width}
				{height}
			/>
			<div
				class="absolute inset-0 bg-black bg-opacity-0 transition-all duration-300 ease-out group-hover:bg-opacity-30"
			></div>
		</a>
		<Button
			type="button"
			size="icon"
			class="absolute bottom-2 right-2 scale-75 transform rounded-full bg-white p-2 text-black opacity-0 transition-all duration-300 ease-out hover:scale-110 group-hover:scale-100 group-hover:opacity-100"
			on:click={() => playSong()}
		>
			<PlusCircle class="h-4 w-4" />
		</Button>
	</div>

	<div class="space-y-1 text-sm">
		<a href="/song/{song.id}">
			<h3 class="font-medium leading-none">{song.title}</h3>
		</a>
		<p class="text-xs text-muted-foreground">
			{#each artistUsernames as username, i}
				<a href="/user/{username}">{username}</a>{i < artistUsernames.length - 1 ? ' • ' : ''}
			{/each}
		</p>
	</div>
</div>

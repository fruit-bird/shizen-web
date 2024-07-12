<!-- src/lib/components/AudioPlayer.svelte -->
<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { audioStore } from '$lib/stores/audioStore';
	import { Slider } from '$lib/components/ui/slider';
	import { Button } from '$lib/components/ui/button';
	import { Play, Pause, SkipBack, SkipForward, Volume2, Heart } from 'lucide-svelte';
	import type { AuthModel, RecordModel } from 'pocketbase';
	import { pb } from '$lib/pocketbase';

	export let user: AuthModel | undefined;

	let audio: HTMLAudioElement;
	let progress = 0;
	let volume = 1;
	let duration = 0;

	let like: RecordModel | undefined = undefined;
	let liked: boolean = false;
	let artists: RecordModel[] = [];

	$: console.log('audioStore', $audioStore);
	onMount(async () => {
		like = await pb
			.collection('song_likes')
			.getFirstListItem(`user="${user?.id}" && song="${$audioStore.currentSongId}"`)
			.catch(() => undefined);
		liked = !!like;

		audio = new Audio();
		audio.addEventListener('timeupdate', updateProgress);
		audio.addEventListener('loadedmetadata', () => {
			duration = audio.duration;
		});
	});

	function updateProgress() {
		progress = (audio.currentTime / audio.duration) * 100 || 0;
	}

	function handleProgressChange(event: CustomEvent) {
		const newProgress = event.detail[0];
		audio.currentTime = (newProgress / 100) * audio.duration;
	}

	function handleVolumeChange(event: CustomEvent) {
		volume = event.detail[0] / 100;
		if (audio) {
			audio.volume = volume;
		}
	}

	function formatTime(seconds: number) {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	}

	async function toggleLike() {
		like = await pb
			.collection('song_likes')
			.getFirstListItem(`user="${user?.id}" && song="${$audioStore.currentSongId}"`)
			.catch(() => undefined);
		liked = !!like;

		if (liked) {
			await pb.collection('song_likes').delete(like?.id!);
			liked = false;
		} else {
			await pb.collection('song_likes').create({ user: user?.id, song: $audioStore.currentSongId });
			liked = true;
		}
	}

	async function getSongInfo() {
		like = await pb
			.collection('song_likes')
			.getFirstListItem(`user="${user?.id}" && song="${$audioStore.currentSongId}"`)
			.catch(() => undefined);
		liked = !!like;

		// for (const artistId of $audioStore.songData!.artists) {
		// 	const artist = await pb.collection('users').getOne(artistId);
		// 	artists.push(artist);
		// }
	}

	$: if ($audioStore.songData) {
		if (!audio) {
			audio = new Audio($audioStore.songData.audioUrl);
		} else {
			audio.src = $audioStore.songData.audioUrl;
		}
		if ($audioStore.isPlaying) {
			audio.play();
		}
	}

	$: if (audio && !$audioStore.isPlaying) {
		audio.pause();
	}
</script>

<div class="fixed bottom-0 left-0 right-0 flex items-center gap-4 px-4 py-2">
	{#if $audioStore.songData}
		<div class="flex-shrink-0">
			<a href={`/song/${$audioStore.currentSongId}`}>
				<img
					src={$audioStore.songData.coverArt}
					alt="Cover Art"
					class="h-14 w-14 rounded object-cover"
				/>
			</a>
		</div>
		<div class="flex-1 overflow-hidden">
			<a
				class="truncate text-base font-semibold hover:underline"
				href={`/song/${$audioStore.currentSongId}`}
			>
				{$audioStore.songData.title}
			</a>
			<div class="text-muted-foreground">
				{#if $audioStore.songData.artists}
					{@const artists = $audioStore.songData.artists}
					{#each artists as artist, i}
						<a class="truncate" href={`/user/${artist.username}`}>
							<small>{artist.username}</small>
						</a>
						{i < artists.length - 1 ? ' • ' : ''}
					{/each}
				{/if}
			</div>
		</div>

		<div class="flex w-1/2 items-center gap-x-3 space-x-2">
			<span class="text-sm">{formatTime(audio?.currentTime || 0)}</span>
			<Slider
				value={[progress]}
				on:change={handleProgressChange}
				max={100}
				step={0.1}
				class="w-full"
			/>
			<span class="text-sm">{formatTime(duration)}</span>
		</div>

		<Button variant="ghost" size="icon" on:click={toggleLike}>
			{#if liked}
				<Heart class="h-5 w-5 text-red-500" />
			{:else}
				<Heart class="h-5 w-5" />
			{/if}
		</Button>

		<div class="flex items-center gap-3">
			<Button variant="ghost" size="icon">
				<SkipBack class="h-5 w-5" />
			</Button>
			{#if $audioStore.isPlaying}
				<Button variant="ghost" size="icon" on:click={() => audioStore.pauseSong()}>
					<Pause class="h-5 w-5" />
				</Button>
			{:else}
				<Button variant="ghost" size="icon" on:click={() => audioStore.resumeSong()}>
					<Play class="h-5 w-5" />
				</Button>
			{/if}
			<Button variant="ghost" size="icon">
				<SkipForward class="h-5 w-5" />
			</Button>
		</div>

		<div class="flex w-1/12 items-center justify-end space-x-2">
			<Volume2 class="h-5 w-5" />
			<Slider
				value={[volume * 100]}
				on:change={handleVolumeChange}
				max={100}
				step={1}
				class="w-24"
			/>
		</div>
	{:else}
		<p class="w-full text-center">No song selected</p>
	{/if}
</div>

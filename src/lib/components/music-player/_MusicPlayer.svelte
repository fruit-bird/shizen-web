<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Slider } from '$lib/components/ui/slider';
	import { pb } from '$lib/pocketbase';
	import { getImageURL } from '$lib/utils';
	import { Pause, Play, FastForward, Rewind, Heart, Volume2 } from 'lucide-svelte';
	import type { RecordModel, AuthModel } from 'pocketbase';
	import { onMount } from 'svelte';

	export let songId: string;
	export let user: AuthModel | undefined;

	let song: RecordModel | undefined = undefined;
	let like: RecordModel | undefined = undefined;
	let liked: boolean = false;

	let src: string | undefined = undefined;
	let audio: HTMLAudioElement;
	let currentTime: number;
	let paused = true;
	let sliderValue: number[] = [70];
	$: volume = sliderValue[0] / 100;

	onMount(async () => {
		song = await pb
			.collection('songs')
			.getOne(songId, { expand: 'artists' })
			.catch(() => undefined);
		like = await pb
			.collection('song_likes')
			.getFirstListItem(`user="${user?.id}" && song="${song?.id}"`)
			.catch(() => undefined);
		liked = !!like;

		if (song) {
			try {
				src = pb.files.getUrl(song, song.audioFile);
			} catch (err) {
				console.error('Error getting song data', err);
			}
		}
	});

	function formatTime(time: number) {
		const minutes = Math.floor(time / 60);
		const seconds = Math.floor(time % 60);
		return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
	}

	function togglePlayPause() {
		if (paused) {
			audio?.play();
			paused = false;
		} else {
			audio?.pause();
			paused = true;
		}
	}

	async function toggleLike() {
		like = await pb
			.collection('song_likes')
			.getFirstListItem(`user="${user?.id}" && song="${song?.id}"`)
			.catch(() => undefined);
		liked = !!like;

		if (liked) {
			await pb.collection('song_likes').delete(like?.id!);
			liked = false;
		} else {
			await pb.collection('song_likes').create({ user: user?.id, song: song?.id });
			liked = true;
		}
	}
</script>

<!-- <div class="player outline-double fixed bottom-0 left-0 right-0 p-4 border-t border-gray-200" class:paused>
	<div class="info">
		<div class="time">
			<span>{formatTime(time)}</span>
			<div class="slider" on:pointerdown={seek}>
				<div class="progress" style="--progress: {time / duration}%" />
			</div>
			<span>{duration ? formatTime(duration) : '--:--'}</span>
		</div>
	</div>
</div> -->

<div class="fixed bottom-0 left-0 right-0 flex items-center gap-4 px-4 py-2">
	<audio bind:this={audio} {src} bind:paused bind:volume bind:currentTime />
	<div class="flex-shrink-0">
		<a href={`/song/${song?.id}`}>
			<img
				src={getImageURL(song?.collectionId!, song?.id!, song?.coverArt, '48x48')}
				alt="Song Cover Art"
				class="aspect-square rounded-md object-cover"
				height={50}
				width={50}
			/>
		</a>
	</div>
	<div class="flex-1 overflow-hidden">
		<a class="truncate text-base font-semibold hover:underline" href={`/song/${song?.id}`}>
			{song?.title}
		</a>
		<div class="text-muted-foreground">
			{#if song?.expand?.artists}
				{@const artists = song?.expand?.artists}
				{#each artists as artist, i}
					<a class="truncate" href={`/user/${artist.username}`}>
						<small>{artist.username}</small>
					</a>
					{i < artists.length - 1 ? ' • ' : ''}
				{/each}
			{/if}
		</div>
	</div>

	<!-- <div class="flex items-center gap-4">
		<span class="text-sm">{formatTime(currentTime)}</span>
		<Slider value={[currentTime]} max={duration} step={1} />
		<span class="text-sm">{formatTime(duration)}</span>
	</div> -->

	<Button variant="ghost" size="icon" on:click={toggleLike}>
		{#if liked}
			<Heart class="h-5 w-5 text-red-500" />
		{:else}
			<Heart class="h-5 w-5" />
		{/if}
	</Button>

	<div class="flex items-center gap-3">
		<Button size="icon" variant="ghost">
			<Rewind class="h-5 w-5" />
		</Button>
		<Button variant="ghost" size="icon" on:click={togglePlayPause}>
			{#if paused}
				<Play class="h-5 w-5" />
			{:else}
				<Pause class="h-5 w-5" />
			{/if}
		</Button>
		<Button size="icon" variant="ghost">
			<FastForward class="h-5 w-5" />
		</Button>
	</div>
	<div class="flex w-1/12 items-center justify-end space-x-2">
		<Volume2 class="h-5 w-5" />
		<Slider bind:value={sliderValue} max={100} step={1} />
	</div>
</div>

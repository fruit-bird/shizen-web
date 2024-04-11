<script lang="ts">
	import { cn } from '$lib/utils.js';
	import type { RecordModel } from 'pocketbase';

	let className: string | undefined | null = 'w-[250px]';
	export let aspectRatio: 'portrait' | 'square' = 'square';
	export let width = 250;
	export let height = 330;
	export { className as class };
	export let song: RecordModel;

	let artistUsernames = song.expand?.artists.map((artist: RecordModel) => artist.username);
</script>

<div class={cn('space-y-3', className)} {...$$restProps}>
	<div class="overflow-hidden rounded-md">
		<img
			class={cn(
				'h-auto w-auto object-cover transition-all hover:scale-105',
				aspectRatio === 'portrait' ? 'aspect-[3/4]' : 'aspect-square'
			)}
			src={song.cover_art}
			alt={song.title}
			{width}
			{height}
		/>
	</div>

	<div class="space-y-1 text-sm">
		<h3 class="font-medium leading-none">{song.title}</h3>
		<p class="text-xs text-muted-foreground">
			{#each artistUsernames as username, i}
				<a href="/user/{username}">{username}</a>{i < artistUsernames.length - 1 ? ' • ' : ''}
			{/each}
		</p>
	</div>
</div>

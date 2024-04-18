<script lang="ts">
	import type { RecordModel } from 'pocketbase';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { pb } from '$lib/pocketbase';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Input } from '$lib/components/ui/input';
	import * as Avatar from '$lib/components/ui/avatar';

	let song: RecordModel;
	let artists: RecordModel[] = [];
	let comments: RecordModel[] = [];

	onMount(async () => {
		song = await pb.collection('songs').getOne($page.params.id, { expand: 'artists' });
		artists = song.expand?.artists;
		comments = await pb
			.collection('song_comments')
			.getList(1, 20, {
				filter: `song="${song.id}"`,
				sort: '-created',
				expand: 'user'
			})
			.then((resultsList) => resultsList.items);
	});
</script>

<div class="container mx-auto px-4 py-8">
	<div class="flex">
		<div class="w-1/4">
			<img src={pb.files.getUrl(song, song?.cover_art)} alt={song?.title} />
		</div>
		<h1 class="mb-2 text-3xl font-bold">{song?.title}</h1>
		<div class="w-3/4">
			<div class="text-xs text-muted-foreground">
				{#each artists as artist, i}
					<a class="mb-4 text-lg" href="/user/{artist.username}">
						<small>{artist.username}</small>
					</a>
					{i < artists.length - 1 ? ' • ' : ''}
				{/each}
				<p class="text-xs text-muted-foreground">{song?.created.slice(0, 4)}</p>
			</div>
			<p>{song?.description}</p>

			<div><p>{song?.num_plays} plays</p></div>
		</div>
	</div>

	<form class="mb-4">
		<div class="flex">
			<Input type="text" placeholder="Your comment..." class="w-full rounded-l-lg px-4 py-2" />
			<Button type="submit" class="rounded-r-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
				Post
			</Button>
		</div>
	</form>

	<!-- i should make a reusable component for this -->
	<!-- so that i can do recursive rendering of replies -->
	<div class="mb-4">
		<div class="mb-2 flex">
			{#each comments as comment}
				<div class="mr-2 flex-shrink-0">
					<a href="/user/{comment.expand?.user?.username}" class="font-semibold">
						<Avatar.Root class="h-8 w-8">
							<Avatar.Image
								src={pb.files.getUrl(comment.expand?.user, comment.expand?.user?.avatar, { thumb: '48x48' })}
								alt={comment.expand?.user?.username}
							/>
							<Avatar.Fallback>{comment.expand?.user?.display_name[0]}</Avatar.Fallback>
						</Avatar.Root>
					</a>
				</div>
				<div>
					<a href="/user/{comment.expand?.user?.username}" class="font-semibold">
						<small>{comment.expand?.user?.username}</small>
					</a>
					<p>{comment.comment}</p>
					<Button variant="link">Reply</Button>
				</div>
			{/each}
		</div>
	</div>
</div>

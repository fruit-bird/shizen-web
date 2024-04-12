<script lang="ts">
	import type { RecordModel } from 'pocketbase';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { pb } from '$lib/pocketbase';
	import { Separator } from '$lib/components/ui/separator';

	let song: RecordModel;
	let user: RecordModel;
	let comments: RecordModel[] = [];
	let commentReplies: RecordModel[] = [];

	onMount(async () => {
		song = await pb.collection('songs').getFirstListItem(`id="${$page.params.id}"`);
		user = await pb.collection('users').getOne(song.artists[0]);
		comments = await pb
			.collection('song_comments')
			.getList(1, 20, {
				filter: `song="${song.id}" && is_reply_to:length=0`,
				sort: '-created',
				expand: 'user'
			})
			.then((resultsList) => resultsList.items);
		// silly way to get replies, fix it later
		commentReplies = await pb
			.collection('song_comments')
			.getList(1, 20, {
				filter: `song="${song.id}" && is_reply_to:length>0`,
				sort: 'created',
				expand: 'user'
			})
			.then((resultsList) => resultsList.items);
	});

	$: console.log({ song, user, comments });
</script>

<div class="m-4">
	<img src={pb.files.getUrl(song, song?.cover_art)} alt={song?.title} />
	<h1>{song?.title}</h1>
	<h2>{user?.display_name}</h2>
	<p>{song?.description}</p>
	<p>{song?.created.slice(0, 4)}</p>

	<Separator />

	<div>
		<p>{song?.num_likes} ♥︎ - {song?.num_plays} plays</p>
	</div>

	<Separator />

	<!-- i should make a reusable component for this -->
	<!-- so that i can do recursive rendering of replies -->
	<div>
		<h1>Comments</h1>
		<div>
			{#each comments as comment}
				<div>
					<a href="/user/{comment.expand?.user?.username}">
						<small>{comment.expand?.user?.username}</small>
					</a>
					<p>{comment.comment}</p>
					<div class="ml-8">
						{#each commentReplies as reply}
							{#if reply.is_reply_to === comment.id}
								<div>
									<a href="/user/{reply.expand?.user?.username}">
										<small>{reply.expand?.user?.username}</small>
									</a>
									<p>{reply.comment}</p>
								</div>
							{/if}
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { Input } from '$lib/components/ui/input';
	import * as Avatar from '$lib/components/ui/avatar';
	import { getImageURL } from '$lib/utils';
	import { Heart, PlusCircle } from 'lucide-svelte';
	export let data;
	const { song, artists, comments } = data;
</script>

<div class="container mx-auto px-4 py-8">
	<div class="mb-8 flex flex-col gap-8 md:flex-row">
		<div class="w-full md:w-1/3">
			<img
				src={getImageURL(song?.collectionId!, song?.id!, song?.coverArt)}
				alt={song?.title}
				class="w-full rounded-lg shadow-lg"
			/>
		</div>
		<div class="w-full md:w-2/3">
			<h1 class="mb-2 text-4xl font-bold">{song?.title}</h1>
			<div class="mb-4 text-sm text-muted-foreground">
				{#each artists as artist, i}
					<a href="/user/{artist.username}" class="hover:underline">
						{artist.username}
					</a>
					{i < artists.length - 1 ? ' • ' : ''}
				{/each}
			</div>
			<p class="mb-4 text-lg">{song?.description}</p>
			<div class="mb-4 flex items-center gap-4">
				<Button class="flex items-center gap-2">
					<PlusCircle size={20} />
					Play
				</Button>
				<Button variant="outline" class="flex items-center gap-2">
					<Heart size={20} />
					Like
				</Button>
			</div>
			<div class="flex items-center text-sm text-muted-foreground">
				<span>{song?.numPlays} plays</span>
				<span class="mx-2">•</span>
				<span>{new Date(song?.created!).getFullYear()}</span>
			</div>
		</div>
	</div>

	<div class="mb-8">
		<h2 class="mb-4 text-2xl font-semibold">Comments</h2>
		<form class="mb-6 w-[50%]">
			<div class="flex">
				<Input type="text" placeholder="Add a comment..." class="flex-grow rounded-r-none" />
				<Button type="submit" class="rounded-l-none">Post</Button>
			</div>
		</form>

		<div class="space-y-6">
			{#each comments! as comment}
				<div class="flex gap-4">
					<a href="/user/{comment.expand?.user?.username}" class="flex-shrink-0">
						<Avatar.Root class="h-10 w-10">
							<Avatar.Image
								src={getImageURL(
									comment.expand?.user?.collectionId,
									comment.expand?.user?.id,
									comment.expand?.user?.avatar,
									'80x80'
								)}
								alt={comment.expand?.user?.username}
							/>
							<Avatar.Fallback>{comment.expand?.user?.displayName[0]}</Avatar.Fallback>
						</Avatar.Root>
					</a>
					<div>
						<div class="mb-1">
							<a
								href="/user/{comment.expand?.user?.username}"
								class="font-semibold hover:underline"
							>
								{comment.expand?.user?.username}
							</a>
							<span class="ml-2 text-sm text-muted-foreground">
								{new Date(comment.created).toLocaleDateString()}
							</span>
						</div>
						<p class="mb-2">{comment.comment}</p>
						<Button variant="link" class="h-auto p-0">Reply</Button>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<script lang="ts">
	import { onMount } from 'svelte';
	import { currentUser, pb } from '$lib/pocketbase';
	import type { RecordModel } from 'pocketbase';
	import { page } from '$app/stores';

	import PlusCircled from 'svelte-radix/PlusCircled.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import * as Avatar from '$lib/components/ui/avatar';
	import SongCard from '$lib/components/SongCard.svelte';

	let user: RecordModel;
	let songs: RecordModel[] = [];

	onMount(async () => {
		user = await pb.collection('users').getFirstListItem(`username="${$page.params.username}"`);
		songs = await pb
			.collection('songs')
			.getList(1, 20, {
				filter: `artists.username?="${$page.params.username}"`,
				sort: '-created',
				expand: 'artists'
			})
			.then((resultsList) => resultsList.items);
	});
</script>

<div class="flex items-center m-4">
    <div class="flex-none mr-4">
        <Avatar.Root class="h-24 w-24">
            <Avatar.Image src={user?.avatar} alt={user?.username} />
            <Avatar.Fallback>{user?.display_name[0]}</Avatar.Fallback>
        </Avatar.Root>
    </div>
    <div>
        <h1 class="text-3xl font-semibold">{user?.display_name}</h1>
        <p class="text-muted-foreground">{user?.tag_line}</p>
    </div>
</div>

<div class="hidden md:block">
	<div class="border-t">
		<div class="bg-background">
			<div class="grid lg:grid-cols-5">
				<div class="col-span-3 lg:col-span-4 lg:border-l">
					<div class="h-full px-4 py-6 lg:px-8">
						<div class="h-full space-y-6">
							<div class="border-none p-0 outline-none">
								<div class="flex items-center justify-between">
									<div class="space-y-1">
										<h2 class="text-2xl font-semibold tracking-tight">Latest Tracks</h2>
										<p class="text-sm text-muted-foreground">
											Most recent uploads for your enjoyment
										</p>
									</div>
									{#if user?.id === $currentUser?.id}
										<Button
											href="/upload"
											color="primary"
											size="sm"
											class="space-between flex items-center"
										>
											<PlusCircled class="h-4 w-4" />
											<span class="ml-2">Upload Music</span>
										</Button>
									{/if}
								</div>
								<Separator class="my-4" />
								<div class="relative">
									<ScrollArea orientation="horizontal">
										<div class="flex space-x-4 pb-4">
											{#each songs as song}
												<SongCard {song} />
											{/each}
										</div>
									</ScrollArea>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

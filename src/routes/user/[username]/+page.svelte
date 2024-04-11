<script lang="ts">
	import { onMount } from 'svelte';
	import { pb } from '$lib/pocketbase';
	import type { RecordModel } from 'pocketbase';
	import { page } from '$app/stores';

	import PlusCircled from 'svelte-radix/PlusCircled.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
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
									<div class="space-between flex items-center">
										<div class="ml-auto mr-4">
											<Button><PlusCircled class="mr-2 h-4 w-4" /> Add music</Button>
										</div>
									</div>
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

<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { pb } from '$lib/pocketbase';
	import type { AuthModel, RecordModel, UnsubscribeFunc } from 'pocketbase';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import * as Avatar from '$lib/components/ui/avatar';
	import { getImageURL } from '$lib/utils';

	let className: string | undefined | null = undefined;
	export { className as class };
	export let user: AuthModel | null = null;

	let newMessage: string = '';
	let messages: RecordModel[] = [];
	let unsubscribe: UnsubscribeFunc;

	onMount(async () => {
		const resultList = await pb.collection('messages').getList(1, 50, {
			sort: '-created',
			expand: 'user'
		});
		messages = resultList.items.reverse();

		unsubscribe = await pb.collection('messages').subscribe('*', async ({ action, record }) => {
			if (action === 'create') {
				const user = await pb.collection('users').getOne(record.user);
				record.expand = { user };
				messages = [...messages, record];
			}
			if (action === 'delete') {
				messages = messages.filter((m) => m.id !== record.id);
			}
		});
	});

	onDestroy(() => {
		unsubscribe?.();
	});

	async function sendMessage() {
		const data = { text: newMessage, user: user?.id };
		console.log('Message Data', data);

		try {
			await pb.collection('messages').create(data);
			newMessage = '';
		} catch (err) {
			console.error('Error sending message', err);
		}
	}

	function formatAMPM(date: Date) {
		const hours = date.getHours();
		const minutes = date.getMinutes();
		const amPM = hours >= 12 ? 'PM' : 'AM';
		const formattedHours = hours % 12 || 12; // Convert 0 to 12
		const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes; // Ensure double digits for minutes
		return `${formattedHours}:${formattedMinutes}${amPM}`;
	}

	function parseTime(dateString: string): string {
		const date = new Date(dateString);
		const now = new Date();
		const diff = now.getTime() - date.getTime();
		const day = 86_400_000; // 1000 * 60 * 60 * 24
		const week = day * 7;

		if (diff < day) {
			return formatAMPM(date);
		} else if (diff < day * 2) {
			return `Yesterday, ${formatAMPM(date)}`;
		} else if (diff < week) {
			return `${date.toLocaleDateString([], { weekday: 'short' })}, ${formatAMPM(date)}`;
		} else {
			return date.toLocaleDateString([], { month: 'short', day: '2-digit' });
		}
	}
</script>

<div class={`flex flex-col ${className}`}>
	<ScrollArea class="flex-grow overflow-auto pr-2">
		{#each messages as message (message.id)}
			{@const commenter = message.expand?.user as RecordModel}
			<div class="mb-4 flex items-start">
				<a href="/user/{commenter?.username}">
					<Avatar.Root class="mr-2 h-9 w-9">
						<Avatar.Image
							src={getImageURL(commenter?.collectionId, commenter?.id, commenter?.avatar, '48x48')}
							alt={commenter?.username}
						/>
						<Avatar.Fallback>{commenter?.displayName[0]}</Avatar.Fallback>
					</Avatar.Root>
				</a>
				<div>
					<a href="/user/{commenter?.username}">
						<small class="opacity-45">{commenter?.username}</small>
					</a>
					<small class="opacity-25">• {parseTime(message.created)}</small>
					<p>{message.text}</p>
				</div>
			</div>
		{/each}
	</ScrollArea>
	<div class="mt-2">
		<form on:submit|preventDefault={sendMessage} class="flex items-center space-x-2">
			<Input bind:value={newMessage} type="text" placeholder="Message" class="flex-grow" />
			<Button type="submit">Send</Button>
		</form>
	</div>
</div>

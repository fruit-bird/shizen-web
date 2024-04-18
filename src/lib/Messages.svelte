<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { currentUser, pb } from '$lib/pocketbase';
	import type { RecordModel, UnsubscribeFunc } from 'pocketbase';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import * as Avatar from '$lib/components/ui/avatar';

	let className: string | undefined | null = undefined;
	export { className as class };

	let newMessage: string = '';
	let messages: RecordModel[] = [];
	let unsubscribe: UnsubscribeFunc;

	onMount(async () => {
		const resultList = await pb.collection('messages').getList(1, 50, {
			sort: '-created',
			expand: 'user'
		});
		messages = resultList.items.reverse();

		// This is a subscription to realtime messages
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
		const data = { text: newMessage, user: $currentUser?.id };
		const createdMessage = await pb.collection('messages').create(data);
		newMessage = ''; // Clear the input field
		scrollToBottom();
	}

	function scrollToBottom() {}

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

<ScrollArea class={className}>
	{#each messages as message (message.id)}
		<div class="mb-4 flex items-start">
			<a href="/user/{message.expand?.user?.username}">
				<Avatar.Root class="mr-2 h-9 w-9">
					<Avatar.Image
						src={pb.files.getUrl(message.expand?.user, message.expand?.user?.avatar, {
							thumb: '48x48'
						})}
						alt={message.expand?.user?.username}
					/>
					<Avatar.Fallback>{message.expand?.user?.display_name[0]}</Avatar.Fallback>
				</Avatar.Root>
			</a>
			<div>
				<a href="/user/{message.expand?.user?.username}">
					<small class="opacity-45">{message.expand?.user?.username}</small>
				</a>
				<small class="opacity-25">• {parseTime(message.created)}</small>
				<p>{message.text}</p>
			</div>
		</div>
	{/each}

	<form on:submit|preventDefault={sendMessage} class="flex w-full max-w-sm items-center space-x-2">
		<Input type="text" placeholder="Message" bind:value={newMessage} />
		<Button type="submit">Send</Button>
	</form>
</ScrollArea>

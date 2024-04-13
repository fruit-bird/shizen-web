<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { currentUser, pb } from '$lib/pocketbase';
	import type { RecordModel, UnsubscribeFunc } from 'pocketbase';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import * as Avatar from '$lib/components/ui/avatar';

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
</script>

<ScrollArea class="fixed right-0 top-0 m-4 h-full w-[20%] rounded-md border p-4">
	{#each messages as message (message.id)}
		<div class="mb-4 flex items-start">
			<a href="/user/{message.expand?.user?.username}">
				<Avatar.Root class="mr-2 h-9 w-9">
					<Avatar.Image
						src={pb.files.getUrl(message.expand?.user, message.expand?.user?.avatar, { thumb: '48x48' })}
						alt={message.expand?.user?.username}
					/>
					<Avatar.Fallback>{message.expand?.user?.display_name[0]}</Avatar.Fallback>
				</Avatar.Root>
			</a>
			<div>
				<a href="/user/{message.expand?.user?.username}">
					<small>{message.expand?.user?.username}</small>
				</a>
				<p>{message.text}</p>
			</div>
		</div>
	{/each}

	<form on:submit|preventDefault={sendMessage} class="flex w-full max-w-sm items-center space-x-2">
		<Input type="text" placeholder="Message" bind:value={newMessage} />
		<Button type="submit">Send</Button>
	</form>
</ScrollArea>

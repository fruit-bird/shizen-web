<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { currentUser, pb } from './pocketbase';
	import type { RecordModel, UnsubscribeFunc } from 'pocketbase';
	import { ScrollArea } from './components/ui/scroll-area';
	import { Input } from './components/ui/input';
	import { Button } from './components/ui/button';

	let newMessage: string = '';
	let messages: RecordModel[] = [];
	let unsubscribe: UnsubscribeFunc;

	onMount(async () => {
		const resultList = await pb.collection('messages').getList(1, 50, {
			sort: 'created',
			expand: 'user'
		});
		messages = resultList.items;

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

	function scrollToBottom() {
		const messagesContainer = document.getElementById('messages-container');
		// messagesContainer?.scrollTo({
		// 	top: messagesContainer.scrollHeight,
		// 	behavior: 'smooth'
		// });
		if (messagesContainer) {
			messagesContainer.scrollTop = messagesContainer.scrollHeight;
		}
		// messagesContainer?.lastElementChild?.scrollIntoView({ behavior: 'smooth' });
	}
</script>

<ScrollArea
	id="messages-container"
	class="fixed right-0 top-0 m-4 h-full w-[20%] rounded-md border p-4"
	on:scoll={scrollToBottom}
>
	{#each messages as message (message.id)}
		<div class="mb-4 flex items-start">
			<!-- <img src={message.expand?.user?.avatar} alt="avatar" class="mr-2 rounded-full w-8 h-8" /> -->
			<div>
				<small>@{message.expand?.user?.name}</small>
				<p>{message.text}</p>
			</div>
		</div>
	{/each}

	<form on:submit|preventDefault={sendMessage} class="flex w-full max-w-sm items-center space-x-2">
		<Input type="text" placeholder="Message" bind:value={newMessage} />
		<Button type="submit">Send</Button>
	</form>
</ScrollArea>

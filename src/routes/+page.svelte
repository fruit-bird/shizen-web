<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import ModeToggle from '$lib/components/ui/ModeToggle.svelte';
	import { ScrollArea } from '$lib/components/ui/scroll-area';

    import Login from '$lib/Login.svelte';
	import Messages from '$lib/Messages.svelte';
	import { currentUser } from '$lib/pocketbase';
</script>

<h1>Shizen Chat</h1>

<Login />

{#if $currentUser}
	<Messages />
{/if}

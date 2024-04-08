<script lang="ts">
	import { pb } from '$lib/pocketbase';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';

	function signOut() {
		pb.authStore.clear();
	}
</script>

<Dialog.Root>
	<Dialog.Trigger class={buttonVariants({ variant: 'outline' })}>Sign Out</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Sign Out</Dialog.Title>
			<Dialog.Description>Are you sure you want to sign out?</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer>
			<Button type="submit" on:click={signOut} variant="destructive">Sign Out</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<script lang="ts">
	import { pb } from '$lib/pocketbase';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Label } from '$lib/components/ui/label';

	let email: string = '';
	let password: string = '';

	async function login() {
		await pb.collection('users').authWithPassword(email, password);
	}
</script>

<Dialog.Root>
	<Dialog.Trigger class={buttonVariants({ variant: 'outline' })}>Login</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Login</Dialog.Title>
			<Dialog.Description>Welcome back! Please login to continue.</Dialog.Description>
		</Dialog.Header>
		<div class="grid gap-4 py-4">
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="name" class="text-right">Email</Label>
				<Input
					id="name"
					placeholder="fruit.bird@shizen.com"
					type="email"
					class="col-span-3"
					bind:value={email}
				/>
			</div>
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="username" class="text-right">Password</Label>
				<Input
					id="username"
					placeholder="••••••••"
					type="password"
					class="col-span-3"
					bind:value={password}
				/>
			</div>
		</div>
		<Dialog.Footer>
			<Dialog.Trigger class={buttonVariants({ variant: 'link', size: 'sm' })}>
				Don't have an account?
			</Dialog.Trigger>
			<Button type="submit" on:click={login}>Login</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

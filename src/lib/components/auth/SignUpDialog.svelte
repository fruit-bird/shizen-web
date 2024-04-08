<script lang="ts">
	import { currentUser, pb } from '$lib/pocketbase';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Label } from '$lib/components/ui/label';

	let username: string = '';
	let email: string = '';
	let password: string = '';

	async function login() {
		await pb.collection('users').authWithPassword(username, password);
	}

	async function signUp() {
		try {
			const data = {
				username,
				email,
				emailVisibility: false,
				password,
				passwordConfirm: password,
				name: username
			};

			const createdUser = await pb.collection('users').create(data);
			await login();
		} catch (err) {
			console.error(err);
		}
	}
</script>

<Dialog.Root>
	<Dialog.Trigger class={buttonVariants({ variant: 'outline' })}>Sign Up</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Sign Up</Dialog.Title>
			<Dialog.Description>Welcome! Create an account to join the conversation</Dialog.Description>
		</Dialog.Header>
		<div class="grid gap-4 py-4">
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="username" class="text-right">Username</Label>
				<Input
					id="username"
					placeholder="fruit-bird"
					type="text"
					class="col-span-3"
					bind:value={username}
				/>
			</div>
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
			<Button type="submit" variant="link" size="sm">Already have an account?</Button>
			<Button type="submit" on:click={signUp}>Sign Up</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

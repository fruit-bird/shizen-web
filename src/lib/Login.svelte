<script lang="ts">
	import { currentUser, pb } from './pocketbase';
	import { Button } from './components/ui/button';
	import { Input } from './components/ui/input';

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

	function signOut() {
		pb.authStore.clear();
	}
</script>

{#if $currentUser}
	<p>Signed in as {$currentUser.username}</p>
	<Button on:click={signOut}>Sign Out</Button>
{:else}
	<form on:submit|preventDefault>
		<Input type="text" placeholder="Username" bind:value={username} />
		<Input type="email" placeholder="Email" bind:value={email} />
		<Input type="password" placeholder="Password" bind:value={password} />

		<Button variant="outline" on:click={signUp}>Sign Up</Button>
		<Button variant="ghost" on:click={login}>Login</Button>
	</form>
{/if}

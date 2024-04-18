<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { currentUser, pb } from '$lib/pocketbase';

	let username: string = '';
	let email: string = '';
	let password: string = '';

	// Redirect if user is already logged in
	$: if ($currentUser) {
		window.location.href = '/';
	}

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

	let isLoading = false;
	async function onSubmit() {
		isLoading = true;

		setTimeout(() => {
			isLoading = false;
		}, 3000);
	}
</script>

<div
	class="container fixed hidden h-[100%] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0"
>
	<Button href="/login" variant="ghost" class="absolute right-4 top-4 md:right-8 md:top-8">
		Login
	</Button>
	<div class="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
		<div
			class="absolute inset-0 bg-cover"
			style={`background-image: url("/images/tunnel_vision.PNG");`}
		/>
		<div class="relative z-20 flex items-center text-lg font-medium">
			<div class="relative z-20 flex items-center text-lg font-medium">
				<a href="/">Shizen</a>
			</div>
		</div>
		<div class="relative z-20 mt-auto">
			<blockquote class="space-y-2">
				<p class="text-lg">
					&ldquo;Shizen has allowed me to meet new people and make new friends. My music career has
					become way more successful than I ever thought it would be. I am so grateful for this
					platform!&rdquo;
				</p>
				<footer class="text-sm">JUKE YOU</footer>
			</blockquote>
		</div>
	</div>
	<div class="lg:p-8">
		<div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
			<div class="flex flex-col space-y-2 text-center">
				<h1 class="text-2xl font-semibold tracking-tight">Create an account</h1>
				<p class="text-sm text-muted-foreground">Enter your email below to create your account</p>
			</div>
			<div class="grid gap-6">
				<form on:submit|preventDefault={signUp}>
					<div class="grid gap-2">
						<div class="grid gap-1">
							<Label class="sr-only" for="username">Username</Label>
							<Input
								id="username"
								placeholder="fruit.bird"
								type="text"
								bind:value={username}
								autocapitalize="none"
								autocomplete="username"
								autocorrect="off"
								disabled={isLoading}
							/>
						</div>
						<div class="grid gap-1">
							<Label class="sr-only" for="email">Email</Label>
							<Input
								id="email"
								placeholder="fruit.bird@shizen.com"
								type="email"
								bind:value={email}
								autocapitalize="none"
								autocomplete="email"
								autocorrect="off"
								disabled={isLoading}
							/>
						</div>
						<div class="grid gap-1">
							<Label class="sr-only" for="password">Password</Label>
							<Input
								id="password"
								placeholder="••••••••"
								type="password"
								bind:value={password}
								autocapitalize="none"
								autocomplete="current-password"
								autocorrect="off"
								disabled={isLoading}
							/>
						</div>
						<Button type="submit" disabled={isLoading}>
							{#if isLoading}
								<!-- <Icons.spinner class="mr-2 h-4 w-4 animate-spin" /> -->
							{/if}
							Sign Up with Email
						</Button>
					</div>
				</form>
				<div class="relative">
					<div class="absolute inset-0 flex items-center">
						<span class="w-full border-t" />
					</div>
					<div class="relative flex justify-center text-xs uppercase">
						<span class="bg-background px-2 text-muted-foreground"> Or continue with </span>
					</div>
				</div>
				<Button variant="outline" type="button" disabled={isLoading}>
					{#if isLoading}
						<!-- <Icons.spinner class="mr-2 h-4 w-4 animate-spin" /> -->
					{:else}
						<!-- <Icons.gitHub class="mr-2 h-4 w-4" /> -->
					{/if}
					Google
				</Button>
			</div>

			<p class="px-8 text-center text-sm text-muted-foreground">
				By signing up, you agree to our
				<a href="/terms" class="underline underline-offset-4 hover:text-primary">
					Terms of Service
				</a>
				and
				<a href="/privacy" class="underline underline-offset-4 hover:text-primary">
					Privacy Policy
				</a>
			</p>
		</div>
	</div>
</div>

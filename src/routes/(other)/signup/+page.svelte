<script lang="ts">
	import UserAuthForm from '$lib/components/auth2';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';

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
		<div class="bg-image absolute inset-0 bg-cover" />
		<div class="relative z-20 flex items-center text-lg font-medium">Shizen</div>
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
				<form on:submit|preventDefault={onSubmit}>
					<div class="grid gap-2">
						<div class="grid gap-1">
							<Label class="sr-only" for="username">Username</Label>
							<Input
								id="username"
								placeholder="fruit.bird"
								type="text"
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
				By clicking continue, you agree to our
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

<style>
	.bg-image {
		background-image: url('https://images.unsplash.com/photo-1590069261209-f8e9b8642343?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1376&q=80');
	}
</style>

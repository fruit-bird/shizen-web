<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { superForm } from 'sveltekit-superforms';
	import type { PageData } from './$types';

	export let data: PageData;
	const { form, errors, constraints, enhance } = superForm(data.form);
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
				<form action="?/register" method="post" use:enhance>
					<div class="grid gap-2">
						<div class="grid gap-1">
							<Label class="sr-only" for="username">Username</Label>
							<Input
								id="username"
								name="username"
								bind:value={$form.username}
								{...$constraints.username}
								type="text"
								aria-invalid={$errors.username ? 'true' : undefined}
								class={$errors.username ? 'border-red-500' : ''}
								placeholder="fruit.bird"
								autocomplete="username"
							/>
							{#if $errors.username}
								{#each $errors.username as error}
									<small class="text-red-500">{error}</small>
								{/each}
							{/if}
						</div>
						<div class="grid gap-1">
							<Label class="sr-only" for="email">Email</Label>
							<Input
								id="email"
								name="email"
								bind:value={$form.email}
								{...$constraints.email}
								type="email"
								aria-invalid={$errors.email ? 'true' : undefined}
								class={$errors.email ? 'border-red-500' : ''}
								placeholder="fruit.bird@shizen.com"
								autocomplete="email"
							/>
							{#if $errors.email}
								{#each $errors.email as error}
									<small class="text-red-500">{error}</small>
								{/each}
							{/if}
						</div>
						<div class="grid gap-1">
							<Label class="sr-only" for="password">Password</Label>
							<Input
								id="password"
								name="password"
								bind:value={$form.password}
								{...$constraints.password}
								type="password"
								aria-invalid={$errors.password ? 'true' : undefined}
								class={$errors.password ? 'border-red-500' : ''}
								placeholder="••••••••"
								autocomplete="new-password"
							/>
							{#if $errors.password}
								{#each $errors.password as error}
									<small class="text-red-500">{error}</small>
								{/each}
							{/if}
						</div>
						<div class="grid gap-1">
							<Label class="sr-only" for="passwordConfirm">Password</Label>
							<Input
								id="passwordConfirm"
								name="passwordConfirm"
								bind:value={$form.passwordConfirm}
								{...$constraints.passwordConfirm}
								type="password"
								aria-invalid={$errors.passwordConfirm ? 'true' : undefined}
								class={$errors.passwordConfirm ? 'border-red-500' : ''}
								placeholder="••••••••"
								autocomplete="new-password"
							/>
							{#if $errors.passwordConfirm}
								{#each $errors.passwordConfirm as error}
									<small class="text-red-500">{error}</small>
								{/each}
							{/if}
						</div>
						<Button type="submit">Sign Up with Email</Button>
					</div>
				</form>
				<div class="relative">
					<div class="absolute inset-0 flex items-center">
						<span class="w-full border-t" />
					</div>
				</div>
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

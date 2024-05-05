<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { superForm } from 'sveltekit-superforms';
	import SuperDebug from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form';
	import type { PageData } from './$types';

	export let data: PageData;
	const form = superForm(data.form);
	const { form: formData, enhance } = form;
</script>

<div
	class="container fixed hidden h-[100%] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0"
>
	<Button href="/signup" variant="ghost" class="absolute right-4 top-4 md:right-8 md:top-8">
		Sign Up
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
				<h1 class="text-2xl font-semibold tracking-tight">Welcome back!</h1>
				<p class="text-sm text-muted-foreground">Login to continue the conversation</p>
			</div>
			<div class="grid gap-6">
				<form method="post" use:enhance>
					<Form.Field {form} name="username">
						<Form.Control let:attrs>
							<Form.Label>Username</Form.Label>
							<Input
								bind:value={$formData.username}
								{...attrs}
								type="username"
								placeholder="fruit.bird"
							/>
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<Form.Field {form} name="password">
						<Form.Control let:attrs>
							<Form.Label>Password</Form.Label>
							<Input
								bind:value={$formData.password}
								{...attrs}
								type="password"
								placeholder="••••••••"
							/>
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<Form.Button class="w-full">Login</Form.Button>
				</form>

				<SuperDebug data={$formData} />
			</div>
		</div>
	</div>
</div>

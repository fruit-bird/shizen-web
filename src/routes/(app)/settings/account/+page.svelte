<script lang="ts">
	import SuperDebug from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Separator } from '$lib/components/ui/separator';
	import { superForm } from 'sveltekit-superforms';
	import type { PageData } from './$types.js';

	export let data: PageData;
	const form = superForm(data.form);
	const { form: formData, enhance } = form;
	const user = data.user;
</script>

<div class="space-y-6">
	<div>
		<h3 class="text-lg font-medium">Profile</h3>
		<p class="text-sm text-muted-foreground">This is how others will see you on the site.</p>
	</div>
	<Separator />

	<form method="post" class="space-y-8" use:enhance>
		<Form.Field {form} name="email">
			<Form.Control let:attrs>
				<Form.Label>Email</Form.Label>
				<Input type="email" bind:value={$formData.email} {...attrs} placeholder={user?.email} />
			</Form.Control>
			<Form.Description>
				This is your email address. It will be used to log in and to send you notifications.
			</Form.Description>
			<Form.FieldErrors />
		</Form.Field>

		<!-- <Form.Field {form} name="password">
			<Form.Control let:attrs>
				<Form.Label>Password</Form.Label>
				<Input type="password" bind:value={$formData.password} {...attrs} placeholder="••••••••" />
			</Form.Control>
			<Form.Description>Your password must be at least 8 characters long.</Form.Description>
			<Form.FieldErrors />
		</Form.Field> -->

		<Form.Button>Update Account</Form.Button>
	</form>

	<SuperDebug data={$formData} />
</div>

<script lang="ts">
	import SuperDebug from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Separator } from '$lib/components/ui/separator';
	import { superForm } from 'sveltekit-superforms';
	import type { PageData } from './$types.js';
	import { getImageURL } from '$lib/utils';
	import { PenLine } from 'lucide-svelte';

	export let data: PageData;
	const form = superForm(data.form);
	const { form: formData, enhance } = form;
	const user = data.user;

	function showPreview(event: Event) {
		const files = (event.target as HTMLInputElement)?.files as FileList;
		if (files.length === 0) return;

		const src = URL.createObjectURL(files[0]);
		const preview = document.getElementById('avatar-preview') as HTMLImageElement;
		preview.src = src;
	}
</script>

<div class="space-y-6">
	<div>
		<h3 class="text-lg font-medium">Profile</h3>
		<p class="text-sm text-muted-foreground">This is how others will see you on the site.</p>
	</div>
	<Separator />

	<form method="post" class="space-y-8" use:enhance>
		<Form.Field {form} name="username">
			<Form.Control let:attrs>
				<Form.Label>Username</Form.Label>
				<Input bind:value={$formData.username} {...attrs} placeholder={user?.username} />
			</Form.Control>
			<Form.Description>
				This is your public display name. It can be your real name or a pseudonym. You can only
				change this once every 30 days.
			</Form.Description>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="motto">
			<Form.Control let:attrs>
				<Form.Label>Motto</Form.Label>
				<Input
					bind:value={$formData.motto}
					{...attrs}
					placeholder={user?.motto ?? 'Quantum entangled to a rock'}
				/>
			</Form.Control>
			<Form.Description>
				This is your motto. It can be a quote, a saying, or anything you like. It will be shown on
				your profile. Keep it short and sweet.
			</Form.Description>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="bio">
			<Form.Control let:attrs>
				<Form.Label>Bio</Form.Label>
				<Textarea
					bind:value={$formData.bio}
					{...attrs}
					placeholder={user?.bio
						? user.bio
						: 'We theorize when a conscious being is in contact with a quantum object and ceases to act as an observer, the being can become entangled with that quantum object, and they move together'}
				/>
			</Form.Control>
			<Form.Description>
				This is your bio. It can be a short description of yourself, your interests, or anything you
				like. It will be shown on your profile. You can @mention other users and organizations to
				link to them.
			</Form.Description>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="avatar" class="w-full max-w-lg">
			<Form.Control let:attrs>
				<Form.Label class="hover:cursor-pointer">
					<Form.Label for="avatar" class="absolute">
						<span class="btn btn-circle btn-secondary btn-sm">
							<PenLine class="h-4 w-4" />
						</span>
					</Form.Label>
					<div class="w-32 rounded-full">
						<img
							id="avatar-preview"
							src={getImageURL(user?.collectionId, user?.id, user?.avatar)}
							alt="Your avatar"
							class="h-32 w-32 rounded-full"
						/>
					</div>
				</Form.Label>
				<Input type="file" on:change={showPreview} accept="image/*" hidden {...attrs} />
			</Form.Control>
			<Form.Description>This is your avatar. It will be shown on your profile.</Form.Description>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Button>Update Profile</Form.Button>
	</form>

	<SuperDebug data={$formData} />
</div>

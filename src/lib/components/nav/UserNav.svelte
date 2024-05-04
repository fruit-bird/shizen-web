<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button';
	import ModeToggle from '$lib/components/ui/ModeToggle.svelte';
	import type { AuthModel } from 'pocketbase';
	import { getImageURL } from '$lib/utils';
	import { LogOut, Settings, PenBox } from 'lucide-svelte';

	export let user: AuthModel | undefined;
	const logout = async () => {
		await fetch('/logout', { method: 'POST', redirect: 'follow' });
		window.location.reload();
	};
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button variant="ghost" builders={[builder]} class="relative h-8 w-8 rounded-full">
			<Avatar.Root class="h-8 w-8">
				<Avatar.Image
					src={user ? getImageURL(user.collectionId, user.id, user.avatar) : undefined}
					alt={user ? user.username : ''}
				/>
				<Avatar.Fallback>{user ? user.displayName[0] : ':)'}</Avatar.Fallback>
			</Avatar.Root>
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-56" align="end">
		<DropdownMenu.Label class="font-normal">
			<div class="flex flex-row">
				<div class="flex flex-col space-y-1">
					<p class="text-sm font-medium leading-none">{user ? user.displayName : 'Guest User'}</p>
					<p class="text-xs leading-none text-muted-foreground">
						@{user ? user.username : 'guest'}
					</p>
				</div>
				<div class="absolute right-0 top-0 flex flex-row items-center justify-end p-2">
					<ModeToggle class="size-8" />
				</div>
			</div>
		</DropdownMenu.Label>
		<DropdownMenu.Separator />
		<DropdownMenu.Group>
			<DropdownMenu.Item href="/settings">
				Settings
				<DropdownMenu.Shortcut><Settings size="18" /></DropdownMenu.Shortcut>
			</DropdownMenu.Item>
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
		<DropdownMenu.Group>
			<DropdownMenu.Item href="mailto:support@shizen.com">
				Send us Feedback
				<DropdownMenu.Shortcut><PenBox size="18" /></DropdownMenu.Shortcut>
			</DropdownMenu.Item>
			<DropdownMenu.Item on:click={logout}>
				Log out
				<DropdownMenu.Shortcut><LogOut size="18" /></DropdownMenu.Shortcut>
			</DropdownMenu.Item>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>

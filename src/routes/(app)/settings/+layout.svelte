<script lang="ts">
	import SidebarNav from '$lib/components/settings/SidebarNav.svelte';
	import { Separator } from '$lib/components/ui/separator';

	const sidebarNavItems = [
		{ title: 'Profile', href: '/settings/profile' },
		{ title: 'Account', href: '/settings/account' },
		// { title: 'Appearance', href: '/settings/appearance' },
		// { title: 'Notifications', href: '/settings/notifications' },
		// { title: 'Display', href: '/settings/display' }
	];
</script>

<div class="hidden space-y-6 p-10 pb-16 md:block">
	<div class="space-y-0.5">
		<h2 class="text-2xl font-bold tracking-tight">Settings</h2>
		<p class="text-muted-foreground">Manage your account settings and set e-mail preferences.</p>
	</div>
	<Separator class="my-6" />
	<div class="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
		<aside class="-mx-4 lg:w-1/5">
			<SidebarNav items={sidebarNavItems} />
		</aside>
		<div class="flex-1 lg:max-w-2xl">
			<slot />
		</div>
	</div>
</div>

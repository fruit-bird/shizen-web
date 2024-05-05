<script lang="ts">
	import MainNav from './MainNav.svelte';
	import Search from './Search.svelte';
	import UserNav from './UserNav.svelte';
	// import TeamSwitcher from './TeamSwitcher.svelte';
	import type { AuthModel } from 'pocketbase';
	import { mode } from 'mode-watcher';

	export let navItems: { title: string; href: string }[] = [];
	export let user: AuthModel | undefined;
</script>

<div class="hidden flex-col md:flex">
	<div class="border-b">
		<div class="flex h-16 items-center px-4">
			<!-- <TeamSwitcher /> -->
			<a href="/" class="flex items-center space-x-2 pl-8">
				<!-- workaround for now -->
				{#if $mode === 'dark'}
					<img src="/images/shizen_dark.png" alt="Shizen" class="h-8 w-8 rounded-full" />
				{:else}
					<img src="/images/shizen_light.png" alt="Shizen" class="h-8 w-8 rounded-full" />
				{/if}
				<span class="pl-1 text-lg font-extrabold">Shizen</span>
			</a>
			<div class="flex flex-grow items-center justify-center">
				<MainNav {navItems} />
			</div>
			<div class="ml-auto flex items-center space-x-4">
				<Search />
				<UserNav {user} />
			</div>
		</div>
	</div>
</div>

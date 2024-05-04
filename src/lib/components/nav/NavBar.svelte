<script lang="ts">
	import MainNav from './MainNav.svelte';
	import Search from './Search.svelte';
	import UserNav from './UserNav.svelte';
	// import TeamSwitcher from './TeamSwitcher.svelte';
	import type { AuthModel } from 'pocketbase';

	export let navItems: { title: string; href: string }[] = [];
	export let user: AuthModel | undefined;
</script>

<div class="hidden flex-col md:flex">
	<div class="border-b">
		<div class="flex h-16 items-center px-4">
			<!-- <TeamSwitcher /> -->
			<a href="/" class="flex items-center space-x-2 pl-8">
				<!-- <img src="/images/shizen_light.svg" alt="Shizen" class="h-8 w-8 rounded-full" /> -->
				<img src="/images/shizen_dark.png" alt="Shizen" class="h-8 w-8 rounded-full" />
				<span class="text-lg font-extrabold pl-1">Shizen</span>
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

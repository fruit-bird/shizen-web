<script lang="ts">
	import { cn } from '$lib/utils';

	let className: string | undefined | null = undefined;
	export { className as class };
	export let navItems: { title: string; href: string }[] = [];
</script>

<nav class={cn('flex items-center space-x-4 lg:space-x-6', className)}>
	{#each navItems as item}
		<a href={item.href} class="text-sm font-medium transition-colors hover:text-primary">
			{item.title}
		</a>
	{/each}
</nav>

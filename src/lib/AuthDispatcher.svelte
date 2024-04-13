<script lang="ts">
	import { currentUser } from '$lib/pocketbase';
	import { LoginDialog, SignUpDialog, SignOutDialog } from '$lib/components/auth';
</script>

{#if !$currentUser}
	<LoginDialog />
	<SignUpDialog />
{:else}
	<SignOutDialog />
{/if}

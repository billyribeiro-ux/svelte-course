<script lang="ts">
	import { theme } from '$stores/theme.svelte';
	import Sun from 'phosphor-svelte/lib/Sun';
	import Moon from 'phosphor-svelte/lib/Moon';

	let isDark = $derived(theme.current === 'dark');
</script>

<button
	class="theme-toggle"
	onclick={() => theme.toggle()}
	aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
	title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
>
	{#if isDark}
		<Sun size={20} weight="bold" />
	{:else}
		<Moon size={20} weight="bold" />
	{/if}
</button>

<style>
	.theme-toggle {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		border: 1px solid var(--color-border, rgba(255, 255, 255, 0.12));
		background: var(--color-surface, rgba(255, 255, 255, 0.05));
		color: var(--color-text, #e4e4e7);
		cursor: pointer;
		transition: all 0.25s ease;
	}

	.theme-toggle:hover {
		background: var(--color-surface-hover, rgba(255, 255, 255, 0.1));
		border-color: var(--color-accent, #6d5acd);
		color: var(--color-accent, #6d5acd);
		transform: rotate(15deg);
	}

	.theme-toggle:focus-visible {
		outline: 2px solid var(--color-accent, #6d5acd);
		outline-offset: 2px;
	}

	.theme-toggle:active {
		transform: rotate(15deg) scale(0.95);
	}
</style>

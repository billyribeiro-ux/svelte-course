<script lang="ts">
	import { page } from '$app/state';
	import { navLinks } from '$data/navigation';
	import ThemeToggle from './ThemeToggle.svelte';
	import List from 'phosphor-svelte/lib/List';
	import X from 'phosphor-svelte/lib/X';

	let mobileMenuOpen = $state(false);

	let currentPath = $derived(page.url.pathname);

	function isActive(href: string): boolean {
		if (href === '/') {
			return currentPath === '/';
		}
		return currentPath.startsWith(href);
	}

	function closeMobileMenu() {
		mobileMenuOpen = false;
	}

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}
</script>

<header class="header">
	<div class="header-inner">
		<a href="/" class="logo" onclick={closeMobileMenu}>
			<span class="logo-mark">RT</span>
			<span class="logo-text">Revolution Trading Pros</span>
		</a>

		<nav class="desktop-nav" aria-label="Main navigation">
			{#each navLinks as link}
				<a
					href={link.href}
					class="nav-link"
					class:active={isActive(link.href)}
					aria-current={isActive(link.href) ? 'page' : undefined}
				>
					{link.label}
				</a>
			{/each}
		</nav>

		<div class="header-actions">
			<ThemeToggle />

			<a href="/lead-magnet" class="cta-button desktop-cta">
				Free Guide
			</a>

			<button
				class="hamburger"
				onclick={toggleMobileMenu}
				aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
				aria-expanded={mobileMenuOpen}
			>
				{#if mobileMenuOpen}
					<X size={24} weight="bold" />
				{:else}
					<List size={24} weight="bold" />
				{/if}
			</button>
		</div>
	</div>
</header>

{#if mobileMenuOpen}
	<div class="mobile-overlay" role="dialog" aria-label="Mobile navigation">
		<button class="overlay-backdrop" onclick={closeMobileMenu} aria-label="Close menu" tabindex="-1"></button>
		<nav class="mobile-nav" aria-label="Mobile navigation">
			{#each navLinks as link}
				<a
					href={link.href}
					class="mobile-nav-link"
					class:active={isActive(link.href)}
					aria-current={isActive(link.href) ? 'page' : undefined}
					onclick={closeMobileMenu}
				>
					{link.label}
				</a>
			{/each}

			<a href="/lead-magnet" class="mobile-cta" onclick={closeMobileMenu}>
				Free Guide
			</a>
		</nav>
	</div>
{/if}

<style>
	/* ---- Header ---- */
	.header {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 1000;
		height: var(--header-height, 72px);
		background: var(--color-header-bg, rgba(10, 10, 15, 0.75));
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
		border-bottom: 1px solid var(--color-border, rgba(255, 255, 255, 0.08));
	}

	.header-inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 100%;
		max-width: 1280px;
		margin: 0 auto;
		padding: 0 1.5rem;
	}

	/* ---- Logo ---- */
	.logo {
		display: flex;
		align-items: center;
		gap: 0.625rem;
		text-decoration: none;
		color: var(--color-text, #e4e4e7);
		flex-shrink: 0;
	}

	.logo-mark {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		border-radius: 8px;
		background: linear-gradient(135deg, var(--color-accent, #6d5acd), var(--color-accent-secondary, #4f8cff));
		color: #fff;
		font-weight: 800;
		font-size: 0.875rem;
		letter-spacing: -0.02em;
	}

	.logo-text {
		font-size: 1.05rem;
		font-weight: 700;
		letter-spacing: -0.01em;
		white-space: nowrap;
	}

	/* ---- Desktop Nav ---- */
	.desktop-nav {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	.nav-link {
		position: relative;
		display: inline-flex;
		align-items: center;
		padding: 0.5rem 0.875rem;
		border-radius: 6px;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-text-muted, #a1a1aa);
		text-decoration: none;
		transition: color 0.2s ease, background 0.2s ease;
	}

	.nav-link:hover {
		color: var(--color-text, #e4e4e7);
		background: var(--color-surface, rgba(255, 255, 255, 0.05));
	}

	.nav-link.active {
		color: var(--color-accent, #6d5acd);
		background: var(--color-accent-surface, rgba(109, 90, 205, 0.1));
	}

	.nav-link.active::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 16px;
		height: 2px;
		border-radius: 1px;
		background: var(--color-accent, #6d5acd);
	}

	/* ---- Header Actions ---- */
	.header-actions {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex-shrink: 0;
	}

	.cta-button {
		display: inline-flex;
		align-items: center;
		padding: 0.5rem 1.25rem;
		border-radius: 8px;
		background: linear-gradient(135deg, var(--color-accent, #6d5acd), var(--color-accent-secondary, #4f8cff));
		color: #fff;
		font-size: 0.875rem;
		font-weight: 600;
		text-decoration: none;
		transition: opacity 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
		white-space: nowrap;
	}

	.cta-button:hover {
		opacity: 0.92;
		transform: translateY(-1px);
		box-shadow: 0 4px 20px rgba(109, 90, 205, 0.35);
	}

	.cta-button:active {
		transform: translateY(0);
	}

	/* ---- Hamburger ---- */
	.hamburger {
		display: none;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		border: 1px solid var(--color-border, rgba(255, 255, 255, 0.12));
		border-radius: 8px;
		background: var(--color-surface, rgba(255, 255, 255, 0.05));
		color: var(--color-text, #e4e4e7);
		cursor: pointer;
		transition: background 0.2s ease, border-color 0.2s ease;
	}

	.hamburger:hover {
		background: var(--color-surface-hover, rgba(255, 255, 255, 0.1));
		border-color: var(--color-accent, #6d5acd);
	}

	.hamburger:focus-visible {
		outline: 2px solid var(--color-accent, #6d5acd);
		outline-offset: 2px;
	}

	/* ---- Mobile Overlay ---- */
	.mobile-overlay {
		position: fixed;
		inset: 0;
		z-index: 999;
		display: flex;
		flex-direction: column;
		padding-top: var(--header-height, 72px);
	}

	.overlay-backdrop {
		position: absolute;
		inset: 0;
		background: rgba(0, 0, 0, 0.6);
		backdrop-filter: blur(4px);
		-webkit-backdrop-filter: blur(4px);
		border: none;
		cursor: default;
	}

	.mobile-nav {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		padding: 1.5rem;
		background: var(--color-header-bg, rgba(10, 10, 15, 0.97));
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border-bottom: 1px solid var(--color-border, rgba(255, 255, 255, 0.08));
		overflow-y: auto;
		max-height: calc(100vh - var(--header-height, 72px));
	}

	.mobile-nav-link {
		display: flex;
		align-items: center;
		padding: 0.875rem 1rem;
		border-radius: 8px;
		font-size: 1.05rem;
		font-weight: 500;
		color: var(--color-text-muted, #a1a1aa);
		text-decoration: none;
		transition: color 0.2s ease, background 0.2s ease;
	}

	.mobile-nav-link:hover {
		color: var(--color-text, #e4e4e7);
		background: var(--color-surface, rgba(255, 255, 255, 0.05));
	}

	.mobile-nav-link.active {
		color: var(--color-accent, #6d5acd);
		background: var(--color-accent-surface, rgba(109, 90, 205, 0.1));
	}

	.mobile-cta {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 0.75rem;
		padding: 0.875rem 1.5rem;
		border-radius: 10px;
		background: linear-gradient(135deg, var(--color-accent, #6d5acd), var(--color-accent-secondary, #4f8cff));
		color: #fff;
		font-size: 1rem;
		font-weight: 600;
		text-decoration: none;
		transition: opacity 0.2s ease;
	}

	.mobile-cta:hover {
		opacity: 0.92;
	}

	/* ---- Responsive ---- */
	@media (max-width: 768px) {
		.desktop-nav {
			display: none;
		}

		.desktop-cta {
			display: none;
		}

		.hamburger {
			display: flex;
		}

		.logo-text {
			font-size: 0.925rem;
		}
	}

	@media (min-width: 769px) {
		.hamburger {
			display: none;
		}

		.mobile-overlay {
			display: none;
		}
	}
</style>

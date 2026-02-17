<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    href?: string;
    type?: 'button' | 'submit';
    disabled?: boolean;
    children: Snippet;
    onclick?: (e: MouseEvent) => void;
  }

  let {
    variant = 'primary',
    size = 'md',
    href,
    type = 'button',
    disabled = false,
    children,
    onclick
  }: Props = $props();
</script>

{#if href}
  <a
    {href}
    class="btn btn--{variant} btn--{size}"
    class:btn--disabled={disabled}
    {onclick}
    aria-disabled={disabled || undefined}
  >
    {@render children()}
  </a>
{:else}
  <button
    {type}
    {disabled}
    class="btn btn--{variant} btn--{size}"
    class:btn--disabled={disabled}
    {onclick}
  >
    {@render children()}
  </button>
{/if}

<style>
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    font-family: var(--font-sans);
    font-weight: var(--font-semibold);
    line-height: var(--leading-none);
    letter-spacing: var(--tracking-wide);
    border-radius: var(--radius-full);
    cursor: pointer;
    transition:
      transform var(--transition-fast),
      box-shadow var(--transition-base),
      background-color var(--transition-base),
      border-color var(--transition-base),
      opacity var(--transition-fast);
    text-decoration: none;
    white-space: nowrap;
    user-select: none;
    -webkit-user-select: none;
    border: var(--border-width-medium) solid transparent;
  }

  /* ---- Sizes ---- */
  .btn--sm {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }

  .btn--md {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
  }

  .btn--lg {
    padding: 1rem 2rem;
    font-size: 1.125rem;
  }

  /* ---- Primary ---- */
  .btn--primary {
    background: var(--gradient-cta);
    color: var(--color-text-inverse);
    border-color: transparent;
    box-shadow: var(--shadow-md);
  }

  .btn--primary:hover:not(.btn--disabled) {
    background: var(--gradient-cta-hover);
    box-shadow: var(--shadow-glow-cta), var(--shadow-lg);
    transform: scale(1.03);
  }

  .btn--primary:active:not(.btn--disabled) {
    transform: scale(0.98);
    box-shadow: var(--shadow-sm);
  }

  /* ---- Secondary ---- */
  .btn--secondary {
    background: transparent;
    color: var(--color-text-accent);
    border-color: var(--color-border-accent);
  }

  .btn--secondary:hover:not(.btn--disabled) {
    background: rgba(var(--color-accent-cyan-rgb), 0.08);
    border-color: var(--color-accent-cyan);
    box-shadow: var(--shadow-glow-cyan);
    transform: scale(1.03);
  }

  .btn--secondary:active:not(.btn--disabled) {
    transform: scale(0.98);
    background: rgba(var(--color-accent-cyan-rgb), 0.12);
  }

  /* ---- Ghost ---- */
  .btn--ghost {
    background: transparent;
    color: var(--color-text-accent);
    border-color: transparent;
  }

  .btn--ghost:hover:not(.btn--disabled) {
    background: rgba(var(--color-accent-cyan-rgb), 0.08);
    transform: scale(1.03);
  }

  .btn--ghost:active:not(.btn--disabled) {
    transform: scale(0.98);
    background: rgba(var(--color-accent-cyan-rgb), 0.12);
  }

  /* ---- Disabled ---- */
  .btn--disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  /* ---- Focus visible ---- */
  .btn:focus-visible {
    outline: var(--border-width-medium) solid var(--color-border-focus);
    outline-offset: 2px;
  }
</style>

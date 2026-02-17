<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    variant?: 'default' | 'success' | 'warning' | 'accent';
    children: Snippet;
  }

  let {
    variant = 'default',
    children
  }: Props = $props();
</script>

<span class="badge badge--{variant}">
  {@render children()}
</span>

<style>
  .badge {
    display: inline-flex;
    align-items: center;
    padding: var(--space-1) var(--space-3);
    font-size: var(--text-xs);
    font-weight: var(--font-semibold);
    line-height: var(--leading-normal);
    letter-spacing: var(--tracking-wider);
    text-transform: uppercase;
    border-radius: var(--radius-full);
    white-space: nowrap;
    user-select: none;
    -webkit-user-select: none;
  }

  /* ---- Default ---- */
  .badge--default {
    background: var(--color-bg-tertiary);
    color: var(--color-text-secondary);
    border: var(--border-width-thin) solid var(--color-border-primary);
  }

  /* ---- Success ---- */
  .badge--success {
    background: var(--color-success-bg);
    color: var(--color-success);
    border: var(--border-width-thin) solid rgba(16, 185, 129, 0.2);
  }

  /* ---- Warning ---- */
  .badge--warning {
    background: var(--color-warning-bg);
    color: var(--color-warning);
    border: var(--border-width-thin) solid rgba(245, 158, 11, 0.2);
  }

  /* ---- Accent ---- */
  .badge--accent {
    background: rgba(var(--color-accent-cyan-rgb), 0.1);
    color: var(--color-accent-cyan);
    border: var(--border-width-thin) solid rgba(var(--color-accent-cyan-rgb), 0.2);
  }
</style>

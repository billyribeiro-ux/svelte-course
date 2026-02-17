<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    glass?: boolean;
    hover?: boolean;
    padding?: 'sm' | 'md' | 'lg';
    children: Snippet;
  }

  let {
    glass = false,
    hover = true,
    padding = 'md',
    children
  }: Props = $props();
</script>

<div
  class="card card--pad-{padding}"
  class:card--glass={glass}
  class:card--hover={hover}
>
  {@render children()}
</div>

<style>
  .card {
    background: var(--color-bg-secondary);
    border: var(--border-width-thin) solid var(--color-border-primary);
    border-radius: var(--radius-xl);
    transition:
      transform var(--transition-base),
      box-shadow var(--transition-base),
      border-color var(--transition-base),
      background-color var(--transition-base);
  }

  /* ---- Padding sizes ---- */
  .card--pad-sm {
    padding: var(--space-4);
  }

  .card--pad-md {
    padding: var(--space-6);
  }

  .card--pad-lg {
    padding: var(--space-8);
  }

  /* ---- Glass mode ---- */
  .card--glass {
    background: var(--glass-bg);
    backdrop-filter: var(--glass-blur);
    -webkit-backdrop-filter: var(--glass-blur);
    border-color: var(--glass-border);
  }

  /* ---- Hover effect ---- */
  .card--hover:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
    border-color: var(--color-border-secondary);
  }

  .card--glass.card--hover:hover {
    background: var(--glass-bg-hover);
    border-color: var(--glass-border-hover);
    box-shadow: var(--shadow-lg);
  }
</style>

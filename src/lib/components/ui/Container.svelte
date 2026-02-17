<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    narrow?: boolean;
    children: Snippet;
  }

  let {
    narrow = false,
    children
  }: Props = $props();
</script>

<div class="container" class:container--narrow={narrow}>
  {@render children()}
</div>

<style>
  .container {
    width: 100%;
    max-width: 1200px;
    margin-inline: auto;
    padding-inline: var(--container-padding);
  }

  .container--narrow {
    max-width: 800px;
  }
</style>

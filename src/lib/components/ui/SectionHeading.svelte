<script lang="ts">
  interface Props {
    title: string;
    subtitle?: string;
    centered?: boolean;
    light?: boolean;
  }

  let {
    title,
    subtitle,
    centered = true,
    light = false
  }: Props = $props();
</script>

<div class="section-heading" class:section-heading--centered={centered}>
  <h2 class="section-heading__title" class:section-heading__title--light={light}>
    {title}
  </h2>
  {#if subtitle}
    <p class="section-heading__subtitle">
      {subtitle}
    </p>
  {/if}
</div>

<style>
  .section-heading {
    margin-bottom: var(--space-12);
  }

  .section-heading--centered {
    text-align: center;
  }

  .section-heading__title {
    font-size: var(--text-4xl);
    font-weight: var(--font-bold);
    line-height: var(--leading-tight);
    letter-spacing: var(--tracking-tight);
    background: var(--gradient-text);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: var(--space-4);
  }

  .section-heading__title--light {
    background: none;
    -webkit-background-clip: unset;
    background-clip: unset;
    -webkit-text-fill-color: unset;
    color: var(--color-text-primary);
  }

  .section-heading__subtitle {
    font-size: var(--text-lg);
    color: var(--color-text-secondary);
    line-height: var(--leading-relaxed);
    max-width: 40rem;
    margin: 0;
  }

  .section-heading--centered .section-heading__subtitle {
    margin-inline: auto;
  }
</style>

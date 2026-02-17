<script lang="ts">
  interface Props {
    name: string;
    label: string;
    type?: 'text' | 'email' | 'tel';
    value?: string;
    required?: boolean;
    error?: string;
  }

  let {
    name,
    label,
    type = 'text',
    value = $bindable(''),
    required = false,
    error
  }: Props = $props();
</script>

<div class="input-group" class:input-group--error={!!error}>
  <label class="input-group__label" for={name}>
    {label}
    {#if required}
      <span class="input-group__required" aria-hidden="true">*</span>
    {/if}
  </label>
  <input
    id={name}
    {name}
    {type}
    {required}
    bind:value
    class="input-group__input"
    aria-invalid={!!error || undefined}
    aria-describedby={error ? `${name}-error` : undefined}
  />
  {#if error}
    <p class="input-group__error" id="{name}-error" role="alert">
      {error}
    </p>
  {/if}
</div>

<style>
  .input-group {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    width: 100%;
  }

  .input-group__label {
    font-size: var(--text-sm);
    font-weight: var(--font-medium);
    color: var(--color-text-secondary);
    letter-spacing: var(--tracking-wide);
  }

  .input-group__required {
    color: var(--color-error);
    margin-left: var(--space-1);
  }

  .input-group__input {
    width: 100%;
    padding: var(--space-3) var(--space-4);
    background: var(--color-bg-tertiary);
    border: var(--border-width-thin) solid var(--color-border-primary);
    border-radius: var(--radius-md);
    color: var(--color-text-primary);
    font-size: var(--text-base);
    line-height: var(--leading-normal);
    transition:
      border-color var(--transition-fast),
      box-shadow var(--transition-fast),
      background-color var(--transition-fast);
    outline: none;
  }

  .input-group__input::placeholder {
    color: var(--color-text-tertiary);
  }

  .input-group__input:focus {
    border-color: var(--color-border-focus);
    box-shadow: 0 0 0 3px rgba(var(--color-accent-cyan-rgb), 0.15);
    background: var(--color-bg-elevated);
  }

  /* ---- Error state ---- */
  .input-group--error .input-group__input {
    border-color: var(--color-error);
  }

  .input-group--error .input-group__input:focus {
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
    border-color: var(--color-error);
  }

  .input-group__error {
    font-size: var(--text-sm);
    color: var(--color-error);
    line-height: var(--leading-snug);
    margin: 0;
  }
</style>

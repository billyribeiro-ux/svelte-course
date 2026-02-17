<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    open: boolean;
    children: Snippet;
  }

  let {
    open = $bindable(false),
    children
  }: Props = $props();

  function handleBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      open = false;
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      open = false;
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
  <div
    class="modal-backdrop"
    onclick={handleBackdropClick}
    role="dialog"
    aria-modal="true"
  >
    <div class="modal">
      <button
        class="modal__close"
        onclick={() => (open = false)}
        aria-label="Close modal"
        type="button"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
      <div class="modal__content">
        {@render children()}
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    inset: 0;
    z-index: var(--z-modal);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-4);
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    animation: fade-in 200ms ease forwards;
  }

  .modal {
    position: relative;
    width: 100%;
    max-width: 32rem;
    max-height: 90vh;
    overflow-y: auto;
    background: var(--color-bg-secondary);
    border: var(--border-width-thin) solid var(--color-border-secondary);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-2xl);
    animation: modal-slide-in 250ms var(--ease-out-expo) forwards;
  }

  .modal__content {
    padding: var(--space-8);
  }

  .modal__close {
    position: absolute;
    top: var(--space-4);
    right: var(--space-4);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    padding: 0;
    background: transparent;
    border: none;
    border-radius: var(--radius-md);
    color: var(--color-text-tertiary);
    cursor: pointer;
    transition:
      color var(--transition-fast),
      background-color var(--transition-fast);
    z-index: 1;
  }

  .modal__close:hover {
    color: var(--color-text-primary);
    background: rgba(255, 255, 255, 0.08);
  }

  .modal__close:focus-visible {
    outline: var(--border-width-medium) solid var(--color-border-focus);
    outline-offset: 2px;
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes modal-slide-in {
    from {
      opacity: 0;
      transform: translateY(16px) scale(0.96);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
</style>

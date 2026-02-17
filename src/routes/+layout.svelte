<script lang="ts">
  import '../app.css';
  import Header from '$components/layout/Header.svelte';
  import Footer from '$components/layout/Footer.svelte';
  import { theme } from '$stores/theme.svelte';
  import { onNavigate } from '$app/navigation';

  let { children } = $props();

  $effect(() => {
    theme.init();
  });

  onNavigate((navigation) => {
    // @ts-expect-error - View Transitions API not yet in all TS libs
    if (!document.startViewTransition) return;
    return new Promise((resolve) => {
      // @ts-expect-error
      document.startViewTransition(async () => {
        resolve();
        await navigation.complete;
      });
    });
  });
</script>

<div class="app-wrapper">
  <Header />
  <main>
    {@render children()}
  </main>
  <Footer />
</div>

<style>
  .app-wrapper {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  main {
    flex: 1;
    padding-top: var(--header-height);
  }
</style>

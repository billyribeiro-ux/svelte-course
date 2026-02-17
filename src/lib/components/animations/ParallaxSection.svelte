<script lang="ts">
  import type { Snippet } from 'svelte';
  import { browser } from '$app/environment';

  interface Props {
    speed?: number;
    bgClass?: string;
    children: Snippet;
  }

  let {
    speed = 0.3,
    bgClass = '',
    children
  }: Props = $props();

  let section: HTMLElement;
  let bgElement: HTMLDivElement;

  $effect(() => {
    if (!browser || !section || !bgElement) return;

    let ctx: gsap.Context | undefined;

    (async () => {
      const { default: gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        gsap.to(bgElement, {
          yPercent: speed * 100,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        });
      }, section);
    })();

    return () => {
      ctx?.revert();
    };
  });
</script>

<section bind:this={section} class="parallax-section">
  <div bind:this={bgElement} class="parallax-bg {bgClass}"></div>
  <div class="parallax-content">
    {@render children()}
  </div>
</section>

<style>
  .parallax-section {
    position: relative;
    overflow: hidden;
  }

  .parallax-bg {
    position: absolute;
    inset: -20% 0;
    z-index: 0;
  }

  .parallax-content {
    position: relative;
    z-index: 1;
  }
</style>

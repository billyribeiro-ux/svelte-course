<script lang="ts">
  import type { Snippet } from 'svelte';
  import { browser } from '$app/environment';

  interface Props {
    delay?: number;
    duration?: number;
    children: Snippet;
  }

  let {
    delay = 0,
    duration = 0.6,
    children
  }: Props = $props();

  let wrapper: HTMLDivElement;

  $effect(() => {
    if (!browser || !wrapper) return;

    let ctx: gsap.Context | undefined;

    (async () => {
      const { default: gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        gsap.from(wrapper, {
          opacity: 0,
          duration,
          delay,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: wrapper,
            start: 'top 85%',
            end: 'bottom 15%',
            toggleActions: 'play none none none'
          }
        });
      }, wrapper);
    })();

    return () => {
      ctx?.revert();
    };
  });
</script>

<div bind:this={wrapper}>
  {@render children()}
</div>

<script lang="ts">
  import type { Snippet } from 'svelte';
  import { browser } from '$app/environment';

  interface Props {
    stagger?: number;
    direction?: 'up' | 'left';
    children: Snippet;
  }

  let {
    stagger = 0.1,
    direction = 'up',
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

      const fromVars: Record<string, { x: number; y: number }> = {
        up: { x: 0, y: 40 },
        left: { x: 40, y: 0 }
      };

      const { x, y } = fromVars[direction] ?? fromVars.up;

      ctx = gsap.context(() => {
        const items = wrapper.children;

        gsap.from(items, {
          x,
          y,
          opacity: 0,
          duration: 0.6,
          stagger,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: wrapper,
            start: 'top 85%',
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

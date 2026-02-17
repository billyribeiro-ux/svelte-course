<script lang="ts">
  import type { Snippet } from 'svelte';
  import { browser } from '$app/environment';

  interface Props {
    direction?: 'up' | 'down' | 'left' | 'right' | 'none';
    delay?: number;
    duration?: number;
    distance?: number;
    stagger?: number;
    children: Snippet;
  }

  let {
    direction = 'up',
    delay = 0,
    duration = 0.8,
    distance = 60,
    stagger = 0,
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

      const directionMap: Record<string, { x: number; y: number }> = {
        up: { x: 0, y: distance },
        down: { x: 0, y: -distance },
        left: { x: distance, y: 0 },
        right: { x: -distance, y: 0 },
        none: { x: 0, y: 0 }
      };

      const { x, y } = directionMap[direction] ?? directionMap.up;

      ctx = gsap.context(() => {
        const targets = stagger > 0 ? wrapper.children : wrapper;

        gsap.from(targets, {
          x,
          y,
          opacity: 0,
          duration,
          delay,
          stagger: stagger > 0 ? stagger : undefined,
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

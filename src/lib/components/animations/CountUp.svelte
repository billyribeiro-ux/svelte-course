<script lang="ts">
  import { browser } from '$app/environment';

  interface Props {
    target: number;
    prefix?: string;
    suffix?: string;
    duration?: number;
    decimals?: number;
  }

  let {
    target,
    prefix = '',
    suffix = '',
    duration = 2,
    decimals = 0
  }: Props = $props();

  let displayValue = $state('0');
  let wrapper: HTMLSpanElement;

  $effect(() => {
    if (!browser || !wrapper) return;

    let ctx: gsap.Context | undefined;

    (async () => {
      const { default: gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      const counter = { value: 0 };

      ctx = gsap.context(() => {
        gsap.to(counter, {
          value: target,
          duration,
          ease: 'power1.out',
          scrollTrigger: {
            trigger: wrapper,
            start: 'top 85%',
            toggleActions: 'play none none none'
          },
          onUpdate: () => {
            displayValue = counter.value.toFixed(decimals);
          }
        });
      }, wrapper);
    })();

    return () => {
      ctx?.revert();
    };
  });
</script>

<span bind:this={wrapper}>
  {prefix}{displayValue}{suffix}
</span>

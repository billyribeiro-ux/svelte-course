<script lang="ts">
  import { browser } from '$app/environment';

  interface Props {
    text: string;
    tag?: 'h1' | 'h2' | 'h3' | 'p';
    class?: string;
    delay?: number;
  }

  let {
    text,
    tag = 'h2',
    class: className = '',
    delay = 0
  }: Props = $props();

  let words = $derived(text.split(/\s+/).filter(Boolean));
  let wrapper: HTMLElement;

  $effect(() => {
    if (!browser || !wrapper) return;

    let ctx: gsap.Context | undefined;

    (async () => {
      const { default: gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        const wordSpans = wrapper.querySelectorAll('.word');

        gsap.from(wordSpans, {
          opacity: 0,
          y: 20,
          duration: 0.5,
          delay,
          stagger: 0.05,
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

{#if tag === 'h1'}
  <h1 bind:this={wrapper} class={className}>
    {#each words as word, i}
      <span class="word" style="display:inline-block">{word}</span>{#if i < words.length - 1}&nbsp;{/if}
    {/each}
  </h1>
{:else if tag === 'h2'}
  <h2 bind:this={wrapper} class={className}>
    {#each words as word, i}
      <span class="word" style="display:inline-block">{word}</span>{#if i < words.length - 1}&nbsp;{/if}
    {/each}
  </h2>
{:else if tag === 'h3'}
  <h3 bind:this={wrapper} class={className}>
    {#each words as word, i}
      <span class="word" style="display:inline-block">{word}</span>{#if i < words.length - 1}&nbsp;{/if}
    {/each}
  </h3>
{:else}
  <p bind:this={wrapper} class={className}>
    {#each words as word, i}
      <span class="word" style="display:inline-block">{word}</span>{#if i < words.length - 1}&nbsp;{/if}
    {/each}
  </p>
{/if}

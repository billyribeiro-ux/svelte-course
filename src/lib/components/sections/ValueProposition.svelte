<script lang="ts">
  import ScrollReveal from '$components/animations/ScrollReveal.svelte';
  import Card from '$components/ui/Card.svelte';
  import ChartLineUp from 'phosphor-svelte/lib/ChartLineUp';
  import ShieldCheck from 'phosphor-svelte/lib/ShieldCheck';
  import Users from 'phosphor-svelte/lib/Users';

  const values = [
    {
      icon: ChartLineUp,
      title: 'Expert-Led Education',
      description:
        'Learn from traders with 15+ years of real market experience. Our instructors have navigated every market condition and distilled their knowledge into actionable, easy-to-follow curricula.'
    },
    {
      icon: ShieldCheck,
      title: 'Proven Risk Management',
      description:
        'Master the strategies that protect your capital and maximize returns. Learn position sizing, stop-loss techniques, and portfolio diversification methods used by professional fund managers.'
    },
    {
      icon: Users,
      title: 'Thriving Community',
      description:
        'Join 10,000+ traders sharing insights, strategies, and real-time market analysis. Get access to live trading rooms, weekly webinars, and a supportive network of like-minded traders.'
    }
  ];
</script>

<section class="value-prop">
  <div class="value-prop__container">
    <div class="value-prop__header">
      <h2 class="value-prop__heading">
        Why Choose <span class="value-prop__heading-accent">Revolution Trading Pros?</span>
      </h2>
      <p class="value-prop__subheading">
        Everything you need to go from beginner to consistently profitable trader,
        all in one platform.
      </p>
    </div>

    <ScrollReveal stagger={0.15}>
      <div class="value-prop__grid">
        {#each values as item}
          <Card glass>
            <div class="value-card">
              <div class="value-card__icon-wrapper">
                <item.icon size={32} weight="duotone" />
              </div>
              <h3 class="value-card__title">{item.title}</h3>
              <p class="value-card__description">{item.description}</p>
            </div>
          </Card>
        {/each}
      </div>
    </ScrollReveal>
  </div>
</section>

<style>
  .value-prop {
    position: relative;
    padding-block: var(--space-24);
    background: var(--color-bg-primary);
  }

  .value-prop__container {
    width: 100%;
    max-width: var(--container-xl);
    margin-inline: auto;
    padding-inline: var(--container-padding);
  }

  .value-prop__header {
    text-align: center;
    margin-bottom: var(--space-16);
    max-width: 40rem;
    margin-inline: auto;
  }

  .value-prop__heading {
    font-size: var(--text-4xl);
    font-weight: var(--font-bold);
    margin-bottom: var(--space-4);
    color: var(--color-text-primary);
  }

  .value-prop__heading-accent {
    background: var(--gradient-text);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .value-prop__subheading {
    font-size: var(--text-lg);
    color: var(--color-text-secondary);
    line-height: var(--leading-relaxed);
  }

  .value-prop__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-8);
  }

  .value-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: var(--space-4);
  }

  .value-card__icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 4rem;
    height: 4rem;
    border-radius: var(--radius-xl);
    background: rgba(var(--color-accent-cyan-rgb), 0.1);
    color: var(--color-accent-cyan);
    flex-shrink: 0;
  }

  .value-card__title {
    font-size: var(--text-xl);
    font-weight: var(--font-semibold);
    color: var(--color-text-primary);
  }

  .value-card__description {
    font-size: var(--text-base);
    color: var(--color-text-secondary);
    line-height: var(--leading-relaxed);
  }

  /* ---- Responsive ---- */
  @media (max-width: 1024px) {
    .value-prop__grid {
      grid-template-columns: repeat(3, 1fr);
      gap: var(--space-6);
    }
  }

  @media (max-width: 768px) {
    .value-prop {
      padding-block: var(--space-16);
    }

    .value-prop__grid {
      grid-template-columns: 1fr;
      gap: var(--space-6);
      max-width: 32rem;
      margin-inline: auto;
    }

    .value-prop__header {
      margin-bottom: var(--space-10);
    }
  }
</style>

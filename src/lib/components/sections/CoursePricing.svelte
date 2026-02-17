<script lang="ts">
  import type { PricingTier } from '$types/course';
  import ScrollReveal from '$components/animations/ScrollReveal.svelte';
  import Card from '$components/ui/Card.svelte';
  import Button from '$components/ui/Button.svelte';
  import CheckCircle from 'phosphor-svelte/lib/CheckCircle';

  interface Props {
    tiers: PricingTier[];
  }

  let { tiers }: Props = $props();
</script>

<section class="pricing">
  <div class="pricing__container">
    <div class="pricing__header">
      <h2 class="pricing__heading">
        Choose Your <span class="pricing__heading-accent">Trading Path</span>
      </h2>
      <p class="pricing__subheading">
        Flexible plans designed to match your goals. Start free and upgrade
        as your trading skills grow.
      </p>
    </div>

    <ScrollReveal stagger={0.15}>
      <div class="pricing__grid">
        {#each tiers as tier}
          <div
            class="pricing-card-wrapper"
            class:pricing-card-wrapper--highlighted={tier.highlighted}
          >
            {#if tier.highlighted}
              <div class="pricing-card__popular">Most Popular</div>
            {/if}
            <Card glass={!tier.highlighted} hover>
              <div class="pricing-card" class:pricing-card--highlighted={tier.highlighted}>
                <div class="pricing-card__top">
                  <h3 class="pricing-card__name">{tier.name}</h3>
                  <div class="pricing-card__price">
                    <span class="pricing-card__currency">$</span>
                    <span class="pricing-card__amount">{tier.price}</span>
                    <span class="pricing-card__period">/{tier.period}</span>
                  </div>
                </div>

                <ul class="pricing-card__features">
                  {#each tier.features as feature}
                    <li class="pricing-card__feature">
                      <span class="pricing-card__check">
                        <CheckCircle size={20} weight="fill" />
                      </span>
                      <span>{feature}</span>
                    </li>
                  {/each}
                </ul>

                <div class="pricing-card__cta">
                  <Button
                    variant={tier.highlighted ? 'primary' : 'secondary'}
                    size="lg"
                    href="/courses?tier={tier.tier}"
                  >
                    {tier.ctaText}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        {/each}
      </div>
    </ScrollReveal>
  </div>
</section>

<style>
  .pricing {
    position: relative;
    padding-block: var(--space-24);
    background: var(--color-bg-primary);
  }

  .pricing__container {
    width: 100%;
    max-width: var(--container-xl);
    margin-inline: auto;
    padding-inline: var(--container-padding);
  }

  .pricing__header {
    text-align: center;
    margin-bottom: var(--space-16);
    max-width: 40rem;
    margin-inline: auto;
  }

  .pricing__heading {
    font-size: var(--text-4xl);
    font-weight: var(--font-bold);
    margin-bottom: var(--space-4);
    color: var(--color-text-primary);
  }

  .pricing__heading-accent {
    background: var(--gradient-text);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .pricing__subheading {
    font-size: var(--text-lg);
    color: var(--color-text-secondary);
    line-height: var(--leading-relaxed);
  }

  .pricing__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-8);
    align-items: start;
  }

  .pricing-card-wrapper {
    position: relative;
  }

  .pricing-card-wrapper--highlighted {
    transform: scale(1.05);
    z-index: 1;
  }

  .pricing-card-wrapper--highlighted :global(.card) {
    background: var(--color-bg-secondary);
    border-color: rgba(var(--color-accent-cyan-rgb), 0.3);
    box-shadow:
      0 0 30px rgba(var(--color-accent-cyan-rgb), 0.1),
      0 0 60px rgba(var(--color-accent-purple-rgb), 0.05);
  }

  .pricing-card__popular {
    position: absolute;
    top: -14px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
    padding: var(--space-1) var(--space-4);
    font-size: var(--text-xs);
    font-weight: var(--font-bold);
    text-transform: uppercase;
    letter-spacing: var(--tracking-wider);
    color: var(--color-text-inverse);
    background: var(--gradient-cta);
    border-radius: var(--radius-full);
    white-space: nowrap;
  }

  .pricing-card {
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
    min-height: 28rem;
  }

  .pricing-card__top {
    text-align: center;
    padding-bottom: var(--space-6);
    border-bottom: var(--border-width-thin) solid var(--color-border-primary);
  }

  .pricing-card__name {
    font-size: var(--text-xl);
    font-weight: var(--font-semibold);
    color: var(--color-text-primary);
    margin-bottom: var(--space-4);
  }

  .pricing-card__price {
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: 2px;
  }

  .pricing-card__currency {
    font-size: var(--text-2xl);
    font-weight: var(--font-bold);
    color: var(--color-text-secondary);
    align-self: flex-start;
    margin-top: 0.25em;
  }

  .pricing-card__amount {
    font-size: var(--text-6xl);
    font-weight: var(--font-extrabold);
    color: var(--color-text-primary);
    line-height: var(--leading-none);
    letter-spacing: var(--tracking-tight);
  }

  .pricing-card--highlighted .pricing-card__amount {
    background: var(--gradient-text);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .pricing-card__period {
    font-size: var(--text-base);
    color: var(--color-text-tertiary);
    font-weight: var(--font-medium);
  }

  .pricing-card__features {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    flex-grow: 1;
  }

  .pricing-card__feature {
    display: flex;
    align-items: flex-start;
    gap: var(--space-3);
    font-size: var(--text-sm);
    color: var(--color-text-secondary);
    line-height: var(--leading-normal);
  }

  .pricing-card__check {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    color: var(--color-accent-cyan);
    margin-top: 1px;
  }

  .pricing-card__cta {
    padding-top: var(--space-2);
  }

  .pricing-card__cta :global(.btn) {
    width: 100%;
  }

  /* ---- Responsive ---- */
  @media (max-width: 1024px) {
    .pricing-card-wrapper--highlighted {
      transform: scale(1.02);
    }

    .pricing__grid {
      gap: var(--space-6);
    }
  }

  @media (max-width: 768px) {
    .pricing {
      padding-block: var(--space-16);
    }

    .pricing__grid {
      grid-template-columns: 1fr;
      gap: var(--space-6);
      max-width: 24rem;
      margin-inline: auto;
    }

    .pricing-card-wrapper--highlighted {
      transform: none;
      order: -1;
    }

    .pricing-card {
      min-height: auto;
    }

    .pricing__header {
      margin-bottom: var(--space-10);
    }
  }
</style>

<script lang="ts">
  import type { Testimonial } from '$types/testimonial';
  import ScrollReveal from '$components/animations/ScrollReveal.svelte';
  import Card from '$components/ui/Card.svelte';
  import Star from 'phosphor-svelte/lib/Star';

  interface Props {
    testimonials: Testimonial[];
  }

  let { testimonials }: Props = $props();
</script>

<section class="testimonials">
  <div class="testimonials__container">
    <div class="testimonials__header">
      <h2 class="testimonials__heading">
        What Our <span class="testimonials__heading-accent">Students Say</span>
      </h2>
      <p class="testimonials__subheading">
        Real results from real traders. Hear how Revolution Trading Pros
        has transformed their trading journey.
      </p>
    </div>

    <ScrollReveal stagger={0.12}>
      <div class="testimonials__grid">
        {#each testimonials as testimonial}
          <Card glass>
            <div class="testimonial-card">
              <div class="testimonial-card__stars">
                {#each Array(5) as _, i}
                  <span
                    class="testimonial-card__star"
                    class:testimonial-card__star--filled={i < testimonial.rating}
                  >
                    <Star
                      size={18}
                      weight={i < testimonial.rating ? 'fill' : 'regular'}
                    />
                  </span>
                {/each}
              </div>

              <blockquote class="testimonial-card__quote">
                "{testimonial.content}"
              </blockquote>

              <div class="testimonial-card__author">
                <div class="testimonial-card__avatar">
                  {testimonial.name.charAt(0)}
                </div>
                <div class="testimonial-card__info">
                  <span class="testimonial-card__name">{testimonial.name}</span>
                  <span class="testimonial-card__role">{testimonial.role}</span>
                </div>
                {#if testimonial.profit}
                  <div class="testimonial-card__profit">
                    <span class="testimonial-card__profit-label">Profit</span>
                    <span class="testimonial-card__profit-value">{testimonial.profit}</span>
                  </div>
                {/if}
              </div>
            </div>
          </Card>
        {/each}
      </div>
    </ScrollReveal>
  </div>
</section>

<style>
  .testimonials {
    position: relative;
    padding-block: var(--space-24);
    background: var(--color-bg-secondary);
  }

  .testimonials__container {
    width: 100%;
    max-width: var(--container-xl);
    margin-inline: auto;
    padding-inline: var(--container-padding);
  }

  .testimonials__header {
    text-align: center;
    margin-bottom: var(--space-16);
    max-width: 40rem;
    margin-inline: auto;
  }

  .testimonials__heading {
    font-size: var(--text-4xl);
    font-weight: var(--font-bold);
    margin-bottom: var(--space-4);
    color: var(--color-text-primary);
  }

  .testimonials__heading-accent {
    background: var(--gradient-text);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .testimonials__subheading {
    font-size: var(--text-lg);
    color: var(--color-text-secondary);
    line-height: var(--leading-relaxed);
  }

  .testimonials__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-6);
  }

  .testimonial-card {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .testimonial-card__stars {
    display: flex;
    gap: var(--space-1);
  }

  .testimonial-card__star {
    color: var(--color-text-tertiary);
    display: flex;
    align-items: center;
  }

  .testimonial-card__star--filled {
    color: var(--color-warning);
  }

  .testimonial-card__quote {
    font-size: var(--text-base);
    color: var(--color-text-secondary);
    line-height: var(--leading-relaxed);
    font-style: italic;
    flex-grow: 1;
    border: none;
    margin: 0;
    padding: 0;
  }

  .testimonial-card__author {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding-top: var(--space-4);
    border-top: var(--border-width-thin) solid var(--color-border-primary);
  }

  .testimonial-card__avatar {
    width: 2.75rem;
    height: 2.75rem;
    border-radius: var(--radius-full);
    background: var(--gradient-cta);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--text-lg);
    font-weight: var(--font-bold);
    color: var(--color-text-inverse);
    flex-shrink: 0;
  }

  .testimonial-card__info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex-grow: 1;
    min-width: 0;
  }

  .testimonial-card__name {
    font-size: var(--text-sm);
    font-weight: var(--font-semibold);
    color: var(--color-text-primary);
  }

  .testimonial-card__role {
    font-size: var(--text-xs);
    color: var(--color-text-tertiary);
  }

  .testimonial-card__profit {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    flex-shrink: 0;
    gap: 2px;
  }

  .testimonial-card__profit-label {
    font-size: var(--text-xs);
    color: var(--color-text-tertiary);
    text-transform: uppercase;
    letter-spacing: var(--tracking-wider);
  }

  .testimonial-card__profit-value {
    font-size: var(--text-sm);
    font-weight: var(--font-bold);
    color: var(--color-success);
  }

  /* ---- Responsive ---- */
  @media (max-width: 1024px) {
    .testimonials__grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 768px) {
    .testimonials {
      padding-block: var(--space-16);
    }

    .testimonials__grid {
      grid-template-columns: 1fr;
      gap: var(--space-4);
      max-width: 32rem;
      margin-inline: auto;
    }

    .testimonials__header {
      margin-bottom: var(--space-10);
    }
  }
</style>

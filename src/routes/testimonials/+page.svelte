<script lang="ts">
  import SEOHead from '$components/seo/SEOHead.svelte';
  import JsonLd from '$components/seo/JsonLd.svelte';
  import Container from '$components/ui/Container.svelte';
  import Card from '$components/ui/Card.svelte';
  import Badge from '$components/ui/Badge.svelte';
  import ScrollReveal from '$components/animations/ScrollReveal.svelte';
  import Star from 'phosphor-svelte/lib/Star';
  import Quotes from 'phosphor-svelte/lib/Quotes';

  let { data } = $props();

  const courses = ['All', 'Trading Foundations', 'Advanced Strategies', 'Elite Mentorship'];

  let activeFilter = $state('All');

  let filteredTestimonials = $derived(
    activeFilter === 'All'
      ? data.testimonials
      : data.testimonials.filter((t) => t.course === activeFilter)
  );

  function setFilter(course: string) {
    activeFilter = course;
  }
</script>

<SEOHead
  title="Student Success Stories - Revolution Trading Pros"
  description="Read real success stories from Revolution Trading Pros students. Discover how our trading courses have helped thousands achieve consistent profitability."
/>
<JsonLd schema={{
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Student Success Stories',
  description: 'Real testimonials and success stories from Revolution Trading Pros students.',
  url: 'https://revolutiontradingpros.com/testimonials',
  mainEntity: {
    '@type': 'ItemList',
    numberOfItems: data.testimonials.length,
    itemListElement: data.testimonials.map((t, i) => ({
      '@type': 'Review',
      position: i + 1,
      author: { '@type': 'Person', name: t.name },
      reviewBody: t.content,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: t.rating,
        bestRating: 5
      }
    }))
  }
}} />

<!-- Hero Banner -->
<section class="hero">
  <Container>
    <ScrollReveal>
      <div class="hero-content">
        <h1 class="hero-title">Student <span class="gradient-text">Success Stories</span></h1>
        <p class="hero-subtitle">
          Real results from real traders. See how our students are transforming their financial futures with Revolution Trading Pros.
        </p>
      </div>
    </ScrollReveal>
  </Container>
</section>

<!-- Filter & Testimonials -->
<section class="testimonials-section">
  <Container>
    <!-- Filter Buttons -->
    <ScrollReveal>
      <div class="filter-bar">
        {#each courses as course}
          <button
            class="filter-btn"
            class:filter-btn--active={activeFilter === course}
            onclick={() => setFilter(course)}
          >
            {course}
          </button>
        {/each}
      </div>
    </ScrollReveal>

    <!-- Testimonials Grid -->
    <div class="testimonials-grid">
      {#each filteredTestimonials as testimonial, i (testimonial.id)}
        <ScrollReveal direction="up" delay={i * 0.08}>
          <Card glass hover padding="lg">
            <div class="testimonial-card">
              <!-- Quote Icon -->
              <div class="quote-icon">
                <Quotes size={32} weight="fill" />
              </div>

              <!-- Content -->
              <p class="testimonial-content">{testimonial.content}</p>

              <!-- Star Rating -->
              <div class="star-rating">
                {#each Array(5) as _, s}
                  <span class="star" class:star--filled={s < testimonial.rating}>
                    <Star size={18} weight={s < testimonial.rating ? 'fill' : 'regular'} />
                  </span>
                {/each}
              </div>

              <!-- Author Info -->
              <div class="testimonial-author">
                <div class="author-avatar">
                  <span class="author-initials">
                    {testimonial.name.split(' ').map((n: string) => n[0]).join('')}
                  </span>
                </div>
                <div class="author-details">
                  <p class="author-name">{testimonial.name}</p>
                  <p class="author-role">{testimonial.role}</p>
                </div>
              </div>

              <!-- Footer: Profit & Course Badge -->
              <div class="testimonial-footer">
                {#if testimonial.profit}
                  <span class="profit-badge">{testimonial.profit}</span>
                {/if}
                {#if testimonial.course}
                  <Badge variant="accent">{testimonial.course}</Badge>
                {/if}
              </div>
            </div>
          </Card>
        </ScrollReveal>
      {/each}
    </div>

    <!-- Empty State -->
    {#if filteredTestimonials.length === 0}
      <div class="empty-state">
        <p>No testimonials found for this course. Try a different filter.</p>
      </div>
    {/if}
  </Container>
</section>

<style>
  /* ---- Hero ---- */
  .hero {
    position: relative;
    padding: var(--space-24) 0 var(--space-16);
    background: var(--gradient-bg-hero);
    text-align: center;
    overflow: hidden;
  }

  .hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--gradient-bg-radial);
    pointer-events: none;
  }

  .hero-content {
    position: relative;
    max-width: 700px;
    margin-inline: auto;
  }

  .hero-title {
    font-size: var(--text-6xl);
    font-weight: var(--font-extrabold);
    line-height: var(--leading-tight);
    letter-spacing: var(--tracking-tight);
    margin-bottom: var(--space-6);
  }

  .hero-subtitle {
    font-size: var(--text-xl);
    color: var(--color-text-secondary);
    line-height: var(--leading-relaxed);
    max-width: 600px;
    margin-inline: auto;
  }

  /* ---- Testimonials Section ---- */
  .testimonials-section {
    padding: var(--space-16) 0 var(--space-24);
  }

  /* ---- Filter Bar ---- */
  .filter-bar {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--space-3);
    margin-bottom: var(--space-12);
  }

  .filter-btn {
    padding: var(--space-2) var(--space-5);
    font-size: var(--text-sm);
    font-weight: var(--font-semibold);
    color: var(--color-text-secondary);
    background: var(--color-bg-secondary);
    border: var(--border-width-thin) solid var(--color-border-primary);
    border-radius: var(--radius-full);
    cursor: pointer;
    transition:
      color var(--transition-fast),
      background-color var(--transition-fast),
      border-color var(--transition-fast),
      box-shadow var(--transition-fast);
    white-space: nowrap;
  }

  .filter-btn:hover {
    color: var(--color-text-primary);
    background: var(--color-bg-tertiary);
    border-color: var(--color-border-secondary);
  }

  .filter-btn--active {
    color: var(--color-text-inverse);
    background: var(--gradient-cta);
    border-color: transparent;
    box-shadow: var(--shadow-glow-cta);
  }

  .filter-btn--active:hover {
    color: var(--color-text-inverse);
    background: var(--gradient-cta-hover);
    border-color: transparent;
  }

  /* ---- Grid ---- */
  .testimonials-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-8);
  }

  /* ---- Testimonial Card ---- */
  .testimonial-card {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    height: 100%;
  }

  .quote-icon {
    color: var(--color-accent-cyan);
    opacity: 0.5;
    line-height: 1;
  }

  .testimonial-content {
    font-size: var(--text-base);
    color: var(--color-text-secondary);
    line-height: var(--leading-relaxed);
    flex: 1;
  }

  /* ---- Star Rating ---- */
  .star-rating {
    display: flex;
    gap: var(--space-1);
  }

  .star {
    color: var(--color-text-tertiary);
    display: flex;
    align-items: center;
  }

  .star--filled {
    color: #f59e0b;
  }

  /* ---- Author ---- */
  .testimonial-author {
    display: flex;
    align-items: center;
    gap: var(--space-3);
  }

  .author-avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border-radius: var(--radius-full);
    background: var(--gradient-cta);
    flex-shrink: 0;
  }

  .author-initials {
    font-size: var(--text-sm);
    font-weight: var(--font-bold);
    color: var(--color-text-inverse);
    line-height: 1;
  }

  .author-details {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .author-name {
    font-size: var(--text-sm);
    font-weight: var(--font-semibold);
    color: var(--color-text-primary);
  }

  .author-role {
    font-size: var(--text-xs);
    color: var(--color-text-tertiary);
  }

  /* ---- Footer ---- */
  .testimonial-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: var(--space-2);
    padding-top: var(--space-4);
    border-top: var(--border-width-thin) solid var(--color-border-primary);
  }

  .profit-badge {
    font-size: var(--text-sm);
    font-weight: var(--font-bold);
    color: var(--color-success);
    background: var(--color-success-bg);
    padding: var(--space-1) var(--space-3);
    border-radius: var(--radius-full);
    border: var(--border-width-thin) solid rgba(16, 185, 129, 0.2);
  }

  /* ---- Empty State ---- */
  .empty-state {
    text-align: center;
    padding: var(--space-16) 0;
    color: var(--color-text-tertiary);
    font-size: var(--text-lg);
  }

  /* ---- Responsive ---- */
  @media (max-width: 1024px) {
    .testimonials-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: var(--space-6);
    }
  }

  @media (max-width: 768px) {
    .hero {
      padding: var(--space-16) 0 var(--space-12);
    }

    .hero-title {
      font-size: var(--text-5xl);
    }

    .testimonials-section {
      padding: var(--space-12) 0 var(--space-20);
    }

    .testimonials-grid {
      grid-template-columns: 1fr;
      gap: var(--space-6);
    }

    .filter-bar {
      gap: var(--space-2);
      margin-bottom: var(--space-8);
    }

    .filter-btn {
      padding: var(--space-2) var(--space-4);
      font-size: var(--text-xs);
    }
  }

  @media (max-width: 480px) {
    .hero {
      padding: var(--space-12) 0 var(--space-10);
    }

    .hero-title {
      font-size: var(--text-4xl);
    }

    .hero-subtitle {
      font-size: var(--text-base);
    }
  }
</style>

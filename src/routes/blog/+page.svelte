<script lang="ts">
  import SEOHead from '$components/seo/SEOHead.svelte';
  import Container from '$components/ui/Container.svelte';
  import Card from '$components/ui/Card.svelte';
  import Badge from '$components/ui/Badge.svelte';
  import ScrollReveal from '$components/animations/ScrollReveal.svelte';
  import Calendar from 'phosphor-svelte/lib/Calendar';
  import User from 'phosphor-svelte/lib/User';

  let { data } = $props();

  const categories = ['All', 'Getting Started', 'Strategy', 'Psychology', 'Risk Management', 'Education'];

  let activeCategory = $state('All');

  let filteredPosts = $derived(
    activeCategory === 'All'
      ? data.posts
      : data.posts.filter(post => post.category === activeCategory)
  );

  const categoryColors: Record<string, string> = {
    'Getting Started': '#10b981',
    'Strategy': '#3b82f6',
    'Psychology': '#a855f7',
    'Risk Management': '#f59e0b',
    'Education': '#00d4ff'
  };

  function getCategoryColor(category: string): string {
    return categoryColors[category] ?? '#6a6a90';
  }
</script>

<SEOHead
  title="Trading Blog - Revolution Trading Pros"
  description="Expert trading insights, strategies, and education. Stay ahead of the markets with our latest articles on technical analysis, risk management, and trading psychology."
/>

<section class="hero-banner">
  <Container>
    <ScrollReveal>
      <div class="hero-banner__content">
        <h1 class="hero-banner__title">Trading Insights & Education</h1>
        <p class="hero-banner__subtitle">
          Expert articles to help you master the markets, sharpen your strategy, and develop the mindset of a professional trader.
        </p>
      </div>
    </ScrollReveal>
  </Container>
</section>

<section class="blog-section">
  <Container>
    <ScrollReveal>
      <div class="category-filter">
        {#each categories as category}
          <button
            class="category-filter__btn"
            class:category-filter__btn--active={activeCategory === category}
            onclick={() => activeCategory = category}
          >
            {category}
          </button>
        {/each}
      </div>
    </ScrollReveal>

    <div class="posts-grid">
      {#each filteredPosts as post, i (post.slug)}
        <ScrollReveal delay={i * 0.1}>
          <Card hover padding="sm">
            <a href="/blog/{post.slug}" class="post-card">
              <div class="post-card__image" style="background-color: {getCategoryColor(post.category)}20;">
                <span class="post-card__image-icon" style="color: {getCategoryColor(post.category)};">
                  {post.category.charAt(0)}
                </span>
              </div>
              <div class="post-card__body">
                <div class="post-card__category">
                  <Badge>{post.category}</Badge>
                </div>
                <h3 class="post-card__title">{post.title}</h3>
                <p class="post-card__excerpt">{post.excerpt}</p>
                <div class="post-card__footer">
                  <div class="post-card__meta">
                    <User size={14} weight="bold" />
                    <span>{post.author}</span>
                  </div>
                  <div class="post-card__meta">
                    <Calendar size={14} weight="bold" />
                    <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <span class="post-card__read-time">{post.readTime}</span>
                </div>
              </div>
            </a>
          </Card>
        </ScrollReveal>
      {/each}
    </div>

    {#if filteredPosts.length === 0}
      <div class="no-posts">
        <p>No posts found in this category yet. Check back soon!</p>
      </div>
    {/if}
  </Container>
</section>

<style>
  /* ---- Hero Banner ---- */
  .hero-banner {
    padding: var(--space-24) 0 var(--space-16);
    background: var(--gradient-bg-hero);
    text-align: center;
    position: relative;
    overflow: hidden;
  }

  .hero-banner::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--gradient-bg-radial);
    pointer-events: none;
  }

  .hero-banner__content {
    position: relative;
    z-index: 1;
  }

  .hero-banner__title {
    font-size: var(--text-5xl);
    font-weight: var(--font-extrabold);
    background: var(--gradient-text);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: var(--space-4);
    line-height: var(--leading-tight);
  }

  .hero-banner__subtitle {
    font-size: var(--text-lg);
    color: var(--color-text-secondary);
    max-width: 36rem;
    margin-inline: auto;
    line-height: var(--leading-relaxed);
  }

  /* ---- Blog Section ---- */
  .blog-section {
    padding: var(--space-16) 0 var(--space-24);
  }

  /* ---- Category Filter ---- */
  .category-filter {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
    justify-content: center;
    margin-bottom: var(--space-12);
  }

  .category-filter__btn {
    padding: var(--space-2) var(--space-4);
    font-size: var(--text-sm);
    font-weight: var(--font-medium);
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

  .category-filter__btn:hover {
    color: var(--color-text-primary);
    border-color: var(--color-border-secondary);
    background: var(--color-bg-tertiary);
  }

  .category-filter__btn--active {
    color: var(--color-accent-cyan);
    background: rgba(var(--color-accent-cyan-rgb), 0.1);
    border-color: rgba(var(--color-accent-cyan-rgb), 0.3);
    box-shadow: var(--shadow-glow-cyan);
  }

  .category-filter__btn--active:hover {
    color: var(--color-accent-cyan);
    background: rgba(var(--color-accent-cyan-rgb), 0.15);
    border-color: rgba(var(--color-accent-cyan-rgb), 0.4);
  }

  /* ---- Posts Grid ---- */
  .posts-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-8);
  }

  @media (max-width: 1024px) {
    .posts-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 640px) {
    .posts-grid {
      grid-template-columns: 1fr;
    }
  }

  /* ---- Post Card ---- */
  .post-card {
    display: flex;
    flex-direction: column;
    text-decoration: none;
    color: inherit;
    height: 100%;
  }

  .post-card__image {
    width: 100%;
    aspect-ratio: 16 / 9;
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }

  .post-card__image-icon {
    font-size: var(--text-6xl);
    font-weight: var(--font-extrabold);
    opacity: 0.5;
    user-select: none;
    -webkit-user-select: none;
  }

  .post-card__body {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    padding: var(--space-4);
    flex: 1;
  }

  .post-card__category {
    display: flex;
  }

  .post-card__title {
    font-size: var(--text-lg);
    font-weight: var(--font-bold);
    color: var(--color-text-primary);
    line-height: var(--leading-snug);
    transition: color var(--transition-fast);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .post-card:hover .post-card__title {
    color: var(--color-accent-cyan);
  }

  .post-card__excerpt {
    font-size: var(--text-sm);
    color: var(--color-text-secondary);
    line-height: var(--leading-relaxed);
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin: 0;
  }

  .post-card__footer {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-3);
    margin-top: auto;
    padding-top: var(--space-3);
    border-top: var(--border-width-thin) solid var(--color-border-primary);
  }

  .post-card__meta {
    display: inline-flex;
    align-items: center;
    gap: var(--space-1);
    font-size: var(--text-xs);
    color: var(--color-text-tertiary);
  }

  .post-card__read-time {
    font-size: var(--text-xs);
    color: var(--color-text-tertiary);
    margin-left: auto;
  }

  /* ---- No Posts ---- */
  .no-posts {
    text-align: center;
    padding: var(--space-16) 0;
  }

  .no-posts p {
    font-size: var(--text-lg);
    color: var(--color-text-tertiary);
  }

  /* ---- Responsive ---- */
  @media (max-width: 640px) {
    .hero-banner {
      padding: var(--space-16) 0 var(--space-12);
    }

    .hero-banner__title {
      font-size: var(--text-4xl);
    }

    .category-filter {
      gap: var(--space-1);
    }

    .category-filter__btn {
      padding: var(--space-1) var(--space-3);
      font-size: var(--text-xs);
    }
  }
</style>

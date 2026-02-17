<script lang="ts">
  import SEOHead from '$components/seo/SEOHead.svelte';
  import JsonLd from '$components/seo/JsonLd.svelte';
  import Container from '$components/ui/Container.svelte';
  import Badge from '$components/ui/Badge.svelte';
  import Card from '$components/ui/Card.svelte';
  import ScrollReveal from '$components/animations/ScrollReveal.svelte';
  import ArrowLeft from 'phosphor-svelte/lib/ArrowLeft';
  import Calendar from 'phosphor-svelte/lib/Calendar';
  import User from 'phosphor-svelte/lib/User';
  import Clock from 'phosphor-svelte/lib/Clock';

  let { data } = $props();
</script>

<SEOHead
  title="{data.post.title} - Revolution Trading Pros"
  description={data.post.excerpt}
  ogType="article"
/>
<JsonLd schema={{
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: data.post.title,
  description: data.post.excerpt,
  author: {
    '@type': 'Person',
    name: data.post.author
  },
  datePublished: data.post.date,
  publisher: {
    '@type': 'Organization',
    name: 'Revolution Trading Pros'
  }
}} />

<article class="blog-post">
  <Container narrow>
    <ScrollReveal>
      <a href="/blog" class="back-link">
        <ArrowLeft size={18} weight="bold" />
        <span>Back to Blog</span>
      </a>
    </ScrollReveal>

    <ScrollReveal delay={0.1}>
      <header class="blog-post__header">
        <div class="blog-post__category">
          <Badge variant="accent">{data.post.category}</Badge>
        </div>
        <h1 class="blog-post__title">{data.post.title}</h1>
        <div class="blog-post__meta">
          <div class="blog-post__meta-item">
            <User size={16} weight="bold" />
            <span>{data.post.author}</span>
          </div>
          <div class="blog-post__meta-item">
            <Calendar size={16} weight="bold" />
            <span>{new Date(data.post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <div class="blog-post__meta-item">
            <Clock size={16} weight="bold" />
            <span>{data.post.readTime}</span>
          </div>
        </div>
      </header>
    </ScrollReveal>

    <ScrollReveal delay={0.2}>
      <div class="prose">
        {@html data.post.content}
      </div>
    </ScrollReveal>

    {#if data.post.tags && data.post.tags.length > 0}
      <ScrollReveal delay={0.3}>
        <div class="blog-post__tags">
          {#each data.post.tags as tag}
            <span class="blog-post__tag">{tag}</span>
          {/each}
        </div>
      </ScrollReveal>
    {/if}
  </Container>
</article>

{#if data.relatedPosts.length > 0}
  <section class="related-section">
    <Container>
      <ScrollReveal>
        <h2 class="related-section__title">Related Articles</h2>
      </ScrollReveal>
      <div class="related-grid">
        {#each data.relatedPosts as relatedPost, i (relatedPost.slug)}
          <ScrollReveal delay={i * 0.15}>
            <Card hover padding="md">
              <a href="/blog/{relatedPost.slug}" class="related-card">
                <div class="related-card__category">
                  <Badge>{relatedPost.category}</Badge>
                </div>
                <h3 class="related-card__title">{relatedPost.title}</h3>
                <p class="related-card__excerpt">{relatedPost.excerpt}</p>
                <div class="related-card__footer">
                  <span class="related-card__author">{relatedPost.author}</span>
                  <span class="related-card__read-time">{relatedPost.readTime}</span>
                </div>
              </a>
            </Card>
          </ScrollReveal>
        {/each}
      </div>
    </Container>
  </section>
{/if}

<style>
  /* ---- Article Layout ---- */
  .blog-post {
    padding: var(--space-20) 0 var(--space-16);
  }

  /* ---- Back Link ---- */
  .back-link {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--text-sm);
    font-weight: var(--font-medium);
    color: var(--color-text-secondary);
    text-decoration: none;
    margin-bottom: var(--space-8);
    transition: color var(--transition-fast);
  }

  .back-link:hover {
    color: var(--color-accent-cyan);
  }

  /* ---- Post Header ---- */
  .blog-post__header {
    margin-bottom: var(--space-10);
  }

  .blog-post__category {
    margin-bottom: var(--space-4);
  }

  .blog-post__title {
    font-size: var(--text-5xl);
    font-weight: var(--font-extrabold);
    line-height: var(--leading-tight);
    color: var(--color-text-primary);
    margin-bottom: var(--space-6);
  }

  .blog-post__meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-5);
    padding-bottom: var(--space-6);
    border-bottom: var(--border-width-thin) solid var(--color-border-primary);
  }

  .blog-post__meta-item {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--text-sm);
    color: var(--color-text-secondary);
  }

  /* ---- Prose Content ---- */
  .prose {
    font-size: var(--text-lg);
    line-height: var(--leading-relaxed);
    color: var(--color-text-secondary);
  }

  .prose :global(h2) {
    font-size: var(--text-3xl);
    font-weight: var(--font-bold);
    color: var(--color-text-primary);
    margin-top: var(--space-12);
    margin-bottom: var(--space-4);
    line-height: var(--leading-tight);
  }

  .prose :global(h3) {
    font-size: var(--text-2xl);
    font-weight: var(--font-semibold);
    color: var(--color-text-primary);
    margin-top: var(--space-10);
    margin-bottom: var(--space-3);
    line-height: var(--leading-snug);
  }

  .prose :global(h4) {
    font-size: var(--text-xl);
    font-weight: var(--font-semibold);
    color: var(--color-text-primary);
    margin-top: var(--space-8);
    margin-bottom: var(--space-3);
  }

  .prose :global(p) {
    margin-bottom: var(--space-5);
    color: var(--color-text-secondary);
    line-height: var(--leading-relaxed);
  }

  .prose :global(ul),
  .prose :global(ol) {
    margin-bottom: var(--space-5);
    padding-left: var(--space-6);
  }

  .prose :global(ul) {
    list-style-type: disc;
  }

  .prose :global(ol) {
    list-style-type: decimal;
  }

  .prose :global(li) {
    margin-bottom: var(--space-2);
    color: var(--color-text-secondary);
    line-height: var(--leading-relaxed);
  }

  .prose :global(li strong) {
    color: var(--color-text-primary);
    font-weight: var(--font-semibold);
  }

  .prose :global(blockquote) {
    margin: var(--space-8) 0;
    padding: var(--space-5) var(--space-6);
    border-left: var(--border-width-thick) solid var(--color-accent-cyan);
    background: rgba(var(--color-accent-cyan-rgb), 0.05);
    border-radius: 0 var(--radius-md) var(--radius-md) 0;
    font-style: italic;
    color: var(--color-text-primary);
    font-size: var(--text-lg);
    line-height: var(--leading-relaxed);
  }

  .prose :global(pre) {
    margin: var(--space-6) 0;
    padding: var(--space-5);
    background: var(--color-bg-tertiary);
    border: var(--border-width-thin) solid var(--color-border-primary);
    border-radius: var(--radius-lg);
    overflow-x: auto;
  }

  .prose :global(code) {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    line-height: var(--leading-relaxed);
    color: var(--color-accent-cyan);
  }

  .prose :global(pre code) {
    color: var(--color-text-primary);
  }

  .prose :global(a) {
    color: var(--color-accent-cyan);
    text-decoration: underline;
    text-underline-offset: 2px;
    transition: color var(--transition-fast);
  }

  .prose :global(a:hover) {
    color: var(--color-text-link-hover);
  }

  .prose :global(strong) {
    color: var(--color-text-primary);
    font-weight: var(--font-semibold);
  }

  /* ---- Tags ---- */
  .blog-post__tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
    margin-top: var(--space-10);
    padding-top: var(--space-6);
    border-top: var(--border-width-thin) solid var(--color-border-primary);
  }

  .blog-post__tag {
    display: inline-flex;
    align-items: center;
    padding: var(--space-1) var(--space-3);
    font-size: var(--text-xs);
    font-weight: var(--font-medium);
    color: var(--color-text-tertiary);
    background: var(--color-bg-tertiary);
    border: var(--border-width-thin) solid var(--color-border-primary);
    border-radius: var(--radius-full);
    letter-spacing: var(--tracking-wide);
  }

  /* ---- Related Section ---- */
  .related-section {
    padding: var(--space-16) 0 var(--space-24);
    border-top: var(--border-width-thin) solid var(--color-border-primary);
  }

  .related-section__title {
    font-size: var(--text-3xl);
    font-weight: var(--font-bold);
    background: var(--gradient-text);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    text-align: center;
    margin-bottom: var(--space-10);
  }

  .related-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-8);
    max-width: 56rem;
    margin-inline: auto;
  }

  @media (max-width: 640px) {
    .related-grid {
      grid-template-columns: 1fr;
    }
  }

  .related-card {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    text-decoration: none;
    color: inherit;
  }

  .related-card__category {
    display: flex;
  }

  .related-card__title {
    font-size: var(--text-xl);
    font-weight: var(--font-bold);
    color: var(--color-text-primary);
    line-height: var(--leading-snug);
    transition: color var(--transition-fast);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .related-card:hover .related-card__title {
    color: var(--color-accent-cyan);
  }

  .related-card__excerpt {
    font-size: var(--text-sm);
    color: var(--color-text-secondary);
    line-height: var(--leading-relaxed);
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin: 0;
  }

  .related-card__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: auto;
    padding-top: var(--space-3);
    border-top: var(--border-width-thin) solid var(--color-border-primary);
  }

  .related-card__author,
  .related-card__read-time {
    font-size: var(--text-xs);
    color: var(--color-text-tertiary);
  }

  /* ---- Responsive ---- */
  @media (max-width: 640px) {
    .blog-post {
      padding: var(--space-16) 0 var(--space-12);
    }

    .blog-post__title {
      font-size: var(--text-3xl);
    }

    .blog-post__meta {
      gap: var(--space-3);
    }

    .related-section {
      padding: var(--space-12) 0 var(--space-16);
    }
  }
</style>

<script lang="ts">
  import SEOHead from '$components/seo/SEOHead.svelte';
  import JsonLd from '$components/seo/JsonLd.svelte';
  import Container from '$components/ui/Container.svelte';
  import SectionHeading from '$components/ui/SectionHeading.svelte';
  import Card from '$components/ui/Card.svelte';
  import Badge from '$components/ui/Badge.svelte';
  import Button from '$components/ui/Button.svelte';
  import CoursePricing from '$components/sections/CoursePricing.svelte';
  import ScrollReveal from '$components/animations/ScrollReveal.svelte';
  import Clock from 'phosphor-svelte/lib/Clock';
  import BookOpen from 'phosphor-svelte/lib/BookOpen';

  let { data } = $props();

  const levelVariantMap: Record<string, 'default' | 'success' | 'warning' | 'accent'> = {
    Beginner: 'success',
    Intermediate: 'warning',
    Advanced: 'accent'
  };

  let itemListSchema = $derived({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Trading Courses',
    description: 'Expert-led trading courses from beginner to advanced levels.',
    numberOfItems: data.courses.length,
    itemListElement: data.courses.map((course: { title: string; description: string; slug: string; price: number }, index: number) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Course',
        name: course.title,
        description: course.description,
        url: `https://revolutiontradingpros.com/courses/${course.slug}`,
        provider: {
          '@type': 'Organization',
          name: 'Revolution Trading Pros',
          url: 'https://revolutiontradingpros.com'
        },
        offers: {
          '@type': 'Offer',
          price: course.price,
          priceCurrency: 'USD'
        }
      }
    }))
  });
</script>

<SEOHead
  title="Trading Courses - Revolution Trading Pros"
  description="Explore our expert-led trading courses designed for every skill level. From beginner foundations to elite mentorship, find the perfect path to trading mastery."
/>
<JsonLd schema={itemListSchema} />

<!-- Hero Banner -->
<section class="courses-hero">
  <div class="courses-hero__bg">
    <div class="courses-hero__glow"></div>
  </div>
  <Container>
    <div class="courses-hero__content">
      <h1 class="courses-hero__title">
        Our <span class="courses-hero__title-accent">Trading Courses</span>
      </h1>
      <p class="courses-hero__subtitle">
        Expert-crafted curricula designed to take you from beginner to professional trader.
        Choose your level and start your journey today.
      </p>
    </div>
  </Container>
</section>

<!-- Pricing Section -->
<section class="courses-pricing">
  <Container>
    <SectionHeading
      title="Choose Your Plan"
      subtitle="Invest in your trading education with our flexible pricing tiers. Every plan includes lifetime access to course materials."
    />
    <CoursePricing tiers={data.pricingTiers} />
  </Container>
</section>

<!-- Full Course Listing -->
<section class="courses-listing">
  <Container>
    <SectionHeading
      title="Explore All Courses"
      subtitle="Dive deep into our comprehensive course catalog. Each course is designed to build real-world trading skills."
      light
    />
    <ScrollReveal stagger={0.15}>
      <div class="courses-grid">
        {#each data.courses as course}
          <Card glass hover>
            <div class="course-card">
              <div class="course-card__header">
                <Badge variant={levelVariantMap[course.level] ?? 'default'}>
                  {course.level}
                </Badge>
                {#if course.originalPrice}
                  <Badge variant="accent">Save ${course.originalPrice - course.price}</Badge>
                {/if}
              </div>

              <h3 class="course-card__title">{course.title}</h3>

              <p class="course-card__description">{course.description}</p>

              <div class="course-card__meta">
                <div class="course-card__meta-item">
                  <Clock size={18} weight="regular" />
                  <span>{course.duration}</span>
                </div>
                <div class="course-card__meta-item">
                  <BookOpen size={18} weight="regular" />
                  <span>{course.features.length} features included</span>
                </div>
              </div>

              <div class="course-card__price">
                {#if course.originalPrice}
                  <span class="course-card__original-price">${course.originalPrice}</span>
                {/if}
                <span class="course-card__current-price">${course.price}</span>
                <span class="course-card__price-period">one-time</span>
              </div>

              <Button variant="primary" href="/courses/{course.slug}">
                View Course Details
              </Button>
            </div>
          </Card>
        {/each}
      </div>
    </ScrollReveal>
  </Container>
</section>

<style>
  /* ============================================
     Hero Banner
     ============================================ */
  .courses-hero {
    position: relative;
    padding-block: var(--space-32) var(--space-20);
    background: var(--gradient-bg-hero);
    overflow: hidden;
  }

  .courses-hero__bg {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
  }

  .courses-hero__glow {
    position: absolute;
    top: 10%;
    left: 50%;
    transform: translateX(-50%);
    width: 600px;
    height: 600px;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(var(--color-accent-cyan-rgb), 0.1) 0%,
      rgba(var(--color-accent-purple-rgb), 0.05) 40%,
      transparent 70%
    );
    filter: blur(80px);
  }

  .courses-hero__content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: var(--space-6);
    max-width: 48rem;
    margin-inline: auto;
  }

  .courses-hero__title {
    font-size: var(--text-6xl);
    font-weight: var(--font-extrabold);
    line-height: var(--leading-tight);
    letter-spacing: var(--tracking-tight);
    color: var(--color-text-primary);
  }

  .courses-hero__title-accent {
    background: var(--gradient-text);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .courses-hero__subtitle {
    font-size: var(--text-lg);
    line-height: var(--leading-relaxed);
    color: var(--color-text-secondary);
    max-width: 38rem;
  }

  /* ============================================
     Pricing Section
     ============================================ */
  .courses-pricing {
    padding-block: var(--space-24);
    background: var(--color-bg-primary);
  }

  /* ============================================
     Course Listing Section
     ============================================ */
  .courses-listing {
    padding-block: var(--space-24);
    background: var(--color-bg-secondary);
  }

  .courses-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-8);
  }

  /* ============================================
     Course Card
     ============================================ */
  .course-card {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    height: 100%;
  }

  .course-card__header {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    flex-wrap: wrap;
  }

  .course-card__title {
    font-size: var(--text-2xl);
    font-weight: var(--font-bold);
    color: var(--color-text-primary);
    line-height: var(--leading-snug);
  }

  .course-card__description {
    font-size: var(--text-sm);
    color: var(--color-text-secondary);
    line-height: var(--leading-relaxed);
    flex-grow: 1;
  }

  .course-card__meta {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .course-card__meta-item {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--text-sm);
    color: var(--color-text-tertiary);
  }

  .course-card__meta-item :global(svg) {
    color: var(--color-accent-cyan);
    flex-shrink: 0;
  }

  .course-card__price {
    display: flex;
    align-items: baseline;
    gap: var(--space-2);
    padding-top: var(--space-4);
    border-top: var(--border-width-thin) solid var(--color-border-primary);
  }

  .course-card__original-price {
    font-size: var(--text-lg);
    color: var(--color-text-tertiary);
    text-decoration: line-through;
  }

  .course-card__current-price {
    font-size: var(--text-3xl);
    font-weight: var(--font-extrabold);
    background: var(--gradient-text);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    line-height: var(--leading-none);
  }

  .course-card__price-period {
    font-size: var(--text-sm);
    color: var(--color-text-tertiary);
    text-transform: uppercase;
    letter-spacing: var(--tracking-wider);
  }

  /* ============================================
     Responsive
     ============================================ */
  @media (max-width: 1024px) {
    .courses-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: var(--space-6);
    }
  }

  @media (max-width: 768px) {
    .courses-hero {
      padding-block: var(--space-24) var(--space-16);
    }

    .courses-hero__title {
      font-size: var(--text-4xl);
    }

    .courses-hero__subtitle {
      font-size: var(--text-base);
    }

    .courses-pricing {
      padding-block: var(--space-16);
    }

    .courses-listing {
      padding-block: var(--space-16);
    }

    .courses-grid {
      grid-template-columns: 1fr;
      max-width: 28rem;
      margin-inline: auto;
    }
  }

  @media (max-width: 480px) {
    .courses-hero {
      padding-block: var(--space-20) var(--space-12);
    }

    .courses-hero__title {
      font-size: var(--text-3xl);
    }
  }
</style>

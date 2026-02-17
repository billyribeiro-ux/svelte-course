<script lang="ts">
  import SEOHead from '$components/seo/SEOHead.svelte';
  import JsonLd from '$components/seo/JsonLd.svelte';
  import Container from '$components/ui/Container.svelte';
  import Badge from '$components/ui/Badge.svelte';
  import Button from '$components/ui/Button.svelte';
  import ScrollReveal from '$components/animations/ScrollReveal.svelte';
  import CheckCircle from 'phosphor-svelte/lib/CheckCircle';
  import CaretDown from 'phosphor-svelte/lib/CaretDown';
  import Clock from 'phosphor-svelte/lib/Clock';
  import GraduationCap from 'phosphor-svelte/lib/GraduationCap';

  let { data } = $props();
  let course = $derived(data.course);

  let openModule = $state<number | null>(null);

  function toggleModule(index: number) {
    openModule = openModule === index ? null : index;
  }

  const levelVariantMap: Record<string, 'default' | 'success' | 'warning' | 'accent'> = {
    Beginner: 'success',
    Intermediate: 'warning',
    Advanced: 'accent'
  };

  const totalLessons = course.modules.reduce((sum, mod) => sum + mod.lessons.length, 0);

  const courseSchema = {
    '@context': 'https://schema.org',
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
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock'
    },
    educationalLevel: course.level,
    timeRequired: course.duration,
    numberOfCredits: course.modules.length
  };
</script>

<SEOHead
  title="{course.title} - Revolution Trading Pros"
  description={course.description}
/>
<JsonLd schema={courseSchema} />

<!-- Course Hero -->
<section class="course-hero">
  <div class="course-hero__bg">
    <div class="course-hero__glow"></div>
    <div class="course-hero__glow course-hero__glow--secondary"></div>
  </div>

  <Container>
    <div class="course-hero__content">
      <div class="course-hero__badges">
        <Badge variant={levelVariantMap[course.level] ?? 'default'}>
          {course.level}
        </Badge>
        <Badge variant="default">
          {course.tier.charAt(0).toUpperCase() + course.tier.slice(1)} Tier
        </Badge>
      </div>

      <h1 class="course-hero__title">{course.title}</h1>

      <p class="course-hero__description">{course.longDescription}</p>

      <div class="course-hero__meta">
        <div class="course-hero__meta-item">
          <Clock size={22} weight="regular" />
          <span>{course.duration}</span>
        </div>
        <div class="course-hero__meta-item">
          <GraduationCap size={22} weight="regular" />
          <span>{course.modules.length} modules &middot; {totalLessons} lessons</span>
        </div>
      </div>

      <div class="course-hero__price">
        {#if course.originalPrice}
          <span class="course-hero__original-price">${course.originalPrice}</span>
        {/if}
        <span class="course-hero__current-price">${course.price}</span>
        <span class="course-hero__price-period">one-time payment</span>
      </div>

      <div class="course-hero__actions">
        <Button variant="primary" size="lg" href="/checkout">
          Enroll Now
        </Button>
        <Button variant="secondary" size="lg" href="/lead-magnet">
          Free Trading Guide
        </Button>
      </div>
    </div>
  </Container>
</section>

<!-- What You'll Learn -->
<section class="course-features">
  <Container>
    <ScrollReveal>
      <h2 class="course-features__title">What You'll Learn</h2>
      <div class="course-features__grid">
        {#each course.features as feature}
          <div class="course-features__item">
            <CheckCircle size={24} weight="fill" />
            <span>{feature}</span>
          </div>
        {/each}
      </div>
    </ScrollReveal>
  </Container>
</section>

<!-- Module Breakdown -->
<section class="course-modules">
  <Container>
    <ScrollReveal>
      <h2 class="course-modules__title">Course Modules</h2>
      <p class="course-modules__subtitle">
        {course.modules.length} modules &middot; {totalLessons} lessons &middot; {course.duration} of content
      </p>

      <div class="course-modules__list">
        {#each course.modules as mod, index}
          <div class="module" class:module--open={openModule === index}>
            <button
              class="module__header"
              onclick={() => toggleModule(index)}
              aria-expanded={openModule === index}
            >
              <div class="module__header-left">
                <span class="module__number">{String(index + 1).padStart(2, '0')}</span>
                <div class="module__info">
                  <h3 class="module__title">{mod.title}</h3>
                  <span class="module__meta">
                    {mod.lessons.length} lessons &middot; {mod.duration}
                  </span>
                </div>
              </div>
              <div class="module__caret" class:module__caret--open={openModule === index}>
                <CaretDown size={20} weight="bold" />
              </div>
            </button>

            <div
              class="module__body"
              class:module__body--open={openModule === index}
            >
              <div class="module__body-inner">
                <ul class="module__lessons">
                  {#each mod.lessons as lesson, lessonIndex}
                    <li class="module__lesson">
                      <span class="module__lesson-number">{index + 1}.{lessonIndex + 1}</span>
                      <span>{lesson}</span>
                    </li>
                  {/each}
                </ul>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </ScrollReveal>
  </Container>
</section>

<!-- CTA Section -->
<section class="course-cta">
  <div class="course-cta__bg">
    <div class="course-cta__glow"></div>
  </div>
  <Container>
    <ScrollReveal>
      <div class="course-cta__content">
        <h2 class="course-cta__title">Ready to Start?</h2>
        <p class="course-cta__description">
          Join thousands of successful traders who transformed their skills with {course.title}.
          Start your journey to trading mastery today.
        </p>
        <div class="course-cta__actions">
          <Button variant="primary" size="lg" href="/checkout">
            Enroll in {course.title} &mdash; ${course.price}
          </Button>
          <Button variant="ghost" size="md" href="/lead-magnet">
            Or start with our free trading guide
          </Button>
        </div>
      </div>
    </ScrollReveal>
  </Container>
</section>

<style>
  /* ============================================
     Course Hero
     ============================================ */
  .course-hero {
    position: relative;
    padding-block: var(--space-32) var(--space-20);
    background: var(--gradient-bg-hero);
    overflow: hidden;
  }

  .course-hero__bg {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
  }

  .course-hero__glow {
    position: absolute;
    top: 5%;
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

  .course-hero__glow--secondary {
    top: auto;
    bottom: -20%;
    left: 70%;
    width: 400px;
    height: 400px;
    background: radial-gradient(
      circle,
      rgba(var(--color-accent-purple-rgb), 0.08) 0%,
      transparent 60%
    );
    filter: blur(100px);
  }

  .course-hero__content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: var(--space-6);
    max-width: 52rem;
    margin-inline: auto;
  }

  .course-hero__badges {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    flex-wrap: wrap;
    justify-content: center;
  }

  .course-hero__title {
    font-size: var(--text-6xl);
    font-weight: var(--font-extrabold);
    line-height: var(--leading-tight);
    letter-spacing: var(--tracking-tight);
    background: var(--gradient-text);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .course-hero__description {
    font-size: var(--text-lg);
    line-height: var(--leading-relaxed);
    color: var(--color-text-secondary);
    max-width: 44rem;
  }

  .course-hero__meta {
    display: flex;
    align-items: center;
    gap: var(--space-8);
    flex-wrap: wrap;
    justify-content: center;
  }

  .course-hero__meta-item {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--text-base);
    color: var(--color-text-secondary);
  }

  .course-hero__meta-item :global(svg) {
    color: var(--color-accent-cyan);
    flex-shrink: 0;
  }

  .course-hero__price {
    display: flex;
    align-items: baseline;
    gap: var(--space-3);
    padding-top: var(--space-4);
  }

  .course-hero__original-price {
    font-size: var(--text-2xl);
    color: var(--color-text-tertiary);
    text-decoration: line-through;
    font-weight: var(--font-medium);
  }

  .course-hero__current-price {
    font-size: var(--text-5xl);
    font-weight: var(--font-extrabold);
    background: var(--gradient-text);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    line-height: var(--leading-none);
  }

  .course-hero__price-period {
    font-size: var(--text-sm);
    color: var(--color-text-tertiary);
    text-transform: uppercase;
    letter-spacing: var(--tracking-wider);
  }

  .course-hero__actions {
    display: flex;
    align-items: center;
    gap: var(--space-4);
    flex-wrap: wrap;
    justify-content: center;
    margin-top: var(--space-2);
  }

  /* ============================================
     What You'll Learn
     ============================================ */
  .course-features {
    padding-block: var(--space-24);
    background: var(--color-bg-primary);
  }

  .course-features__title {
    font-size: var(--text-4xl);
    font-weight: var(--font-bold);
    line-height: var(--leading-tight);
    letter-spacing: var(--tracking-tight);
    text-align: center;
    margin-bottom: var(--space-12);
    background: var(--gradient-text);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .course-features__grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-5);
    max-width: 48rem;
    margin-inline: auto;
  }

  .course-features__item {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    font-size: var(--text-base);
    color: var(--color-text-secondary);
    line-height: var(--leading-normal);
    padding: var(--space-4);
    background: var(--color-bg-secondary);
    border: var(--border-width-thin) solid var(--color-border-primary);
    border-radius: var(--radius-lg);
    transition: border-color var(--transition-base), background-color var(--transition-base);
  }

  .course-features__item:hover {
    border-color: var(--color-border-secondary);
    background: var(--color-bg-tertiary);
  }

  .course-features__item :global(svg) {
    color: var(--color-success);
    flex-shrink: 0;
  }

  /* ============================================
     Module Breakdown
     ============================================ */
  .course-modules {
    padding-block: var(--space-24);
    background: var(--color-bg-secondary);
  }

  .course-modules__title {
    font-size: var(--text-4xl);
    font-weight: var(--font-bold);
    line-height: var(--leading-tight);
    letter-spacing: var(--tracking-tight);
    text-align: center;
    margin-bottom: var(--space-4);
    background: var(--gradient-text);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .course-modules__subtitle {
    font-size: var(--text-base);
    color: var(--color-text-tertiary);
    text-align: center;
    margin-bottom: var(--space-12);
  }

  .course-modules__list {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    max-width: 48rem;
    margin-inline: auto;
  }

  /* ---- Accordion Module ---- */
  .module {
    background: var(--color-bg-primary);
    border: var(--border-width-thin) solid var(--color-border-primary);
    border-radius: var(--radius-xl);
    overflow: hidden;
    transition: border-color var(--transition-base), box-shadow var(--transition-base);
  }

  .module--open {
    border-color: var(--color-border-accent);
    box-shadow: var(--shadow-glow-cyan);
  }

  .module__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: var(--space-5) var(--space-6);
    background: transparent;
    border: none;
    cursor: pointer;
    color: inherit;
    text-align: left;
    transition: background-color var(--transition-fast);
  }

  .module__header:hover {
    background: rgba(var(--color-accent-cyan-rgb), 0.03);
  }

  .module__header-left {
    display: flex;
    align-items: center;
    gap: var(--space-4);
  }

  .module__number {
    font-size: var(--text-sm);
    font-weight: var(--font-bold);
    color: var(--color-accent-cyan);
    font-family: var(--font-mono);
    min-width: 2rem;
  }

  .module__info {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .module__title {
    font-size: var(--text-lg);
    font-weight: var(--font-semibold);
    color: var(--color-text-primary);
    line-height: var(--leading-snug);
  }

  .module__meta {
    font-size: var(--text-sm);
    color: var(--color-text-tertiary);
  }

  .module__caret {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text-tertiary);
    transition: transform var(--transition-base);
    flex-shrink: 0;
  }

  .module__caret--open {
    transform: rotate(180deg);
    color: var(--color-accent-cyan);
  }

  .module__body {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.4s cubic-bezier(0.65, 0, 0.35, 1);
  }

  .module__body--open {
    max-height: 600px;
  }

  .module__body-inner {
    padding: 0 var(--space-6) var(--space-6);
  }

  .module__lessons {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    padding-top: var(--space-4);
    border-top: var(--border-width-thin) solid var(--color-border-primary);
  }

  .module__lesson {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-2) var(--space-3);
    font-size: var(--text-sm);
    color: var(--color-text-secondary);
    border-radius: var(--radius-md);
    transition: background-color var(--transition-fast);
  }

  .module__lesson:hover {
    background: rgba(var(--color-accent-cyan-rgb), 0.04);
  }

  .module__lesson-number {
    font-size: var(--text-xs);
    font-weight: var(--font-semibold);
    color: var(--color-text-tertiary);
    font-family: var(--font-mono);
    min-width: 2.5rem;
  }

  /* ============================================
     CTA Section
     ============================================ */
  .course-cta {
    position: relative;
    padding-block: var(--space-24);
    background: var(--color-bg-primary);
    overflow: hidden;
  }

  .course-cta__bg {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
  }

  .course-cta__glow {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 500px;
    height: 500px;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(var(--color-accent-purple-rgb), 0.08) 0%,
      rgba(var(--color-accent-cyan-rgb), 0.04) 40%,
      transparent 70%
    );
    filter: blur(80px);
  }

  .course-cta__content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: var(--space-6);
    max-width: 40rem;
    margin-inline: auto;
  }

  .course-cta__title {
    font-size: var(--text-4xl);
    font-weight: var(--font-bold);
    line-height: var(--leading-tight);
    letter-spacing: var(--tracking-tight);
    background: var(--gradient-text);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .course-cta__description {
    font-size: var(--text-lg);
    line-height: var(--leading-relaxed);
    color: var(--color-text-secondary);
  }

  .course-cta__actions {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-4);
    margin-top: var(--space-2);
  }

  /* ============================================
     Responsive
     ============================================ */
  @media (max-width: 768px) {
    .course-hero {
      padding-block: var(--space-24) var(--space-16);
    }

    .course-hero__title {
      font-size: var(--text-4xl);
    }

    .course-hero__description {
      font-size: var(--text-base);
    }

    .course-hero__meta {
      gap: var(--space-4);
    }

    .course-hero__current-price {
      font-size: var(--text-4xl);
    }

    .course-features {
      padding-block: var(--space-16);
    }

    .course-features__title {
      font-size: var(--text-3xl);
    }

    .course-features__grid {
      grid-template-columns: 1fr;
    }

    .course-modules {
      padding-block: var(--space-16);
    }

    .course-modules__title {
      font-size: var(--text-3xl);
    }

    .module__header {
      padding: var(--space-4) var(--space-5);
    }

    .module__body-inner {
      padding: 0 var(--space-5) var(--space-5);
    }

    .course-cta {
      padding-block: var(--space-16);
    }

    .course-cta__title {
      font-size: var(--text-3xl);
    }

    .course-cta__description {
      font-size: var(--text-base);
    }
  }

  @media (max-width: 480px) {
    .course-hero {
      padding-block: var(--space-20) var(--space-12);
    }

    .course-hero__title {
      font-size: var(--text-3xl);
    }

    .course-hero__actions {
      flex-direction: column;
      width: 100%;
    }

    .course-hero__current-price {
      font-size: var(--text-3xl);
    }

    .module__header-left {
      gap: var(--space-3);
    }

    .module__title {
      font-size: var(--text-base);
    }

    .module__number {
      display: none;
    }

    .course-cta__title {
      font-size: var(--text-2xl);
    }
  }
</style>

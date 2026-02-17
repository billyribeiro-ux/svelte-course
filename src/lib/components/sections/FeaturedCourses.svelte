<script lang="ts">
  import type { Course } from '$types/course';
  import ScrollReveal from '$components/animations/ScrollReveal.svelte';
  import Card from '$components/ui/Card.svelte';
  import Button from '$components/ui/Button.svelte';
  import TrendUp from 'phosphor-svelte/lib/TrendUp';
  import CheckCircle from 'phosphor-svelte/lib/CheckCircle';

  interface Props {
    courses: Course[];
  }

  let { courses }: Props = $props();

  function getLevelColor(level: Course['level']): string {
    switch (level) {
      case 'Beginner':
        return 'var(--color-success)';
      case 'Intermediate':
        return 'var(--color-warning)';
      case 'Advanced':
        return 'var(--color-error)';
      default:
        return 'var(--color-info)';
    }
  }
</script>

<section class="featured-courses">
  <div class="featured-courses__container">
    <div class="featured-courses__header">
      <h2 class="featured-courses__heading">
        Our <span class="featured-courses__heading-accent">Trading Courses</span>
      </h2>
      <p class="featured-courses__subheading">
        Structured learning paths designed for every experience level.
        Start your journey to consistent profitability today.
      </p>
    </div>

    <ScrollReveal stagger={0.15}>
      <div class="featured-courses__grid">
        {#each courses.slice(0, 3) as course}
          <Card hover>
            <div class="course-card">
              <div class="course-card__header">
                <span
                  class="course-card__level"
                  style="--level-color: {getLevelColor(course.level)}"
                >
                  {course.level}
                </span>
                <div class="course-card__icon">
                  <TrendUp size={20} weight="bold" />
                </div>
              </div>

              <h3 class="course-card__title">{course.title}</h3>
              <p class="course-card__description">{course.description}</p>

              <div class="course-card__price">
                <span class="course-card__price-current">${course.price}</span>
                {#if course.originalPrice}
                  <span class="course-card__price-original">${course.originalPrice}</span>
                {/if}
              </div>

              <ul class="course-card__features">
                {#each course.features.slice(0, 4) as feature}
                  <li class="course-card__feature">
                    <CheckCircle size={18} weight="fill" />
                    <span>{feature}</span>
                  </li>
                {/each}
              </ul>

              <div class="course-card__cta">
                <Button variant="primary" size="md" href="/courses/{course.slug}">
                  View Course
                </Button>
              </div>
            </div>
          </Card>
        {/each}
      </div>
    </ScrollReveal>

    <div class="featured-courses__footer">
      <Button variant="secondary" size="lg" href="/courses">
        View All Courses
      </Button>
    </div>
  </div>
</section>

<style>
  .featured-courses {
    position: relative;
    padding-block: var(--space-24);
    background: var(--color-bg-primary);
  }

  .featured-courses__container {
    width: 100%;
    max-width: var(--container-xl);
    margin-inline: auto;
    padding-inline: var(--container-padding);
  }

  .featured-courses__header {
    text-align: center;
    margin-bottom: var(--space-16);
    max-width: 40rem;
    margin-inline: auto;
  }

  .featured-courses__heading {
    font-size: var(--text-4xl);
    font-weight: var(--font-bold);
    margin-bottom: var(--space-4);
    color: var(--color-text-primary);
  }

  .featured-courses__heading-accent {
    background: var(--gradient-text);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .featured-courses__subheading {
    font-size: var(--text-lg);
    color: var(--color-text-secondary);
    line-height: var(--leading-relaxed);
  }

  .featured-courses__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-8);
  }

  .course-card {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    height: 100%;
  }

  .course-card__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .course-card__level {
    display: inline-flex;
    align-items: center;
    padding: var(--space-1) var(--space-3);
    font-size: var(--text-xs);
    font-weight: var(--font-semibold);
    text-transform: uppercase;
    letter-spacing: var(--tracking-wider);
    color: var(--level-color);
    background: color-mix(in srgb, var(--level-color) 12%, transparent);
    border-radius: var(--radius-full);
    border: var(--border-width-thin) solid color-mix(in srgb, var(--level-color) 25%, transparent);
  }

  .course-card__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    border-radius: var(--radius-lg);
    background: rgba(var(--color-accent-cyan-rgb), 0.1);
    color: var(--color-accent-cyan);
  }

  .course-card__title {
    font-size: var(--text-xl);
    font-weight: var(--font-semibold);
    color: var(--color-text-primary);
    line-height: var(--leading-snug);
  }

  .course-card__description {
    font-size: var(--text-sm);
    color: var(--color-text-secondary);
    line-height: var(--leading-relaxed);
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .course-card__price {
    display: flex;
    align-items: baseline;
    gap: var(--space-2);
  }

  .course-card__price-current {
    font-size: var(--text-3xl);
    font-weight: var(--font-bold);
    color: var(--color-text-primary);
  }

  .course-card__price-original {
    font-size: var(--text-lg);
    color: var(--color-text-tertiary);
    text-decoration: line-through;
  }

  .course-card__features {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    flex-grow: 1;
  }

  .course-card__feature {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--text-sm);
    color: var(--color-text-secondary);
  }

  .course-card__feature :global(svg) {
    flex-shrink: 0;
    color: var(--color-success);
  }

  .course-card__cta {
    margin-top: var(--space-2);
  }

  .course-card__cta :global(.btn) {
    width: 100%;
  }

  .featured-courses__footer {
    display: flex;
    justify-content: center;
    margin-top: var(--space-12);
  }

  /* ---- Responsive ---- */
  @media (max-width: 1024px) {
    .featured-courses__grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 768px) {
    .featured-courses {
      padding-block: var(--space-16);
    }

    .featured-courses__grid {
      grid-template-columns: 1fr;
      gap: var(--space-6);
      max-width: 28rem;
      margin-inline: auto;
    }

    .featured-courses__header {
      margin-bottom: var(--space-10);
    }
  }
</style>

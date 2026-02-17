<script lang="ts">
  import CountUp from '$components/animations/CountUp.svelte';

  const stats = [
    { target: 10000, prefix: '', suffix: '+', label: 'Students' },
    { target: 93, prefix: '', suffix: '%', label: 'Success Rate' },
    { target: 2.4, prefix: '$', suffix: 'M+', label: 'Student Profits', decimals: 1 },
    { target: 50, prefix: '', suffix: '+', label: 'Courses' }
  ];
</script>

<section class="stats-counter">
  <div class="stats-counter__bg">
    <div class="stats-counter__glow"></div>
  </div>

  <div class="stats-counter__container">
    <div class="stats-counter__grid">
      {#each stats as stat}
        <div class="stats-counter__item">
          <span class="stats-counter__value">
            <CountUp
              target={stat.target}
              prefix={stat.prefix}
              suffix={stat.suffix}
              decimals={stat.decimals ?? 0}
              duration={2.5}
            />
          </span>
          <span class="stats-counter__label">{stat.label}</span>
        </div>
      {/each}
    </div>
  </div>
</section>

<style>
  .stats-counter {
    position: relative;
    padding-block: var(--space-20);
    background: var(--color-bg-secondary);
    overflow: hidden;
  }

  .stats-counter__bg {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .stats-counter__glow {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 800px;
    height: 300px;
    border-radius: 50%;
    background: radial-gradient(
      ellipse,
      rgba(var(--color-accent-cyan-rgb), 0.06) 0%,
      rgba(var(--color-accent-purple-rgb), 0.03) 40%,
      transparent 70%
    );
    filter: blur(60px);
  }

  .stats-counter__container {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: var(--container-xl);
    margin-inline: auto;
    padding-inline: var(--container-padding);
  }

  .stats-counter__grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--space-8);
  }

  .stats-counter__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-6);
    text-align: center;
    border-radius: var(--radius-xl);
    background: rgba(255, 255, 255, 0.02);
    border: var(--border-width-thin) solid var(--color-border-primary);
    transition: border-color var(--transition-base), background-color var(--transition-base);
  }

  .stats-counter__item:hover {
    border-color: var(--color-border-secondary);
    background: rgba(255, 255, 255, 0.04);
  }

  .stats-counter__value {
    font-size: var(--text-5xl);
    font-weight: var(--font-extrabold);
    letter-spacing: var(--tracking-tight);
    background: var(--gradient-text);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    line-height: var(--leading-none);
  }

  .stats-counter__label {
    font-size: var(--text-sm);
    font-weight: var(--font-medium);
    color: var(--color-text-tertiary);
    text-transform: uppercase;
    letter-spacing: var(--tracking-widest);
  }

  /* ---- Responsive ---- */
  @media (max-width: 1024px) {
    .stats-counter__grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 480px) {
    .stats-counter {
      padding-block: var(--space-16);
    }

    .stats-counter__grid {
      grid-template-columns: 1fr;
      gap: var(--space-4);
    }

    .stats-counter__value {
      font-size: var(--text-4xl);
    }
  }
</style>

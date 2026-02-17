<script lang="ts">
  import { browser } from '$app/environment';
  import Button from '$components/ui/Button.svelte';

  let heroSection: HTMLElement;

  $effect(() => {
    if (!browser || !heroSection) return;

    let ctx: gsap.Context | undefined;

    (async () => {
      const { default: gsap } = await import('gsap');

      ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        tl.from('.hero__badge', {
          opacity: 0,
          y: -20,
          duration: 0.6
        })
          .from('.hero__title', {
            opacity: 0,
            y: 40,
            duration: 0.8
          }, '-=0.2')
          .from('.hero__subtitle', {
            opacity: 0,
            y: 20,
            duration: 0.6
          }, '-=0.3')
          .from('.hero__actions .btn', {
            opacity: 0,
            y: 20,
            stagger: 0.15,
            duration: 0.5
          }, '-=0.2')
          .from('.hero__stat', {
            opacity: 0,
            y: 30,
            stagger: 0.12,
            duration: 0.5
          }, '-=0.2');

        gsap.to('.hero__glow', {
          y: -30,
          scale: 1.1,
          duration: 3,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1
        });

        gsap.to('.hero__glow--secondary', {
          y: 20,
          scale: 0.9,
          duration: 4,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1
        });
      }, heroSection);
    })();

    return () => {
      ctx?.revert();
    };
  });
</script>

<section class="hero" bind:this={heroSection}>
  <div class="hero__bg">
    <div class="hero__glow"></div>
    <div class="hero__glow hero__glow--secondary"></div>
  </div>

  <div class="hero__container">
    <div class="hero__content">
      <span class="hero__badge">
        Trusted by 10,000+ Traders Worldwide
      </span>

      <h1 class="hero__title">
        Master the Markets.<br />
        <span class="hero__title-gradient">Trade with Confidence.</span>
      </h1>

      <p class="hero__subtitle">
        Expert-led trading education designed to transform beginners into confident,
        profitable traders. Learn proven strategies, risk management, and market analysis
        from professionals with over 15 years of real-world experience.
      </p>

      <div class="hero__actions">
        <Button variant="primary" size="lg" href="/courses">Explore Courses</Button>
        <Button variant="secondary" size="lg" href="/lead-magnet">Free Trading Guide</Button>
      </div>

      <div class="hero__stats">
        <div class="hero__stat">
          <span class="hero__stat-value">10,000+</span>
          <span class="hero__stat-label">Active Students</span>
        </div>
        <div class="hero__stat">
          <span class="hero__stat-value">93%</span>
          <span class="hero__stat-label">Success Rate</span>
        </div>
        <div class="hero__stat">
          <span class="hero__stat-value">$2.4M+</span>
          <span class="hero__stat-label">Student Profits</span>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .hero {
    position: relative;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background: var(--gradient-bg-hero);
  }

  .hero__bg {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
  }

  .hero__glow {
    position: absolute;
    top: 10%;
    left: 50%;
    transform: translateX(-50%);
    width: 600px;
    height: 600px;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(var(--color-accent-cyan-rgb), 0.12) 0%,
      rgba(var(--color-accent-purple-rgb), 0.06) 40%,
      transparent 70%
    );
    filter: blur(80px);
  }

  .hero__glow--secondary {
    top: auto;
    bottom: -10%;
    left: 30%;
    width: 500px;
    height: 500px;
    background: radial-gradient(
      circle,
      rgba(var(--color-accent-purple-rgb), 0.1) 0%,
      rgba(var(--color-accent-cyan-rgb), 0.04) 40%,
      transparent 70%
    );
    filter: blur(100px);
  }

  .hero__container {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: var(--container-xl);
    margin-inline: auto;
    padding-inline: var(--container-padding);
    padding-block: var(--space-32) var(--space-20);
  }

  .hero__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: var(--space-8);
    max-width: 56rem;
    margin-inline: auto;
  }

  .hero__badge {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-5);
    font-size: var(--text-sm);
    font-weight: var(--font-semibold);
    letter-spacing: var(--tracking-wider);
    text-transform: uppercase;
    color: var(--color-accent-cyan);
    background: rgba(var(--color-accent-cyan-rgb), 0.08);
    border: var(--border-width-thin) solid rgba(var(--color-accent-cyan-rgb), 0.2);
    border-radius: var(--radius-full);
  }

  .hero__title {
    font-size: var(--text-7xl);
    font-weight: var(--font-extrabold);
    line-height: var(--leading-tight);
    letter-spacing: var(--tracking-tight);
    color: var(--color-text-primary);
  }

  .hero__title-gradient {
    background: var(--gradient-text);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .hero__subtitle {
    font-size: var(--text-lg);
    line-height: var(--leading-relaxed);
    color: var(--color-text-secondary);
    max-width: 44rem;
  }

  .hero__actions {
    display: flex;
    align-items: center;
    gap: var(--space-4);
    flex-wrap: wrap;
    justify-content: center;
  }

  .hero__stats {
    display: flex;
    align-items: center;
    gap: var(--space-12);
    margin-top: var(--space-8);
    padding-top: var(--space-8);
    border-top: var(--border-width-thin) solid var(--color-border-primary);
  }

  .hero__stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-1);
  }

  .hero__stat-value {
    font-size: var(--text-3xl);
    font-weight: var(--font-bold);
    color: var(--color-accent-cyan);
    letter-spacing: var(--tracking-tight);
  }

  .hero__stat-label {
    font-size: var(--text-sm);
    color: var(--color-text-tertiary);
    text-transform: uppercase;
    letter-spacing: var(--tracking-wider);
  }

  /* ---- Responsive ---- */
  @media (max-width: 768px) {
    .hero__container {
      padding-block: var(--space-24) var(--space-16);
    }

    .hero__title {
      font-size: var(--text-5xl);
    }

    .hero__subtitle {
      font-size: var(--text-base);
    }

    .hero__stats {
      gap: var(--space-6);
      flex-wrap: wrap;
      justify-content: center;
    }

    .hero__stat-value {
      font-size: var(--text-2xl);
    }
  }

  @media (max-width: 480px) {
    .hero__container {
      padding-block: var(--space-20) var(--space-12);
    }

    .hero__title {
      font-size: var(--text-4xl);
    }

    .hero__actions {
      flex-direction: column;
      width: 100%;
    }

    .hero__stats {
      gap: var(--space-4);
    }

    .hero__badge {
      font-size: var(--text-xs);
    }
  }
</style>

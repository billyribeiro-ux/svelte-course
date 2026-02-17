<script lang="ts">
  import ScrollReveal from '$components/animations/ScrollReveal.svelte';
  import Button from '$components/ui/Button.svelte';
</script>

<section class="cta-banner">
  <div class="cta-banner__bg">
    <div class="cta-banner__glow cta-banner__glow--left"></div>
    <div class="cta-banner__glow cta-banner__glow--right"></div>
  </div>

  <div class="cta-banner__container">
    <ScrollReveal direction="up">
      <div class="cta-banner__content">
        <h2 class="cta-banner__heading">
          Ready to Transform Your Trading?
        </h2>
        <p class="cta-banner__subtitle">
          Get our free guide and start your journey to financial freedom.
          Join thousands of successful traders who started right here.
        </p>
        <div class="cta-banner__actions">
          <Button variant="primary" size="lg" href="/lead-magnet">
            Download Free Guide
          </Button>
          <Button variant="secondary" size="lg" href="/courses">
            Browse Courses
          </Button>
        </div>
      </div>
    </ScrollReveal>
  </div>
</section>

<style>
  .cta-banner {
    position: relative;
    padding-block: var(--space-24);
    overflow: hidden;
    background: linear-gradient(
      135deg,
      rgba(var(--color-accent-cyan-rgb), 0.15) 0%,
      rgba(var(--color-accent-purple-rgb), 0.2) 50%,
      rgba(var(--color-accent-cyan-rgb), 0.1) 100%
    );
  }

  .cta-banner__bg {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .cta-banner__glow {
    position: absolute;
    width: 500px;
    height: 500px;
    border-radius: 50%;
    filter: blur(120px);
    opacity: 0.4;
  }

  .cta-banner__glow--left {
    top: -30%;
    left: -10%;
    background: radial-gradient(
      circle,
      rgba(var(--color-accent-cyan-rgb), 0.3) 0%,
      transparent 70%
    );
  }

  .cta-banner__glow--right {
    bottom: -30%;
    right: -10%;
    background: radial-gradient(
      circle,
      rgba(var(--color-accent-purple-rgb), 0.3) 0%,
      transparent 70%
    );
  }

  .cta-banner__container {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: var(--container-xl);
    margin-inline: auto;
    padding-inline: var(--container-padding);
  }

  .cta-banner__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: var(--space-6);
    max-width: 40rem;
    margin-inline: auto;
  }

  .cta-banner__heading {
    font-size: var(--text-4xl);
    font-weight: var(--font-bold);
    color: var(--color-text-primary);
    line-height: var(--leading-tight);
  }

  .cta-banner__subtitle {
    font-size: var(--text-lg);
    color: var(--color-text-secondary);
    line-height: var(--leading-relaxed);
    max-width: 36rem;
  }

  .cta-banner__actions {
    display: flex;
    align-items: center;
    gap: var(--space-4);
    flex-wrap: wrap;
    justify-content: center;
    margin-top: var(--space-4);
  }

  /* ---- Responsive ---- */
  @media (max-width: 768px) {
    .cta-banner {
      padding-block: var(--space-16);
    }

    .cta-banner__heading {
      font-size: var(--text-3xl);
    }

    .cta-banner__subtitle {
      font-size: var(--text-base);
    }
  }

  @media (max-width: 480px) {
    .cta-banner__actions {
      flex-direction: column;
      width: 100%;
    }
  }
</style>

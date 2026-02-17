<script lang="ts">
  import SEOHead from '$components/seo/SEOHead.svelte';
  import JsonLd from '$components/seo/JsonLd.svelte';
  import Container from '$components/ui/Container.svelte';
  import Card from '$components/ui/Card.svelte';
  import ScrollReveal from '$components/animations/ScrollReveal.svelte';
  import Target from 'phosphor-svelte/lib/Target';
  import Eye from 'phosphor-svelte/lib/Eye';
  import Heart from 'phosphor-svelte/lib/Heart';

  let { data } = $props();
</script>

<SEOHead
  title="About Us - Revolution Trading Pros"
  description="Learn about Revolution Trading Pros, our mission to democratize trading education, and the expert team dedicated to helping you succeed in the financial markets."
/>
<JsonLd schema={{
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About Revolution Trading Pros',
  description: 'Learn about our mission, vision, and the expert team behind Revolution Trading Pros.',
  url: 'https://revolutiontradingpros.com/about',
  mainEntity: {
    '@type': 'Organization',
    name: 'Revolution Trading Pros',
    foundingDate: '2020',
    description: 'Expert-led trading education platform helping traders master the markets.',
    numberOfEmployees: {
      '@type': 'QuantitativeValue',
      value: data.team.length
    }
  }
}} />

<!-- Hero Banner -->
<section class="hero">
  <Container>
    <ScrollReveal>
      <div class="hero-content">
        <h1 class="hero-title">Our <span class="gradient-text">Story</span></h1>
        <p class="hero-subtitle">
          Empowering traders worldwide with professional-grade education, proven strategies, and a community that champions your success.
        </p>
      </div>
    </ScrollReveal>
  </Container>
</section>

<!-- Company Story Section -->
<section class="story-section">
  <Container narrow>
    <ScrollReveal>
      <div class="story-content">
        <h2 class="section-heading">How It All <span class="gradient-text">Began</span></h2>
        <p class="story-paragraph">
          Revolution Trading Pros was founded in 2020 by Alex Rivera, a veteran trader with over 15 years of experience
          navigating global financial markets. After spending years watching aspiring traders fail due to a lack of quality
          education, Alex set out to build something different: a platform where real market expertise meets accessible,
          structured learning.
        </p>
        <p class="story-paragraph">
          Our mission is simple yet ambitious: to democratize trading education. We believe that every individual, regardless
          of background or starting capital, deserves access to the same caliber of training that institutional traders
          receive. From foundational concepts to advanced algorithmic strategies, our curriculum is designed to take you from
          where you are to where you want to be.
        </p>
        <p class="story-paragraph">
          Today, Revolution Trading Pros has grown into a thriving community of over 10,000 traders worldwide. Our students
          have collectively generated millions in profits, and our retention rate speaks for itself. We are more than a course
          provider; we are a movement dedicated to financial empowerment and lifelong learning.
        </p>
      </div>
    </ScrollReveal>
  </Container>
</section>

<!-- Mission / Vision / Values -->
<section class="values-section">
  <Container>
    <ScrollReveal>
      <h2 class="section-heading center">What <span class="gradient-text">Drives Us</span></h2>
    </ScrollReveal>
    <div class="values-grid">
      <ScrollReveal direction="up" delay={0}>
        <Card glass hover padding="lg">
          <div class="value-card">
            <div class="value-icon">
              <Target size={40} weight="duotone" />
            </div>
            <h3 class="value-title">Our Mission</h3>
            <p class="value-description">
              Empower every trader with world-class education and the tools they need to achieve consistent profitability in the financial markets.
            </p>
          </div>
        </Card>
      </ScrollReveal>
      <ScrollReveal direction="up" delay={0.15}>
        <Card glass hover padding="lg">
          <div class="value-card">
            <div class="value-icon vision-icon">
              <Eye size={40} weight="duotone" />
            </div>
            <h3 class="value-title">Our Vision</h3>
            <p class="value-description">
              A world where financial literacy is accessible to all, and every person has the knowledge to take control of their financial future.
            </p>
          </div>
        </Card>
      </ScrollReveal>
      <ScrollReveal direction="up" delay={0.3}>
        <Card glass hover padding="lg">
          <div class="value-card">
            <div class="value-icon values-icon">
              <Heart size={40} weight="duotone" />
            </div>
            <h3 class="value-title">Our Values</h3>
            <p class="value-description">
              Integrity, transparency, and student success are the pillars of everything we do. We succeed only when our students succeed.
            </p>
          </div>
        </Card>
      </ScrollReveal>
    </div>
  </Container>
</section>

<!-- Team Section -->
<section class="team-section">
  <Container>
    <ScrollReveal>
      <h2 class="section-heading center">Meet the <span class="gradient-text">Team</span></h2>
      <p class="section-subtitle">
        The experts behind Revolution Trading Pros bring decades of combined experience from Wall Street, institutional trading desks, and the world of education.
      </p>
    </ScrollReveal>
    <div class="team-grid">
      {#each data.team as member, i}
        <ScrollReveal direction="up" delay={i * 0.1}>
          <Card glass hover padding="lg">
            <div class="team-card">
              <div class="team-avatar">
                <span class="team-initials">
                  {member.name.split(' ').map((n: string) => n[0]).join('')}
                </span>
              </div>
              <h3 class="team-name">{member.name}</h3>
              <p class="team-role">{member.role}</p>
              <p class="team-bio">{member.bio}</p>
            </div>
          </Card>
        </ScrollReveal>
      {/each}
    </div>
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

  /* ---- Section Heading ---- */
  .section-heading {
    font-size: var(--text-4xl);
    font-weight: var(--font-bold);
    line-height: var(--leading-tight);
    letter-spacing: var(--tracking-tight);
    margin-bottom: var(--space-6);
  }

  .section-heading.center {
    text-align: center;
  }

  .section-subtitle {
    text-align: center;
    font-size: var(--text-lg);
    color: var(--color-text-secondary);
    line-height: var(--leading-relaxed);
    max-width: 650px;
    margin-inline: auto;
    margin-bottom: var(--space-12);
  }

  /* ---- Story Section ---- */
  .story-section {
    padding: var(--space-20) 0;
  }

  .story-content {
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
  }

  .story-paragraph {
    font-size: var(--text-lg);
    color: var(--color-text-secondary);
    line-height: var(--leading-relaxed);
  }

  /* ---- Values Section ---- */
  .values-section {
    padding: var(--space-20) 0;
    background: var(--color-bg-secondary);
  }

  .values-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-8);
    margin-top: var(--space-12);
  }

  .value-card {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-4);
  }

  .value-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 80px;
    border-radius: var(--radius-2xl);
    background: rgba(var(--color-accent-cyan-rgb), 0.1);
    color: var(--color-accent-cyan);
    margin-bottom: var(--space-2);
  }

  .value-icon.vision-icon {
    background: rgba(var(--color-accent-purple-rgb), 0.1);
    color: var(--color-accent-purple);
  }

  .value-icon.values-icon {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
  }

  .value-title {
    font-size: var(--text-2xl);
    font-weight: var(--font-bold);
  }

  .value-description {
    font-size: var(--text-base);
    color: var(--color-text-secondary);
    line-height: var(--leading-relaxed);
  }

  /* ---- Team Section ---- */
  .team-section {
    padding: var(--space-20) 0 var(--space-24);
  }

  .team-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-8);
  }

  .team-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: var(--space-3);
  }

  .team-avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 96px;
    height: 96px;
    border-radius: var(--radius-full);
    background: var(--gradient-cta);
    margin-bottom: var(--space-2);
    flex-shrink: 0;
  }

  .team-initials {
    font-size: var(--text-3xl);
    font-weight: var(--font-extrabold);
    color: var(--color-text-inverse);
    letter-spacing: var(--tracking-wide);
    line-height: 1;
  }

  .team-name {
    font-size: var(--text-xl);
    font-weight: var(--font-bold);
  }

  .team-role {
    font-size: var(--text-sm);
    font-weight: var(--font-semibold);
    color: var(--color-accent-cyan);
    text-transform: uppercase;
    letter-spacing: var(--tracking-wider);
  }

  .team-bio {
    font-size: var(--text-sm);
    color: var(--color-text-secondary);
    line-height: var(--leading-relaxed);
    margin-top: var(--space-2);
  }

  /* ---- Responsive ---- */
  @media (max-width: 1024px) {
    .values-grid {
      grid-template-columns: repeat(3, 1fr);
      gap: var(--space-6);
    }

    .team-grid {
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

    .values-grid {
      grid-template-columns: 1fr;
      gap: var(--space-6);
    }

    .team-grid {
      grid-template-columns: 1fr;
      gap: var(--space-6);
    }

    .section-heading {
      font-size: var(--text-3xl);
    }

    .story-section {
      padding: var(--space-16) 0;
    }

    .values-section {
      padding: var(--space-16) 0;
    }

    .team-section {
      padding: var(--space-16) 0 var(--space-20);
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

    .team-avatar {
      width: 80px;
      height: 80px;
    }

    .team-initials {
      font-size: var(--text-2xl);
    }
  }
</style>

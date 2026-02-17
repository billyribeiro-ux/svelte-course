<script lang="ts">
  import SEOHead from '$components/seo/SEOHead.svelte';
  import JsonLd from '$components/seo/JsonLd.svelte';
  import Hero from '$components/sections/Hero.svelte';
  import ValueProposition from '$components/sections/ValueProposition.svelte';
  import StatsCounter from '$components/sections/StatsCounter.svelte';
  import FeaturedCourses from '$components/sections/FeaturedCourses.svelte';
  import Testimonials from '$components/sections/Testimonials.svelte';
  import CTABanner from '$components/sections/CTABanner.svelte';

  let { data } = $props();
</script>

<SEOHead
  title="Revolution Trading Pros - Master the Markets with Expert-Led Education"
  description="Transform your trading with expert-led courses, proven strategies, and a thriving community. Join 10,000+ successful traders. Start with our free trading guide."
/>
<JsonLd schema={{
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Revolution Trading Pros',
  url: 'https://revolutiontradingpros.com',
  description: 'Expert-led trading education platform helping traders master the markets.',
  foundingDate: '2020',
  sameAs: [
    'https://twitter.com/revtradingpros',
    'https://instagram.com/revtradingpros',
    'https://youtube.com/@revtradingpros'
  ]
}} />

<Hero />
<ValueProposition />
<StatsCounter />
<FeaturedCourses courses={data.featuredCourses} />
<Testimonials testimonials={data.featuredTestimonials} />
<CTABanner />

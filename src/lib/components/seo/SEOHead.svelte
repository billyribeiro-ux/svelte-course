<script lang="ts">
  import { page } from '$app/state';

  interface Props {
    title: string;
    description: string;
    canonical?: string;
    ogImage?: string;
    ogType?: 'website' | 'article';
    twitterCard?: 'summary' | 'summary_large_image';
    noindex?: boolean;
  }

  let {
    title,
    description,
    canonical,
    ogImage = '/og-image.jpg',
    ogType = 'website',
    twitterCard = 'summary_large_image',
    noindex = false
  }: Props = $props();

  const siteUrl = 'https://revolutiontradingpros.com';
  let canonicalUrl = $derived(canonical ?? `${siteUrl}${page.url.pathname}`);
  let fullOgImage = $derived(ogImage?.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`);
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={canonicalUrl} />
  {#if noindex}
    <meta name="robots" content="noindex, nofollow" />
  {/if}
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:type" content={ogType} />
  <meta property="og:url" content={canonicalUrl} />
  <meta property="og:image" content={fullOgImage} />
  <meta property="og:site_name" content="Revolution Trading Pros" />
  <meta name="twitter:card" content={twitterCard} />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={fullOgImage} />
</svelte:head>

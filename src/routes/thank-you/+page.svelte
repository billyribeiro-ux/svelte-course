<script lang="ts">
	import SEOHead from '$components/seo/SEOHead.svelte';
	import Container from '$components/ui/Container.svelte';
	import Button from '$components/ui/Button.svelte';
	import Card from '$components/ui/Card.svelte';
	import ScrollReveal from '$components/animations/ScrollReveal.svelte';
	import DownloadSimple from 'phosphor-svelte/lib/DownloadSimple';
	import CheckCircle from 'phosphor-svelte/lib/CheckCircle';

	let { data } = $props();
</script>

<SEOHead
	title="Your Guide is Ready! | Revolution Trading Pros"
	description="Download your free trading secrets PDF guide."
	noindex={true}
/>

<section class="thank-you">
	<div class="thank-you__bg-effects">
		<div class="thank-you__orb thank-you__orb--1"></div>
		<div class="thank-you__orb thank-you__orb--2"></div>
	</div>

	<Container narrow>
		<ScrollReveal direction="up">
			<div class="thank-you__hero">
				<div class="thank-you__icon-wrapper">
					<div class="thank-you__icon-ring"></div>
					<div class="thank-you__icon">
						<CheckCircle size={64} weight="fill" />
					</div>
				</div>

				<h1 class="thank-you__title">Your Guide is Ready!</h1>
				<p class="thank-you__description">
					Thank you for signing up! Your free copy of <strong>"The 5 Trading Secrets Every Beginner Must Know"</strong>
					is ready for download. Click the button below to get your PDF guide instantly.
				</p>

				<div class="thank-you__download">
					<Button href="/api/download-pdf?token={data.token}" variant="primary" size="lg">
						<DownloadSimple size={22} weight="bold" />
						Download Your Free PDF
					</Button>
				</div>

				<p class="thank-you__note">
					Your download link is valid for 24 hours. Save the PDF to your device for permanent access.
				</p>
			</div>
		</ScrollReveal>

		<ScrollReveal direction="up" delay={0.2}>
			<div class="whats-next">
				<h2 class="whats-next__title">What's Next?</h2>
				<p class="whats-next__description">
					Now that you have the fundamentals, take your trading to the next level with our expert-led courses
					and thriving community.
				</p>

				<div class="whats-next__cards">
					<Card glass padding="lg" hover>
						<div class="whats-next__card-content">
							<div class="whats-next__card-number">01</div>
							<h3 class="whats-next__card-title">Browse Courses</h3>
							<p class="whats-next__card-text">
								Explore our library of in-depth trading courses designed for every skill level.
								From technical analysis to advanced strategies.
							</p>
							<Button href="/courses" variant="secondary" size="md">
								View Courses
							</Button>
						</div>
					</Card>

					<Card glass padding="lg" hover>
						<div class="whats-next__card-content">
							<div class="whats-next__card-number">02</div>
							<h3 class="whats-next__card-title">Join Our Community</h3>
							<p class="whats-next__card-text">
								Connect with 10,000+ traders, share insights, get real-time market analysis,
								and grow together as a community.
							</p>
							<Button href="/community" variant="secondary" size="md">
								Join Community
							</Button>
						</div>
					</Card>
				</div>
			</div>
		</ScrollReveal>
	</Container>
</section>

<style>
	/* ---- Thank You Section ---- */
	.thank-you {
		position: relative;
		padding: var(--space-20) 0 var(--space-16);
		overflow: hidden;
		min-height: 100vh;
	}

	.thank-you__bg-effects {
		position: absolute;
		inset: 0;
		pointer-events: none;
		z-index: 0;
	}

	.thank-you__orb {
		position: absolute;
		border-radius: 50%;
		filter: blur(120px);
		opacity: 0.12;
	}

	.thank-you__orb--1 {
		width: 500px;
		height: 500px;
		background: var(--color-accent-green);
		top: -100px;
		right: -150px;
	}

	.thank-you__orb--2 {
		width: 400px;
		height: 400px;
		background: var(--color-accent-cyan);
		bottom: -100px;
		left: -100px;
	}

	/* ---- Hero Area ---- */
	.thank-you__hero {
		text-align: center;
		position: relative;
		z-index: 1;
		margin-bottom: var(--space-16);
	}

	/* ---- Success Icon ---- */
	.thank-you__icon-wrapper {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		margin-bottom: var(--space-8);
	}

	.thank-you__icon-ring {
		position: absolute;
		width: 120px;
		height: 120px;
		border-radius: 50%;
		border: 2px solid rgba(var(--color-accent-green-rgb, 34, 197, 94), 0.3);
		animation: thank-you-pulse 2s ease-in-out infinite;
	}

	.thank-you__icon {
		position: relative;
		width: 96px;
		height: 96px;
		border-radius: 50%;
		background: rgba(var(--color-accent-green-rgb, 34, 197, 94), 0.1);
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--color-accent-green);
	}

	@keyframes thank-you-pulse {
		0%, 100% {
			transform: scale(1);
			opacity: 0.6;
		}
		50% {
			transform: scale(1.15);
			opacity: 0;
		}
	}

	/* ---- Title & Text ---- */
	.thank-you__title {
		font-size: clamp(2rem, 5vw, 3rem);
		font-weight: var(--font-bold);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-6);
		line-height: var(--leading-tight);
	}

	.thank-you__description {
		font-size: var(--text-lg);
		color: var(--color-text-secondary);
		line-height: var(--leading-relaxed);
		margin: 0 0 var(--space-8);
		max-width: 560px;
		margin-inline: auto;
	}

	.thank-you__description strong {
		color: var(--color-text-primary);
	}

	/* ---- Download Button ---- */
	.thank-you__download {
		margin-bottom: var(--space-6);
		display: flex;
		justify-content: center;
	}

	.thank-you__download :global(.btn) {
		gap: var(--space-3);
		padding: var(--space-4) var(--space-8);
		font-size: var(--text-lg);
	}

	.thank-you__note {
		font-size: var(--text-sm);
		color: var(--color-text-tertiary);
		margin: 0;
		line-height: var(--leading-relaxed);
	}

	/* ---- What's Next Section ---- */
	.whats-next {
		position: relative;
		z-index: 1;
		border-top: 1px solid var(--color-border-primary);
		padding-top: var(--space-12);
	}

	.whats-next__title {
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
		color: var(--color-text-primary);
		text-align: center;
		margin: 0 0 var(--space-3);
	}

	.whats-next__description {
		font-size: var(--text-base);
		color: var(--color-text-secondary);
		text-align: center;
		max-width: 480px;
		margin: 0 auto var(--space-10);
		line-height: var(--leading-relaxed);
	}

	.whats-next__cards {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-6);
	}

	.whats-next__card-content {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		align-items: flex-start;
	}

	.whats-next__card-number {
		font-size: var(--text-sm);
		font-weight: var(--font-bold);
		color: var(--color-accent-cyan);
		letter-spacing: var(--tracking-widest);
		font-family: var(--font-mono);
	}

	.whats-next__card-title {
		font-size: var(--text-xl);
		font-weight: var(--font-bold);
		color: var(--color-text-primary);
		margin: 0;
	}

	.whats-next__card-text {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		line-height: var(--leading-relaxed);
		margin: 0 0 var(--space-2);
	}

	/* ---- Responsive ---- */
	@media (max-width: 768px) {
		.thank-you {
			padding: var(--space-16) 0 var(--space-12);
			min-height: auto;
		}

		.thank-you__hero {
			margin-bottom: var(--space-12);
		}

		.whats-next__cards {
			grid-template-columns: 1fr;
		}

		.thank-you__download :global(.btn) {
			width: 100%;
			justify-content: center;
		}
	}
</style>

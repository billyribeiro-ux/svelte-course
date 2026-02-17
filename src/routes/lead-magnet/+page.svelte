<script lang="ts">
	import { enhance } from '$app/forms';
	import SEOHead from '$components/seo/SEOHead.svelte';
	import Container from '$components/ui/Container.svelte';
	import Button from '$components/ui/Button.svelte';
	import Input from '$components/ui/Input.svelte';
	import Card from '$components/ui/Card.svelte';
	import ScrollReveal from '$components/animations/ScrollReveal.svelte';
	import CheckCircle from 'phosphor-svelte/lib/CheckCircle';
	import Download from 'phosphor-svelte/lib/Download';

	let { form } = $props();

	let submitting = $state(false);

	const benefits = [
		'The one indicator that actually predicts market moves',
		'Risk management rules that protect your capital',
		'The best times to enter and exit trades',
		'How to read market sentiment like a pro',
		'The compound growth strategy used by top traders'
	];
</script>

<SEOHead
	title="Free Trading Guide - 5 Secrets Every Beginner Must Know | Revolution Trading Pros"
	description="Download our free PDF guide that has helped 5,000+ beginners start their profitable trading journey. Learn the 5 trading secrets every beginner must know."
/>

<section class="lead-hero">
	<div class="lead-hero__bg-effects">
		<div class="lead-hero__orb lead-hero__orb--1"></div>
		<div class="lead-hero__orb lead-hero__orb--2"></div>
		<div class="lead-hero__orb lead-hero__orb--3"></div>
	</div>

	<Container>
		<ScrollReveal direction="up">
			<div class="lead-hero__badge">
				<Download size={18} weight="bold" />
				<span>Free PDF Guide</span>
			</div>

			<h1 class="lead-hero__title">
				The <span class="lead-hero__title-accent">5 Trading Secrets</span> Every Beginner Must Know
			</h1>

			<p class="lead-hero__subtitle">
				Free PDF guide that has helped <strong>5,000+ beginners</strong> start their profitable trading journey.
			</p>
		</ScrollReveal>

		<div class="lead-hero__content">
			<ScrollReveal direction="left" delay={0.2}>
				<div class="lead-hero__benefits">
					<h2 class="lead-hero__benefits-title">What You'll Discover Inside:</h2>
					<ul class="lead-hero__benefits-list">
						{#each benefits as benefit}
							<li class="lead-hero__benefit-item">
								<span class="lead-hero__benefit-icon">
									<CheckCircle size={24} weight="fill" />
								</span>
								<span class="lead-hero__benefit-text">{benefit}</span>
							</li>
						{/each}
					</ul>
				</div>
			</ScrollReveal>

			<ScrollReveal direction="right" delay={0.3}>
				<Card glass padding="lg">
					<div class="lead-form">
						<h3 class="lead-form__title">Get Your Free Guide</h3>
						<p class="lead-form__description">
							Enter your details below and get instant access to the complete trading secrets PDF.
						</p>

						{#if form?.error}
							<div class="lead-form__error" role="alert">
								<p>{form.error}</p>
							</div>
						{/if}

						<form
							method="POST"
							use:enhance={() => {
								submitting = true;
								return async ({ update }) => {
									await update();
									submitting = false;
								};
							}}
							class="lead-form__form"
						>
							<Input
								name="name"
								label="Your Name"
								type="text"
								required
								value={form?.name ?? ''}
							/>

							<Input
								name="email"
								label="Email Address"
								type="email"
								required
								value={form?.email ?? ''}
							/>

							<Button type="submit" variant="primary" size="lg" disabled={submitting}>
								{#if submitting}
									Sending...
								{:else}
									Get Your Free Guide →
								{/if}
							</Button>

							<p class="lead-form__privacy">
								We respect your privacy. Unsubscribe anytime.
							</p>
						</form>
					</div>
				</Card>
			</ScrollReveal>
		</div>
	</Container>
</section>

<section class="social-proof">
	<Container>
		<ScrollReveal direction="up" delay={0.1}>
			<div class="social-proof__inner">
				<div class="social-proof__avatars">
					{#each Array(5) as _, i}
						<div class="social-proof__avatar" style="--i: {i}">
							<span class="social-proof__avatar-text">{['J', 'S', 'M', 'K', 'A'][i]}</span>
						</div>
					{/each}
				</div>
				<div class="social-proof__text">
					<p class="social-proof__headline">Join <strong>5,000+</strong> traders who downloaded this guide</p>
					<div class="social-proof__stars">
						{#each Array(5) as _}
							<span class="social-proof__star">&#9733;</span>
						{/each}
						<span class="social-proof__rating">4.9/5 average rating</span>
					</div>
				</div>
			</div>
		</ScrollReveal>
	</Container>
</section>

<style>
	/* ---- Hero Section ---- */
	.lead-hero {
		position: relative;
		padding: var(--space-20) 0 var(--space-16);
		overflow: hidden;
		min-height: 90vh;
		display: flex;
		align-items: center;
	}

	.lead-hero__bg-effects {
		position: absolute;
		inset: 0;
		pointer-events: none;
		z-index: 0;
	}

	.lead-hero__orb {
		position: absolute;
		border-radius: 50%;
		filter: blur(120px);
		opacity: 0.15;
	}

	.lead-hero__orb--1 {
		width: 600px;
		height: 600px;
		background: var(--color-accent-cyan);
		top: -200px;
		right: -100px;
	}

	.lead-hero__orb--2 {
		width: 500px;
		height: 500px;
		background: var(--color-accent-green);
		bottom: -150px;
		left: -150px;
	}

	.lead-hero__orb--3 {
		width: 300px;
		height: 300px;
		background: var(--color-accent-cyan);
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	/* ---- Badge ---- */
	.lead-hero__badge {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-4);
		background: rgba(var(--color-accent-cyan-rgb), 0.1);
		border: 1px solid rgba(var(--color-accent-cyan-rgb), 0.3);
		border-radius: var(--radius-full);
		color: var(--color-accent-cyan);
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		letter-spacing: var(--tracking-wide);
		margin-bottom: var(--space-6);
	}

	/* ---- Title ---- */
	.lead-hero__title {
		font-size: clamp(2rem, 5vw, 3.5rem);
		font-weight: var(--font-bold);
		line-height: var(--leading-tight);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-6);
		max-width: 800px;
	}

	.lead-hero__title-accent {
		background: var(--gradient-text);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.lead-hero__subtitle {
		font-size: var(--text-xl);
		color: var(--color-text-secondary);
		line-height: var(--leading-relaxed);
		margin: 0 0 var(--space-12);
		max-width: 600px;
	}

	/* ---- Two-column Content ---- */
	.lead-hero__content {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-12);
		align-items: start;
		position: relative;
		z-index: 1;
	}

	/* ---- Benefits List ---- */
	.lead-hero__benefits {
		padding-top: var(--space-4);
	}

	.lead-hero__benefits-title {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-6);
		letter-spacing: var(--tracking-wide);
	}

	.lead-hero__benefits-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-5);
	}

	.lead-hero__benefit-item {
		display: flex;
		align-items: flex-start;
		gap: var(--space-3);
	}

	.lead-hero__benefit-icon {
		flex-shrink: 0;
		color: var(--color-accent-green);
		display: flex;
		align-items: center;
		margin-top: 2px;
	}

	.lead-hero__benefit-text {
		font-size: var(--text-base);
		color: var(--color-text-secondary);
		line-height: var(--leading-relaxed);
	}

	/* ---- Form Card ---- */
	.lead-form {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.lead-form__title {
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
		color: var(--color-text-primary);
		margin: 0;
		text-align: center;
	}

	.lead-form__description {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		text-align: center;
		margin: 0 0 var(--space-2);
		line-height: var(--leading-relaxed);
	}

	.lead-form__error {
		background: rgba(239, 68, 68, 0.1);
		border: 1px solid rgba(239, 68, 68, 0.3);
		border-radius: var(--radius-md);
		padding: var(--space-3) var(--space-4);
	}

	.lead-form__error p {
		margin: 0;
		color: var(--color-error);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
	}

	.lead-form__form {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.lead-form__form :global(.btn) {
		width: 100%;
		margin-top: var(--space-2);
	}

	.lead-form__privacy {
		font-size: var(--text-xs);
		color: var(--color-text-tertiary);
		text-align: center;
		margin: 0;
		line-height: var(--leading-relaxed);
	}

	/* ---- Social Proof Section ---- */
	.social-proof {
		padding: var(--space-16) 0;
		border-top: 1px solid var(--color-border-primary);
	}

	.social-proof__inner {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-6);
		flex-wrap: wrap;
	}

	.social-proof__avatars {
		display: flex;
		align-items: center;
	}

	.social-proof__avatar {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: var(--gradient-cta);
		display: flex;
		align-items: center;
		justify-content: center;
		border: 2px solid var(--color-bg-primary);
		margin-left: calc(var(--i, 0) * -1px * 3);
		position: relative;
		z-index: calc(5 - var(--i, 0));
	}

	.social-proof__avatar:first-child {
		margin-left: 0;
	}

	.social-proof__avatar-text {
		font-size: var(--text-sm);
		font-weight: var(--font-bold);
		color: var(--color-text-inverse);
	}

	.social-proof__text {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.social-proof__headline {
		font-size: var(--text-base);
		color: var(--color-text-secondary);
		margin: 0;
	}

	.social-proof__headline strong {
		color: var(--color-text-primary);
	}

	.social-proof__stars {
		display: flex;
		align-items: center;
		gap: var(--space-1);
	}

	.social-proof__star {
		color: #f59e0b;
		font-size: var(--text-lg);
	}

	.social-proof__rating {
		font-size: var(--text-sm);
		color: var(--color-text-tertiary);
		margin-left: var(--space-2);
	}

	/* ---- Responsive ---- */
	@media (max-width: 768px) {
		.lead-hero {
			padding: var(--space-16) 0 var(--space-12);
			min-height: auto;
		}

		.lead-hero__content {
			grid-template-columns: 1fr;
			gap: var(--space-8);
		}

		.lead-hero__title {
			font-size: clamp(1.75rem, 6vw, 2.5rem);
		}

		.lead-hero__subtitle {
			font-size: var(--text-lg);
			margin-bottom: var(--space-8);
		}

		.social-proof__inner {
			flex-direction: column;
			text-align: center;
		}
	}
</style>

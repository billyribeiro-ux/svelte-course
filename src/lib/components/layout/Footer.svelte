<script lang="ts">
	import TwitterLogo from 'phosphor-svelte/lib/TwitterLogo';
	import InstagramLogo from 'phosphor-svelte/lib/InstagramLogo';
	import YoutubeLogo from 'phosphor-svelte/lib/YoutubeLogo';
	import LinkedinLogo from 'phosphor-svelte/lib/LinkedinLogo';
	import Envelope from 'phosphor-svelte/lib/Envelope';
	import Phone from 'phosphor-svelte/lib/Phone';
	import Clock from 'phosphor-svelte/lib/Clock';

	const quickLinks = [
		{ label: 'Home', href: '/' },
		{ label: 'About', href: '/about' },
		{ label: 'Courses', href: '/courses' },
		{ label: 'Blog', href: '/blog' }
	];

	const resourceLinks = [
		{ label: 'Free Trading Guide', href: '/lead-magnet' },
		{ label: 'Testimonials', href: '/testimonials' },
		{ label: 'Contact', href: '/contact' },
		{ label: 'FAQ', href: '/faq' }
	];

	const socialLinks = [
		{ icon: TwitterLogo, href: 'https://twitter.com', label: 'Twitter' },
		{ icon: InstagramLogo, href: 'https://instagram.com', label: 'Instagram' },
		{ icon: YoutubeLogo, href: 'https://youtube.com', label: 'YouTube' },
		{ icon: LinkedinLogo, href: 'https://linkedin.com', label: 'LinkedIn' }
	];
</script>

<footer class="footer">
	<div class="footer-inner">
		<div class="footer-grid">
			<!-- Column 1: Brand -->
			<div class="footer-col brand-col">
				<a href="/" class="footer-logo">
					<span class="logo-mark">RT</span>
					<span class="logo-text">Revolution Trading Pros</span>
				</a>
				<p class="brand-description">
					Empowering traders with professional-grade education, proven strategies, and a
					supportive community. Transform your trading journey today.
				</p>
				<div class="social-links">
					{#each socialLinks as social}
						<a
							href={social.href}
							class="social-link"
							target="_blank"
							rel="noopener noreferrer"
							aria-label={social.label}
						>
							<social.icon size={20} weight="regular" />
						</a>
					{/each}
				</div>
			</div>

			<!-- Column 2: Quick Links -->
			<div class="footer-col">
				<h3 class="footer-heading">Quick Links</h3>
				<nav aria-label="Quick links">
					<ul class="footer-links">
						{#each quickLinks as link}
							<li>
								<a href={link.href} class="footer-link">{link.label}</a>
							</li>
						{/each}
					</ul>
				</nav>
			</div>

			<!-- Column 3: Resources -->
			<div class="footer-col">
				<h3 class="footer-heading">Resources</h3>
				<nav aria-label="Resources">
					<ul class="footer-links">
						{#each resourceLinks as link}
							<li>
								<a href={link.href} class="footer-link">{link.label}</a>
							</li>
						{/each}
					</ul>
				</nav>
			</div>

			<!-- Column 4: Contact -->
			<div class="footer-col">
				<h3 class="footer-heading">Contact</h3>
				<ul class="contact-list">
					<li class="contact-item">
						<Envelope size={18} weight="regular" />
						<a href="mailto:support@revolutiontradingpros.com" class="footer-link">
							support@revolutiontradingpros.com
						</a>
					</li>
					<li class="contact-item">
						<Phone size={18} weight="regular" />
						<a href="tel:+18005551234" class="footer-link">
							+1 (800) 555-1234
						</a>
					</li>
					<li class="contact-item">
						<Clock size={18} weight="regular" />
						<span class="contact-text">Mon - Fri: 9AM - 6PM EST</span>
					</li>
				</ul>
			</div>
		</div>

		<!-- Bottom Bar -->
		<div class="footer-bottom">
			<p class="copyright">
				&copy; 2026 Revolution Trading Pros. All rights reserved.
			</p>
			<nav class="legal-links" aria-label="Legal">
				<a href="/privacy-policy" class="legal-link">Privacy Policy</a>
				<span class="legal-divider" aria-hidden="true">|</span>
				<a href="/terms" class="legal-link">Terms of Service</a>
			</nav>
		</div>
	</div>
</footer>

<style>
	/* ---- Footer ---- */
	.footer {
		background: var(--color-footer-bg, rgba(12, 12, 18, 1));
		border-top: 1px solid var(--color-border, rgba(255, 255, 255, 0.08));
		padding-top: 4rem;
		padding-bottom: 0;
		margin-top: auto;
	}

	.footer-inner {
		max-width: 1280px;
		margin: 0 auto;
		padding: 0 1.5rem;
	}

	/* ---- Grid ---- */
	.footer-grid {
		display: grid;
		grid-template-columns: 1.5fr 1fr 1fr 1.25fr;
		gap: 3rem;
	}

	/* ---- Brand Column ---- */
	.footer-logo {
		display: inline-flex;
		align-items: center;
		gap: 0.625rem;
		text-decoration: none;
		color: var(--color-text, #e4e4e7);
		margin-bottom: 1rem;
	}

	.logo-mark {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		border-radius: 7px;
		background: linear-gradient(135deg, var(--color-accent, #6d5acd), var(--color-accent-secondary, #4f8cff));
		color: #fff;
		font-weight: 800;
		font-size: 0.8rem;
		letter-spacing: -0.02em;
	}

	.logo-text {
		font-size: 0.95rem;
		font-weight: 700;
		letter-spacing: -0.01em;
	}

	.brand-description {
		font-size: 0.875rem;
		line-height: 1.65;
		color: var(--color-text-muted, #a1a1aa);
		margin: 0 0 1.25rem 0;
		max-width: 320px;
	}

	.social-links {
		display: flex;
		gap: 0.5rem;
	}

	.social-link {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		border-radius: 8px;
		border: 1px solid var(--color-border, rgba(255, 255, 255, 0.1));
		background: var(--color-surface, rgba(255, 255, 255, 0.04));
		color: var(--color-text-muted, #a1a1aa);
		text-decoration: none;
		transition: all 0.2s ease;
	}

	.social-link:hover {
		color: var(--color-accent, #6d5acd);
		border-color: var(--color-accent, #6d5acd);
		background: var(--color-accent-surface, rgba(109, 90, 205, 0.1));
		transform: translateY(-2px);
	}

	/* ---- Footer Columns ---- */
	.footer-heading {
		font-size: 0.825rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-text, #e4e4e7);
		margin: 0 0 1.25rem 0;
	}

	.footer-links {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.625rem;
	}

	.footer-link {
		font-size: 0.875rem;
		color: var(--color-text-muted, #a1a1aa);
		text-decoration: none;
		transition: color 0.2s ease;
	}

	.footer-link:hover {
		color: var(--color-accent, #6d5acd);
	}

	/* ---- Contact ---- */
	.contact-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.875rem;
	}

	.contact-item {
		display: flex;
		align-items: flex-start;
		gap: 0.625rem;
		color: var(--color-text-muted, #a1a1aa);
		font-size: 0.875rem;
	}

	.contact-item :global(svg) {
		flex-shrink: 0;
		margin-top: 2px;
	}

	.contact-text {
		color: var(--color-text-muted, #a1a1aa);
		font-size: 0.875rem;
	}

	/* ---- Bottom Bar ---- */
	.footer-bottom {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1.5rem 0;
		margin-top: 3rem;
		border-top: 1px solid var(--color-border, rgba(255, 255, 255, 0.06));
	}

	.copyright {
		font-size: 0.8rem;
		color: var(--color-text-muted, #71717a);
		margin: 0;
	}

	.legal-links {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.legal-link {
		font-size: 0.8rem;
		color: var(--color-text-muted, #71717a);
		text-decoration: none;
		transition: color 0.2s ease;
	}

	.legal-link:hover {
		color: var(--color-accent, #6d5acd);
	}

	.legal-divider {
		color: var(--color-border, rgba(255, 255, 255, 0.12));
		font-size: 0.75rem;
	}

	/* ---- Responsive ---- */
	@media (max-width: 1024px) {
		.footer-grid {
			grid-template-columns: 1.25fr 1fr 1fr;
			gap: 2.5rem;
		}

		.brand-col {
			grid-column: 1 / -1;
		}
	}

	@media (max-width: 640px) {
		.footer {
			padding-top: 3rem;
		}

		.footer-grid {
			grid-template-columns: 1fr;
			gap: 2rem;
		}

		.brand-col {
			grid-column: auto;
		}

		.brand-description {
			max-width: none;
		}

		.footer-bottom {
			flex-direction: column;
			gap: 0.75rem;
			text-align: center;
			margin-top: 2rem;
		}
	}
</style>

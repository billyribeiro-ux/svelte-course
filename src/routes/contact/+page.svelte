<script lang="ts">
  import { enhance } from '$app/forms';
  import SEOHead from '$components/seo/SEOHead.svelte';
  import JsonLd from '$components/seo/JsonLd.svelte';
  import Container from '$components/ui/Container.svelte';
  import Button from '$components/ui/Button.svelte';
  import Input from '$components/ui/Input.svelte';
  import Card from '$components/ui/Card.svelte';
  import ScrollReveal from '$components/animations/ScrollReveal.svelte';
  import Envelope from 'phosphor-svelte/lib/Envelope';
  import Phone from 'phosphor-svelte/lib/Phone';
  import Clock from 'phosphor-svelte/lib/Clock';
  import MapPin from 'phosphor-svelte/lib/MapPin';

  let { form } = $props();
  let submitting = $state(false);
</script>

<SEOHead
  title="Contact Us - Revolution Trading Pros"
  description="Get in touch with Revolution Trading Pros. We're here to help you on your trading journey."
/>
<JsonLd schema={{
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact Revolution Trading Pros',
  url: 'https://revolutiontradingpros.com/contact'
}} />

<section class="contact-page">
  <Container>
    <ScrollReveal>
      <div class="contact-header">
        <h1>Get in Touch</h1>
        <p>Have questions about our courses or want to learn more? We'd love to hear from you.</p>
      </div>
    </ScrollReveal>

    <div class="contact-grid">
      <ScrollReveal direction="left">
        <div class="contact-form-wrapper">
          {#if form?.success}
            <Card glass>
              <div class="success-message">
                <div class="success-icon">&#10003;</div>
                <h2>Message Sent!</h2>
                <p>Thank you for reaching out. We'll get back to you within 24 hours.</p>
                <Button href="/" variant="secondary">Back to Home</Button>
              </div>
            </Card>
          {:else}
            <form method="POST" use:enhance={() => {
              submitting = true;
              return async ({ update }) => {
                submitting = false;
                await update();
              };
            }}>
              <Input name="name" label="Full Name" required value={form?.name ?? ''} />
              <Input name="email" label="Email Address" type="email" required value={form?.email ?? ''} />
              <Input name="subject" label="Subject" required value={form?.subject ?? ''} />
              <div class="textarea-group">
                <label for="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  required
                  placeholder="Tell us how we can help..."
                >{form?.message ?? ''}</textarea>
              </div>
              {#if form?.error}
                <p class="error-message">{form.error}</p>
              {/if}
              <Button type="submit" variant="primary" size="lg" disabled={submitting}>
                {submitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          {/if}
        </div>
      </ScrollReveal>

      <ScrollReveal direction="right">
        <div class="contact-info">
          <Card glass>
            <div class="info-items">
              <div class="info-item">
                <div class="info-icon"><Envelope size={24} weight="duotone" /></div>
                <div>
                  <h3>Email</h3>
                  <p>contact@revolutiontradingpros.com</p>
                </div>
              </div>
              <div class="info-item">
                <div class="info-icon"><Phone size={24} weight="duotone" /></div>
                <div>
                  <h3>Phone</h3>
                  <p>+1 (555) 123-4567</p>
                </div>
              </div>
              <div class="info-item">
                <div class="info-icon"><Clock size={24} weight="duotone" /></div>
                <div>
                  <h3>Hours</h3>
                  <p>Mon - Fri: 9am - 6pm EST</p>
                </div>
              </div>
              <div class="info-item">
                <div class="info-icon"><MapPin size={24} weight="duotone" /></div>
                <div>
                  <h3>Location</h3>
                  <p>New York, NY</p>
                </div>
              </div>
            </div>
          </Card>

          <Card glass>
            <h3>Quick Help</h3>
            <p>Looking for answers? Check our free trading guide or browse courses.</p>
            <div class="quick-links">
              <Button href="/lead-magnet" variant="secondary" size="sm">Free Guide</Button>
              <Button href="/courses" variant="ghost" size="sm">Browse Courses</Button>
            </div>
          </Card>
        </div>
      </ScrollReveal>
    </div>
  </Container>
</section>

<style>
  .contact-page { padding: var(--space-16) 0 var(--space-24); }
  .contact-header { text-align: center; margin-bottom: var(--space-12); }
  .contact-header h1 { margin-bottom: var(--space-4); }
  .contact-header p { font-size: var(--text-lg); max-width: 36rem; margin: 0 auto; }
  .contact-grid {
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;
    gap: var(--space-10);
    align-items: start;
  }
  form { display: flex; flex-direction: column; gap: var(--space-4); }
  .textarea-group { display: flex; flex-direction: column; gap: var(--space-2); }
  .textarea-group label {
    font-size: var(--text-sm);
    font-weight: var(--font-medium);
    color: var(--color-text-secondary);
  }
  textarea {
    width: 100%;
    padding: var(--space-3) var(--space-4);
    background: var(--color-bg-tertiary);
    border: 1px solid var(--color-border-primary);
    border-radius: var(--radius-md);
    color: var(--color-text-primary);
    font-family: var(--font-sans);
    font-size: var(--text-base);
    resize: vertical;
    transition: border-color var(--transition-fast);
  }
  textarea:focus {
    outline: none;
    border-color: var(--color-accent-cyan);
    box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
  }
  .error-message {
    color: var(--color-error);
    font-size: var(--text-sm);
    padding: var(--space-2) var(--space-3);
    background: var(--color-error-bg);
    border-radius: var(--radius-md);
  }
  .success-message { text-align: center; padding: var(--space-8); }
  .success-icon {
    width: 4rem; height: 4rem;
    border-radius: 50%;
    background: var(--color-success);
    color: white;
    display: flex; align-items: center; justify-content: center;
    font-size: var(--text-2xl);
    margin: 0 auto var(--space-4);
  }
  .success-message h2 { margin-bottom: var(--space-3); }
  .success-message p { margin-bottom: var(--space-6); }
  .contact-info { display: flex; flex-direction: column; gap: var(--space-6); }
  .info-items { display: flex; flex-direction: column; gap: var(--space-6); }
  .info-item { display: flex; gap: var(--space-4); align-items: start; }
  .info-icon {
    flex-shrink: 0;
    width: 3rem; height: 3rem;
    border-radius: var(--radius-lg);
    background: rgba(0, 212, 255, 0.1);
    display: flex; align-items: center; justify-content: center;
    color: var(--color-accent-cyan);
  }
  .info-item h3 { font-size: var(--text-base); font-weight: var(--font-semibold); margin-bottom: var(--space-1); }
  .info-item p { font-size: var(--text-sm); }
  .quick-links { display: flex; gap: var(--space-3); margin-top: var(--space-4); flex-wrap: wrap; }
  @media (max-width: 768px) { .contact-grid { grid-template-columns: 1fr; } }
</style>

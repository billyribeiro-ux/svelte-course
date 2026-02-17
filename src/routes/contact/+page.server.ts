import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
  return {};
};

export const actions: Actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const name = formData.get('name')?.toString().trim();
    const email = formData.get('email')?.toString().trim();
    const subject = formData.get('subject')?.toString().trim();
    const message = formData.get('message')?.toString().trim();

    if (!name || name.length < 2) {
      return fail(400, { error: 'Please enter your name', name, email, subject, message });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return fail(400, { error: 'Please enter a valid email address', name, email, subject, message });
    }
    if (!subject) {
      return fail(400, { error: 'Please enter a subject', name, email, subject, message });
    }
    if (!message || message.length < 10) {
      return fail(400, { error: 'Please enter a message (at least 10 characters)', name, email, subject, message });
    }

    // In production: send email, store in database
    console.log(`[Contact Form] From: ${name} (${email}) Subject: ${subject}`);
    return { success: true };
  }
};

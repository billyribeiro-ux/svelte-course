import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { processLeadMagnet } from '$lib/server/lead-magnet';

export const load: PageServerLoad = async () => {
	return {};
};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name')?.toString().trim();
		const email = formData.get('email')?.toString().trim();

		if (!name || name.length < 2) {
			return fail(400, { error: 'Please enter your name', name, email });
		}
		if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			return fail(400, { error: 'Please enter a valid email address', name, email });
		}

		const result = await processLeadMagnet(name, email);
		redirect(303, `/thank-you?token=${result.token}`);
	}
};

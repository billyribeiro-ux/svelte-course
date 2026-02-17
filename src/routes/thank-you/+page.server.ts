import type { PageServerLoad } from './$types';
import { validateDownloadToken } from '$lib/server/lead-magnet';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ url }) => {
	const token = url.searchParams.get('token');
	if (!token || !validateDownloadToken(token)) {
		redirect(303, '/lead-magnet');
	}
	return { token };
};

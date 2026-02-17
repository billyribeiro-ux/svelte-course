import type { RequestHandler } from './$types';
import { validateDownloadToken } from '$lib/server/lead-magnet';
import { error } from '@sveltejs/kit';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

export const GET: RequestHandler = async ({ url }) => {
	const token = url.searchParams.get('token');

	if (!token || !validateDownloadToken(token)) {
		throw error(403, 'Invalid or expired download link. Please request a new one.');
	}

	const pdfPath = join(process.cwd(), 'static', 'pdfs', 'trading-secrets-guide.pdf');

	if (!existsSync(pdfPath)) {
		throw error(500, 'PDF not available at this time.');
	}

	const pdfBuffer = readFileSync(pdfPath);
	return new Response(pdfBuffer, {
		headers: {
			'Content-Type': 'application/pdf',
			'Content-Disposition': 'attachment; filename="5-Trading-Secrets-Guide-RevolutionTradingPros.pdf"',
			'Cache-Control': 'no-store'
		}
	});
};

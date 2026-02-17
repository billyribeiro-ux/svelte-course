const leadStore = new Map<string, { name: string; email: string; timestamp: number }>();

export async function processLeadMagnet(name: string, email: string) {
	const token = crypto.randomUUID();
	leadStore.set(token, { name, email, timestamp: Date.now() });
	console.log(`[Lead Magnet] New lead: ${name} (${email}) - Token: ${token}`);
	return { token };
}

export function validateDownloadToken(token: string): boolean {
	const lead = leadStore.get(token);
	if (!lead) return false;
	return Date.now() - lead.timestamp < 24 * 60 * 60 * 1000;
}

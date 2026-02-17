export interface TeamMember {
	id: number;
	name: string;
	role: string;
	bio: string;
	avatar: string;
}

export const team: TeamMember[] = [
	{
		id: 1,
		name: 'Alex Rivera',
		role: 'Founder & Head Trader',
		bio: 'With over 15 years of experience in the financial markets, Alex founded Revolution Trading Pros to make professional-grade trading education accessible to everyone. He has traded equities, options, and futures across global markets and managed portfolios exceeding $50 million. His teaching philosophy centers on disciplined risk management and developing a personalized trading edge. Alex has been featured in Forbes, Bloomberg, and The Wall Street Journal for his innovative approach to trading education.',
		avatar: '/images/team/alex-rivera.webp'
	},
	{
		id: 2,
		name: 'Sarah Chen',
		role: 'Senior Trading Instructor',
		bio: 'Sarah spent 10 years on Wall Street working for top-tier investment banks, specializing in equity derivatives and structured products. After leaving the institutional world, she dedicated herself to teaching retail traders the strategies and mindset used by professional desks. Her deep understanding of options pricing, volatility, and market microstructure makes her one of the most sought-after instructors in the industry. Students praise her ability to explain complex concepts in simple, actionable terms.',
		avatar: '/images/team/sarah-chen.webp'
	},
	{
		id: 3,
		name: 'Marcus Johnson',
		role: 'Technical Analysis Expert',
		bio: 'Marcus is a Chartered Market Technician (CMT) with a passion for price action and chart pattern analysis. He has spent over a decade refining his approach to technical analysis, combining classical charting techniques with modern quantitative methods. His proprietary indicator toolkit, included in the Pro and Elite tiers, is used by thousands of traders worldwide. Marcus leads the weekly live trading sessions and is known for his calm, methodical approach to reading the markets in real time.',
		avatar: '/images/team/marcus-johnson.webp'
	},
	{
		id: 4,
		name: 'Emily Patel',
		role: 'Student Success Manager',
		bio: 'Emily ensures every student at Revolution Trading Pros gets the support they need to succeed. With a background in education and a personal passion for trading, she bridges the gap between curriculum design and student outcomes. She manages the community forums, coordinates coaching sessions, and tracks student progress to identify areas where additional support is needed. Emily is often the first point of contact for new students and is dedicated to creating a welcoming, results-driven learning environment.',
		avatar: '/images/team/emily-patel.webp'
	}
];

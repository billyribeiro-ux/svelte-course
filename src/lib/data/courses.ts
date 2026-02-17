import type { Course, PricingTier } from '$types/course';

export const courses: Course[] = [
	{
		slug: 'trading-foundations',
		title: 'Trading Foundations',
		description:
			'Build a rock-solid trading foundation with our comprehensive beginner course. Learn market basics, technical analysis, risk management, and execute your first live trades with confidence.',
		longDescription:
			'Trading Foundations is designed for complete beginners who want to enter the world of trading with a structured, proven approach. Over 8 weeks, you will progress from understanding how markets work to placing your first live trades. Each module builds on the last, ensuring you develop the skills and confidence needed to trade responsibly. Our curriculum emphasizes risk management from day one, so you never risk more than you can afford to lose.',
		price: 97,
		image: '/images/courses/trading-foundations.webp',
		duration: '8 weeks',
		level: 'Beginner',
		tier: 'starter',
		modules: [
			{
				title: 'Market Basics',
				lessons: [
					'How Financial Markets Work',
					'Understanding Asset Classes',
					'Reading Price Charts',
					'Market Hours and Sessions',
					'Choosing a Broker'
				],
				duration: '2 weeks'
			},
			{
				title: 'Technical Analysis 101',
				lessons: [
					'Support and Resistance Levels',
					'Trend Lines and Channels',
					'Candlestick Patterns',
					'Moving Averages',
					'Volume Analysis'
				],
				duration: '2 weeks'
			},
			{
				title: 'Risk Management',
				lessons: [
					'Position Sizing Fundamentals',
					'Setting Stop Losses',
					'Risk-Reward Ratios',
					'Portfolio Diversification',
					'Managing Emotions'
				],
				duration: '2 weeks'
			},
			{
				title: 'First Live Trades',
				lessons: [
					'Paper Trading Practice',
					'Transitioning to Live Markets',
					'Building a Trading Journal',
					'Executing Your First Trades',
					'Reviewing and Improving'
				],
				duration: '2 weeks'
			}
		],
		features: [
			'40+ video lessons',
			'Downloadable resources',
			'Community access',
			'Certificate of completion'
		]
	},
	{
		slug: 'advanced-strategies',
		title: 'Advanced Strategies',
		description:
			'Take your trading to the next level with advanced price action techniques, options trading, algorithmic concepts, and professional portfolio management strategies.',
		longDescription:
			'Advanced Strategies is built for traders who have mastered the basics and are ready to develop a professional edge. Over 12 weeks, you will dive deep into price action mastery, explore the world of options trading, learn algorithmic concepts to automate parts of your strategy, and build robust portfolio management skills. This course bridges the gap between hobbyist and professional trader, giving you the tools used by institutional desks around the world.',
		price: 297,
		originalPrice: 497,
		image: '/images/courses/advanced-strategies.webp',
		duration: '12 weeks',
		level: 'Intermediate',
		tier: 'pro',
		modules: [
			{
				title: 'Price Action Mastery',
				lessons: [
					'Advanced Candlestick Patterns',
					'Order Flow Analysis',
					'Market Structure Breaks',
					'Supply and Demand Zones',
					'Multi-Timeframe Analysis'
				],
				duration: '2.5 weeks'
			},
			{
				title: 'Options Trading',
				lessons: [
					'Options Fundamentals',
					'Calls, Puts, and Spreads',
					'The Greeks Explained',
					'Options Strategies for Income',
					'Hedging with Options'
				],
				duration: '2.5 weeks'
			},
			{
				title: 'Algorithmic Concepts',
				lessons: [
					'Introduction to Trading Algorithms',
					'Backtesting Strategies',
					'Building Simple Bots',
					'Optimizing Parameters',
					'Avoiding Overfitting'
				],
				duration: '2.5 weeks'
			},
			{
				title: 'Portfolio Management',
				lessons: [
					'Asset Allocation Strategies',
					'Correlation Analysis',
					'Rebalancing Techniques',
					'Performance Attribution',
					'Drawdown Management'
				],
				duration: '2.5 weeks'
			},
			{
				title: 'Advanced Risk',
				lessons: [
					'Value at Risk (VaR)',
					'Stress Testing Your Portfolio',
					'Black Swan Preparation',
					'Leverage and Margin Management',
					'Creating a Risk Framework'
				],
				duration: '2 weeks'
			}
		],
		features: [
			'Everything in Starter',
			'Live weekly trading sessions',
			'Advanced indicator toolkit',
			'1-on-1 monthly coaching call',
			'Priority community access',
			'Trade alert notifications'
		]
	},
	{
		slug: 'elite-mentorship',
		title: 'Elite Mentorship',
		description:
			'Join our most exclusive program with direct mentor access, daily live trading rooms, institutional-grade strategies, and proprietary tools used by professional fund managers.',
		longDescription:
			'Elite Mentorship is our flagship program reserved for serious traders committed to achieving mastery. Over 24 weeks, you will learn institutional trading strategies, dive into market microstructure, apply quantitative analysis methods, understand global macro forces, trade live alongside professional mentors, and ultimately build your own unique trading edge. This is the same knowledge that powers hedge funds and proprietary trading firms, now accessible to dedicated independent traders.',
		price: 997,
		originalPrice: 1497,
		image: '/images/courses/elite-mentorship.webp',
		duration: '24 weeks',
		level: 'Advanced',
		tier: 'elite',
		modules: [
			{
				title: 'Institutional Trading',
				lessons: [
					'How Institutions Move Markets',
					'Dark Pools and Hidden Liquidity',
					'Smart Money Concepts',
					'Institutional Order Flow',
					'Block Trade Analysis'
				],
				duration: '4 weeks'
			},
			{
				title: 'Market Microstructure',
				lessons: [
					'Order Book Dynamics',
					'Bid-Ask Spread Analysis',
					'Market Making Fundamentals',
					'High-Frequency Trading Overview',
					'Latency and Execution Quality'
				],
				duration: '4 weeks'
			},
			{
				title: 'Quantitative Analysis',
				lessons: [
					'Statistical Methods for Trading',
					'Regression Analysis and Factor Models',
					'Monte Carlo Simulations',
					'Machine Learning in Trading',
					'Building Quantitative Models'
				],
				duration: '4 weeks'
			},
			{
				title: 'Global Macro',
				lessons: [
					'Central Bank Policy Impact',
					'Geopolitical Event Trading',
					'Currency and Bond Market Analysis',
					'Commodity Cycles',
					'Intermarket Relationships'
				],
				duration: '4 weeks'
			},
			{
				title: 'Live Trading Room',
				lessons: [
					'Real-Time Trade Execution',
					'Mentor-Led Market Analysis',
					'Handling Volatile Markets',
					'Scaling Positions in Real Time',
					'Post-Session Reviews'
				],
				duration: '4 weeks'
			},
			{
				title: 'Building Your Edge',
				lessons: [
					'Defining Your Trading Identity',
					'Strategy Development Framework',
					'Continuous Improvement Process',
					'Scaling Your Trading Business',
					'Long-Term Wealth Building'
				],
				duration: '4 weeks'
			}
		],
		features: [
			'Everything in Pro',
			'Daily live trading room',
			'Direct mentor access',
			'Proprietary trading tools',
			'Lifetime course updates',
			'Private elite community',
			'Quarterly strategy retreats'
		]
	}
];

export const pricingTiers: PricingTier[] = [
	{
		name: 'Starter',
		price: 97,
		period: 'one-time',
		tier: 'starter',
		highlighted: false,
		ctaText: 'Start Learning',
		features: [
			'40+ video lessons',
			'Downloadable resources',
			'Community access',
			'Certificate of completion',
			'8 weeks of content',
			'Email support'
		]
	},
	{
		name: 'Pro',
		price: 297,
		period: 'one-time',
		tier: 'pro',
		highlighted: true,
		ctaText: 'Go Pro',
		features: [
			'Everything in Starter',
			'Live weekly trading sessions',
			'Advanced indicator toolkit',
			'1-on-1 monthly coaching call',
			'Priority community access',
			'Trade alert notifications',
			'12 weeks of content'
		]
	},
	{
		name: 'Elite',
		price: 997,
		period: 'one-time',
		tier: 'elite',
		highlighted: false,
		ctaText: 'Join Elite',
		features: [
			'Everything in Pro',
			'Daily live trading room',
			'Direct mentor access',
			'Proprietary trading tools',
			'Lifetime course updates',
			'Private elite community',
			'Quarterly strategy retreats',
			'24 weeks of content'
		]
	}
];

import PDFDocument from 'pdfkit';
import { createWriteStream, mkdirSync } from 'fs';
import { join } from 'path';

const OUTPUT_DIR = join(process.cwd(), 'static', 'pdfs');
const COLORS = {
  primary: '#0a0a1a',
  accent: '#00d4ff',
  accentPurple: '#7c3aed',
  text: '#333333',
  textLight: '#666666',
  codeBg: '#f5f5f5',
  terminalBg: '#1a1a2e',
  terminalText: '#e0e0e0',
  white: '#ffffff',
  border: '#e0e0e0'
};

mkdirSync(OUTPUT_DIR, { recursive: true });

// ---------------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------------

function createPDF(filename: string): { doc: PDFKit.PDFDocument; stream: NodeJS.WritableStream; promise: Promise<void> } {
  const doc = new PDFDocument({
    size: 'letter',
    margins: { top: 72, bottom: 72, left: 72, right: 72 },
    bufferPages: true,
    info: {
      Title: filename.replace('.pdf', ''),
      Author: 'Revolution Trading Pros',
      Creator: 'Revolution Trading Pros PDF Generator'
    }
  });
  const filepath = join(OUTPUT_DIR, filename);
  const stream = createWriteStream(filepath);
  doc.pipe(stream);
  const promise = new Promise<void>((resolve, reject) => {
    stream.on('finish', resolve);
    stream.on('error', reject);
  });
  return { doc, stream, promise };
}

function addCoverPage(doc: PDFKit.PDFDocument, title: string, subtitle: string): void {
  doc.rect(0, 0, doc.page.width, doc.page.height).fill(COLORS.primary);
  doc.rect(0, 0, doc.page.width, 6).fill(COLORS.accent);
  doc.circle(doc.page.width / 2, 260, 80).lineWidth(3).strokeColor(COLORS.accent).stroke();
  doc.circle(doc.page.width / 2, 260, 60).lineWidth(2).strokeColor(COLORS.accentPurple).stroke();
  doc.fontSize(14).fillColor(COLORS.accent).font('Helvetica')
    .text('REVOLUTION TRADING PROS', 0, 180, { align: 'center' });
  doc.fontSize(28).fillColor(COLORS.white).font('Helvetica-Bold')
    .text(title, 72, 360, { align: 'center', width: doc.page.width - 144 });
  const divY = doc.y + 20;
  doc.moveTo(doc.page.width / 2 - 60, divY)
    .lineTo(doc.page.width / 2 + 60, divY)
    .lineWidth(2).strokeColor(COLORS.accent).stroke();
  doc.fontSize(14).fillColor(COLORS.accentPurple).font('Helvetica')
    .text(subtitle, 72, divY + 16, { align: 'center', width: doc.page.width - 144 });
  doc.fontSize(10).fillColor(COLORS.textLight).font('Helvetica')
    .text('www.revolutiontradingpros.com', 0, doc.page.height - 60, { align: 'center' });
  doc.rect(0, doc.page.height - 6, doc.page.width, 6).fill(COLORS.accentPurple);
}

function addHeader(doc: PDFKit.PDFDocument, text: string): void {
  checkPageSpace(doc, 60);
  if (doc.y > 100) doc.moveDown(0.8);
  doc.fontSize(20).fillColor(COLORS.accent).font('Helvetica-Bold').text(text, 72, undefined, { width: 468 });
  const y = doc.y + 4;
  doc.moveTo(72, y).lineTo(200, y).lineWidth(2).strokeColor(COLORS.accent).stroke();
  doc.moveDown(0.6);
}

function addSubheading(doc: PDFKit.PDFDocument, text: string): void {
  checkPageSpace(doc, 40);
  doc.moveDown(0.5);
  doc.fontSize(14).fillColor(COLORS.accentPurple).font('Helvetica-Bold').text(text, 72, undefined, { width: 468 });
  doc.moveDown(0.3);
}

function addParagraph(doc: PDFKit.PDFDocument, text: string): void {
  checkPageSpace(doc, 30);
  doc.fontSize(11).fillColor(COLORS.text).font('Helvetica').text(text, 72, undefined, { width: 468, lineGap: 4 });
  doc.moveDown(0.5);
}

function addBulletPoint(doc: PDFKit.PDFDocument, text: string): void {
  checkPageSpace(doc, 24);
  const startY = doc.y;
  doc.fontSize(11).fillColor(COLORS.accent).font('Helvetica').text('\u2022', 84, startY);
  doc.fontSize(11).fillColor(COLORS.text).font('Helvetica').text(text, 100, startY, { width: 440, lineGap: 3 });
  doc.moveDown(0.2);
}

function addCodeBlock(doc: PDFKit.PDFDocument, code: string, label?: string): void {
  const lines = code.split('\n');
  const blockHeight = lines.length * 14 + 24 + (label ? 18 : 0);
  checkPageSpace(doc, Math.min(blockHeight, 300));
  doc.moveDown(0.3);
  if (label) {
    doc.fontSize(9).fillColor(COLORS.textLight).font('Helvetica').text(label, 80);
    doc.moveDown(0.2);
  }
  const codeStartY = doc.y;
  doc.roundedRect(72, codeStartY, 468, lines.length * 14 + 20, 4).fill(COLORS.codeBg);
  doc.rect(72, codeStartY, 3, lines.length * 14 + 20).fill(COLORS.accent);
  let yPos = codeStartY + 10;
  for (const line of lines) {
    if (yPos > doc.page.height - 80) {
      addPageBreak(doc);
      yPos = doc.y;
    }
    doc.fontSize(9.5).fillColor(COLORS.text).font('Courier').text(line, 86, yPos, { width: 444 });
    yPos += 14;
  }
  doc.y = yPos + 10;
  doc.moveDown(0.4);
}

function addTerminalBlock(doc: PDFKit.PDFDocument, command: string): void {
  const lines = command.split('\n');
  const blockHeight = lines.length * 14 + 30;
  checkPageSpace(doc, Math.min(blockHeight, 200));
  doc.moveDown(0.3);
  const startY = doc.y;
  doc.roundedRect(72, startY, 468, blockHeight, 4).fill(COLORS.terminalBg);
  doc.circle(86, startY + 12, 4).fill('#ff5f56');
  doc.circle(100, startY + 12, 4).fill('#ffbd2e');
  doc.circle(114, startY + 12, 4).fill('#27c93f');
  let yPos = startY + 26;
  for (const line of lines) {
    const displayLine = line.startsWith('$') ? line : `$ ${line}`;
    doc.fontSize(9.5).fillColor(COLORS.terminalText).font('Courier').text(displayLine, 86, yPos, { width: 444 });
    yPos += 14;
  }
  doc.y = startY + blockHeight + 4;
  doc.moveDown(0.4);
}

function addPageBreak(doc: PDFKit.PDFDocument): void {
  doc.addPage();
  addPageHeader(doc);
}

function addPageHeader(doc: PDFKit.PDFDocument): void {
  doc.save();
  doc.fontSize(8).fillColor(COLORS.textLight).font('Helvetica')
    .text('Revolution Trading Pros', 72, 30);
  doc.moveTo(72, 46).lineTo(540, 46).lineWidth(0.5).strokeColor(COLORS.border).stroke();
  doc.restore();
  doc.y = 72;
}

function addFooter(doc: PDFKit.PDFDocument, pageNum: number): void {
  doc.fontSize(8).fillColor(COLORS.textLight).font('Helvetica')
    .text(`Page ${pageNum}`, 0, doc.page.height - 40, { align: 'center' });
  doc.moveTo(72, doc.page.height - 52).lineTo(540, doc.page.height - 52)
    .lineWidth(0.5).strokeColor(COLORS.border).stroke();
}

function addFootersToAllPages(doc: PDFKit.PDFDocument): void {
  const pages = doc.bufferedPageRange();
  for (let i = 1; i < pages.count; i++) {
    doc.switchToPage(i);
    addFooter(doc, i);
  }
}

function checkPageSpace(doc: PDFKit.PDFDocument, needed: number): void {
  if (doc.y + needed > doc.page.height - 80) {
    addPageBreak(doc);
  }
}

function addTip(doc: PDFKit.PDFDocument, text: string): void {
  checkPageSpace(doc, 50);
  doc.moveDown(0.3);
  const startY = doc.y;
  doc.roundedRect(72, startY, 468, 40, 4).fill('#f0f9ff');
  doc.rect(72, startY, 3, 40).fill(COLORS.accent);
  doc.fontSize(9).fillColor(COLORS.accent).font('Helvetica-Bold').text('TIP:', 86, startY + 8);
  doc.fontSize(9.5).fillColor(COLORS.text).font('Helvetica').text(text, 114, startY + 8, { width: 416 });
  doc.y = startY + 46;
  doc.moveDown(0.3);
}

function addNote(doc: PDFKit.PDFDocument, text: string): void {
  checkPageSpace(doc, 50);
  doc.moveDown(0.3);
  const startY = doc.y;
  doc.roundedRect(72, startY, 468, 40, 4).fill('#faf5ff');
  doc.rect(72, startY, 3, 40).fill(COLORS.accentPurple);
  doc.fontSize(9).fillColor(COLORS.accentPurple).font('Helvetica-Bold').text('NOTE:', 86, startY + 8);
  doc.fontSize(9.5).fillColor(COLORS.text).font('Helvetica').text(text, 120, startY + 8, { width: 410 });
  doc.y = startY + 46;
  doc.moveDown(0.3);
}

function addTableOfContents(doc: PDFKit.PDFDocument, items: string[]): void {
  addPageBreak(doc);
  doc.fontSize(20).fillColor(COLORS.accent).font('Helvetica-Bold').text('Table of Contents', 72, 80, { width: 468 });
  doc.moveDown(1);
  items.forEach((item, i) => {
    doc.fontSize(12).fillColor(COLORS.text).font('Helvetica').text(`${i + 1}.  ${item}`, 90, undefined, { width: 440 });
    doc.moveDown(0.4);
  });
}

function addNextSteps(doc: PDFKit.PDFDocument, nextModule: string, nextDesc: string): void {
  checkPageSpace(doc, 120);
  doc.moveDown(1);
  const startY = doc.y;
  doc.roundedRect(72, startY, 468, 100, 6).fill('#f0f9ff');
  doc.rect(72, startY, 468, 4).fill(COLORS.accent);
  doc.fontSize(14).fillColor(COLORS.accent).font('Helvetica-Bold').text('Next Steps', 90, startY + 16, { width: 430 });
  doc.fontSize(11).fillColor(COLORS.text).font('Helvetica')
    .text(`Up next: ${nextModule}`, 90, startY + 40, { width: 430 });
  doc.fontSize(10).fillColor(COLORS.textLight).font('Helvetica')
    .text(nextDesc, 90, startY + 60, { width: 430 });
  doc.y = startY + 110;
}

// ---------------------------------------------------------------------------
// Lead Magnet PDF
// ---------------------------------------------------------------------------

async function generateLeadMagnet(): Promise<void> {
  const { doc, promise } = createPDF('lead-magnet-5-trading-secrets.pdf');

  addCoverPage(doc, 'The 5 Trading Secrets Every Beginner Must Know', 'A Free Guide by Revolution Trading Pros');

  addPageBreak(doc);
  addHeader(doc, 'Introduction');
  addParagraph(doc, 'Welcome to "The 5 Trading Secrets Every Beginner Must Know" \u2014 your essential guide to building a rock-solid foundation in trading. Whether you are exploring the markets for the first time or looking to sharpen your edge, these five secrets will transform how you think about and approach the financial markets.');
  addParagraph(doc, 'Most beginner traders lose money not because the markets are rigged, but because they lack a structured approach. They chase tips, trade emotionally, and ignore the fundamentals that professional traders rely on every single day.');
  addSubheading(doc, 'What You Will Learn');
  addBulletPoint(doc, 'The one indicator setup that professional traders actually use');
  addBulletPoint(doc, 'Risk management techniques that protect your capital from catastrophic losses');
  addBulletPoint(doc, 'Optimal trade timing based on market sessions and price action');
  addBulletPoint(doc, 'How to read market sentiment like an experienced trader');
  addBulletPoint(doc, 'The compound growth strategy that builds wealth consistently');
  addParagraph(doc, 'Each secret is designed to be actionable. You can start applying these principles to your trading immediately. Let us get started.');

  addPageBreak(doc);
  addHeader(doc, 'Secret #1: The One Indicator That Actually Works');
  addParagraph(doc, 'New traders often clutter their charts with dozens of indicators, creating a confusing mess of conflicting signals. Professional traders know that simplicity is key. The most reliable indicator setup combines just two tools: Moving Averages and the Relative Strength Index (RSI).');
  addSubheading(doc, 'Moving Averages: SMA vs EMA');
  addParagraph(doc, 'A Simple Moving Average (SMA) calculates the average price over a given number of periods. For example, a 50-day SMA adds up the last 50 closing prices and divides by 50. An Exponential Moving Average (EMA) gives more weight to recent prices, making it more responsive to new information.');
  addParagraph(doc, 'Neither is objectively better \u2014 the SMA is smoother and better for identifying long-term trends, while the EMA reacts faster and is preferred for shorter-term setups.');
  addSubheading(doc, 'The Golden Cross and Death Cross');
  addParagraph(doc, 'The most watched moving average signal in all of trading is the crossover between the 50-day and 200-day moving averages:');
  addBulletPoint(doc, 'Golden Cross: The 50-day MA crosses ABOVE the 200-day MA \u2014 a bullish signal suggesting upward momentum.');
  addBulletPoint(doc, 'Death Cross: The 50-day MA crosses BELOW the 200-day MA \u2014 a bearish signal suggesting downward momentum.');
  addParagraph(doc, 'These signals are not perfect timing tools, but they help you stay on the right side of the major trend. Institutional traders and algorithms watch these levels closely.');
  addSubheading(doc, 'RSI: Overbought and Oversold');
  addParagraph(doc, 'The Relative Strength Index (RSI) is a momentum oscillator that ranges from 0 to 100. The standard settings use 14 periods:');
  addBulletPoint(doc, 'Above 70: Overbought \u2014 the asset may be due for a pullback.');
  addBulletPoint(doc, 'Below 30: Oversold \u2014 the asset may be due for a bounce.');
  addBulletPoint(doc, 'Between 40-60: Neutral zone \u2014 wait for a clearer signal.');
  addSubheading(doc, 'Combining for Powerful Signals');
  addParagraph(doc, 'The real power comes from combining these tools. Look for trades where the moving average trend direction agrees with the RSI reading. For example, a Golden Cross combined with RSI rising from oversold territory (below 30) is a high-probability long setup. Conversely, a Death Cross with RSI falling from overbought levels provides a strong short signal.');
  addTip(doc, 'Never rely on a single indicator. Confluence \u2014 multiple signals agreeing \u2014 is what separates profitable traders from gamblers.');

  addPageBreak(doc);
  addHeader(doc, 'Secret #2: Risk Management That Protects Your Capital');
  addParagraph(doc, 'Risk management is not glamorous, but it is the single most important skill in trading. You can have a mediocre strategy and still be profitable with excellent risk management. Conversely, even the best strategy will blow up your account without it.');
  addSubheading(doc, 'The 1% Rule');
  addParagraph(doc, 'Professional traders almost universally follow some version of the 1% rule: never risk more than 1% of your total account balance on any single trade. With a $10,000 account, that means your maximum loss per trade is $100.');
  addParagraph(doc, 'This might sound overly conservative, but consider this: with the 1% rule, you would need to lose 100 consecutive trades to blow your account. That gives you enormous staying power and the ability to weather losing streaks.');
  addSubheading(doc, 'Position Sizing Formula');
  addParagraph(doc, 'Once you know your maximum dollar risk per trade, calculate position size with this formula:');
  addCodeBlock(doc, 'Position Size = Account Risk / (Entry Price - Stop Loss Price)\n\nExample:\n  Account Balance:   $10,000\n  Risk per Trade:    1% = $100\n  Entry Price:       $50.00\n  Stop Loss:         $48.00\n  Risk per Share:    $2.00\n\n  Position Size = $100 / $2.00 = 50 shares', 'Position Sizing Formula');
  addSubheading(doc, 'Setting Stop Losses');
  addParagraph(doc, 'A stop loss is a predetermined price at which you exit a losing trade. There are several methods to set effective stop losses:');
  addBulletPoint(doc, 'Technical stop: Place below a support level, moving average, or swing low.');
  addBulletPoint(doc, 'Percentage stop: A fixed percentage below your entry (e.g., 2%).');
  addBulletPoint(doc, 'ATR stop: Use the Average True Range to set volatility-adjusted stops.');
  addParagraph(doc, 'The key is to place your stop at a level where your trade thesis is invalidated, not at an arbitrary number.');
  addSubheading(doc, 'Risk-Reward Ratio');
  addParagraph(doc, 'Always aim for a minimum risk-reward ratio of 1:2. This means for every dollar you risk, you expect to gain at least two dollars. With a 1:2 risk-reward ratio, you only need to be right 34% of the time to break even. At a 50% win rate, you are highly profitable.');
  addBulletPoint(doc, '1:1 ratio \u2014 You need > 50% win rate to be profitable.');
  addBulletPoint(doc, '1:2 ratio \u2014 You need > 34% win rate to be profitable.');
  addBulletPoint(doc, '1:3 ratio \u2014 You need > 25% win rate to be profitable.');
  addTip(doc, 'Track your risk-reward on every trade in a journal. Over time, patterns will emerge that help you refine your entries and exits.');

  addPageBreak(doc);
  addHeader(doc, 'Secret #3: The Best Time to Enter and Exit Trades');
  addParagraph(doc, 'Not all trading hours are created equal. Understanding when the market is most active and volatile can dramatically improve your results. Timing your entries and exits around key sessions and price patterns gives you an edge over traders who operate blindly.');
  addSubheading(doc, 'Market Sessions');
  addParagraph(doc, 'The global forex and equities markets operate in three major sessions, each with distinct characteristics:');
  addBulletPoint(doc, 'Asian Session (Tokyo): 7:00 PM \u2013 4:00 AM EST. Generally lower volatility. Pairs involving JPY and AUD are most active.');
  addBulletPoint(doc, 'London Session: 3:00 AM \u2013 12:00 PM EST. The most liquid session \u2014 roughly 35% of all forex volume. EUR and GBP pairs move the most.');
  addBulletPoint(doc, 'New York Session: 8:00 AM \u2013 5:00 PM EST. Second most active session. USD pairs dominate. Major economic releases occur here.');
  addSubheading(doc, 'Session Overlaps');
  addParagraph(doc, 'The highest-volatility periods occur when two sessions overlap:');
  addBulletPoint(doc, 'London-New York Overlap (8:00 AM \u2013 12:00 PM EST): The most volatile and liquid period of the day. This is where the biggest moves happen.');
  addBulletPoint(doc, 'Tokyo-London Overlap (3:00 AM \u2013 4:00 AM EST): A brief but sometimes volatile period, especially for EUR/JPY.');
  addParagraph(doc, 'If you can only trade during one window, the London-New York overlap provides the best opportunities.');
  addSubheading(doc, 'Candlestick Patterns for Entry');
  addParagraph(doc, 'Candlestick patterns provide visual clues about market psychology. Three essential patterns every beginner should know:');
  addBulletPoint(doc, 'Doji: A candle with almost no body, showing indecision. Often appears at trend reversals.');
  addBulletPoint(doc, 'Engulfing Pattern: A large candle that completely engulfs the previous candle. Bullish engulfing signals buyers taking control.');
  addBulletPoint(doc, 'Hammer/Shooting Star: A hammer has a long lower wick and small body at the top \u2014 bullish reversal signal.');
  addSubheading(doc, 'Confirmation Signals');
  addParagraph(doc, 'Never enter a trade on a single signal. Wait for confirmation:');
  addBulletPoint(doc, 'A candlestick pattern at a key support/resistance level.');
  addBulletPoint(doc, 'Volume spike confirming the move.');
  addBulletPoint(doc, 'RSI confirming the direction (e.g., bouncing from oversold on a bullish setup).');
  addBulletPoint(doc, 'A close above/below the key level, not just a wick.');
  addTip(doc, 'The London-New York overlap (8 AM - 12 PM EST) is the single best time to trade for most strategies.');

  addPageBreak(doc);
  addHeader(doc, 'Secret #4: How to Read Market Sentiment');
  addParagraph(doc, 'Price is just one piece of the puzzle. Understanding the mood of the market \u2014 whether participants are fearful, greedy, or uncertain \u2014 gives you context that pure technical analysis cannot provide.');
  addSubheading(doc, 'Volume Analysis');
  addParagraph(doc, 'Volume is the number of shares or contracts traded in a given period. It is the fuel behind price movements:');
  addBulletPoint(doc, 'Rising price + Rising volume = Strong trend (likely to continue).');
  addBulletPoint(doc, 'Rising price + Falling volume = Weakening trend (potential reversal).');
  addBulletPoint(doc, 'Volume spike at support/resistance = Likely breakout or strong bounce.');
  addBulletPoint(doc, 'Low volume = Market is undecided; avoid forcing trades.');
  addParagraph(doc, 'Think of volume as confirmation. A move without volume is suspect; a move with volume has conviction behind it.');
  addSubheading(doc, 'Fear & Greed Index');
  addParagraph(doc, 'The CNN Fear & Greed Index aggregates seven market indicators into a single number from 0 (extreme fear) to 100 (extreme greed).');
  addBulletPoint(doc, 'Extreme Fear (0-25): Markets may be oversold \u2014 potential buying opportunity.');
  addBulletPoint(doc, 'Extreme Greed (75-100): Markets may be overbought \u2014 potential selling opportunity.');
  addParagraph(doc, 'As Warren Buffett famously said: "Be fearful when others are greedy, and greedy when others are fearful."');
  addSubheading(doc, 'Order Flow Basics');
  addParagraph(doc, 'Order flow analysis looks at the actual buy and sell orders hitting the market:');
  addBulletPoint(doc, 'Level 2 data showing bid/ask depth.');
  addBulletPoint(doc, 'Time and Sales (the tape) showing real-time transactions.');
  addBulletPoint(doc, 'Large block trades that indicate institutional activity.');
  addSubheading(doc, 'News Sentiment');
  addParagraph(doc, 'Headlines move markets. Build a habit of checking economic calendars for scheduled events like Fed meetings, jobs reports, and earnings releases. Avoid trading 15 minutes before and after major news releases unless you specifically trade news events.');
  addTip(doc, 'Combine sentiment tools with technical analysis for the highest-conviction trades.');

  addPageBreak(doc);
  addHeader(doc, 'Secret #5: The Compound Growth Strategy');
  addParagraph(doc, 'The biggest mistake beginners make is chasing huge returns. They want to double their account in a week. Professional traders think in terms of consistent, compounding gains over months and years.');
  addSubheading(doc, 'Start Small, Grow Consistently');
  addParagraph(doc, 'Begin with an amount you can afford to lose entirely. This is not pessimism \u2014 it is pragmatism. When you trade with money you cannot afford to lose, emotions take over and you make poor decisions. Start small, prove your strategy works, then scale.');
  addSubheading(doc, 'The 2% Daily Target: Myth vs Reality');
  addParagraph(doc, 'Many gurus promote the idea of making 2% per day. Let us be honest about the math. A 2% daily return on a $10,000 account would give you over $3 million in one year if compounded daily. If it were that easy, everyone would be a millionaire.');
  addParagraph(doc, 'A more realistic and still excellent target is 5-10% per month. That translates to roughly 0.25% to 0.5% per day. This may sound small, but compounded over a year, 8% monthly turns $10,000 into roughly $25,000.');
  addSubheading(doc, 'Compound Growth Example');
  addCodeBlock(doc, 'Starting Capital: $10,000\nMonthly Return:  8%\n\nMonth  1:  $10,800\nMonth  3:  $12,597\nMonth  6:  $15,869\nMonth  9:  $19,990\nMonth 12:  $25,182\n\nYear 2 End: ~$63,412\nYear 3 End: ~$159,725', 'Compound Growth Calculator');
  addSubheading(doc, 'Reinvestment Strategy');
  addParagraph(doc, 'Follow the 50/25/25 rule for managing your trading profits:');
  addBulletPoint(doc, '50% stays in your trading account to compound.');
  addBulletPoint(doc, '25% goes to a savings or investment account (your safety net).');
  addBulletPoint(doc, '25% is your reward \u2014 spend it, enjoy the fruits of your discipline.');
  addTip(doc, 'Track your monthly returns in a spreadsheet. Consistency matters more than any single big win.');

  addPageBreak(doc);
  addHeader(doc, 'About Revolution Trading Pros');
  addParagraph(doc, 'Revolution Trading Pros is a trading education platform dedicated to helping beginners and intermediate traders build the skills, discipline, and mindset needed to trade profitably.');
  addSubheading(doc, 'Our Course Offerings');
  addBulletPoint(doc, 'Svelte Zero-to-Hero Course: Build professional trading dashboards and tools with modern web technology.');
  addBulletPoint(doc, 'Live Trading Sessions: Watch professional traders execute strategies in real time.');
  addBulletPoint(doc, 'Community Access: Join our Discord community for support, ideas, and accountability.');
  addBulletPoint(doc, 'One-on-One Mentorship: Personalized coaching to accelerate your progress.');
  addSubheading(doc, 'Ready to Take the Next Step?');
  addParagraph(doc, 'This guide is just the beginning. If you want to go deeper and build real trading skills with hands-on projects, our full course curriculum is designed to take you from complete beginner to confident trader.');
  addParagraph(doc, 'Visit us: www.revolutiontradingpros.com');
  doc.moveDown(1);
  const ctaY = doc.y;
  doc.roundedRect(72, ctaY, 468, 60, 6).fill(COLORS.accent);
  doc.fontSize(16).fillColor(COLORS.primary).font('Helvetica-Bold')
    .text('Start Your Trading Journey Today', 72, ctaY + 12, { width: 468, align: 'center' });
  doc.fontSize(11).fillColor(COLORS.primary).font('Helvetica')
    .text('www.revolutiontradingpros.com/courses', 72, ctaY + 36, { width: 468, align: 'center' });

  addFootersToAllPages(doc);
  doc.end();
  await promise;
  console.log('  Generated: lead-magnet-5-trading-secrets.pdf');
}

// ---------------------------------------------------------------------------
// Module Generator
// ---------------------------------------------------------------------------

interface ModuleContent {
  number: number;
  title: string;
  subtitle: string;
  tocItems: string[];
  generate: (doc: PDFKit.PDFDocument) => void;
  nextModule?: string;
  nextDesc?: string;
}

async function generateModule(mod: ModuleContent): Promise<void> {
  const filename = `module-${mod.number}-${mod.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '')}.pdf`;
  const { doc, promise } = createPDF(filename);
  addCoverPage(doc, `Module ${mod.number}: ${mod.title}`, mod.subtitle);
  addTableOfContents(doc, mod.tocItems);
  addPageBreak(doc);
  mod.generate(doc);
  if (mod.nextModule && mod.nextDesc) {
    addNextSteps(doc, mod.nextModule, mod.nextDesc);
  }
  addFootersToAllPages(doc);
  doc.end();
  await promise;
  console.log(`  Generated: ${filename}`);
}

// ---------------------------------------------------------------------------
// Module 1
// ---------------------------------------------------------------------------

const module1: ModuleContent = {
  number: 1,
  title: 'Setting Up Your Dev Environment',
  subtitle: 'Revolution Trading Pros \u2014 Svelte Zero-to-Hero Course',
  tocItems: ['Installing Node.js with nvm', 'Installing pnpm', 'Setting Up VS Code', 'Git Basics', 'Creating Your First SvelteKit Project', 'Project Structure Walkthrough', 'Running the Dev Server', 'Your First Edit', 'Exercise'],
  nextModule: 'Module 2: HTML & CSS Fundamentals for Svelte',
  nextDesc: 'Learn semantic HTML5, scoped CSS in Svelte, Flexbox, Grid, and responsive design.',
  generate(doc) {
    addHeader(doc, '1. Installing Node.js with nvm');
    addParagraph(doc, 'Node.js is the JavaScript runtime that powers SvelteKit, the build tools, and the development server. We recommend installing Node.js via nvm (Node Version Manager) so you can easily switch between versions.');
    addSubheading(doc, 'Install nvm');
    addTerminalBlock(doc, 'curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash');
    addParagraph(doc, 'Close and reopen your terminal, then verify the installation:');
    addTerminalBlock(doc, 'nvm --version');
    addSubheading(doc, 'Install Node.js LTS');
    addTerminalBlock(doc, 'nvm install --lts\nnvm use --lts\nnode --version');
    addParagraph(doc, 'You should see a version number like v20.x.x or higher. SvelteKit requires Node.js 18.13 or later.');
    addTip(doc, 'Always use an LTS (Long Term Support) version for production projects.');

    addHeader(doc, '2. Installing pnpm');
    addParagraph(doc, 'pnpm is a fast, disk-efficient package manager. It is significantly faster than npm and uses hard links to save disk space.');
    addTerminalBlock(doc, 'npm install -g pnpm\npnpm --version');

    addHeader(doc, '3. Setting Up VS Code');
    addParagraph(doc, 'Visual Studio Code is the recommended editor for Svelte development.');
    addSubheading(doc, 'Essential Extensions');
    addBulletPoint(doc, 'Svelte for VS Code (svelte.svelte-vscode) \u2014 Syntax highlighting, IntelliSense, and diagnostics.');
    addBulletPoint(doc, 'Prettier (esbenp.prettier-vscode) \u2014 Automatic code formatting.');
    addBulletPoint(doc, 'ESLint (dbaeumer.vscode-eslint) \u2014 JavaScript/TypeScript linting.');
    addBulletPoint(doc, 'GitLens (eamodio.gitlens) \u2014 Enhanced Git integration.');
    addSubheading(doc, 'Recommended Settings');
    addCodeBlock(doc, '{\n  "editor.formatOnSave": true,\n  "editor.defaultFormatter": "esbenp.prettier-vscode",\n  "[svelte]": {\n    "editor.defaultFormatter": "svelte.svelte-vscode"\n  },\n  "svelte.enable-ts-plugin": true\n}', '.vscode/settings.json');

    addHeader(doc, '4. Git Basics');
    addParagraph(doc, 'Git is essential for version control. Every professional project uses Git to track changes, collaborate, and deploy code.');
    addTerminalBlock(doc, 'git config --global user.name "Your Name"\ngit config --global user.email "you@example.com"');
    addCodeBlock(doc, 'git init              # Initialize a new repository\ngit add .             # Stage all changes\ngit commit -m "msg"   # Commit staged changes\ngit status            # Check current status\ngit log --oneline     # View commit history\ngit push origin main  # Push to remote', 'Common Git Commands');
    addTip(doc, 'Commit early and often. Small, focused commits are easier to understand and revert.');

    addHeader(doc, '5. Creating Your First SvelteKit Project');
    addTerminalBlock(doc, 'pnpm dlx sv create my-app --template minimal --types ts');
    addParagraph(doc, 'This creates a new SvelteKit project with TypeScript support. Install the dependencies:');
    addTerminalBlock(doc, 'cd my-app\npnpm install');

    addHeader(doc, '6. Project Structure Walkthrough');
    addCodeBlock(doc, 'my-app/\n\u251c\u2500\u2500 src/\n\u2502   \u251c\u2500\u2500 routes/\n\u2502   \u2502   \u2514\u2500\u2500 +page.svelte      # Home page\n\u2502   \u251c\u2500\u2500 app.html              # HTML template\n\u2502   \u251c\u2500\u2500 app.d.ts              # Type declarations\n\u2502   \u2514\u2500\u2500 lib/                  # Shared code\n\u251c\u2500\u2500 static/                   # Static assets\n\u251c\u2500\u2500 svelte.config.js          # Svelte configuration\n\u251c\u2500\u2500 vite.config.ts            # Vite configuration\n\u251c\u2500\u2500 tsconfig.json             # TypeScript config\n\u2514\u2500\u2500 package.json              # Dependencies', 'Project Structure');
    addBulletPoint(doc, 'src/routes/ \u2014 File-based routing. Every +page.svelte becomes a page.');
    addBulletPoint(doc, 'src/lib/ \u2014 Shared components, utilities, and modules. Importable via $lib alias.');
    addBulletPoint(doc, 'static/ \u2014 Files served as-is (images, fonts, favicons).');

    addHeader(doc, '7. Running the Dev Server');
    addTerminalBlock(doc, 'pnpm dev');
    addParagraph(doc, 'Open http://localhost:5173. The dev server features hot module replacement (HMR) \u2014 changes appear instantly.');
    addTip(doc, 'Use pnpm dev --open to automatically open your browser.');

    addHeader(doc, '8. Your First Edit');
    addCodeBlock(doc, '<script lang="ts">\n  let name = $state(\'World\');\n</script>\n\n<h1>Hello {name}!</h1>\n<input bind:value={name} />\n\n<style>\n  h1 {\n    color: #00d4ff;\n    font-family: sans-serif;\n  }\n  input {\n    padding: 0.5rem;\n    font-size: 1rem;\n    border: 2px solid #7c3aed;\n    border-radius: 4px;\n  }\n</style>', 'src/routes/+page.svelte');
    addNote(doc, 'The $state() rune is new in Svelte 5. It creates reactive state that automatically updates the DOM.');

    addHeader(doc, '9. Exercise: Personalize Your App');
    addBulletPoint(doc, 'Add a second reactive variable for a greeting message.');
    addBulletPoint(doc, 'Add a button that changes the greeting when clicked.');
    addBulletPoint(doc, 'Style with the course colors (#00d4ff, #7c3aed, #0a0a1a).');
  }
};

// ---------------------------------------------------------------------------
// Module 2
// ---------------------------------------------------------------------------

const module2: ModuleContent = {
  number: 2,
  title: 'HTML & CSS Fundamentals for Svelte',
  subtitle: 'Revolution Trading Pros \u2014 Svelte Zero-to-Hero Course',
  tocItems: ['Semantic HTML5 Elements', 'CSS in Svelte: Scoped Styles', 'CSS Box Model', 'Flexbox Layout', 'CSS Grid Layout', 'CSS Custom Properties', 'Responsive Design', 'Exercise: Build a Responsive Card Layout'],
  nextModule: 'Module 3: JavaScript Essentials for Svelte',
  nextDesc: 'Master the JavaScript features you will use every day in Svelte development.',
  generate(doc) {
    addHeader(doc, '1. Semantic HTML5 Elements');
    addParagraph(doc, 'Semantic HTML uses elements that describe their meaning rather than just their appearance. Search engines and screen readers rely on semantic structure.');
    addCodeBlock(doc, '<header>   <!-- Site header, logo, navigation -->\n<nav>      <!-- Navigation links -->\n<main>     <!-- Primary page content -->\n<section>  <!-- Thematic grouping of content -->\n<article>  <!-- Self-contained content (blog post, card) -->\n<aside>    <!-- Sidebar, related content -->\n<footer>   <!-- Site footer, copyright, links -->', 'Semantic HTML5 Elements');

    addHeader(doc, '2. CSS in Svelte: Scoped Styles');
    addParagraph(doc, 'Styles defined in a component\'s <style> block only apply to that component. No CSS-in-JS library needed, no BEM naming, no class collisions.');
    addCodeBlock(doc, '<h1>This heading is styled</h1>\n<p>This paragraph is also styled</p>\n\n<style>\n  h1 { color: #00d4ff; font-size: 2rem; }\n  p { color: #666; line-height: 1.6; }\n</style>', 'Scoped Styles Example');
    addTip(doc, 'Use the :global() modifier if you need a style to apply to elements in child components.');

    addHeader(doc, '3. CSS Box Model');
    addBulletPoint(doc, 'Content \u2014 The actual text or image inside the element.');
    addBulletPoint(doc, 'Padding \u2014 Space between the content and the border.');
    addBulletPoint(doc, 'Border \u2014 The edge of the element.');
    addBulletPoint(doc, 'Margin \u2014 Space outside the border, separating elements.');
    addCodeBlock(doc, '* { box-sizing: border-box; }\n\n.card {\n  width: 300px;\n  padding: 1.5rem;\n  border: 1px solid #e0e0e0;\n  margin: 1rem;\n}', 'Box Model');

    addHeader(doc, '4. Flexbox Layout');
    addCodeBlock(doc, '.container {\n  display: flex;\n  flex-direction: row;\n  justify-content: center;\n  align-items: center;\n  gap: 1rem;\n  flex-wrap: wrap;\n}\n\n.item {\n  flex: 1;\n  min-width: 200px;\n}', 'Flexbox Properties');
    addBulletPoint(doc, 'Centering: display: flex; justify-content: center; align-items: center;');
    addBulletPoint(doc, 'Space between: justify-content: space-between; to push items apart.');

    addHeader(doc, '5. CSS Grid Layout');
    addCodeBlock(doc, '.grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 1.5rem;\n}\n\n@media (max-width: 768px) {\n  .grid { grid-template-columns: 1fr; }\n}', 'CSS Grid');
    addSubheading(doc, 'Named Grid Areas');
    addCodeBlock(doc, '.layout {\n  display: grid;\n  grid-template-areas:\n    "header header"\n    "sidebar main"\n    "footer footer";\n  grid-template-columns: 250px 1fr;\n  min-height: 100vh;\n}', 'Named Grid Areas');

    addHeader(doc, '6. CSS Custom Properties');
    addCodeBlock(doc, ':root {\n  --color-primary: #0a0a1a;\n  --color-accent: #00d4ff;\n  --color-purple: #7c3aed;\n  --font-sans: \'Inter\', system-ui, sans-serif;\n  --radius: 8px;\n}\n\n.card {\n  background: var(--color-primary);\n  border-radius: var(--radius);\n}', 'CSS Custom Properties');

    addHeader(doc, '7. Responsive Design');
    addCodeBlock(doc, '/* Mobile first */\n.container { padding: 1rem; }\n\n@media (min-width: 768px) {\n  .container { padding: 2rem; max-width: 768px; margin: 0 auto; }\n}\n\n@media (min-width: 1024px) {\n  .container { max-width: 1200px; padding: 3rem; }\n}', 'Media Queries');
    addBulletPoint(doc, 'Use relative units (rem, em, %) instead of fixed pixels.');
    addBulletPoint(doc, 'Use clamp() for fluid typography: font-size: clamp(1rem, 2.5vw, 2rem);');

    addHeader(doc, '8. Exercise: Build a Responsive Card Layout');
    addBulletPoint(doc, 'Create a Card.svelte component with title, description, and image props.');
    addBulletPoint(doc, 'Use CSS Grid: 3 columns on desktop, 2 on tablet, 1 on mobile.');
    addBulletPoint(doc, 'Add hover effects using CSS transitions.');
    addCodeBlock(doc, '<script lang="ts">\n  let { title, description } = $props<{\n    title: string;\n    description: string;\n  }>();\n</script>\n\n<article class="card">\n  <h3>{title}</h3>\n  <p>{description}</p>\n</article>\n\n<style>\n  .card {\n    background: var(--color-primary, #0a0a1a);\n    color: white;\n    padding: 1.5rem;\n    border-radius: 8px;\n    border: 1px solid rgba(0, 212, 255, 0.2);\n    transition: transform 0.2s, border-color 0.2s;\n  }\n  .card:hover {\n    transform: translateY(-4px);\n    border-color: var(--color-accent, #00d4ff);\n  }\n</style>', 'Card.svelte');
  }
};

// ---------------------------------------------------------------------------
// Module 3
// ---------------------------------------------------------------------------

const module3: ModuleContent = {
  number: 3,
  title: 'JavaScript Essentials for Svelte',
  subtitle: 'Revolution Trading Pros \u2014 Svelte Zero-to-Hero Course',
  tocItems: ['Variables: let and const', 'Data Types and Template Literals', 'Arrow Functions', 'Array Methods', 'Object Destructuring and Spread', 'Async/Await and Promises', 'ES Modules', 'Error Handling', 'Exercise: Build a Data-Driven List'],
  nextModule: 'Module 4: Svelte 5 Core Concepts',
  nextDesc: 'Dive into Svelte 5 runes, components, reactivity, and build your first interactive app.',
  generate(doc) {
    addHeader(doc, '1. Variables: let and const');
    addParagraph(doc, 'Modern JavaScript uses let and const. Forget var \u2014 it has function-scoping quirks. Use const by default, let only when you need to reassign.');
    addCodeBlock(doc, 'const API_URL = \'https://api.example.com\';\nlet count = 0;\ncount = 1; // OK\n// API_URL = \'...\'; // ERROR!', 'let vs const');

    addHeader(doc, '2. Data Types and Template Literals');
    addCodeBlock(doc, 'const name: string = \'Svelte\';\nconst version: number = 5;\nconst isAwesome: boolean = true;\n\nconst greeting = `Hello, ${name} ${version}!`;\nconst multiline = `\n  This spans\n  multiple lines\n`;', 'Data Types & Template Literals');

    addHeader(doc, '3. Arrow Functions');
    addCodeBlock(doc, 'const add = (a: number, b: number): number => a + b;\n\nconst greet = (name: string): string => {\n  return `Hello, ${name}!`;\n};\n\n// Common in Svelte\n<button onclick={() => count++}>Click</button>', 'Arrow Functions');

    addHeader(doc, '4. Array Methods');
    addCodeBlock(doc, 'const numbers = [1, 2, 3, 4, 5];\n\nconst doubled = numbers.map(n => n * 2);     // [2,4,6,8,10]\nconst even = numbers.filter(n => n % 2 === 0); // [2, 4]\nconst sum = numbers.reduce((a, n) => a + n, 0); // 15\nconst found = numbers.find(n => n > 3);        // 4', 'Array Methods');
    addCodeBlock(doc, 'const result = users\n  .filter(user => user.active)\n  .map(user => user.name)\n  .sort((a, b) => a.localeCompare(b));', 'Method Chaining');
    addTip(doc, 'Master array methods \u2014 you will use them constantly in Svelte {#each} blocks.');

    addHeader(doc, '5. Object Destructuring and Spread');
    addCodeBlock(doc, 'const user = { name: \'Alice\', age: 30, role: \'admin\' };\nconst { name, age } = user;\n\nconst defaults = { theme: \'dark\', lang: \'en\' };\nconst config = { ...defaults, lang: \'fr\' };\n\nconst arr1 = [1, 2, 3];\nconst arr2 = [...arr1, 4, 5];', 'Destructuring & Spread');

    addHeader(doc, '6. Async/Await and Promises');
    addCodeBlock(doc, 'async function fetchUsers(): Promise<User[]> {\n  const response = await fetch(\'/api/users\');\n  if (!response.ok) throw new Error(`HTTP ${response.status}`);\n  return response.json();\n}\n\nconst [users, posts] = await Promise.all([\n  fetch(\'/api/users\').then(r => r.json()),\n  fetch(\'/api/posts\').then(r => r.json())\n]);', 'Async/Await');

    addHeader(doc, '7. ES Modules');
    addCodeBlock(doc, 'export const API_URL = \'https://api.example.com\';\nexport function formatDate(d: Date): string {\n  return d.toLocaleDateString();\n}\n\nimport { API_URL, formatDate } from \'./utils\';\nimport Card from \'$lib/components/Card.svelte\';', 'ES Modules');
    addTip(doc, 'The $lib alias in SvelteKit points to src/lib/. Use it for cleaner imports.');

    addHeader(doc, '8. Error Handling');
    addCodeBlock(doc, 'async function loadData() {\n  try {\n    const response = await fetch(\'/api/data\');\n    if (!response.ok) throw new Error(`Server error: ${response.status}`);\n    return await response.json();\n  } catch (error) {\n    console.error(\'Error:\', error);\n    return null;\n  }\n}', 'Error Handling');

    addHeader(doc, '9. Exercise: Build a Data-Driven List');
    addBulletPoint(doc, 'Define an array of objects with name, category, and price.');
    addBulletPoint(doc, 'Use $state() for filter text and selected category.');
    addBulletPoint(doc, 'Use $derived() to compute the filtered list.');
    addBulletPoint(doc, 'Render with {#each} and show "No results" when empty.');
    addCodeBlock(doc, '<script lang="ts">\n  interface Product {\n    name: string;\n    category: string;\n    price: number;\n  }\n\n  const products: Product[] = [\n    { name: \'Laptop\', category: \'Electronics\', price: 999 },\n    { name: \'Desk\', category: \'Furniture\', price: 299 },\n  ];\n\n  let search = $state(\'\');\n  let category = $state(\'all\');\n\n  let filtered = $derived(\n    products\n      .filter(p => category === \'all\' || p.category === category)\n      .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))\n  );\n</script>', 'Exercise Starter');
  }
};

// ---------------------------------------------------------------------------
// Module 4
// ---------------------------------------------------------------------------

const module4: ModuleContent = {
  number: 4,
  title: 'Svelte 5 Core Concepts',
  subtitle: 'Revolution Trading Pros \u2014 Svelte Zero-to-Hero Course',
  tocItems: ['Components', '$state() Rune', '$derived() Rune', '$effect() Rune', '$props() Rune', '$bindable() Rune', 'Snippets and Render Tags', 'Event Handling', 'Conditional and List Rendering', 'Exercise: Build a Todo List'],
  nextModule: 'Module 5: SvelteKit Routing & Layouts',
  nextDesc: 'Learn file-based routing, layouts, server-side data loading, and dynamic routes.',
  generate(doc) {
    addHeader(doc, '1. Components: Creating .svelte Files');
    addCodeBlock(doc, '<script lang="ts">\n  let { label, variant = \'primary\' } = $props<{\n    label: string;\n    variant?: \'primary\' | \'secondary\';\n  }>();\n</script>\n\n<button class="btn {variant}">{label}</button>\n\n<style>\n  .btn { padding: 0.75rem 1.5rem; border: none; border-radius: 6px; cursor: pointer; }\n  .primary { background: #00d4ff; color: #0a0a1a; }\n  .secondary { background: #7c3aed; color: white; }\n</style>', 'Button.svelte');

    addHeader(doc, '2. $state() Rune: Reactive State');
    addCodeBlock(doc, '<script lang="ts">\n  let count = $state(0);\n  let items = $state<string[]>([]);\n  let user = $state({ name: \'Alice\', score: 0 });\n\n  function increment() { count++; }\n  function addItem(item: string) { items.push(item); }\n</script>\n\n<p>Count: {count}</p>\n<button onclick={increment}>+1</button>', '$state()');
    addNote(doc, 'Svelte 5 tracks mutations \u2014 push, splice, property assignment all trigger updates.');

    addHeader(doc, '3. $derived() Rune: Computed Values');
    addCodeBlock(doc, 'let items = $state([\'apple\', \'banana\', \'cherry\']);\nlet search = $state(\'\');\n\nlet filtered = $derived(\n  items.filter(item => item.toLowerCase().includes(search.toLowerCase()))\n);\nlet count = $derived(filtered.length);', '$derived()');

    addHeader(doc, '4. $effect() Rune: Side Effects');
    addCodeBlock(doc, '$effect(() => {\n  console.log(\'Search query:\', query);\n  return () => console.log(\'Cleaning up\');\n});\n\n$effect(() => {\n  const controller = new AbortController();\n  fetch(`/api/search?q=${query}`, { signal: controller.signal })\n    .then(r => r.json()).then(console.log);\n  return () => controller.abort();\n});', '$effect()');
    addTip(doc, 'The cleanup function runs before re-execution and on destroy. Use it for abort controllers and listeners.');

    addHeader(doc, '5. $props() Rune: Component Props');
    addCodeBlock(doc, 'let { title, count = 0, onAction } = $props<{\n  title: string;\n  count?: number;\n  onAction?: (id: string) => void;\n}>();', '$props()');

    addHeader(doc, '6. $bindable() Rune: Two-Way Binding');
    addCodeBlock(doc, '<!-- Child: TextInput.svelte -->\n<script lang="ts">\n  let { value = $bindable(\'\') } = $props<{ value?: string }>();\n</script>\n<input bind:value={value} />\n\n<!-- Parent -->\n<script lang="ts">\n  let name = $state(\'\');\n</script>\n<TextInput bind:value={name} />', '$bindable()');

    addHeader(doc, '7. Snippets and Render Tags');
    addCodeBlock(doc, '{#snippet greeting(name)}\n  <h2>Hello, {name}!</h2>\n{/snippet}\n\n{@render greeting(\'Alice\')}\n{@render greeting(\'Bob\')}', 'Snippets');

    addHeader(doc, '8. Event Handling');
    addCodeBlock(doc, '<button onclick={handleClick}>Count: {count}</button>\n<button onclick={() => count++}>Inline</button>\n<form onsubmit={(e) => { e.preventDefault(); }}>\n  <!-- fields -->\n</form>', 'Events');

    addHeader(doc, '9. Conditional and List Rendering');
    addCodeBlock(doc, '{#if loggedIn}\n  <Dashboard />\n{:else}\n  <LoginForm />\n{/if}\n\n{#each items as item (item.id)}\n  <div>{item.name}</div>\n{:empty}\n  <p>No items found.</p>\n{/each}', 'Conditional & List Rendering');

    addHeader(doc, '10. Exercise: Build a Todo List');
    addBulletPoint(doc, 'Use $state() for todos and input, $derived() for filtered counts.');
    addBulletPoint(doc, 'Add, toggle, delete. Filter by all/active/completed.');
    addBulletPoint(doc, 'Persist to localStorage with $effect().');
    addCodeBlock(doc, 'interface Todo { id: number; text: string; done: boolean; }\n\nlet todos = $state<Todo[]>([]);\nlet input = $state(\'\');\nlet filter = $state<\'all\' | \'active\' | \'completed\'>(\'all\');\n\nlet filtered = $derived(\n  todos.filter(t => filter === \'all\' ? true : filter === \'active\' ? !t.done : t.done)\n);', 'Todo Starter');
  }
};

// ---------------------------------------------------------------------------
// Module 5
// ---------------------------------------------------------------------------

const module5: ModuleContent = {
  number: 5,
  title: 'SvelteKit Routing & Layouts',
  subtitle: 'Revolution Trading Pros \u2014 Svelte Zero-to-Hero Course',
  tocItems: ['File-Based Routing', '+page.svelte', '+layout.svelte', '+page.server.ts', '+layout.server.ts', 'Dynamic Routes', 'Route Groups', 'Error Pages', 'Loading States', 'Exercise: Multi-Page App'],
  nextModule: 'Module 6: Forms & Server Actions',
  nextDesc: 'Master form handling, server actions, validation, and progressive enhancement.',
  generate(doc) {
    addHeader(doc, '1. File-Based Routing');
    addCodeBlock(doc, 'src/routes/\n\u251c\u2500\u2500 +page.svelte            # /\n\u251c\u2500\u2500 +layout.svelte          # Root layout\n\u251c\u2500\u2500 about/\n\u2502   \u2514\u2500\u2500 +page.svelte        # /about\n\u251c\u2500\u2500 blog/\n\u2502   \u251c\u2500\u2500 +page.svelte        # /blog\n\u2502   \u2514\u2500\u2500 [slug]/\n\u2502       \u2514\u2500\u2500 +page.svelte    # /blog/:slug\n\u2514\u2500\u2500 dashboard/\n    \u2514\u2500\u2500 +page.svelte        # /dashboard', 'Route Structure');

    addHeader(doc, '2. +page.svelte: Page Components');
    addCodeBlock(doc, '<script lang="ts">\n  let { data } = $props();\n</script>\n\n<svelte:head>\n  <title>About Us</title>\n</svelte:head>\n\n<h1>About Us</h1>\n<p>{data.description}</p>', '+page.svelte');

    addHeader(doc, '3. +layout.svelte: Shared Layouts');
    addCodeBlock(doc, '<script lang="ts">\n  let { children } = $props();\n</script>\n\n<nav>\n  <a href="/">Home</a>\n  <a href="/about">About</a>\n</nav>\n\n<main>{@render children()}</main>\n\n<footer>&copy; 2025 Revolution Trading Pros</footer>', '+layout.svelte');

    addHeader(doc, '4. +page.server.ts: Server-Side Data Loading');
    addCodeBlock(doc, 'import type { PageServerLoad } from \'./$types\';\n\nexport const load: PageServerLoad = async ({ fetch }) => {\n  const response = await fetch(\'/api/posts\');\n  const posts = await response.json();\n  return { posts };\n};', '+page.server.ts');

    addHeader(doc, '5. +layout.server.ts: Shared Layout Data');
    addCodeBlock(doc, 'import type { LayoutServerLoad } from \'./$types\';\n\nexport const load: LayoutServerLoad = async ({ cookies }) => {\n  const sessionId = cookies.get(\'session\');\n  const user = sessionId ? await getUser(sessionId) : null;\n  return { user };\n};', '+layout.server.ts');

    addHeader(doc, '6. Dynamic Routes');
    addCodeBlock(doc, '// [slug] - required parameter\nsrc/routes/blog/[slug]/+page.svelte\n\n// [[lang]] - optional parameter\nsrc/routes/[[lang]]/about/+page.svelte\n\n// [...rest] - rest parameter\nsrc/routes/files/[...path]/+page.svelte', 'Dynamic Patterns');
    addCodeBlock(doc, 'export const load: PageServerLoad = async ({ params }) => {\n  const post = await getPost(params.slug);\n  if (!post) throw error(404, \'Post not found\');\n  return { post };\n};', 'Route Parameters');

    addHeader(doc, '7. Route Groups');
    addCodeBlock(doc, 'src/routes/\n\u251c\u2500\u2500 (marketing)/       # Does not appear in URL\n\u2502   \u251c\u2500\u2500 +layout.svelte  # Marketing layout\n\u2502   \u2514\u2500\u2500 +page.svelte    # /\n\u2514\u2500\u2500 (app)/\n    \u251c\u2500\u2500 +layout.svelte  # App layout\n    \u2514\u2500\u2500 dashboard/\n        \u2514\u2500\u2500 +page.svelte # /dashboard', 'Route Groups');

    addHeader(doc, '8. Error Pages');
    addCodeBlock(doc, '<script lang="ts">\n  import { page } from \'$app/stores\';\n</script>\n\n<h1>{$page.status}</h1>\n<p>{$page.error?.message}</p>\n<a href="/">Go home</a>', '+error.svelte');

    addHeader(doc, '9. Loading States');
    addCodeBlock(doc, '<script lang="ts">\n  import { navigating } from \'$app/stores\';\n  let { children } = $props();\n</script>\n\n{#if $navigating}\n  <div class="loading-bar"></div>\n{/if}\n{@render children()}', 'Loading Indicator');

    addHeader(doc, '10. Exercise: Build a Multi-Page App');
    addBulletPoint(doc, 'Root layout with nav and footer.');
    addBulletPoint(doc, 'Home, About, and Blog pages.');
    addBulletPoint(doc, 'Dynamic [slug] blog posts with server load.');
    addBulletPoint(doc, 'Route group for dashboard with sidebar layout.');
    addBulletPoint(doc, 'Custom +error.svelte page.');
  }
};

// ---------------------------------------------------------------------------
// Module 6
// ---------------------------------------------------------------------------

const module6: ModuleContent = {
  number: 6,
  title: 'Forms & Server Actions',
  subtitle: 'Revolution Trading Pros \u2014 Svelte Zero-to-Hero Course',
  tocItems: ['HTML Forms in SvelteKit', 'Form Actions', 'Default and Named Actions', 'Server-Side Validation', 'Returning Errors with fail()', 'Progressive Enhancement', 'Redirects', 'File Uploads', 'Exercise: Contact Form'],
  nextModule: 'Module 7: Styling & Animations',
  nextDesc: 'Learn CSS transitions, Svelte transitions, GSAP integration, and animated interfaces.',
  generate(doc) {
    addHeader(doc, '1. HTML Forms in SvelteKit');
    addParagraph(doc, 'SvelteKit embraces native HTML forms. Forms submit data to the server without client-side JavaScript \u2014 progressive enhancement at its core.');
    addCodeBlock(doc, '<form method="POST">\n  <label>\n    Email <input type="email" name="email" required />\n  </label>\n  <label>\n    Message <textarea name="message" required></textarea>\n  </label>\n  <button type="submit">Send</button>\n</form>', 'Basic Form');

    addHeader(doc, '2. Form Actions in +page.server.ts');
    addCodeBlock(doc, 'import type { Actions } from \'./$types\';\n\nexport const actions: Actions = {\n  default: async ({ request }) => {\n    const formData = await request.formData();\n    const email = formData.get(\'email\') as string;\n    const message = formData.get(\'message\') as string;\n    await sendEmail({ email, message });\n    return { success: true };\n  }\n};', 'Form Action');

    addHeader(doc, '3. Default and Named Actions');
    addCodeBlock(doc, 'export const actions: Actions = {\n  login: async ({ request }) => { /* ... */ },\n  register: async ({ request }) => { /* ... */ }\n};\n\n<form method="POST" action="?/login"> ... </form>\n<form method="POST" action="?/register"> ... </form>', 'Named Actions');

    addHeader(doc, '4. Server-Side Validation');
    addCodeBlock(doc, 'const errors: Record<string, string> = {};\n\nif (!email || !email.includes(\'@\')) {\n  errors.email = \'Please enter a valid email\';\n}\nif (!message || message.length < 10) {\n  errors.message = \'Message must be at least 10 characters\';\n}\n\nif (Object.keys(errors).length > 0) {\n  return fail(400, { errors, email, message });\n}', 'Validation');

    addHeader(doc, '5. Returning Errors with fail()');
    addCodeBlock(doc, '<script lang="ts">\n  import type { ActionData } from \'./$types\';\n  let { form } = $props<{ form: ActionData }>();\n</script>\n\n<form method="POST">\n  <input name="email" value={form?.email ?? \'\'} />\n  {#if form?.errors?.email}\n    <span class="error">{form.errors.email}</span>\n  {/if}\n  <button>Submit</button>\n</form>\n\n{#if form?.success}\n  <p class="success">Sent!</p>\n{/if}', 'Displaying Errors');

    addHeader(doc, '6. Progressive Enhancement with use:enhance');
    addCodeBlock(doc, '<script lang="ts">\n  import { enhance } from \'$app/forms\';\n</script>\n\n<form method="POST" use:enhance>\n  <!-- Upgrades to fetch; still works without JS -->\n</form>', 'use:enhance');

    addHeader(doc, '7. Redirects After Submission');
    addCodeBlock(doc, 'import { redirect } from \'@sveltejs/kit\';\n\nexport const actions: Actions = {\n  default: async ({ request }) => {\n    await processData(await request.formData());\n    throw redirect(303, \'/success\');\n  }\n};', 'Redirect');
    addNote(doc, 'Use 303 status for POST-to-GET redirects to prevent resubmission on refresh.');

    addHeader(doc, '8. File Uploads');
    addCodeBlock(doc, '<form method="POST" enctype="multipart/form-data">\n  <input type="file" name="avatar" accept="image/*" />\n  <button>Upload</button>\n</form>', 'File Upload Form');
    addCodeBlock(doc, 'const file = data.get(\'avatar\') as File;\nif (file.size > 5 * 1024 * 1024) {\n  return fail(400, { error: \'File too large (max 5MB)\' });\n}\nconst buffer = Buffer.from(await file.arrayBuffer());', 'Server Handler');

    addHeader(doc, '9. Exercise: Build a Contact Form');
    addBulletPoint(doc, 'Fields: name, email, subject dropdown, message textarea.');
    addBulletPoint(doc, 'Server-side validation with inline error display via fail().');
    addBulletPoint(doc, 'Progressive enhancement with use:enhance.');
    addBulletPoint(doc, 'Success message and styled with course colors.');
  }
};

// ---------------------------------------------------------------------------
// Module 7
// ---------------------------------------------------------------------------

const module7: ModuleContent = {
  number: 7,
  title: 'Styling & Animations',
  subtitle: 'Revolution Trading Pros \u2014 Svelte Zero-to-Hero Course',
  tocItems: ['CSS Scoping', ':global() Selector', 'CSS Transitions', 'Svelte Transitions', 'Custom Transitions', 'GSAP Integration', 'ScrollTrigger', '$effect() Lifecycle', 'gsap.context() Cleanup', 'Exercise: Animated Landing'],
  nextModule: 'Module 8: Deployment & Production',
  nextDesc: 'Learn to build, deploy, and optimize your SvelteKit application for production.',
  generate(doc) {
    addHeader(doc, '1. CSS Scoping in Svelte');
    addParagraph(doc, 'Svelte automatically scopes CSS. Styles in one component cannot affect another. The compiler adds unique class attributes.');
    addCodeBlock(doc, '<!-- Component A -->\n<p>Styled by A</p>\n<style> p { color: blue; } </style>\n\n<!-- Component B -->\n<p>Styled by B</p>\n<style> p { color: red; } </style>', 'CSS Scoping');

    addHeader(doc, '2. :global() Selector');
    addCodeBlock(doc, '<style>\n  :global(.highlight) { background: yellow; }\n  .container :global(pre) {\n    background: #1a1a2e;\n    color: #e0e0e0;\n  }\n  :global(body) { margin: 0; }\n</style>', ':global()');

    addHeader(doc, '3. CSS Transitions and Animations');
    addCodeBlock(doc, '.card {\n  transition: transform 0.3s ease, box-shadow 0.3s ease;\n}\n.card:hover {\n  transform: translateY(-8px);\n  box-shadow: 0 12px 24px rgba(0,0,0,0.2);\n}\n\n@keyframes fadeIn {\n  from { opacity: 0; transform: translateY(20px); }\n  to { opacity: 1; transform: translateY(0); }\n}', 'CSS Transitions');

    addHeader(doc, '4. Svelte Transitions');
    addCodeBlock(doc, '<script lang="ts">\n  import { fade, slide, fly, scale } from \'svelte/transition\';\n  let visible = $state(true);\n</script>\n\n{#if visible}\n  <div transition:fade>Fades</div>\n  <div transition:fly={{ y: 50, duration: 300 }}>Flies</div>\n  <div in:fly={{ y: -20 }} out:fade>Different in/out</div>\n{/if}', 'Svelte Transitions');

    addHeader(doc, '5. Custom Transitions');
    addCodeBlock(doc, 'function typewriter(node: HTMLElement, { speed = 30 }) {\n  const text = node.textContent ?? \'\';\n  const duration = text.length * speed;\n  return {\n    duration,\n    tick: (t: number) => {\n      node.textContent = text.slice(0, Math.trunc(text.length * t));\n    }\n  };\n}', 'Custom Transition');

    addHeader(doc, '6. GSAP Integration with Svelte 5');
    addTerminalBlock(doc, 'pnpm add gsap');
    addCodeBlock(doc, '<script lang="ts">\n  import gsap from \'gsap\';\n  let heading: HTMLElement;\n  let cards: HTMLElement;\n\n  $effect(() => {\n    const ctx = gsap.context(() => {\n      gsap.from(heading, {\n        opacity: 0, y: 50, duration: 1, ease: \'power3.out\'\n      });\n      gsap.from(\'.card\', {\n        opacity: 0, y: 30, stagger: 0.15,\n        duration: 0.8, ease: \'power2.out\', delay: 0.3\n      });\n    }, cards);\n    return () => ctx.revert();\n  });\n</script>\n\n<h1 bind:this={heading}>Welcome</h1>\n<div bind:this={cards}>\n  <div class="card">Card 1</div>\n  <div class="card">Card 2</div>\n</div>', 'GSAP + Svelte 5');

    addHeader(doc, '7. ScrollTrigger Setup');
    addCodeBlock(doc, 'import gsap from \'gsap\';\nimport { ScrollTrigger } from \'gsap/ScrollTrigger\';\ngsap.registerPlugin(ScrollTrigger);\n\n$effect(() => {\n  const ctx = gsap.context(() => {\n    gsap.from(\'.feature\', {\n      scrollTrigger: {\n        trigger: section,\n        start: \'top 80%\',\n        toggleActions: \'play none none reverse\'\n      },\n      opacity: 0, y: 60, stagger: 0.2\n    });\n  }, section);\n  return () => ctx.revert();\n});', 'ScrollTrigger');

    addHeader(doc, '8. $effect() for Animation Lifecycle');
    addBulletPoint(doc, 'Initialize GSAP timelines inside $effect().');
    addBulletPoint(doc, 'Return cleanup that calls ctx.revert() or tl.kill().');
    addBulletPoint(doc, 'Use bind:this to get DOM references for GSAP.');
    addBulletPoint(doc, 'Wrap in gsap.context() for automatic cleanup.');

    addHeader(doc, '9. gsap.context() for Cleanup');
    addCodeBlock(doc, '$effect(() => {\n  const ctx = gsap.context(() => {\n    gsap.to(\'.card\', { rotation: 360 });\n    gsap.to(\'.title\', { color: \'#00d4ff\' });\n  }, containerElement);\n  return () => ctx.revert();\n});', 'gsap.context()');

    addHeader(doc, '10. Exercise: Build an Animated Landing Section');
    addBulletPoint(doc, 'Hero heading: GSAP fade + slide up.');
    addBulletPoint(doc, 'Subtitle with delay after heading.');
    addBulletPoint(doc, 'CTA button with CSS hover scale.');
    addBulletPoint(doc, 'Feature cards with ScrollTrigger stagger.');
    addBulletPoint(doc, 'Proper cleanup with gsap.context() in $effect().');
  }
};

// ---------------------------------------------------------------------------
// Module 8
// ---------------------------------------------------------------------------

const module8: ModuleContent = {
  number: 8,
  title: 'Deployment & Production',
  subtitle: 'Revolution Trading Pros \u2014 Svelte Zero-to-Hero Course',
  tocItems: ['Building for Production', 'SvelteKit Adapters', 'Environment Variables', 'Performance Optimization', 'SEO Best Practices', 'Deploying to Vercel', 'Deploying to Netlify', 'Custom Domain Setup', 'Monitoring and Analytics', 'Exercise: Deploy Your App'],
  generate(doc) {
    addHeader(doc, '1. Building for Production');
    addTerminalBlock(doc, 'pnpm build');
    addParagraph(doc, 'Svelte compiles components into vanilla JavaScript \u2014 no runtime framework shipped to the browser. Tree-shaking, minification, and code splitting happen automatically.');
    addTerminalBlock(doc, 'pnpm preview');
    addParagraph(doc, 'Always preview before deploying to catch build-related issues.');

    addHeader(doc, '2. SvelteKit Adapters');
    addCodeBlock(doc, 'import adapter from \'@sveltejs/adapter-auto\';\n// OR: adapter-vercel, adapter-netlify, adapter-node, adapter-static\n\nexport default {\n  kit: { adapter: adapter() }\n};', 'svelte.config.js');
    addBulletPoint(doc, 'adapter-auto: Detects the platform automatically.');
    addBulletPoint(doc, 'adapter-vercel: Optimized for Vercel edge functions.');
    addBulletPoint(doc, 'adapter-netlify: Optimized for Netlify serverless.');
    addBulletPoint(doc, 'adapter-node: Standalone Node.js server for Docker/VPS.');
    addBulletPoint(doc, 'adapter-static: Pre-renders all pages at build time.');

    addHeader(doc, '3. Environment Variables');
    addCodeBlock(doc, '# .env\nDATABASE_URL=postgresql://...\nAPI_SECRET=sk_live_...\nPUBLIC_API_URL=https://api.example.com', '.env');
    addCodeBlock(doc, '// Server-only\nimport { DATABASE_URL } from \'$env/static/private\';\n\n// Client-safe\nimport { PUBLIC_API_URL } from \'$env/static/public\';', 'Env Variables');
    addNote(doc, 'NEVER put secrets in PUBLIC_ variables. They are visible in client-side JavaScript.');

    addHeader(doc, '4. Performance Optimization');
    addCodeBlock(doc, '// Dynamic imports for code splitting\nconst Chart = await import(\'$lib/components/Chart.svelte\');\n\n// Preload links\n<a href="/dashboard" data-sveltekit-preload-data>Dashboard</a>', 'Code Splitting');
    addBulletPoint(doc, 'Use WebP/AVIF images with width/height attributes.');
    addBulletPoint(doc, 'Lazy load below-fold images: loading="lazy".');
    addBulletPoint(doc, 'Use responsive srcset for different screen sizes.');

    addHeader(doc, '5. SEO Best Practices');
    addCodeBlock(doc, '<svelte:head>\n  <title>Page Title | Revolution Trading Pros</title>\n  <meta name="description" content="Description" />\n  <meta property="og:title" content="Page Title" />\n  <meta property="og:image" content="/images/og.jpg" />\n  <meta name="twitter:card" content="summary_large_image" />\n  <link rel="canonical" href="https://yoursite.com/page" />\n</svelte:head>', 'SEO Meta Tags');

    addHeader(doc, '6. Deploying to Vercel');
    addTerminalBlock(doc, 'pnpm add -D @sveltejs/adapter-vercel');
    addBulletPoint(doc, 'Push code to GitHub.');
    addBulletPoint(doc, 'Import repository on vercel.com.');
    addBulletPoint(doc, 'Add environment variables in dashboard.');
    addBulletPoint(doc, 'Click Deploy. Every push auto-deploys.');

    addHeader(doc, '7. Deploying to Netlify');
    addTerminalBlock(doc, 'pnpm add -D @sveltejs/adapter-netlify');
    addBulletPoint(doc, 'Connect repository on app.netlify.com.');
    addBulletPoint(doc, 'Build command: pnpm build. Publish directory: build.');
    addBulletPoint(doc, 'Add environment variables in site settings.');

    addHeader(doc, '8. Custom Domain Setup');
    addBulletPoint(doc, 'Purchase a domain from a registrar.');
    addBulletPoint(doc, 'Add domain in hosting platform settings.');
    addBulletPoint(doc, 'Update DNS: A record or CNAME to hosting.');
    addBulletPoint(doc, 'SSL is automatically provisioned.');

    addHeader(doc, '9. Monitoring and Analytics');
    addBulletPoint(doc, 'Vercel Analytics: Built-in web vitals (LCP, FID, CLS).');
    addBulletPoint(doc, 'Plausible/Fathom: Privacy-friendly analytics.');
    addBulletPoint(doc, 'Sentry: Error tracking and performance monitoring.');
    addCodeBlock(doc, '<!-- src/app.html -->\n<script defer data-domain="yoursite.com"\n  src="https://plausible.io/js/script.js"></script>', 'Analytics');

    addHeader(doc, '10. Exercise: Deploy Your App');
    addBulletPoint(doc, 'Choose Vercel or Netlify. Install the adapter.');
    addBulletPoint(doc, 'Run pnpm build locally and fix any errors.');
    addBulletPoint(doc, 'Push to GitHub and trigger deployment.');
    addBulletPoint(doc, 'Test on desktop and mobile.');
    addBulletPoint(doc, 'Set up a custom domain (optional).');
    addParagraph(doc, 'Congratulations on completing the Revolution Trading Pros Svelte Zero-to-Hero course! You now have the skills to build, style, and deploy professional web applications with SvelteKit.');
  }
};

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  console.log('Generating Revolution Trading Pros PDFs...\n');

  console.log('Generating lead magnet...');
  await generateLeadMagnet();

  const modules: ModuleContent[] = [module1, module2, module3, module4, module5, module6, module7, module8];

  for (const mod of modules) {
    console.log(`Generating Module ${mod.number}: ${mod.title}...`);
    await generateModule(mod);
  }

  console.log('\nAll 9 PDFs generated successfully in static/pdfs/');
}

main().catch((err) => {
  console.error('PDF generation failed:', err);
  process.exit(1);
});

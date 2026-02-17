import PDFDocument from "pdfkit";
import { createWriteStream } from "fs";
import path from "path";

const OUT_DIR = path.resolve("static/pdfs");

// Colors
const CYAN = "#00d4ff";
const PURPLE = "#7c3aed";
const DARK_BG = "#0a0a1a";
const CODE_BG = "#f0f0f5";
const TERMINAL_BG = "#1a1a2e";
const WHITE = "#ffffff";
const BLACK = "#111111";
const GRAY = "#555555";

// ─── Helper Functions ───

function createDoc(filename: string): PDFKit.PDFDocument {
  const doc = new PDFDocument({ size: "A4", margin: 60, bufferPages: true });
  doc.pipe(createWriteStream(path.join(OUT_DIR, filename)));
  return doc;
}

function addPageNumbers(doc: PDFKit.PDFDocument) {
  const range = doc.bufferedPageRange();
  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i);
    const oldBottomMargin = doc.page.margins.bottom;
    doc.page.margins.bottom = 0;
    doc
      .fontSize(9)
      .font("Helvetica")
      .fillColor(GRAY)
      .text(`Page ${i + 1} of ${range.count}`, 60, doc.page.height - 40, {
        align: "center",
        width: doc.page.width - 120,
      });
    doc.page.margins.bottom = oldBottomMargin;
  }
}

function coverPage(
  doc: PDFKit.PDFDocument,
  title: string,
  subtitle: string,
  author: string
) {
  // Dark background
  doc.rect(0, 0, doc.page.width, doc.page.height).fill(DARK_BG);

  // Accent line
  doc.rect(60, 200, 120, 4).fill(CYAN);

  // Title
  doc
    .fontSize(36)
    .font("Helvetica-Bold")
    .fillColor(WHITE)
    .text(title, 60, 230, { width: doc.page.width - 120 });

  // Subtitle
  doc
    .moveDown(1)
    .fontSize(16)
    .font("Helvetica")
    .fillColor(CYAN)
    .text(subtitle, { width: doc.page.width - 120 });

  // Author
  doc
    .moveDown(2)
    .fontSize(14)
    .font("Helvetica")
    .fillColor(GRAY)
    .text(author, { width: doc.page.width - 120 });

  // Bottom accent
  doc.rect(60, doc.page.height - 80, doc.page.width - 120, 2).fill(PURPLE);

  doc.addPage();
}

function heading(doc: PDFKit.PDFDocument, text: string) {
  checkPageSpace(doc, 80);
  doc.moveDown(0.5);
  doc.rect(60, doc.y, 4, 24).fill(CYAN);
  doc
    .fontSize(22)
    .font("Helvetica-Bold")
    .fillColor(BLACK)
    .text(text, 72, doc.y + 2, { width: doc.page.width - 140 });
  doc.moveDown(0.8);
  doc.x = 60;
}

function subheading(doc: PDFKit.PDFDocument, text: string) {
  checkPageSpace(doc, 60);
  doc.moveDown(0.3);
  doc
    .fontSize(16)
    .font("Helvetica-Bold")
    .fillColor(PURPLE)
    .text(text, 60, doc.y, { width: doc.page.width - 120 });
  doc.moveDown(0.5);
}

function para(doc: PDFKit.PDFDocument, text: string) {
  doc
    .fontSize(11)
    .font("Helvetica")
    .fillColor(BLACK)
    .text(text, 60, doc.y, { width: doc.page.width - 120, lineGap: 4 });
  doc.moveDown(0.6);
}

function bullet(doc: PDFKit.PDFDocument, text: string) {
  checkPageSpace(doc, 30);
  const startY = doc.y;
  doc.fontSize(11).font("Helvetica").fillColor(CYAN).text("●", 68, startY);
  doc
    .fontSize(11)
    .font("Helvetica")
    .fillColor(BLACK)
    .text(text, 84, startY, { width: doc.page.width - 152, lineGap: 3 });
  doc.moveDown(0.3);
}

function codeBlock(doc: PDFKit.PDFDocument, code: string, lang?: string) {
  const lines = code.split("\n");
  const blockHeight = lines.length * 15 + 24;
  checkPageSpace(doc, blockHeight + 10);

  if (lang) {
    doc.fontSize(8).font("Helvetica").fillColor(GRAY).text(lang, 60, doc.y);
    doc.moveDown(0.2);
  }

  const startY = doc.y;
  doc
    .roundedRect(58, startY - 4, doc.page.width - 116, blockHeight, 4)
    .fill(CODE_BG);

  doc.fontSize(9.5).font("Courier").fillColor("#333333");
  let yPos = startY + 8;
  for (const line of lines) {
    doc.text(line, 72, yPos, { width: doc.page.width - 150 });
    yPos += 15;
  }
  doc.y = startY + blockHeight + 6;
  doc.x = 60;
  doc.moveDown(0.4);
}

function terminalBlock(doc: PDFKit.PDFDocument, code: string) {
  const lines = code.split("\n");
  const blockHeight = lines.length * 15 + 30;
  checkPageSpace(doc, blockHeight + 10);

  doc.fontSize(8).font("Helvetica").fillColor(GRAY).text("Terminal", 60, doc.y);
  doc.moveDown(0.2);

  const startY = doc.y;
  doc
    .roundedRect(58, startY - 4, doc.page.width - 116, blockHeight, 4)
    .fill(TERMINAL_BG);

  // Three dots (window controls)
  doc.circle(74, startY + 10, 4).fill("#ff5f56");
  doc.circle(88, startY + 10, 4).fill("#ffbd2e");
  doc.circle(102, startY + 10, 4).fill("#27ca40");

  doc.fontSize(9.5).font("Courier").fillColor("#00ff88");
  let yPos = startY + 22;
  for (const line of lines) {
    doc.text(line, 72, yPos, { width: doc.page.width - 150 });
    yPos += 15;
  }
  doc.y = startY + blockHeight + 6;
  doc.x = 60;
  doc.moveDown(0.4);
}

function pageBreak(doc: PDFKit.PDFDocument) {
  doc.addPage();
}

function checkPageSpace(doc: PDFKit.PDFDocument, needed: number) {
  if (doc.y + needed > doc.page.height - 80) {
    doc.addPage();
  }
}

function sectionDivider(doc: PDFKit.PDFDocument) {
  doc.moveDown(0.5);
  const y = doc.y;
  doc
    .moveTo(60, y)
    .lineTo(doc.page.width - 60, y)
    .strokeColor("#e0e0e0")
    .lineWidth(0.5)
    .stroke();
  doc.moveDown(0.8);
}

// ─── TRADING SECRETS GUIDE ───

function generateTradingSecrets() {
  console.log("Generating trading-secrets-guide.pdf ...");
  const doc = createDoc("trading-secrets-guide.pdf");

  coverPage(
    doc,
    "The 5 Trading Secrets Every Beginner Must Know",
    "A Comprehensive Guide to Profitable Trading",
    "By Revolution Trading Pros"
  );

  // Introduction
  heading(doc, "Introduction");
  para(
    doc,
    "Welcome to this exclusive guide from Revolution Trading Pros. If you are reading this, you have already taken the first and most important step toward becoming a successful trader: committing to education."
  );
  para(
    doc,
    "The financial markets can feel overwhelming. Thousands of indicators, conflicting opinions, and the constant noise of social media make it nearly impossible for beginners to know where to start. That is exactly why we created this guide."
  );
  para(
    doc,
    "Over the past decade, we have mentored hundreds of traders. We have seen the same mistakes repeated over and over, and we have identified the core principles that separate consistently profitable traders from everyone else. These are not gimmicks or get-rich-quick schemes. They are battle-tested strategies rooted in data, discipline, and risk management."
  );
  para(
    doc,
    "In the following pages, you will discover five foundational secrets that every beginner must understand before risking real capital. Each secret builds upon the last, forming a complete framework for approaching the markets with confidence and clarity."
  );
  para(
    doc,
    "Whether you are interested in stocks, forex, or cryptocurrency, these principles apply universally. Read this guide carefully, take notes, and revisit it often. The knowledge contained here could save you thousands of dollars in avoidable losses and accelerate your path to consistent profitability."
  );

  sectionDivider(doc);

  // Secret 1
  pageBreak(doc);
  heading(doc, "Secret #1: Moving Averages & RSI Indicator");
  para(
    doc,
    "Technical analysis is the study of price action and chart patterns to forecast future price movements. While there are hundreds of indicators available, two stand out as absolutely essential for beginners: Moving Averages and the Relative Strength Index (RSI)."
  );

  subheading(doc, "Moving Averages Explained");
  para(
    doc,
    "A moving average smooths out price data by creating a constantly updated average price over a specific time period. The two most commonly used types are the Simple Moving Average (SMA) and the Exponential Moving Average (EMA)."
  );
  bullet(
    doc,
    "Simple Moving Average (SMA): Calculates the arithmetic mean of prices over a period. The 50-day and 200-day SMAs are the most widely followed by institutional traders."
  );
  bullet(
    doc,
    "Exponential Moving Average (EMA): Gives more weight to recent prices, making it more responsive to new information. The 9-day and 21-day EMAs are popular for short-term trading."
  );
  para(
    doc,
    "The Golden Cross occurs when a shorter-term moving average crosses above a longer-term moving average, signaling a potential bullish trend. Conversely, the Death Cross occurs when the shorter-term average crosses below the longer-term average, signaling a bearish trend."
  );
  para(
    doc,
    'For example, when the 50-day SMA crosses above the 200-day SMA, many traders interpret this as a strong buy signal. Historically, this pattern has preceded significant upward moves in major indices like the S&P 500.'
  );

  subheading(doc, "The RSI Indicator");
  para(
    doc,
    "The Relative Strength Index (RSI) is a momentum oscillator that measures the speed and magnitude of price changes. It ranges from 0 to 100 and is typically calculated using a 14-period lookback."
  );
  bullet(
    doc,
    "Overbought (RSI above 70): The asset may be overvalued and due for a pullback. This does not mean you should sell immediately, but it is a warning to tighten your stops."
  );
  bullet(
    doc,
    "Oversold (RSI below 30): The asset may be undervalued and due for a bounce. This can present buying opportunities, especially in an overall uptrend."
  );
  bullet(
    doc,
    "RSI Divergence: When price makes a new high but RSI does not, this bearish divergence often precedes a reversal. The opposite (bullish divergence) applies at market bottoms."
  );
  para(
    doc,
    "The most powerful trading setups occur when moving average signals align with RSI readings. For example, if price is bouncing off the 50-day EMA while RSI is rising from the 30 level, this confluence of signals significantly increases the probability of a successful trade."
  );
  para(
    doc,
    "Pro tip: Never rely on a single indicator in isolation. The best traders use a combination of tools to confirm their thesis before entering a position."
  );

  sectionDivider(doc);

  // Secret 2
  pageBreak(doc);
  heading(doc, "Secret #2: Risk Management");
  para(
    doc,
    "Risk management is the single most important skill in trading. You can have the best strategy in the world, but without proper risk management, one bad trade can wipe out months of profits. Professional traders are obsessed with protecting their capital first and growing it second."
  );

  subheading(doc, "The 1% Rule");
  para(
    doc,
    "The 1% Rule states that you should never risk more than 1% of your total trading capital on any single trade. This means if you have a $10,000 account, the maximum you should risk on one trade is $100."
  );
  para(
    doc,
    "This might seem overly conservative, but consider this: with the 1% rule, you would need to lose 100 consecutive trades to blow your account. That is virtually impossible if you have any edge at all. Compare this to risking 10% per trade, where just 10 losses in a row would devastate your account."
  );
  bullet(doc, "Account size: $10,000");
  bullet(doc, "Risk per trade (1%): $100");
  bullet(doc, "If you lose 10 trades in a row: $900 loss (9% drawdown) - recoverable");
  bullet(
    doc,
    "Compare with 10% risk: $6,513 loss (65% drawdown) after 10 losses - catastrophic"
  );

  subheading(doc, "Position Sizing");
  para(
    doc,
    "Position sizing determines how many shares or contracts you trade. It is directly linked to your risk management rules. The formula is straightforward:"
  );
  para(
    doc,
    "Position Size = Risk Amount / (Entry Price - Stop Loss Price)"
  );
  para(
    doc,
    "For example, if your risk per trade is $100, your entry is $50, and your stop loss is $48, then: Position Size = $100 / ($50 - $48) = 50 shares. This ensures that if your stop loss is hit, you lose exactly $100 - no more, no less."
  );

  subheading(doc, "Stop Losses");
  para(
    doc,
    "A stop loss is a predetermined price level at which you will exit a losing trade. Setting stop losses is non-negotiable for professional traders. There are several approaches:"
  );
  bullet(
    doc,
    "Technical Stop: Placed below a support level, moving average, or recent swing low."
  );
  bullet(
    doc,
    "Percentage Stop: A fixed percentage below your entry price (e.g., 2-3%)."
  );
  bullet(
    doc,
    "Volatility Stop: Based on the Average True Range (ATR), which adapts to current market conditions."
  );
  bullet(
    doc,
    "Trailing Stop: Moves up as the price increases, locking in profits while giving the trade room to breathe."
  );
  para(
    doc,
    "The golden rule: Always set your stop loss BEFORE entering the trade, and NEVER move it further away from your entry. Moving your stop loss to avoid being stopped out is the fastest way to blow up a trading account."
  );

  sectionDivider(doc);

  // Secret 3
  pageBreak(doc);
  heading(doc, "Secret #3: Market Sessions & Candlestick Patterns");
  para(
    doc,
    "Understanding when to trade is just as important as knowing what to trade. Markets behave differently throughout the day, and timing your entries can dramatically improve your results."
  );

  subheading(doc, "Market Sessions");
  para(
    doc,
    "The global forex and stock markets operate across three major sessions:"
  );
  bullet(
    doc,
    "Asian Session (Tokyo): 7:00 PM - 4:00 AM EST. Lower volatility, range-bound price action. Best for scalping strategies."
  );
  bullet(
    doc,
    "European Session (London): 3:00 AM - 12:00 PM EST. High liquidity and volatility. Many major trends begin during this session."
  );
  bullet(
    doc,
    "American Session (New York): 8:00 AM - 5:00 PM EST. Highest volume for US stocks. The overlap with London (8:00 AM - 12:00 PM) is the most volatile period."
  );
  para(
    doc,
    "For stock traders, the first 30 minutes after market open (9:30 AM - 10:00 AM EST) and the last 30 minutes before close (3:30 PM - 4:00 PM EST) tend to see the highest volume and most significant moves."
  );

  subheading(doc, "Essential Candlestick Patterns");
  para(
    doc,
    "Japanese candlestick charts provide visual insight into market psychology. Each candle represents four data points: open, high, low, and close. Here are the patterns every trader must know:"
  );
  bullet(
    doc,
    "Doji: Open and close are virtually the same. Signals indecision and potential reversal. Most powerful at tops and bottoms."
  );
  bullet(
    doc,
    "Hammer / Hanging Man: Small body at the top with a long lower wick. A hammer at the bottom of a downtrend signals bullish reversal. A hanging man at the top signals bearish reversal."
  );
  bullet(
    doc,
    "Engulfing Pattern: A large candle completely engulfs the previous candle. Bullish engulfing at support levels and bearish engulfing at resistance levels are high-probability setups."
  );
  bullet(
    doc,
    "Morning Star / Evening Star: Three-candle reversal pattern. The morning star (bullish) appears at market bottoms; the evening star (bearish) appears at market tops."
  );
  bullet(
    doc,
    "Three White Soldiers / Three Black Crows: Three consecutive strong candles in the same direction. Signals strong momentum continuation."
  );
  para(
    doc,
    "Remember: candlestick patterns are most reliable when they form at key support and resistance levels, and when confirmed by volume and other indicators."
  );

  sectionDivider(doc);

  // Secret 4
  pageBreak(doc);
  heading(doc, "Secret #4: Volume Analysis & Market Sentiment");
  para(
    doc,
    "Price tells you what happened, but volume tells you why. Volume is the number of shares or contracts traded in a given period, and it provides crucial insight into the conviction behind price movements."
  );

  subheading(doc, "Volume Analysis Principles");
  bullet(
    doc,
    "Rising price + Rising volume = Strong uptrend (bulls are in control with conviction)"
  );
  bullet(
    doc,
    "Rising price + Falling volume = Weak uptrend (buyers are losing interest, potential reversal ahead)"
  );
  bullet(
    doc,
    "Falling price + Rising volume = Strong downtrend (panic selling, bears in control)"
  );
  bullet(
    doc,
    "Falling price + Falling volume = Weak downtrend (selling pressure is easing, potential bottom)"
  );
  para(
    doc,
    "Volume spikes often precede major price moves. When volume is 2-3 times the average, pay close attention - something significant is happening. This could be institutional accumulation, earnings reactions, or sector rotation."
  );

  subheading(doc, "On-Balance Volume (OBV)");
  para(
    doc,
    "OBV is a cumulative indicator that adds volume on up days and subtracts volume on down days. When OBV is rising while price is flat, it suggests accumulation by smart money - a bullish signal. When OBV is falling while price is flat, distribution is occurring - a bearish signal."
  );

  subheading(doc, "Market Sentiment Indicators");
  para(
    doc,
    "Understanding the crowd psychology can give you a significant edge:"
  );
  bullet(
    doc,
    "Fear & Greed Index: When extreme fear dominates, it often signals a buying opportunity. Extreme greed often precedes corrections."
  );
  bullet(
    doc,
    "Put/Call Ratio: A high ratio indicates fear (more puts being bought). Extreme readings can signal contrarian opportunities."
  );
  bullet(
    doc,
    "VIX (Volatility Index): Known as the 'fear gauge.' Spikes in VIX often coincide with market bottoms."
  );
  bullet(
    doc,
    "Social Media Sentiment: Tools that track Twitter and Reddit sentiment can provide early signals of retail interest surges."
  );
  para(
    doc,
    "The most profitable traders are often contrarians. When everyone is euphoric, they are cautious. When everyone is panicking, they are looking for opportunities."
  );

  sectionDivider(doc);

  // Secret 5
  pageBreak(doc);
  heading(doc, "Secret #5: Compound Growth Strategy");
  para(
    doc,
    "The most powerful force in trading and investing is compound growth. Albert Einstein allegedly called compound interest the eighth wonder of the world. Whether or not he said it, the math is undeniable."
  );

  subheading(doc, "The Power of Consistency");
  para(
    doc,
    "Most beginners focus on hitting home runs - they want 100% returns in a week. Professional traders focus on consistent, small gains that compound over time."
  );
  para(
    doc,
    "Consider two traders with a $10,000 account:"
  );
  bullet(
    doc,
    "Trader A: Aims for 50% monthly returns. Achieves it twice, then loses 60% in month three. Net result after 3 months: $8,400."
  );
  bullet(
    doc,
    "Trader B: Aims for 5% monthly returns consistently. Net result after 3 months: $11,576. After 12 months: $17,959. After 24 months: $32,251."
  );
  para(
    doc,
    "Trader B's approach seems boring, but 5% per month compounded equals 79.6% per year. Over two years, that is a 222% total return. This is how professionals build wealth in the markets."
  );

  subheading(doc, "Building Your Compound Growth Plan");
  bullet(doc, "Start with a realistic monthly target (3-5% for beginners).");
  bullet(doc, "Track every trade in a journal with entry reason, exit reason, and lessons learned.");
  bullet(doc, "Review your journal weekly to identify patterns in your winners and losers.");
  bullet(doc, "Gradually increase position size as your account grows, maintaining the 1% risk rule.");
  bullet(doc, "Reinvest profits rather than withdrawing early - let compounding work.");
  bullet(doc, "Set quarterly milestones and celebrate progress, not individual trades.");

  subheading(doc, "The 90/90/90 Rule");
  para(
    doc,
    "There is a well-known statistic: 90% of traders lose 90% of their money in the first 90 days. This is not because trading is impossible. It is because most beginners skip the education, ignore risk management, and trade with emotions instead of a plan."
  );
  para(
    doc,
    "By reading this guide and implementing these five secrets, you are already ahead of the vast majority. The key now is execution and discipline."
  );

  sectionDivider(doc);

  // About + CTA
  pageBreak(doc);
  heading(doc, "About Revolution Trading Pros");
  para(
    doc,
    "Revolution Trading Pros is a premium trading education platform founded by professional traders with over a combined 40 years of market experience. Our mission is to transform beginners into confident, consistently profitable traders through structured education, live mentorship, and a supportive community."
  );
  para(
    doc,
    "Our comprehensive curriculum covers everything from the fundamentals you have read about in this guide to advanced strategies including algorithmic trading, options flow analysis, and institutional order flow."
  );

  subheading(doc, "What You Get With Our Full Course");
  bullet(doc, "8 in-depth modules covering development environment setup through deployment");
  bullet(doc, "Step-by-step video tutorials with downloadable companion PDFs");
  bullet(doc, "Live weekly Q&A sessions with professional traders");
  bullet(doc, "Private community Discord with real-time trade alerts");
  bullet(doc, "Lifetime access to all course materials and future updates");
  bullet(doc, "Certificate of completion to showcase your expertise");

  subheading(doc, "Ready to Take the Next Step?");
  para(
    doc,
    "Visit us at revolutiontradingpros.com to enroll in our full trading course. Use code SECRETS2025 for an exclusive discount reserved for guide readers."
  );
  para(
    doc,
    "Remember: the best investment you can make is in your own education. The markets will always be there. Make sure you are prepared before you put your hard-earned money on the line."
  );
  para(
    doc,
    "We look forward to being part of your trading journey."
  );

  addPageNumbers(doc);
  doc.end();
  console.log("  -> trading-secrets-guide.pdf done");
}

// ─── MODULE HELPERS ───

function modulecover(
  doc: PDFKit.PDFDocument,
  moduleNum: number,
  title: string,
  description: string
) {
  coverPage(
    doc,
    `Module ${String(moduleNum).padStart(2, "0")}: ${title}`,
    description,
    "Revolution Trading Pros - Web Dev Course"
  );
}

function exercise(doc: PDFKit.PDFDocument, title: string, steps: string[]) {
  checkPageSpace(doc, 60);
  subheading(doc, `Exercise: ${title}`);
  para(
    doc,
    "Put what you have learned into practice with this hands-on exercise."
  );
  steps.forEach((s, i) => {
    bullet(doc, `Step ${i + 1}: ${s}`);
  });
  doc.moveDown(0.5);
}

// ─── MODULE 1 ───

function generateModule01() {
  console.log("Generating module-01-dev-environment.pdf ...");
  const doc = createDoc("module-01-dev-environment.pdf");
  modulecover(doc, 1, "Setting Up Your Dev Environment", "Install and configure all the tools you need to build modern web applications with SvelteKit.");

  heading(doc, "Overview");
  para(doc, "Before writing any code, you need a properly configured development environment. In this module, we will install Node.js, pnpm (a fast package manager), Visual Studio Code (our code editor), and Git (for version control). Then we will create our first SvelteKit project and explore its structure.");
  para(doc, "By the end of this module, you will have a fully working development environment and a running SvelteKit application on your local machine.");

  sectionDivider(doc);

  // Node.js
  heading(doc, "Installing Node.js");
  para(doc, "Node.js is a JavaScript runtime that allows you to run JavaScript outside of the browser. SvelteKit requires Node.js version 18.13 or later. We recommend using the LTS (Long Term Support) version for stability.");

  subheading(doc, "macOS / Linux");
  para(doc, "The recommended way to install Node.js is using a version manager called nvm (Node Version Manager). This allows you to easily switch between Node versions for different projects.");
  terminalBlock(doc, "# Install nvm\ncurl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash\n\n# Restart your terminal, then install Node.js LTS\nnvm install --lts\n\n# Verify installation\nnode --version\nnpm --version");
  para(doc, "You should see version numbers printed for both node and npm. If you see errors, make sure to restart your terminal after installing nvm.");

  subheading(doc, "Windows");
  para(doc, "On Windows, download the LTS installer directly from the official Node.js website at nodejs.org. Run the installer and follow the prompts. Make sure to check the box that adds Node to your PATH.");
  terminalBlock(doc, "# After installation, open a new Command Prompt or PowerShell\nnode --version\nnpm --version");

  subheading(doc, "Verifying Your Installation");
  para(doc, "Run the following command to ensure everything is working correctly:");
  terminalBlock(doc, "node -e \"console.log('Node.js is working!')\"");
  para(doc, "If you see the message printed, Node.js is installed and working correctly.");

  sectionDivider(doc);
  pageBreak(doc);

  // pnpm
  heading(doc, "Installing pnpm");
  para(doc, "pnpm is a fast, disk-space-efficient package manager. It is significantly faster than npm and yarn because it uses a content-addressable store and hard links to avoid duplicating packages across projects.");
  terminalBlock(doc, "# Install pnpm globally\nnpm install -g pnpm\n\n# Verify installation\npnpm --version");
  para(doc, "You should see a version number like 8.x.x or 9.x.x. pnpm is fully compatible with the npm ecosystem and reads the same package.json files.");

  subheading(doc, "Why pnpm Over npm?");
  bullet(doc, "Speed: pnpm installs packages up to 2x faster than npm.");
  bullet(doc, "Disk Space: pnpm stores packages in a global store and uses hard links, saving significant disk space.");
  bullet(doc, "Strictness: pnpm creates a non-flat node_modules structure, preventing phantom dependencies.");
  bullet(doc, "Monorepo Support: Built-in workspace support for managing multiple packages.");

  sectionDivider(doc);

  // VS Code
  heading(doc, "Installing Visual Studio Code");
  para(doc, "Visual Studio Code (VS Code) is a free, open-source code editor from Microsoft. It is the most popular editor for web development thanks to its excellent extension ecosystem, built-in terminal, and IntelliSense code completion.");

  subheading(doc, "Download and Install");
  para(doc, "Download VS Code from code.visualstudio.com and install it for your operating system. On macOS, drag the app to your Applications folder. On Windows, run the installer.");

  subheading(doc, "Essential Extensions");
  para(doc, "Install these extensions to supercharge your Svelte development:");
  bullet(doc, "Svelte for VS Code (svelte.svelte-vscode): Syntax highlighting, IntelliSense, and diagnostics for Svelte files.");
  bullet(doc, "Prettier (esbenp.prettier-vscode): Automatic code formatting. Set it as your default formatter.");
  bullet(doc, "ESLint (dbaeumer.vscode-eslint): JavaScript/TypeScript linting for catching errors early.");
  bullet(doc, "GitLens (eamodio.gitlens): Enhanced Git integration with blame annotations and history.");
  bullet(doc, "Auto Rename Tag (formulahendry.auto-rename-tag): Automatically renames paired HTML tags.");

  terminalBlock(doc, "# Install extensions from the command line\ncode --install-extension svelte.svelte-vscode\ncode --install-extension esbenp.prettier-vscode\ncode --install-extension dbaeumer.vscode-eslint");

  subheading(doc, "Recommended Settings");
  para(doc, "Add these settings to your VS Code configuration (Cmd/Ctrl + Shift + P, then 'Open Settings JSON'):");
  codeBlock(doc, '{\n  "editor.formatOnSave": true,\n  "editor.defaultFormatter": "esbenp.prettier-vscode",\n  "editor.tabSize": 2,\n  "editor.wordWrap": "on",\n  "emmet.includeLanguages": { "svelte": "html" }\n}', "JSON");

  sectionDivider(doc);
  pageBreak(doc);

  // Git
  heading(doc, "Git Basics");
  para(doc, "Git is a distributed version control system that tracks changes to your code over time. It allows you to collaborate with others, revert to previous states, and manage multiple features simultaneously through branching.");

  subheading(doc, "Installing Git");
  para(doc, "Git may already be installed on your system. Check by running:");
  terminalBlock(doc, "git --version");
  para(doc, "If it is not installed, download it from git-scm.com or install via your package manager:");
  terminalBlock(doc, "# macOS (via Homebrew)\nbrew install git\n\n# Ubuntu/Debian\nsudo apt install git\n\n# Windows: Download from git-scm.com");

  subheading(doc, "Configuring Git");
  para(doc, "Set your name and email so Git can attribute your commits to you:");
  terminalBlock(doc, 'git config --global user.name "Your Name"\ngit config --global user.email "your.email@example.com"');

  subheading(doc, "Essential Git Commands");
  para(doc, "Here are the Git commands you will use most frequently:");
  terminalBlock(doc, "# Initialize a new repository\ngit init\n\n# Check status of your files\ngit status\n\n# Stage files for commit\ngit add .                    # Stage all changes\ngit add filename.txt         # Stage a specific file\n\n# Commit staged changes\ngit commit -m \"Your message\"\n\n# View commit history\ngit log --oneline");

  para(doc, "Think of Git like saving checkpoints in a video game. Each commit is a snapshot of your entire project at a specific point in time. If something breaks, you can always go back to a previous commit.");

  sectionDivider(doc);
  pageBreak(doc);

  // SvelteKit Project
  heading(doc, "Creating a SvelteKit Project");
  para(doc, "Now for the exciting part! Let us create your first SvelteKit project. SvelteKit provides a CLI tool that scaffolds a new project with all the configuration you need.");
  terminalBlock(doc, "# Create a new SvelteKit project\npnpm dlx sv create my-first-app\n\n# Navigate into the project directory\ncd my-first-app\n\n# Install dependencies\npnpm install");
  para(doc, "During the setup wizard, you will be asked several questions. For this course, select the following options:");
  bullet(doc, "Template: SvelteKit minimal");
  bullet(doc, "Type checking: TypeScript");
  bullet(doc, "Additional options: Select Prettier and ESLint");
  para(doc, "The CLI will create a new directory with all the project files. Let us explore what was generated.");

  sectionDivider(doc);

  // Project Structure
  heading(doc, "Project Structure Walkthrough");
  para(doc, "Understanding the project structure is crucial. Here is what each file and directory does:");
  codeBlock(doc, "my-first-app/\n├── src/\n│   ├── routes/\n│   │   └── +page.svelte      # Home page\n│   ├── lib/\n│   │   └── index.ts           # Library exports\n│   └── app.html               # HTML template\n├── static/                     # Static assets\n├── svelte.config.js            # Svelte configuration\n├── vite.config.ts              # Vite bundler config\n├── tsconfig.json               # TypeScript config\n├── package.json                # Dependencies & scripts\n└── pnpm-lock.yaml              # Lock file", "Project Structure");

  subheading(doc, "Key Directories");
  bullet(doc, "src/routes/: This is where your pages live. SvelteKit uses file-based routing, so the file structure maps directly to URL paths.");
  bullet(doc, "src/lib/: Shared components, utilities, and modules. You can import from here using the $lib alias.");
  bullet(doc, "static/: Files placed here are served as-is. Perfect for images, fonts, and other static assets.");

  subheading(doc, "Key Files");
  bullet(doc, "app.html: The HTML shell that wraps your entire application. The %sveltekit.head% and %sveltekit.body% placeholders are replaced at build time.");
  bullet(doc, "svelte.config.js: Configures the Svelte compiler, adapter, and preprocessors.");
  bullet(doc, "vite.config.ts: Configures Vite, the blazing-fast build tool that powers SvelteKit.");

  sectionDivider(doc);
  pageBreak(doc);

  // Dev Server
  heading(doc, "Running the Dev Server");
  para(doc, "Start the development server with hot module replacement:");
  terminalBlock(doc, "pnpm dev\n\n# Output:\n#   VITE v5.x.x  ready in 500 ms\n#\n#   ➜  Local:   http://localhost:5173/\n#   ➜  Network: use --host to expose");
  para(doc, "Open your browser and navigate to http://localhost:5173. You should see the SvelteKit welcome page. Try editing src/routes/+page.svelte - the browser will update instantly without a full reload.");

  subheading(doc, "Understanding Hot Module Replacement (HMR)");
  para(doc, "HMR is a development feature that updates your application in the browser without losing state. When you save a file, Vite detects the change, recompiles only the affected module, and sends the update to the browser. This makes development incredibly fast and productive.");

  subheading(doc, "Your First Edit");
  para(doc, "Open src/routes/+page.svelte in VS Code and replace its contents:");
  codeBlock(doc, "<h1>Hello from SvelteKit!</h1>\n<p>I just set up my development environment.</p>\n\n<style>\n  h1 {\n    color: #ff3e00;\n    font-size: 2rem;\n  }\n  p {\n    color: #666;\n  }\n</style>", "Svelte");
  para(doc, "Save the file and check your browser. You should see your changes reflected immediately. Congratulations - you just wrote your first Svelte code!");

  sectionDivider(doc);

  // Exercise
  heading(doc, "Module 1 Exercise");
  exercise(doc, "Set Up and Customize Your Project", [
    "Create a new SvelteKit project using pnpm dlx sv create my-portfolio.",
    "Install dependencies with pnpm install.",
    "Open the project in VS Code.",
    "Edit src/routes/+page.svelte to display your name, a short bio, and your favorite programming language.",
    "Style the page with custom colors and fonts using a <style> block.",
    "Initialize a Git repository with git init, stage all files with git add ., and create your first commit.",
    "Take a screenshot of your running application and your terminal output to share with the community.",
  ]);

  heading(doc, "Summary");
  bullet(doc, "Node.js provides the JavaScript runtime needed for SvelteKit development.");
  bullet(doc, "pnpm is a fast, efficient package manager that we will use throughout the course.");
  bullet(doc, "VS Code with the Svelte extension provides an excellent development experience.");
  bullet(doc, "Git tracks your code changes and enables collaboration.");
  bullet(doc, "SvelteKit projects are created with pnpm dlx sv create and run with pnpm dev.");
  para(doc, "In the next module, we will dive into HTML and CSS fundamentals within the context of Svelte components.");

  addPageNumbers(doc);
  doc.end();
  console.log("  -> module-01-dev-environment.pdf done");
}

// ─── MODULE 2 ───

function generateModule02() {
  console.log("Generating module-02-html-css.pdf ...");
  const doc = createDoc("module-02-html-css.pdf");
  modulecover(doc, 2, "HTML & CSS for Svelte", "Master the building blocks of the web and learn how Svelte supercharges your styling workflow.");

  heading(doc, "Overview");
  para(doc, "HTML and CSS are the foundation of every web application. In this module, you will learn semantic HTML5 elements, modern CSS techniques including Flexbox and Grid, and how Svelte scopes styles to individual components. By the end, you will build a responsive card layout from scratch.");
  para(doc, "Even if you have some HTML and CSS experience, this module covers Svelte-specific patterns that are essential for the rest of the course.");

  sectionDivider(doc);

  heading(doc, "Semantic HTML5");
  para(doc, "Semantic HTML uses elements that clearly describe their meaning to both the browser and the developer. Using semantic elements improves accessibility, SEO, and code readability.");
  subheading(doc, "Common Semantic Elements");
  bullet(doc, "<header>: Introductory content or navigation links. Typically contains the site logo and main navigation.");
  bullet(doc, "<nav>: A section of navigation links. Use for primary site navigation, not every group of links.");
  bullet(doc, "<main>: The dominant content of the page. There should be only one <main> per page.");
  bullet(doc, "<article>: Self-contained content that could be distributed independently (blog post, news article, product card).");
  bullet(doc, "<section>: A thematic grouping of content, typically with a heading.");
  bullet(doc, "<aside>: Content tangentially related to the surrounding content (sidebars, call-out boxes).");
  bullet(doc, "<footer>: Footer content, typically containing copyright info, links, and contact details.");

  codeBlock(doc, '<header>\n  <nav>\n    <a href="/">Home</a>\n    <a href="/about">About</a>\n    <a href="/contact">Contact</a>\n  </nav>\n</header>\n\n<main>\n  <article>\n    <h1>My First Article</h1>\n    <p>This is the article content.</p>\n  </article>\n</main>\n\n<footer>\n  <p>&copy; 2025 My Website</p>\n</footer>', "HTML");

  para(doc, "Avoid using <div> for everything. Ask yourself: 'Does this element have a specific meaning?' If yes, use the appropriate semantic element.");

  sectionDivider(doc);
  pageBreak(doc);

  heading(doc, "CSS Scoped Styles in Svelte");
  para(doc, "One of Svelte's most powerful features is automatic CSS scoping. When you write styles in a Svelte component's <style> block, those styles only apply to that component. No more CSS class name collisions!");

  codeBlock(doc, '<!-- Button.svelte -->\n<button>Click me</button>\n\n<style>\n  /* This ONLY affects buttons in this component */\n  button {\n    background: #ff3e00;\n    color: white;\n    border: none;\n    padding: 0.5rem 1rem;\n    border-radius: 4px;\n    cursor: pointer;\n  }\n\n  button:hover {\n    background: #cc3200;\n  }\n</style>', "Svelte");

  para(doc, "Under the hood, Svelte adds unique class attributes to your elements and modifies your selectors to include these classes. This means you can write simple, readable CSS without worrying about global conflicts.");

  subheading(doc, "When You Need Global Styles");
  para(doc, "Sometimes you do need global styles (for body, reset styles, or third-party library overrides). Use the :global() modifier:");
  codeBlock(doc, '<style>\n  /* Scoped - only this component */\n  p { color: blue; }\n\n  /* Global - affects everything */\n  :global(body) {\n    margin: 0;\n    font-family: system-ui, sans-serif;\n  }\n\n  /* Global within a scoped parent */\n  div :global(strong) {\n    color: red;\n  }\n</style>', "Svelte");

  sectionDivider(doc);
  pageBreak(doc);

  heading(doc, "Flexbox Layout");
  para(doc, "Flexbox is a one-dimensional layout method for arranging items in rows or columns. It excels at distributing space and aligning items within a container.");

  subheading(doc, "Core Concepts");
  bullet(doc, "Flex Container: The parent element with display: flex. Controls the overall layout direction and alignment.");
  bullet(doc, "Flex Items: The direct children of a flex container. Can be individually sized and ordered.");
  bullet(doc, "Main Axis: The primary axis along which flex items are laid out (horizontal for row, vertical for column).");
  bullet(doc, "Cross Axis: Perpendicular to the main axis.");

  codeBlock(doc, '.container {\n  display: flex;\n  justify-content: space-between;  /* Main axis alignment */\n  align-items: center;             /* Cross axis alignment */\n  gap: 1rem;                       /* Space between items */\n  flex-wrap: wrap;                 /* Allow wrapping */\n}\n\n.item {\n  flex: 1;                         /* Grow equally */\n  min-width: 200px;                /* Minimum size before wrap */\n}', "CSS");

  subheading(doc, "Common Flexbox Patterns");
  para(doc, "Navigation bar with logo left and links right:");
  codeBlock(doc, 'nav {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 1rem 2rem;\n}', "CSS");
  para(doc, "Centering an element both horizontally and vertically:");
  codeBlock(doc, '.center-me {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  min-height: 100vh;\n}', "CSS");

  sectionDivider(doc);
  pageBreak(doc);

  heading(doc, "CSS Grid Layout");
  para(doc, "CSS Grid is a two-dimensional layout system. While Flexbox handles one dimension (row or column), Grid handles both simultaneously, making it perfect for page layouts and complex component designs.");

  subheading(doc, "Defining a Grid");
  codeBlock(doc, '.grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);  /* 3 equal columns */\n  grid-template-rows: auto;                /* Rows size to content */\n  gap: 1.5rem;                             /* Row and column gap */\n}\n\n/* Responsive grid */\n.responsive-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));\n  gap: 1.5rem;\n}', "CSS");

  para(doc, "The repeat(auto-fit, minmax(280px, 1fr)) pattern is incredibly powerful. It creates as many columns as will fit, each at least 280px wide, and distributes remaining space equally. This creates a fully responsive grid without any media queries.");

  subheading(doc, "Grid Areas");
  para(doc, "For complex layouts, you can name grid areas:");
  codeBlock(doc, '.layout {\n  display: grid;\n  grid-template-areas:\n    "header header"\n    "sidebar main"\n    "footer footer";\n  grid-template-columns: 250px 1fr;\n  grid-template-rows: auto 1fr auto;\n  min-height: 100vh;\n}\n\n.header  { grid-area: header; }\n.sidebar { grid-area: sidebar; }\n.main    { grid-area: main; }\n.footer  { grid-area: footer; }', "CSS");

  sectionDivider(doc);
  pageBreak(doc);

  heading(doc, "CSS Custom Properties (Variables)");
  para(doc, "CSS Custom Properties (also called CSS variables) allow you to define reusable values that can be updated dynamically. They are essential for theming and maintaining consistent design systems.");

  codeBlock(doc, ':root {\n  --color-primary: #ff3e00;\n  --color-secondary: #7c3aed;\n  --color-bg: #ffffff;\n  --color-text: #333333;\n  --font-body: system-ui, -apple-system, sans-serif;\n  --font-mono: "Fira Code", monospace;\n  --spacing-sm: 0.5rem;\n  --spacing-md: 1rem;\n  --spacing-lg: 2rem;\n  --radius: 8px;\n  --shadow: 0 2px 8px rgba(0, 0, 0, 0.1);\n}\n\n/* Usage */\n.card {\n  background: var(--color-bg);\n  color: var(--color-text);\n  padding: var(--spacing-lg);\n  border-radius: var(--radius);\n  box-shadow: var(--shadow);\n  font-family: var(--font-body);\n}', "CSS");

  para(doc, "Custom properties cascade like any other CSS property, so you can override them at any level of specificity. This makes dark mode implementation straightforward:");
  codeBlock(doc, '[data-theme="dark"] {\n  --color-bg: #1a1a2e;\n  --color-text: #e0e0e0;\n  --shadow: 0 2px 8px rgba(0, 0, 0, 0.4);\n}', "CSS");

  sectionDivider(doc);
  pageBreak(doc);

  heading(doc, "Responsive Design");
  para(doc, "Responsive design ensures your application looks great on all screen sizes. The key principles are fluid layouts, flexible images, and media queries.");

  subheading(doc, "The Viewport Meta Tag");
  para(doc, "This must be in your HTML head (SvelteKit includes it by default in app.html):");
  codeBlock(doc, '<meta name="viewport" content="width=device-width, initial-scale=1">', "HTML");

  subheading(doc, "Mobile-First Media Queries");
  para(doc, "Write base styles for mobile, then add complexity for larger screens:");
  codeBlock(doc, '/* Base styles (mobile) */\n.container {\n  padding: 1rem;\n}\n\n.grid {\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 1rem;\n}\n\n/* Tablet (768px+) */\n@media (min-width: 768px) {\n  .container { padding: 2rem; }\n  .grid { grid-template-columns: repeat(2, 1fr); }\n}\n\n/* Desktop (1024px+) */\n@media (min-width: 1024px) {\n  .container { max-width: 1200px; margin: 0 auto; }\n  .grid { grid-template-columns: repeat(3, 1fr); }\n}', "CSS");

  subheading(doc, "Responsive Units");
  bullet(doc, "rem: Relative to root font size. Use for font sizes, spacing, and widths.");
  bullet(doc, "em: Relative to parent font size. Use for padding/margin relative to the current element's text.");
  bullet(doc, "vw/vh: Viewport width/height. Use for hero sections and full-screen elements.");
  bullet(doc, "clamp(): A modern function for fluid typography: font-size: clamp(1rem, 2.5vw, 2rem);");
  bullet(doc, "%: Percentage of parent. Use for flexible containers within a defined width.");

  sectionDivider(doc);
  pageBreak(doc);

  heading(doc, "Module 2 Exercise");
  exercise(doc, "Responsive Card Layout", [
    "Create a new Svelte component called CardGrid.svelte in src/lib/components/.",
    "Define CSS custom properties for colors, spacing, and border-radius in a :root block.",
    "Create a card component with an image placeholder, title, description, and a button.",
    "Use CSS Grid with repeat(auto-fit, minmax(280px, 1fr)) to make the layout responsive.",
    "Style the cards with hover effects (transform, shadow transitions).",
    "Add a navigation bar above the grid using Flexbox.",
    "Test on different screen sizes using the browser's responsive design mode (Cmd+Shift+M in Chrome).",
    "Commit your changes to Git with a descriptive message.",
  ]);

  heading(doc, "Summary");
  bullet(doc, "Semantic HTML improves accessibility, SEO, and code readability.");
  bullet(doc, "Svelte scopes CSS automatically - no class name collisions.");
  bullet(doc, "Flexbox is ideal for one-dimensional layouts (navbars, centering).");
  bullet(doc, "CSS Grid handles two-dimensional layouts (page layouts, card grids).");
  bullet(doc, "CSS Custom Properties enable theming and consistent design systems.");
  bullet(doc, "Mobile-first responsive design ensures great experiences on all devices.");

  addPageNumbers(doc);
  doc.end();
  console.log("  -> module-02-html-css.pdf done");
}

// ─── MODULE 3 ───

function generateModule03() {
  console.log("Generating module-03-javascript.pdf ...");
  const doc = createDoc("module-03-javascript.pdf");
  modulecover(doc, 3, "JavaScript Essentials", "Learn the modern JavaScript features you will use every day in Svelte development.");

  heading(doc, "Overview");
  para(doc, "JavaScript is the programming language of the web, and modern JavaScript (ES6+) provides powerful features that make your code more concise and expressive. In this module, we cover the essential JavaScript concepts you need for Svelte development. If you are coming from another language, this module will get you up to speed quickly.");

  sectionDivider(doc);

  heading(doc, "Variables: let and const");
  para(doc, "Modern JavaScript provides two ways to declare variables. The older 'var' keyword has scoping issues and should be avoided.");

  codeBlock(doc, '// const - for values that will not be reassigned\nconst API_URL = "https://api.example.com";\nconst MAX_RETRIES = 3;\nconst user = { name: "Alice", age: 30 };  // Object reference is constant\nuser.age = 31;  // This is fine - mutating the object, not reassigning\n\n// let - for values that will change\nlet count = 0;\ncount += 1;  // Reassignment is allowed\n\nlet isLoading = true;\nisLoading = false;', "JavaScript");

  para(doc, "Rule of thumb: Use const by default. Only use let when you know the value needs to be reassigned. This makes your code more predictable and easier to reason about.");

  sectionDivider(doc);

  heading(doc, "Template Literals");
  para(doc, "Template literals use backticks instead of quotes and support embedded expressions and multi-line strings:");

  codeBlock(doc, "const name = \"World\";\nconst greeting = `Hello, ${name}!`;  // \"Hello, World!\"\n\nconst price = 29.99;\nconst tax = 0.1;\nconst total = `Total: $${(price * (1 + tax)).toFixed(2)}`;  // \"Total: $32.99\"\n\n// Multi-line strings\nconst html = `\n  <div class=\"card\">\n    <h2>${name}</h2>\n    <p>Price: $${price}</p>\n  </div>\n`;", "JavaScript");

  sectionDivider(doc);
  pageBreak(doc);

  heading(doc, "Arrow Functions");
  para(doc, "Arrow functions provide a concise syntax for writing functions. They also lexically bind 'this', which solves many common JavaScript pitfalls.");

  codeBlock(doc, '// Traditional function\nfunction add(a, b) {\n  return a + b;\n}\n\n// Arrow function\nconst add = (a, b) => a + b;\n\n// With a body block (for multiple statements)\nconst processUser = (user) => {\n  const fullName = `${user.first} ${user.last}`;\n  return { ...user, fullName };\n};\n\n// Single parameter - parentheses optional\nconst double = x => x * 2;\n\n// No parameters - empty parentheses required\nconst getTimestamp = () => Date.now();', "JavaScript");

  para(doc, "Arrow functions are used extensively in Svelte for event handlers, reactive computations, and array transformations.");

  sectionDivider(doc);

  heading(doc, "Array Methods");
  para(doc, "Array methods are the bread and butter of data manipulation in JavaScript. Svelte templates often use these methods to transform data for display.");

  subheading(doc, "map() - Transform Each Element");
  codeBlock(doc, 'const numbers = [1, 2, 3, 4, 5];\nconst doubled = numbers.map(n => n * 2);  // [2, 4, 6, 8, 10]\n\nconst users = [\n  { name: "Alice", age: 30 },\n  { name: "Bob", age: 25 }\n];\nconst names = users.map(u => u.name);  // ["Alice", "Bob"]', "JavaScript");

  subheading(doc, "filter() - Keep Elements That Match");
  codeBlock(doc, "const numbers = [1, 2, 3, 4, 5, 6];\nconst evens = numbers.filter(n => n % 2 === 0);  // [2, 4, 6]\n\nconst adults = users.filter(u => u.age >= 18);", "JavaScript");

  subheading(doc, "reduce() - Accumulate Into a Single Value");
  codeBlock(doc, "const numbers = [1, 2, 3, 4, 5];\nconst sum = numbers.reduce((acc, n) => acc + n, 0);  // 15\n\n// Group items by category\nconst items = [\n  { name: \"Apple\", category: \"fruit\" },\n  { name: \"Carrot\", category: \"vegetable\" },\n  { name: \"Banana\", category: \"fruit\" }\n];\n\nconst grouped = items.reduce((acc, item) => {\n  const key = item.category;\n  acc[key] = acc[key] || [];\n  acc[key].push(item);\n  return acc;\n}, {});", "JavaScript");

  subheading(doc, "Chaining Methods");
  codeBlock(doc, "const result = users\n  .filter(u => u.age >= 18)\n  .map(u => u.name.toUpperCase())\n  .sort();", "JavaScript");

  sectionDivider(doc);
  pageBreak(doc);

  heading(doc, "Destructuring");
  para(doc, "Destructuring allows you to extract values from arrays and objects into distinct variables. It is used extensively in Svelte for props, function parameters, and data processing.");

  subheading(doc, "Object Destructuring");
  codeBlock(doc, 'const user = { name: "Alice", age: 30, email: "alice@example.com" };\n\n// Extract specific properties\nconst { name, age } = user;\nconsole.log(name);  // "Alice"\nconsole.log(age);   // 30\n\n// Rename during destructuring\nconst { name: userName, email: userEmail } = user;\n\n// Default values\nconst { role = "user" } = user;  // "user" (not in original object)\n\n// Nested destructuring\nconst response = { data: { users: [{ id: 1 }] } };\nconst { data: { users } } = response;', "JavaScript");

  subheading(doc, "Array Destructuring");
  codeBlock(doc, 'const colors = ["red", "green", "blue"];\nconst [first, second] = colors;  // "red", "green"\nconst [, , third] = colors;       // "blue" (skip first two)\n\n// Swap variables\nlet a = 1, b = 2;\n[a, b] = [b, a];  // a = 2, b = 1\n\n// Rest element\nconst [head, ...tail] = [1, 2, 3, 4];  // head = 1, tail = [2, 3, 4]', "JavaScript");

  sectionDivider(doc);

  heading(doc, "Spread Operator");
  para(doc, "The spread operator (...) expands iterables and is essential for immutable data patterns in Svelte.");

  codeBlock(doc, '// Spread arrays\nconst arr1 = [1, 2, 3];\nconst arr2 = [4, 5, 6];\nconst combined = [...arr1, ...arr2];  // [1, 2, 3, 4, 5, 6]\n\n// Spread objects (shallow copy + merge)\nconst defaults = { theme: "light", lang: "en", fontSize: 14 };\nconst prefs = { theme: "dark", fontSize: 16 };\nconst settings = { ...defaults, ...prefs };  // theme: "dark", lang: "en", fontSize: 16\n\n// Creating a new object with one property changed (immutable update)\nconst updatedUser = { ...user, age: 31 };', "JavaScript");

  sectionDivider(doc);
  pageBreak(doc);

  heading(doc, "Async/Await");
  para(doc, "Modern JavaScript handles asynchronous operations with Promises and the async/await syntax. This is essential for API calls, file operations, and any task that takes time.");

  codeBlock(doc, '// Fetching data with async/await\nasync function fetchUsers() {\n  try {\n    const response = await fetch("https://api.example.com/users");\n\n    if (!response.ok) {\n      throw new Error(`HTTP error! status: ${response.status}`);\n    }\n\n    const users = await response.json();\n    return users;\n  } catch (error) {\n    console.error("Failed to fetch users:", error);\n    throw error;  // Re-throw to let the caller handle it\n  }\n}\n\n// Using the function\nconst users = await fetchUsers();\nconsole.log(users);', "JavaScript");

  subheading(doc, "Parallel Requests");
  codeBlock(doc, '// Run multiple requests in parallel\nconst [users, posts, comments] = await Promise.all([\n  fetch("/api/users").then(r => r.json()),\n  fetch("/api/posts").then(r => r.json()),\n  fetch("/api/comments").then(r => r.json())\n]);', "JavaScript");

  sectionDivider(doc);

  heading(doc, "ES Modules");
  para(doc, "ES Modules are the standard module system for JavaScript. SvelteKit uses ES Modules throughout.");

  codeBlock(doc, '// utils.ts - Named exports\nexport function formatDate(date: Date): string {\n  return date.toLocaleDateString();\n}\n\nexport function formatCurrency(amount: number): string {\n  return `$${amount.toFixed(2)}`;\n}\n\nexport const API_BASE = "https://api.example.com";\n\n// Default export (one per module)\nexport default class ApiClient {\n  // ...\n}', "TypeScript");

  codeBlock(doc, '// Importing in another file\nimport ApiClient, { formatDate, formatCurrency, API_BASE } from "./utils";\n\n// Import everything as a namespace\nimport * as utils from "./utils";\nutils.formatDate(new Date());\n\n// SvelteKit $lib alias\nimport Header from "$lib/components/Header.svelte";\nimport { formatDate } from "$lib/utils";', "TypeScript");

  sectionDivider(doc);
  pageBreak(doc);

  heading(doc, "Module 3 Exercise");
  exercise(doc, "Data-Driven List", [
    "Create a new file src/lib/data/products.ts with an array of 10 product objects, each having id, name, price, category, and inStock properties.",
    "Export the array as a named export.",
    "In src/routes/+page.svelte, import the products array.",
    "Display all products using {#each} with destructuring.",
    "Add filter buttons for each category using array.filter().",
    "Display the total price of displayed products using array.reduce().",
    "Add a search input that filters products by name using string.toLowerCase().includes().",
    "Commit your changes to Git.",
  ]);

  heading(doc, "Summary");
  bullet(doc, "Use const by default, let when reassignment is needed. Avoid var.");
  bullet(doc, "Template literals make string interpolation clean and readable.");
  bullet(doc, "Arrow functions are concise and solve 'this' binding issues.");
  bullet(doc, "map, filter, and reduce are essential for data transformation.");
  bullet(doc, "Destructuring extracts values from objects and arrays concisely.");
  bullet(doc, "The spread operator enables immutable data patterns.");
  bullet(doc, "async/await makes asynchronous code readable and maintainable.");
  bullet(doc, "ES Modules organize code into reusable, importable pieces.");

  addPageNumbers(doc);
  doc.end();
  console.log("  -> module-03-javascript.pdf done");
}

// ─── MODULE 4 ───

function generateModule04() {
  console.log("Generating module-04-svelte-core.pdf ...");
  const doc = createDoc("module-04-svelte-core.pdf");
  modulecover(doc, 4, "Svelte 5 Core Concepts", "Master the runes, reactivity system, and component patterns that make Svelte 5 unique.");

  heading(doc, "Overview");
  para(doc, "Svelte 5 introduces a revolutionary reactivity system based on 'runes' - special function-like primitives that tell the Svelte compiler how to handle reactivity. This module covers every core concept you need to build interactive Svelte 5 applications.");
  para(doc, "If you have used earlier versions of Svelte, forget what you knew about $: reactive declarations and stores. Runes are simpler, more explicit, and more powerful.");

  sectionDivider(doc);

  heading(doc, "Components and .svelte Files");
  para(doc, "A Svelte component is a self-contained unit of UI written in a .svelte file. Each component can contain three sections: a script block for logic, markup for structure, and a style block for presentation.");

  codeBlock(doc, '<script lang="ts">\n  // Logic goes here\n  let greeting = "Hello";\n</script>\n\n<!-- Markup (HTML) goes here -->\n<h1>{greeting}, World!</h1>\n\n<style>\n  /* Scoped styles go here */\n  h1 {\n    color: #ff3e00;\n  }\n</style>', "Svelte");

  para(doc, "The script block uses lang=\"ts\" for TypeScript support (recommended). The markup can include dynamic expressions in curly braces. Styles are automatically scoped to this component.");

  sectionDivider(doc);
  pageBreak(doc);

  heading(doc, "The $state() Rune");
  para(doc, "The $state() rune creates reactive state. When state changes, Svelte automatically updates the DOM. This is the most fundamental rune and the one you will use most often.");

  codeBlock(doc, '<script lang="ts">\n  let count = $state(0);\n  let name = $state("World");\n  let items = $state<string[]>([]);\n\n  // Object state\n  let user = $state({\n    name: "Alice",\n    email: "alice@example.com",\n    preferences: { theme: "dark" }\n  });\n\n  function increment() {\n    count++;  // Direct mutation triggers updates\n  }\n\n  function addItem(item: string) {\n    items.push(item);  // Array mutations work too!\n  }\n\n  function updateTheme(theme: string) {\n    user.preferences.theme = theme;  // Deep mutations are reactive\n  }\n</script>\n\n<button onclick={increment}>Count: {count}</button>\n<p>Hello, {name}!</p>', "Svelte");

  para(doc, "Key insight: In Svelte 5, you can directly mutate state (push, splice, property assignment) and the UI will update. You do not need to reassign the entire variable like in React or previous Svelte versions.");

  subheading(doc, "State with Classes");
  codeBlock(doc, '<script lang="ts">\n  class Counter {\n    value = $state(0);\n\n    increment() {\n      this.value++;\n    }\n\n    reset() {\n      this.value = 0;\n    }\n  }\n\n  const counter = new Counter();\n</script>\n\n<button onclick={() => counter.increment()}>\n  Count: {counter.value}\n</button>', "Svelte");

  sectionDivider(doc);
  pageBreak(doc);

  heading(doc, "The $derived() Rune");
  para(doc, "The $derived() rune creates computed values that automatically update when their dependencies change. Think of it as a formula in a spreadsheet.");

  codeBlock(doc, '<script lang="ts">\n  let price = $state(100);\n  let quantity = $state(2);\n  let taxRate = $state(0.1);\n\n  // Automatically recalculates when price, quantity, or taxRate changes\n  let subtotal = $derived(price * quantity);\n  let tax = $derived(subtotal * taxRate);\n  let total = $derived(subtotal + tax);\n\n  // Derived from arrays\n  let items = $state([5, 10, 15, 20]);\n  let sum = $derived(items.reduce((a, b) => a + b, 0));\n  let average = $derived(sum / items.length);\n\n  // String derived values\n  let firstName = $state("John");\n  let lastName = $state("Doe");\n  let fullName = $derived(`${firstName} ${lastName}`);\n</script>\n\n<p>Subtotal: ${subtotal}</p>\n<p>Tax: ${tax.toFixed(2)}</p>\n<p>Total: ${total.toFixed(2)}</p>', "Svelte");

  subheading(doc, "$derived.by() for Complex Computations");
  para(doc, "When you need more than a single expression, use $derived.by() which takes a function:");
  codeBlock(doc, '<script lang="ts">\n  let items = $state([\n    { name: "Apple", price: 1.50, quantity: 3 },\n    { name: "Banana", price: 0.75, quantity: 6 }\n  ]);\n\n  let summary = $derived.by(() => {\n    const total = items.reduce((sum, item) => {\n      return sum + item.price * item.quantity;\n    }, 0);\n    const count = items.reduce((sum, item) => sum + item.quantity, 0);\n    return { total, count, average: total / count };\n  });\n</script>\n\n<p>Total: ${summary.total.toFixed(2)} for {summary.count} items</p>', "Svelte");

  sectionDivider(doc);
  pageBreak(doc);

  heading(doc, "The $effect() Rune");
  para(doc, "The $effect() rune runs side effects when reactive dependencies change. It automatically tracks which state values you read and re-runs when they change. Effects run after the DOM has updated.");

  codeBlock(doc, '<script lang="ts">\n  let count = $state(0);\n  let query = $state("");\n\n  // Runs whenever count changes\n  $effect(() => {\n    console.log(`Count is now: ${count}`);\n  });\n\n  // Debounced search effect\n  $effect(() => {\n    const trimmed = query.trim();\n    if (trimmed.length < 3) return;\n\n    const timeout = setTimeout(async () => {\n      const response = await fetch(`/api/search?q=${trimmed}`);\n      // handle response...\n    }, 300);\n\n    // Cleanup function - runs before re-executing\n    return () => clearTimeout(timeout);\n  });\n\n  // DOM manipulation effect\n  $effect(() => {\n    document.title = `Count: ${count}`;\n  });\n</script>', "Svelte");

  para(doc, "Important: $effect() should be used sparingly. Prefer $derived() for computed values. Use $effect() only for side effects like DOM manipulation, API calls, logging, or integrating with third-party libraries.");

  sectionDivider(doc);
  pageBreak(doc);

  heading(doc, "The $props() Rune");
  para(doc, "The $props() rune receives properties passed to a component from its parent. It replaces the old 'export let' syntax and provides full TypeScript support.");

  codeBlock(doc, '<!-- UserCard.svelte -->\n<script lang="ts">\n  interface Props {\n    name: string;\n    email: string;\n    avatar?: string;          // Optional\n    role?: "admin" | "user";  // Optional with union type\n  }\n\n  let { name, email, avatar = "/default-avatar.png", role = "user" } = $props<Props>();\n</script>\n\n<div class="card">\n  <img src={avatar} alt={name} />\n  <h3>{name}</h3>\n  <p>{email}</p>\n  <span class="badge">{role}</span>\n</div>', "Svelte");

  codeBlock(doc, '<!-- Parent.svelte - Using the component -->\n<script lang="ts">\n  import UserCard from "$lib/components/UserCard.svelte";\n</script>\n\n<UserCard name="Alice" email="alice@example.com" role="admin" />\n<UserCard name="Bob" email="bob@example.com" />', "Svelte");

  subheading(doc, "Rest Props");
  codeBlock(doc, '<script lang="ts">\n  let { href, children, ...rest } = $props<{\n    href: string;\n    children: any;\n    [key: string]: any;\n  }>();\n</script>\n\n<a {href} {...rest}>{@render children()}</a>', "Svelte");

  sectionDivider(doc);
  pageBreak(doc);

  heading(doc, "The $bindable() Rune");
  para(doc, "$bindable() creates props that can be two-way bound from the parent component using the bind: directive. This is useful for form inputs and interactive components.");

  codeBlock(doc, '<!-- TextInput.svelte -->\n<script lang="ts">\n  let { value = $bindable(""), label, placeholder = "" } = $props<{\n    value: string;\n    label: string;\n    placeholder?: string;\n  }>();\n</script>\n\n<label>\n  {label}\n  <input type="text" bind:value {placeholder} />\n</label>', "Svelte");

  codeBlock(doc, '<!-- Parent.svelte -->\n<script lang="ts">\n  import TextInput from "$lib/components/TextInput.svelte";\n\n  let username = $state("");\n  let email = $state("");\n</script>\n\n<!-- Two-way binding: parent state updates when child input changes -->\n<TextInput bind:value={username} label="Username" />\n<TextInput bind:value={email} label="Email" />\n<p>You entered: {username} ({email})</p>', "Svelte");

  sectionDivider(doc);
  pageBreak(doc);

  heading(doc, "Snippets and {@render}");
  para(doc, "Snippets are Svelte 5's replacement for slots. They let you define reusable chunks of markup within a component or pass markup between components.");

  codeBlock(doc, '<!-- Defining and using snippets locally -->\n<script lang="ts">\n  let items = $state(["Apple", "Banana", "Cherry"]);\n</script>\n\n{#snippet listItem(item: string, index: number)}\n  <li class="item">\n    <span class="index">{index + 1}.</span>\n    <span class="name">{item}</span>\n  </li>\n{/snippet}\n\n<ul>\n  {#each items as item, i}\n    {@render listItem(item, i)}\n  {/each}\n</ul>', "Svelte");

  subheading(doc, "Passing Snippets as Props (Replacing Slots)");
  codeBlock(doc, '<!-- Card.svelte -->\n<script lang="ts">\n  import type { Snippet } from "svelte";\n\n  let { header, children, footer }: {\n    header: Snippet;\n    children: Snippet;\n    footer?: Snippet;\n  } = $props();\n</script>\n\n<div class="card">\n  <div class="card-header">{@render header()}</div>\n  <div class="card-body">{@render children()}</div>\n  {#if footer}\n    <div class="card-footer">{@render footer()}</div>\n  {/if}\n</div>', "Svelte");

  codeBlock(doc, '<!-- Using Card -->\n<Card>\n  {#snippet header()}\n    <h2>Card Title</h2>\n  {/snippet}\n\n  <p>This is the card body content (children).</p>\n\n  {#snippet footer()}\n    <button>Read More</button>\n  {/snippet}\n</Card>', "Svelte");

  sectionDivider(doc);
  pageBreak(doc);

  heading(doc, "Event Handling");
  para(doc, "Svelte 5 simplifies event handling by using standard HTML event attributes (onclick, oninput, etc.) instead of the old on: directive.");

  codeBlock(doc, '<script lang="ts">\n  let count = $state(0);\n  let name = $state("");\n\n  function handleClick(event: MouseEvent) {\n    count++;\n    console.log("Clicked at:", event.clientX, event.clientY);\n  }\n\n  function handleKeydown(event: KeyboardEvent) {\n    if (event.key === "Enter") {\n      console.log("Enter pressed! Name:", name);\n    }\n  }\n</script>\n\n<!-- Inline handler -->\n<button onclick={() => count++}>Count: {count}</button>\n\n<!-- Named handler -->\n<button onclick={handleClick}>Click Me</button>\n\n<!-- Input events -->\n<input\n  type="text"\n  value={name}\n  oninput={(e) => name = e.currentTarget.value}\n  onkeydown={handleKeydown}\n/>', "Svelte");

  sectionDivider(doc);

  heading(doc, "Control Flow: {#if} and {#each}");

  subheading(doc, "Conditional Rendering");
  codeBlock(doc, '<script lang="ts">\n  let loggedIn = $state(false);\n  let role = $state<"admin" | "user" | "guest">("guest");\n</script>\n\n{#if loggedIn}\n  <p>Welcome back!</p>\n  {#if role === "admin"}\n    <a href="/admin">Admin Panel</a>\n  {/if}\n{:else}\n  <p>Please log in.</p>\n  <button onclick={() => loggedIn = true}>Log In</button>\n{/if}', "Svelte");

  subheading(doc, "List Rendering");
  codeBlock(doc, '<script lang="ts">\n  interface Todo {\n    id: number;\n    text: string;\n    done: boolean;\n  }\n\n  let todos = $state<Todo[]>([\n    { id: 1, text: "Learn Svelte", done: false },\n    { id: 2, text: "Build an app", done: false }\n  ]);\n</script>\n\n{#each todos as todo (todo.id)}\n  <div class="todo" class:done={todo.done}>\n    <input type="checkbox" bind:checked={todo.done} />\n    <span>{todo.text}</span>\n  </div>\n{:else}\n  <p>No todos yet. Add one above!</p>\n{/each}', "Svelte");

  para(doc, "Always provide a unique key expression (todo.id) in the {#each} block. This helps Svelte efficiently update the DOM when items are added, removed, or reordered.");

  sectionDivider(doc);
  pageBreak(doc);

  heading(doc, "Module 4 Exercise");
  exercise(doc, "Interactive Todo List", [
    "Create a new SvelteKit project or use your existing one.",
    "Create a TodoList.svelte component with $state() for the todo array and input value.",
    "Add an input field and 'Add' button to create new todos with unique IDs.",
    "Display todos using {#each} with a key, showing checkbox and text.",
    "Use $derived() to calculate completed count, remaining count, and completion percentage.",
    "Add a filter (all/active/completed) using $state() and $derived().",
    "Implement delete functionality with a button on each todo.",
    "Add a 'Clear Completed' button that removes all done todos.",
    "Use $effect() to save todos to localStorage and load them on mount.",
    "Style everything with scoped CSS, including transition effects.",
  ]);

  heading(doc, "Summary");
  bullet(doc, "$state() creates reactive state that can be directly mutated.");
  bullet(doc, "$derived() computes values that update automatically when dependencies change.");
  bullet(doc, "$effect() runs side effects after DOM updates; use sparingly.");
  bullet(doc, "$props() receives typed component properties from parents.");
  bullet(doc, "$bindable() enables two-way data binding between parent and child.");
  bullet(doc, "Snippets replace slots for passing markup between components.");
  bullet(doc, "Event handling uses standard HTML attributes like onclick.");
  bullet(doc, "{#if} and {#each} provide declarative control flow in templates.");

  addPageNumbers(doc);
  doc.end();
  console.log("  -> module-04-svelte-core.pdf done");
}

// ─── MODULE 5 ───

function generateModule05() {
  console.log("Generating module-05-routing.pdf ...");
  const doc = createDoc("module-05-routing.pdf");
  modulecover(doc, 5, "SvelteKit Routing", "Master file-based routing, layouts, server-side data loading, and dynamic routes.");

  heading(doc, "Overview");
  para(doc, "SvelteKit uses a file-based routing system where the structure of your src/routes/ directory maps directly to the URLs of your application. This approach is intuitive, scalable, and eliminates the need for a separate router configuration file. In this module, you will learn every routing concept you need to build complex multi-page applications.");

  sectionDivider(doc);

  heading(doc, "File-Based Routing");
  para(doc, "Every route in your application corresponds to a directory inside src/routes/. The URL path is determined by the directory structure:");

  codeBlock(doc, "src/routes/\n├── +page.svelte              → /\n├── about/\n│   └── +page.svelte          → /about\n├── blog/\n│   ├── +page.svelte          → /blog\n│   └── [slug]/\n│       └── +page.svelte      → /blog/my-first-post\n├── dashboard/\n│   ├── +page.svelte          → /dashboard\n│   ├── settings/\n│   │   └── +page.svelte      → /dashboard/settings\n│   └── profile/\n│       └── +page.svelte      → /dashboard/profile\n└── api/\n    └── users/\n        └── +server.ts         → /api/users (API endpoint)", "Project Structure");

  para(doc, "Each directory can contain special files that SvelteKit recognizes. These files follow a naming convention that starts with a plus sign (+).");

  sectionDivider(doc);

  heading(doc, "+page.svelte - Page Components");
  para(doc, "The +page.svelte file defines the UI for a route. It is a regular Svelte component that renders when the user navigates to that URL.");

  codeBlock(doc, '<!-- src/routes/about/+page.svelte -->\n<script lang="ts">\n  // Component logic\n  let title = "About Us";\n</script>\n\n<svelte:head>\n  <title>{title}</title>\n  <meta name="description" content="Learn about our company" />\n</svelte:head>\n\n<main>\n  <h1>{title}</h1>\n  <p>Welcome to our about page.</p>\n</main>\n\n<style>\n  main {\n    max-width: 800px;\n    margin: 0 auto;\n    padding: 2rem;\n  }\n</style>', "Svelte");

  sectionDivider(doc);
  pageBreak(doc);

  heading(doc, "+layout.svelte - Shared Layouts");
  para(doc, "Layout files wrap page components and persist across navigations. They are perfect for navigation bars, sidebars, and footers that appear on every page.");

  codeBlock(doc, '<!-- src/routes/+layout.svelte -->\n<script lang="ts">\n  import type { Snippet } from "svelte";\n\n  let { children }: { children: Snippet } = $props();\n</script>\n\n<header>\n  <nav>\n    <a href="/">Home</a>\n    <a href="/about">About</a>\n    <a href="/blog">Blog</a>\n    <a href="/dashboard">Dashboard</a>\n  </nav>\n</header>\n\n<main>\n  {@render children()}\n</main>\n\n<footer>\n  <p>&copy; 2025 My App. All rights reserved.</p>\n</footer>\n\n<style>\n  header { padding: 1rem 2rem; background: #f5f5f5; }\n  nav { display: flex; gap: 1rem; }\n  main { min-height: 80vh; padding: 2rem; }\n  footer { padding: 1rem 2rem; text-align: center; color: #666; }\n</style>', "Svelte");

  para(doc, "Layouts are hierarchical. A layout in src/routes/dashboard/+layout.svelte will nest inside the root layout, allowing you to create layout hierarchies for different sections of your app.");

  subheading(doc, "Nested Layouts");
  codeBlock(doc, '<!-- src/routes/dashboard/+layout.svelte -->\n<script lang="ts">\n  import type { Snippet } from "svelte";\n  let { children }: { children: Snippet } = $props();\n</script>\n\n<div class="dashboard">\n  <aside>\n    <nav>\n      <a href="/dashboard">Overview</a>\n      <a href="/dashboard/settings">Settings</a>\n      <a href="/dashboard/profile">Profile</a>\n    </nav>\n  </aside>\n  <section>\n    {@render children()}\n  </section>\n</div>\n\n<style>\n  .dashboard { display: grid; grid-template-columns: 250px 1fr; }\n  aside { background: #1a1a2e; color: white; padding: 2rem; }\n  section { padding: 2rem; }\n</style>', "Svelte");

  sectionDivider(doc);
  pageBreak(doc);

  heading(doc, "+page.server.ts - Server-Side Data Loading");
  para(doc, "The +page.server.ts file runs exclusively on the server. Its load function fetches data that the page component can access via $props(). This is SvelteKit's primary data loading mechanism.");

  codeBlock(doc, '// src/routes/blog/+page.server.ts\nimport type { PageServerLoad } from "./$types";\n\nexport const load: PageServerLoad = async ({ fetch }) => {\n  const response = await fetch("/api/posts");\n  const posts = await response.json();\n\n  return {\n    posts,\n    totalCount: posts.length\n  };\n};', "TypeScript");

  codeBlock(doc, '<!-- src/routes/blog/+page.svelte -->\n<script lang="ts">\n  // Data from +page.server.ts load function\n  let { data } = $props();\n</script>\n\n<h1>Blog ({data.totalCount} posts)</h1>\n\n{#each data.posts as post}\n  <article>\n    <h2><a href="/blog/{post.slug}">{post.title}</a></h2>\n    <p>{post.excerpt}</p>\n  </article>\n{/each}', "Svelte");

  para(doc, "The load function has access to useful parameters including fetch (a special fetch that works server-side), params (route parameters), cookies, url, and the request object.");

  sectionDivider(doc);

  heading(doc, "+layout.server.ts - Layout Data Loading");
  para(doc, "Just like pages, layouts can have server-side load functions. Layout data is available to all child pages and nested layouts.");

  codeBlock(doc, '// src/routes/+layout.server.ts\nimport type { LayoutServerLoad } from "./$types";\n\nexport const load: LayoutServerLoad = async ({ cookies }) => {\n  const sessionId = cookies.get("session_id");\n\n  if (sessionId) {\n    const user = await getUser(sessionId);  // Your auth logic\n    return { user };\n  }\n\n  return { user: null };\n};', "TypeScript");

  codeBlock(doc, '<!-- Any page can access layout data -->\n<script lang="ts">\n  let { data } = $props();\n  // data.user is available from the layout load function\n</script>\n\n{#if data.user}\n  <p>Welcome, {data.user.name}!</p>\n{:else}\n  <a href="/login">Log In</a>\n{/if}', "Svelte");

  sectionDivider(doc);
  pageBreak(doc);

  heading(doc, "Dynamic Routes with [slug]");
  para(doc, "Dynamic route segments are defined by wrapping a directory name in square brackets. The value is captured as a parameter and available in load functions.");

  codeBlock(doc, "src/routes/\n├── blog/\n│   ├── +page.svelte           → /blog (list all posts)\n│   └── [slug]/\n│       ├── +page.svelte        → /blog/my-post (single post)\n│       └── +page.server.ts     → Server data loading\n├── users/\n│   └── [id]/\n│       └── +page.svelte        → /users/123", "Project Structure");

  codeBlock(doc, '// src/routes/blog/[slug]/+page.server.ts\nimport type { PageServerLoad } from "./$types";\nimport { error } from "@sveltejs/kit";\n\nexport const load: PageServerLoad = async ({ params }) => {\n  const { slug } = params;  // e.g., "my-first-post"\n\n  const post = await getPostBySlug(slug);  // Your data fetching\n\n  if (!post) {\n    error(404, { message: "Post not found" });\n  }\n\n  return { post };\n};', "TypeScript");

  subheading(doc, "Rest Parameters");
  para(doc, "Catch all remaining path segments with [...rest]:");
  codeBlock(doc, "// src/routes/docs/[...path]/+page.svelte\n// Matches: /docs/getting-started\n//          /docs/api/reference/v2\n//          /docs/anything/nested/deeply", "");

  sectionDivider(doc);
  pageBreak(doc);

  heading(doc, "Route Groups");
  para(doc, "Route groups let you organize routes without affecting the URL structure. A group is created by wrapping a directory name in parentheses.");

  codeBlock(doc, "src/routes/\n├── (marketing)/              # Group - not in URL\n│   ├── +layout.svelte        # Marketing layout\n│   ├── +page.svelte          → /\n│   ├── about/\n│   │   └── +page.svelte      → /about\n│   └── pricing/\n│       └── +page.svelte      → /pricing\n├── (app)/                    # Group - not in URL\n│   ├── +layout.svelte        # App layout (with sidebar)\n│   ├── dashboard/\n│   │   └── +page.svelte      → /dashboard\n│   └── settings/\n│       └── +page.svelte      → /settings", "Project Structure");

  para(doc, "This is powerful because the marketing pages and app pages can have completely different layouts without sharing URL prefixes. The (marketing) group uses a simple header/footer layout, while the (app) group uses a sidebar layout.");

  sectionDivider(doc);

  heading(doc, "Error Pages");
  para(doc, "SvelteKit provides built-in error handling through +error.svelte files. These display when an error occurs during loading or rendering.");

  codeBlock(doc, '<!-- src/routes/+error.svelte -->\n<script lang="ts">\n  import { page } from "$app/stores";\n</script>\n\n<div class="error">\n  <h1>{$page.status}</h1>\n  <p>{$page.error?.message}</p>\n  <a href="/">Go Home</a>\n</div>\n\n<style>\n  .error {\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    justify-content: center;\n    min-height: 60vh;\n    text-align: center;\n  }\n  h1 { font-size: 4rem; color: #ff3e00; }\n</style>', "Svelte");

  para(doc, "Error pages follow the layout hierarchy. You can have specific error pages at different levels: a root +error.svelte for general errors, and nested +error.svelte files for section-specific error handling.");

  subheading(doc, "Throwing Errors in Load Functions");
  codeBlock(doc, 'import { error, redirect } from "@sveltejs/kit";\n\nexport const load = async ({ params, locals }) => {\n  // 404 error\n  if (!found) {\n    error(404, { message: "Page not found" });\n  }\n\n  // 403 error\n  if (!locals.user) {\n    error(403, { message: "You must be logged in" });\n  }\n\n  // Redirect instead of error\n  if (shouldRedirect) {\n    redirect(307, "/login");\n  }\n};', "TypeScript");

  sectionDivider(doc);
  pageBreak(doc);

  heading(doc, "Module 5 Exercise");
  exercise(doc, "Multi-Page Application", [
    "Create a new SvelteKit project with a root layout containing a navigation bar.",
    "Create these routes: / (home), /about, /blog, /blog/[slug], /contact.",
    "Create a (marketing) route group for /, /about, and /contact with a simple layout.",
    "Create a +page.server.ts for /blog that returns a list of mock blog posts.",
    "Create a dynamic /blog/[slug] route that loads a single post.",
    "Add a 404 error page with a custom +error.svelte.",
    "Add svelte:head with title and meta tags to each page.",
    "Test navigation between all pages and verify data loading works.",
    "Commit your changes to Git.",
  ]);

  heading(doc, "Summary");
  bullet(doc, "SvelteKit uses file-based routing where directory structure maps to URLs.");
  bullet(doc, "+page.svelte defines the UI for each route.");
  bullet(doc, "+layout.svelte creates persistent, hierarchical layouts.");
  bullet(doc, "+page.server.ts loads data on the server, available to pages via $props().");
  bullet(doc, "Dynamic routes [slug] capture URL segments as parameters.");
  bullet(doc, "Route groups (name) organize files without affecting URLs.");
  bullet(doc, "+error.svelte provides custom error pages at any level.");

  addPageNumbers(doc);
  doc.end();
  console.log("  -> module-05-routing.pdf done");
}

// ─── MODULE 6 ───

function generateModule06() {
  console.log("Generating module-06-forms.pdf ...");
  const doc = createDoc("module-06-forms.pdf");
  modulecover(doc, 6, "Forms & Server Actions", "Build full-stack forms with server-side validation, progressive enhancement, and secure data handling.");

  heading(doc, "Overview");
  para(doc, "Forms are the backbone of interactive web applications. SvelteKit provides a powerful form handling system that works with progressive enhancement - your forms work without JavaScript, then get enhanced when JS is available. In this module, you will learn how to build secure, validated forms with server actions.");

  sectionDivider(doc);

  heading(doc, "HTML Forms in SvelteKit");
  para(doc, "SvelteKit forms use standard HTML form elements. The key difference is that form submissions are handled by server-side actions, not client-side JavaScript.");

  codeBlock(doc, '<!-- src/routes/login/+page.svelte -->\n<script lang="ts">\n  let { form } = $props();\n</script>\n\n{#if form?.error}\n  <p class="error">{form.error}</p>\n{/if}\n\n<form method="POST">\n  <label>\n    Email\n    <input type="email" name="email" value={form?.email ?? ""} required />\n  </label>\n\n  <label>\n    Password\n    <input type="password" name="password" required />\n  </label>\n\n  <button type="submit">Log In</button>\n</form>\n\n<style>\n  .error { color: #ff3e00; padding: 0.5rem; background: #fff0f0; }\n  form { display: flex; flex-direction: column; gap: 1rem; max-width: 400px; }\n  label { display: flex; flex-direction: column; gap: 0.25rem; }\n  input { padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px; }\n</style>', "Svelte");

  para(doc, "Notice that we use standard HTML: method=\"POST\", name attributes on inputs, and a submit button. The form's action attribute defaults to the current page URL. SvelteKit intercepts the submission and routes it to the server action.");

  sectionDivider(doc);
  pageBreak(doc);

  heading(doc, "Form Actions (+page.server.ts)");
  para(doc, "Form actions are server-side functions that handle form submissions. They are defined in +page.server.ts alongside the load function.");

  subheading(doc, "Default Action");
  codeBlock(doc, '// src/routes/login/+page.server.ts\nimport type { Actions } from "./$types";\nimport { fail, redirect } from "@sveltejs/kit";\n\nexport const actions: Actions = {\n  default: async ({ request, cookies }) => {\n    const data = await request.formData();\n    const email = data.get("email") as string;\n    const password = data.get("password") as string;\n\n    // Validation\n    if (!email || !email.includes("@")) {\n      return fail(400, {\n        error: "Please enter a valid email address.",\n        email  // Return email so the form can repopulate it\n      });\n    }\n\n    if (!password || password.length < 8) {\n      return fail(400, {\n        error: "Password must be at least 8 characters.",\n        email\n      });\n    }\n\n    // Authentication logic\n    const user = await authenticateUser(email, password);\n\n    if (!user) {\n      return fail(401, {\n        error: "Invalid email or password.",\n        email\n      });\n    }\n\n    // Set session cookie\n    cookies.set("session_id", user.sessionId, {\n      path: "/",\n      httpOnly: true,\n      sameSite: "lax",\n      secure: true,\n      maxAge: 60 * 60 * 24 * 7  // 1 week\n    });\n\n    // Redirect to dashboard\n    redirect(303, "/dashboard");\n  }\n};', "TypeScript");

  sectionDivider(doc);
  pageBreak(doc);

  subheading(doc, "Named Actions");
  para(doc, "You can define multiple named actions for a single page. This is useful when a page has multiple forms.");

  codeBlock(doc, '// src/routes/todos/+page.server.ts\nimport type { Actions, PageServerLoad } from "./$types";\nimport { fail } from "@sveltejs/kit";\n\nexport const load: PageServerLoad = async () => {\n  const todos = await getTodos();\n  return { todos };\n};\n\nexport const actions: Actions = {\n  create: async ({ request }) => {\n    const data = await request.formData();\n    const text = data.get("text") as string;\n\n    if (!text?.trim()) {\n      return fail(400, { error: "Todo text is required" });\n    }\n\n    await createTodo(text.trim());\n    return { success: true };\n  },\n\n  delete: async ({ request }) => {\n    const data = await request.formData();\n    const id = data.get("id") as string;\n    await deleteTodo(id);\n    return { success: true };\n  },\n\n  toggle: async ({ request }) => {\n    const data = await request.formData();\n    const id = data.get("id") as string;\n    await toggleTodo(id);\n    return { success: true };\n  }\n};', "TypeScript");

  codeBlock(doc, '<!-- src/routes/todos/+page.svelte -->\n<!-- Use ?/ prefix for named actions -->\n<form method="POST" action="?/create">\n  <input type="text" name="text" placeholder="Add a todo..." />\n  <button>Add</button>\n</form>\n\n{#each data.todos as todo}\n  <div>\n    <form method="POST" action="?/toggle">\n      <input type="hidden" name="id" value={todo.id} />\n      <button>{todo.done ? "Undo" : "Done"}</button>\n    </form>\n    <span>{todo.text}</span>\n    <form method="POST" action="?/delete">\n      <input type="hidden" name="id" value={todo.id} />\n      <button>Delete</button>\n    </form>\n  </div>\n{/each}', "Svelte");

  sectionDivider(doc);
  pageBreak(doc);

  heading(doc, "Validation with fail()");
  para(doc, "The fail() function returns validation errors to the client without redirecting. The data you return is available as the 'form' prop in the page component.");

  codeBlock(doc, '// Comprehensive validation example\nexport const actions: Actions = {\n  register: async ({ request }) => {\n    const data = await request.formData();\n    const name = data.get("name") as string;\n    const email = data.get("email") as string;\n    const password = data.get("password") as string;\n    const confirm = data.get("confirm") as string;\n\n    const errors: Record<string, string> = {};\n\n    if (!name || name.length < 2) {\n      errors.name = "Name must be at least 2 characters";\n    }\n\n    if (!email || !email.includes("@")) {\n      errors.email = "Valid email is required";\n    }\n\n    if (!password || password.length < 8) {\n      errors.password = "Password must be at least 8 characters";\n    }\n\n    if (password !== confirm) {\n      errors.confirm = "Passwords do not match";\n    }\n\n    if (Object.keys(errors).length > 0) {\n      return fail(400, {\n        errors,\n        name,\n        email  // Do NOT return password\n      });\n    }\n\n    await createUser(name, email, password);\n    redirect(303, "/login?registered=true");\n  }\n};', "TypeScript");

  codeBlock(doc, '<!-- Display field-level errors -->\n<script lang="ts">\n  let { form } = $props();\n</script>\n\n<form method="POST" action="?/register">\n  <label>\n    Name\n    <input name="name" value={form?.name ?? ""} />\n    {#if form?.errors?.name}\n      <span class="error">{form.errors.name}</span>\n    {/if}\n  </label>\n\n  <label>\n    Email\n    <input type="email" name="email" value={form?.email ?? ""} />\n    {#if form?.errors?.email}\n      <span class="error">{form.errors.email}</span>\n    {/if}\n  </label>\n\n  <!-- Password fields... -->\n  <button>Register</button>\n</form>', "Svelte");

  sectionDivider(doc);
  pageBreak(doc);

  heading(doc, "Progressive Enhancement with use:enhance");
  para(doc, "The use:enhance directive progressively enhances your forms with JavaScript. Without it, forms work as standard HTML forms (full page reload). With it, submissions are handled via fetch with no page reload.");

  codeBlock(doc, '<script lang="ts">\n  import { enhance } from "$app/forms";\n\n  let { form } = $props();\n  let submitting = $state(false);\n</script>\n\n<!-- Basic enhancement -->\n<form method="POST" use:enhance>\n  <!-- Form automatically submits via fetch, no page reload -->\n</form>\n\n<!-- Custom enhancement with callbacks -->\n<form\n  method="POST"\n  action="?/create"\n  use:enhance={() => {\n    submitting = true;\n\n    return async ({ update, result }) => {\n      submitting = false;\n\n      if (result.type === "success") {\n        // Custom success handling\n        console.log("Todo created!");\n      }\n\n      await update();  // Apply the default behavior\n    };\n  }}\n>\n  <input type="text" name="text" />\n  <button disabled={submitting}>\n    {submitting ? "Saving..." : "Add Todo"}\n  </button>\n</form>', "Svelte");

  para(doc, "The enhance callback receives the form and cancel function. The return function receives the result and an update function. The result.type can be 'success', 'failure', 'redirect', or 'error'.");

  sectionDivider(doc);

  heading(doc, "Redirects");
  para(doc, "Use the redirect() function from @sveltejs/kit to redirect after successful form submissions or in load functions.");

  codeBlock(doc, 'import { redirect } from "@sveltejs/kit";\n\n// In a form action (after successful submission)\nredirect(303, "/dashboard");\n\n// In a load function (e.g., auth guard)\nexport const load = async ({ locals }) => {\n  if (!locals.user) {\n    redirect(307, "/login");\n  }\n  return { user: locals.user };\n};', "TypeScript");

  para(doc, "Status codes matter: Use 303 for POST-redirect-GET (after form submission). Use 307 for temporary redirects that preserve the HTTP method. Use 308 for permanent redirects.");

  sectionDivider(doc);
  pageBreak(doc);

  heading(doc, "Module 6 Exercise");
  exercise(doc, "Contact Form with Validation", [
    "Create a /contact route with a +page.svelte and +page.server.ts.",
    "Build a form with fields: name, email, subject (dropdown), and message (textarea).",
    "Implement server-side validation in the form action: all fields required, email must be valid, message must be at least 20 characters.",
    "Return field-level errors using fail() and display them next to each field.",
    "Repopulate the form with submitted values on validation failure.",
    "Show a success message when the form submits successfully.",
    "Add use:enhance for progressive enhancement with a loading state.",
    "Style the form with proper spacing, focus states, and error styling.",
    "Test that the form works both with and without JavaScript.",
    "Commit your changes to Git.",
  ]);

  heading(doc, "Summary");
  bullet(doc, "SvelteKit forms use standard HTML with method=\"POST\" and name attributes.");
  bullet(doc, "Form actions in +page.server.ts handle submissions on the server.");
  bullet(doc, "Named actions (?/actionName) allow multiple forms per page.");
  bullet(doc, "fail() returns validation errors without redirecting.");
  bullet(doc, "use:enhance adds progressive enhancement with fetch-based submissions.");
  bullet(doc, "redirect() navigates after successful submissions with proper status codes.");

  addPageNumbers(doc);
  doc.end();
  console.log("  -> module-06-forms.pdf done");
}

// ─── MODULE 7 ───

function generateModule07() {
  console.log("Generating module-07-styling-animations.pdf ...");
  const doc = createDoc("module-07-styling-animations.pdf");
  modulecover(doc, 7, "Styling & Animations", "Create stunning visual experiences with CSS scoping, Svelte transitions, GSAP, and ScrollTrigger.");

  heading(doc, "Overview");
  para(doc, "Great applications are not just functional - they are beautiful and feel alive. In this module, you will learn advanced CSS techniques in Svelte, built-in transition directives, and how to integrate GSAP (GreenSock Animation Platform) for professional-grade animations. By the end, you will build an animated landing section with scroll-triggered effects.");

  sectionDivider(doc);

  heading(doc, "Advanced CSS Scoping");
  para(doc, "You already learned the basics of Svelte's scoped styles in Module 2. Now let us explore advanced patterns.");

  subheading(doc, "The :global() Modifier");
  para(doc, "The :global() modifier breaks out of Svelte's scoping. Use it carefully and only when necessary.");

  codeBlock(doc, '<style>\n  /* Scoped: only affects <p> in this component */\n  p { color: #333; }\n\n  /* Global: affects all <body> elements */\n  :global(body) {\n    margin: 0;\n    font-family: system-ui;\n  }\n\n  /* Scoped parent, global child */\n  .container :global(h2) {\n    /* Affects all h2 inside .container, even from child components */\n    color: #7c3aed;\n  }\n\n  /* Global block - everything inside is global */\n  :global {\n    .prose h1 { font-size: 2.5rem; }\n    .prose p { line-height: 1.8; }\n    .prose code { background: #f0f0f5; padding: 0.2rem 0.4rem; }\n  }\n</style>', "Svelte");

  subheading(doc, "Dynamic Classes and Styles");
  codeBlock(doc, '<script lang="ts">\n  let isActive = $state(false);\n  let theme = $state<"light" | "dark">("light");\n  let progress = $state(0);\n</script>\n\n<!-- class: directive -->\n<div class:active={isActive}>Toggle me</div>\n\n<!-- Multiple dynamic classes -->\n<div\n  class="card"\n  class:active={isActive}\n  class:dark={theme === "dark"}\n>Content</div>\n\n<!-- Dynamic style with CSS variables -->\n<div style:--progress="{progress}%">\n  <div class="bar"></div>\n</div>\n\n<style>\n  .bar {\n    width: var(--progress);\n    height: 4px;\n    background: #00d4ff;\n    transition: width 0.3s ease;\n  }\n</style>', "Svelte");

  sectionDivider(doc);
  pageBreak(doc);

  heading(doc, "Svelte Transitions");
  para(doc, "Svelte includes built-in transition directives that animate elements as they enter and leave the DOM. These are declarative, performant, and incredibly easy to use.");

  codeBlock(doc, '<script lang="ts">\n  import { fade, fly, slide, scale, blur } from "svelte/transition";\n  import { quintOut, elasticOut } from "svelte/easing";\n\n  let visible = $state(true);\n</script>\n\n<button onclick={() => visible = !visible}>Toggle</button>\n\n{#if visible}\n  <!-- Basic fade -->\n  <div transition:fade>Fade in/out</div>\n\n  <!-- Fly from direction -->\n  <div transition:fly={{ y: 50, duration: 400 }}>Fly up</div>\n\n  <!-- Scale with easing -->\n  <div transition:scale={{ start: 0.5, easing: elasticOut }}>Scale</div>\n\n  <!-- Slide (accordion effect) -->\n  <div transition:slide={{ duration: 300 }}>Slide</div>\n\n  <!-- Blur -->\n  <div transition:blur={{ amount: 10 }}>Blur</div>\n{/if}', "Svelte");

  subheading(doc, "In/Out Transitions");
  para(doc, "Use in: and out: for separate enter and exit animations:");
  codeBlock(doc, '{#if visible}\n  <div\n    in:fly={{ y: -20, duration: 400, delay: 200 }}\n    out:fade={{ duration: 200 }}\n  >\n    Different enter and exit animations\n  </div>\n{/if}', "Svelte");

  subheading(doc, "Transition Events");
  codeBlock(doc, '<div\n  transition:fly={{ y: 50 }}\n  onintrostart={() => console.log("enter started")}\n  onintroend={() => console.log("enter complete")}\n  onoutrostart={() => console.log("exit started")}\n  onoutroend={() => console.log("exit complete")}\n>\n  Animated element\n</div>', "Svelte");

  sectionDivider(doc);
  pageBreak(doc);

  heading(doc, "GSAP Integration");
  para(doc, "GSAP (GreenSock Animation Platform) is the industry-standard JavaScript animation library. It provides timeline-based animations, scroll triggers, and physics-based motion that go far beyond what CSS transitions can achieve.");

  subheading(doc, "Installing GSAP");
  terminalBlock(doc, "pnpm add gsap");

  subheading(doc, "Basic GSAP Animations");
  codeBlock(doc, '<script lang="ts">\n  import { gsap } from "gsap";\n\n  let heroRef: HTMLElement;\n  let titleRef: HTMLElement;\n  let subtitleRef: HTMLElement;\n\n  $effect(() => {\n    const ctx = gsap.context(() => {\n      // Animate title\n      gsap.from(titleRef, {\n        y: 60,\n        opacity: 0,\n        duration: 1,\n        ease: "power3.out"\n      });\n\n      // Animate subtitle with delay\n      gsap.from(subtitleRef, {\n        y: 40,\n        opacity: 0,\n        duration: 0.8,\n        delay: 0.3,\n        ease: "power3.out"\n      });\n    }, heroRef);  // Scope to heroRef\n\n    // Cleanup on unmount\n    return () => ctx.revert();\n  });\n</script>\n\n<section bind:this={heroRef}>\n  <h1 bind:this={titleRef}>Welcome</h1>\n  <p bind:this={subtitleRef}>Build amazing things.</p>\n</section>', "Svelte");

  subheading(doc, "GSAP Timelines");
  para(doc, "Timelines let you sequence multiple animations with precise control:");
  codeBlock(doc, '<script lang="ts">\n  import { gsap } from "gsap";\n\n  let containerRef: HTMLElement;\n\n  $effect(() => {\n    const ctx = gsap.context(() => {\n      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });\n\n      tl.from(".hero-title", { y: 80, opacity: 0, duration: 1 })\n        .from(".hero-subtitle", { y: 50, opacity: 0, duration: 0.8 }, "-=0.5")\n        .from(".hero-cta", { scale: 0.8, opacity: 0, duration: 0.6 }, "-=0.3")\n        .from(".hero-image", { x: 100, opacity: 0, duration: 1 }, "-=0.8");\n    }, containerRef);\n\n    return () => ctx.revert();\n  });\n</script>', "Svelte");

  sectionDivider(doc);
  pageBreak(doc);

  heading(doc, "ScrollTrigger Animations");
  para(doc, "ScrollTrigger is a GSAP plugin that triggers animations based on scroll position. It is essential for modern landing pages and storytelling experiences.");

  subheading(doc, "Setting Up ScrollTrigger");
  codeBlock(doc, '<script lang="ts">\n  import { gsap } from "gsap";\n  import { ScrollTrigger } from "gsap/ScrollTrigger";\n\n  // Register the plugin\n  gsap.registerPlugin(ScrollTrigger);\n\n  let sectionRef: HTMLElement;\n\n  $effect(() => {\n    const ctx = gsap.context(() => {\n      // Fade in cards as they enter viewport\n      gsap.from(".feature-card", {\n        y: 80,\n        opacity: 0,\n        duration: 0.8,\n        stagger: 0.2,  // 0.2s delay between each card\n        ease: "power2.out",\n        scrollTrigger: {\n          trigger: ".features-section",\n          start: "top 80%",   // When top of trigger hits 80% of viewport\n          end: "bottom 20%",  // When bottom hits 20% of viewport\n          toggleActions: "play none none reverse"\n        }\n      });\n\n      // Parallax effect\n      gsap.to(".parallax-bg", {\n        yPercent: -30,\n        ease: "none",\n        scrollTrigger: {\n          trigger: ".parallax-section",\n          start: "top bottom",\n          end: "bottom top",\n          scrub: true  // Ties animation to scroll position\n        }\n      });\n    }, sectionRef);\n\n    return () => ctx.revert();\n  });\n</script>', "Svelte");

  subheading(doc, "ScrollTrigger Options Explained");
  bullet(doc, "trigger: The element that triggers the animation when scrolled into view.");
  bullet(doc, "start/end: Define the scroll range. Format: 'element-position viewport-position'.");
  bullet(doc, "toggleActions: Four states - onEnter, onLeave, onEnterBack, onLeaveBack. Values: play, pause, resume, restart, reset, complete, reverse, none.");
  bullet(doc, "scrub: When true (or a number for smoothing), ties animation progress directly to scroll position.");
  bullet(doc, "pin: When true, pins the trigger element in place during the animation.");
  bullet(doc, "markers: Set to true during development to visualize trigger points.");

  sectionDivider(doc);
  pageBreak(doc);

  heading(doc, "$effect() for Animation Cleanup");
  para(doc, "Proper cleanup is critical when using GSAP in Svelte components. Without cleanup, animations can persist after the component is destroyed, causing memory leaks and visual glitches.");

  codeBlock(doc, '<script lang="ts">\n  import { gsap } from "gsap";\n  import { ScrollTrigger } from "gsap/ScrollTrigger";\n\n  gsap.registerPlugin(ScrollTrigger);\n\n  let ref: HTMLElement;\n\n  $effect(() => {\n    // gsap.context() scopes all animations created inside it\n    const ctx = gsap.context(() => {\n      // All GSAP code here is automatically tracked\n      gsap.to(".element", { x: 100 });\n\n      ScrollTrigger.create({\n        trigger: ".section",\n        onEnter: () => console.log("entered")\n      });\n\n      gsap.timeline()\n        .to(".a", { y: 50 })\n        .to(".b", { rotation: 360 });\n    }, ref);\n\n    // ctx.revert() kills ALL animations and ScrollTriggers\n    // created within the context\n    return () => ctx.revert();\n  });\n</script>', "Svelte");

  para(doc, "The gsap.context() method is the recommended way to manage GSAP animations in component-based frameworks. It tracks all animations created within it and provides a single revert() call that cleans everything up.");

  subheading(doc, "Common Cleanup Mistakes");
  bullet(doc, "Forgetting to return a cleanup function from $effect() - animations persist after navigation.");
  bullet(doc, "Using gsap.killTweensOf() instead of context - misses ScrollTrigger instances.");
  bullet(doc, "Creating ScrollTriggers outside of $effect() - they run before the DOM is ready.");
  bullet(doc, "Not scoping the context to a ref element - animations may target wrong elements.");

  sectionDivider(doc);
  pageBreak(doc);

  heading(doc, "Module 7 Exercise");
  exercise(doc, "Animated Landing Section", [
    "Create a new route /landing with a full-page hero section.",
    "Add a hero title, subtitle, and CTA button. Animate them in sequence using a GSAP timeline.",
    "Create a features section below with 3-4 cards.",
    "Use ScrollTrigger to animate the feature cards as they scroll into view with stagger.",
    "Add a parallax background effect to a section using scrub.",
    "Include Svelte transition:fly on toggle-able elements (e.g., a modal or dropdown).",
    "Use CSS custom properties for theming (colors, spacing).",
    "Ensure all GSAP animations are properly cleaned up with gsap.context() and $effect().",
    "Test the animations at different scroll speeds and viewport sizes.",
    "Commit your changes to Git.",
  ]);

  heading(doc, "Summary");
  bullet(doc, ":global() breaks out of Svelte's CSS scoping when needed.");
  bullet(doc, "Svelte transitions (fade, fly, slide, scale) animate DOM enter/exit.");
  bullet(doc, "GSAP provides professional-grade timeline and physics-based animations.");
  bullet(doc, "ScrollTrigger ties animations to scroll position for immersive experiences.");
  bullet(doc, "$effect() with gsap.context() ensures proper animation lifecycle management.");
  bullet(doc, "Always return a cleanup function from $effect() to prevent memory leaks.");

  addPageNumbers(doc);
  doc.end();
  console.log("  -> module-07-styling-animations.pdf done");
}

// ─── MODULE 8 ───

function generateModule08() {
  console.log("Generating module-08-deployment.pdf ...");
  const doc = createDoc("module-08-deployment.pdf");
  modulecover(doc, 8, "Deployment", "Ship your SvelteKit application to the world with optimized builds, SEO, and cloud hosting.");

  heading(doc, "Overview");
  para(doc, "You have built an amazing application - now it is time to share it with the world. In this final module, you will learn how to build your application for production, configure adapters for different hosting platforms, manage environment variables securely, optimize for SEO, and deploy to Vercel and Netlify.");

  sectionDivider(doc);

  heading(doc, "Building for Production");
  para(doc, "The build command compiles your Svelte components, optimizes your code, and produces a production-ready output.");
  terminalBlock(doc, "# Build the application\npnpm build\n\n# Preview the production build locally\npnpm preview");
  para(doc, "The build process performs several optimizations:");
  bullet(doc, "Tree-shaking: Removes unused code from your bundle.");
  bullet(doc, "Minification: Compresses JavaScript and CSS for smaller file sizes.");
  bullet(doc, "Code splitting: Creates separate chunks for different routes, loaded on demand.");
  bullet(doc, "Asset hashing: Adds content hashes to filenames for optimal caching.");
  bullet(doc, "SSR: Pre-renders pages on the server for faster initial loads.");

  subheading(doc, "Analyzing Your Build");
  terminalBlock(doc, "# Install the bundle analyzer\npnpm add -D rollup-plugin-visualizer\n\n# Build with analysis\npnpm build\n\n# The analyzer generates an HTML report you can open in your browser");
  para(doc, "Keep an eye on your bundle sizes. A good target is under 100KB of JavaScript for the initial page load. Use dynamic imports for heavy libraries that are not needed immediately.");

  sectionDivider(doc);
  pageBreak(doc);

  heading(doc, "SvelteKit Adapters");
  para(doc, "Adapters transform your SvelteKit application for different deployment targets. The adapter determines how your app is served - as a Node.js server, serverless functions, static files, or edge functions.");

  subheading(doc, "adapter-auto (Default)");
  para(doc, "The auto adapter detects your deployment platform and selects the appropriate adapter automatically. It works with Vercel, Netlify, and Cloudflare Pages out of the box.");
  codeBlock(doc, '// svelte.config.js\nimport adapter from "@sveltejs/adapter-auto";\n\nexport default {\n  kit: {\n    adapter: adapter()\n  }\n};', "JavaScript");

  subheading(doc, "adapter-node");
  para(doc, "For traditional Node.js servers (VPS, Docker, Railway, Fly.io):");
  terminalBlock(doc, "pnpm add -D @sveltejs/adapter-node");
  codeBlock(doc, '// svelte.config.js\nimport adapter from "@sveltejs/adapter-node";\n\nexport default {\n  kit: {\n    adapter: adapter({\n      out: "build",\n      precompress: true  // Generate .gz and .br files\n    })\n  }\n};', "JavaScript");
  terminalBlock(doc, "# Run the production server\nnode build/index.js\n\n# Or with environment variables\nPORT=3000 HOST=0.0.0.0 node build/index.js");

  subheading(doc, "adapter-static");
  para(doc, "For fully static sites (GitHub Pages, S3, any static host):");
  terminalBlock(doc, "pnpm add -D @sveltejs/adapter-static");
  codeBlock(doc, '// svelte.config.js\nimport adapter from "@sveltejs/adapter-static";\n\nexport default {\n  kit: {\n    adapter: adapter({\n      pages: "build",\n      assets: "build",\n      fallback: "404.html"  // SPA fallback\n    })\n  }\n};', "JavaScript");

  para(doc, "Note: Static sites cannot use server-side features like +page.server.ts, form actions, or hooks. All data must be loaded at build time or client-side.");

  subheading(doc, "adapter-vercel");
  para(doc, "For Vercel-specific features like edge functions and ISR:");
  terminalBlock(doc, "pnpm add -D @sveltejs/adapter-vercel");
  codeBlock(doc, '// svelte.config.js\nimport adapter from "@sveltejs/adapter-vercel";\n\nexport default {\n  kit: {\n    adapter: adapter({\n      runtime: "nodejs20.x",  // or "edge"\n      regions: ["iad1"],       // Deploy to specific regions\n      split: true              // Split into separate functions\n    })\n  }\n};', "JavaScript");

  sectionDivider(doc);
  pageBreak(doc);

  heading(doc, "Environment Variables");
  para(doc, "SvelteKit provides a secure system for managing environment variables. There are two categories: public (exposed to the browser) and private (server-only).");

  subheading(doc, "Defining Variables");
  codeBlock(doc, "# .env file (never commit this!)\n\n# Private - only accessible on the server\nDATABASE_URL=postgresql://user:pass@localhost:5432/mydb\nSTRIPE_SECRET_KEY=sk_live_abc123\nJWT_SECRET=super-secret-key-here\n\n# Public - accessible in the browser (prefixed with PUBLIC_)\nPUBLIC_API_URL=https://api.example.com\nPUBLIC_SITE_NAME=My Awesome App\nPUBLIC_GA_ID=G-XXXXXXXXXX", "Shell");

  subheading(doc, "Using Variables in Code");
  codeBlock(doc, '// Server-only (in +page.server.ts, +server.ts, hooks)\nimport { DATABASE_URL, STRIPE_SECRET_KEY } from "$env/static/private";\nimport { env } from "$env/dynamic/private";\n\n// These ONLY work in server-side files\nconst db = connectToDatabase(DATABASE_URL);\nconst stripe = new Stripe(env.STRIPE_SECRET_KEY);\n\n// Public (anywhere, including browser)\nimport { PUBLIC_API_URL, PUBLIC_SITE_NAME } from "$env/static/public";\nimport { env } from "$env/dynamic/public";\n\nconst apiUrl = PUBLIC_API_URL;\nconst siteName = env.PUBLIC_SITE_NAME;', "TypeScript");

  subheading(doc, "Important Security Rules");
  bullet(doc, "NEVER put secrets in PUBLIC_ variables - they are sent to the browser.");
  bullet(doc, "Add .env to your .gitignore file. Create a .env.example with placeholder values.");
  bullet(doc, "Use $env/static/ when possible for better tree-shaking and build-time validation.");
  bullet(doc, "Use $env/dynamic/ when variables might change at runtime (e.g., Docker containers).");
  bullet(doc, "Set environment variables in your hosting platform's dashboard, not in committed files.");

  sectionDivider(doc);
  pageBreak(doc);

  heading(doc, "SEO Optimization");
  para(doc, "Search Engine Optimization ensures your application is discoverable by search engines. SvelteKit's server-side rendering gives you a huge advantage for SEO out of the box.");

  subheading(doc, "svelte:head for Meta Tags");
  codeBlock(doc, '<!-- src/routes/blog/[slug]/+page.svelte -->\n<script lang="ts">\n  let { data } = $props();\n</script>\n\n<svelte:head>\n  <title>{data.post.title} | My Blog</title>\n  <meta name="description" content={data.post.excerpt} />\n\n  <!-- Open Graph (Facebook, LinkedIn) -->\n  <meta property="og:title" content={data.post.title} />\n  <meta property="og:description" content={data.post.excerpt} />\n  <meta property="og:image" content={data.post.image} />\n  <meta property="og:type" content="article" />\n\n  <!-- Twitter Card -->\n  <meta name="twitter:card" content="summary_large_image" />\n  <meta name="twitter:title" content={data.post.title} />\n  <meta name="twitter:description" content={data.post.excerpt} />\n  <meta name="twitter:image" content={data.post.image} />\n\n  <!-- Canonical URL -->\n  <link rel="canonical" href="https://mysite.com/blog/{data.post.slug}" />\n</svelte:head>\n\n<article>\n  <h1>{data.post.title}</h1>\n  <!-- ... -->\n</article>', "Svelte");

  subheading(doc, "Structured Data (JSON-LD)");
  codeBlock(doc, '<svelte:head>\n  {@html `<script type="application/ld+json">\n    {\n      "@context": "https://schema.org",\n      "@type": "Article",\n      "headline": "${data.post.title}",\n      "author": {\n        "@type": "Person",\n        "name": "${data.post.author}"\n      },\n      "datePublished": "${data.post.date}",\n      "image": "${data.post.image}"\n    }\n  </script>`}\n</svelte:head>', "Svelte");

  subheading(doc, "SEO Checklist");
  bullet(doc, "Every page has a unique <title> and <meta name=\"description\">.");
  bullet(doc, "Open Graph and Twitter Card meta tags for social sharing.");
  bullet(doc, "Canonical URLs to prevent duplicate content issues.");
  bullet(doc, "Proper heading hierarchy (one h1 per page, followed by h2, h3, etc.).");
  bullet(doc, "Semantic HTML throughout (header, main, article, section, footer).");
  bullet(doc, "Image alt attributes for accessibility and image search.");
  bullet(doc, "Fast page loads (under 3 seconds) - SvelteKit helps with this.");
  bullet(doc, "Mobile-friendly responsive design.");
  bullet(doc, "sitemap.xml and robots.txt in the static/ directory.");

  sectionDivider(doc);
  pageBreak(doc);

  heading(doc, "Deploying to Vercel");
  para(doc, "Vercel is the easiest way to deploy SvelteKit applications. It provides automatic SSL, global CDN, serverless functions, and preview deployments for every pull request.");

  subheading(doc, "Step 1: Push to GitHub");
  terminalBlock(doc, "# Initialize git (if not already done)\ngit init\ngit add .\ngit commit -m \"Initial commit\"\n\n# Create a GitHub repo and push\ngh repo create my-app --public --source=. --push\n\n# Or add an existing remote\ngit remote add origin https://github.com/username/my-app.git\ngit push -u origin main");

  subheading(doc, "Step 2: Connect to Vercel");
  bullet(doc, "Go to vercel.com and sign in with your GitHub account.");
  bullet(doc, "Click 'Add New Project' and import your GitHub repository.");
  bullet(doc, "Vercel auto-detects SvelteKit and configures the build settings.");
  bullet(doc, "Add environment variables in the Vercel dashboard under Settings > Environment Variables.");
  bullet(doc, "Click 'Deploy' and wait for the build to complete.");

  subheading(doc, "Step 3: Configure Custom Domain (Optional)");
  bullet(doc, "Go to your project settings in Vercel.");
  bullet(doc, "Navigate to Domains and add your custom domain.");
  bullet(doc, "Update your DNS records as instructed by Vercel.");
  bullet(doc, "SSL certificates are provisioned automatically.");

  terminalBlock(doc, "# Install Vercel CLI for advanced workflows\npnpm add -g vercel\n\n# Deploy from command line\nvercel\n\n# Deploy to production\nvercel --prod");

  sectionDivider(doc);
  pageBreak(doc);

  heading(doc, "Deploying to Netlify");
  para(doc, "Netlify is another excellent choice for hosting SvelteKit applications, with great support for serverless functions, form handling, and identity management.");

  subheading(doc, "Step 1: Install the Netlify Adapter");
  terminalBlock(doc, "pnpm add -D @sveltejs/adapter-netlify");

  codeBlock(doc, '// svelte.config.js\nimport adapter from "@sveltejs/adapter-netlify";\n\nexport default {\n  kit: {\n    adapter: adapter({\n      edge: false,         // Use serverless functions (not edge)\n      split: false         // Bundle all routes into one function\n    })\n  }\n};', "JavaScript");

  subheading(doc, "Step 2: Add netlify.toml");
  codeBlock(doc, '# netlify.toml\n[build]\n  command = "pnpm build"\n  publish = "build"\n\n[build.environment]\n  NODE_VERSION = "20"', "TOML");

  subheading(doc, "Step 3: Deploy");
  bullet(doc, "Push your code to GitHub.");
  bullet(doc, "Log in to app.netlify.com and click 'Add new site' > 'Import an existing project'.");
  bullet(doc, "Select your GitHub repository.");
  bullet(doc, "Netlify detects the netlify.toml and configures the build.");
  bullet(doc, "Add environment variables under Site settings > Environment variables.");
  bullet(doc, "Click Deploy and wait for the build to complete.");

  terminalBlock(doc, "# Install Netlify CLI\npnpm add -g netlify-cli\n\n# Deploy from command line\nntl deploy\n\n# Deploy to production\nntl deploy --prod");

  sectionDivider(doc);
  pageBreak(doc);

  heading(doc, "Module 8 Exercise");
  exercise(doc, "Deploy Your Application", [
    "Ensure your application builds without errors by running pnpm build.",
    "Preview the production build locally with pnpm preview and test all pages.",
    "Create a .env.example file documenting all required environment variables.",
    "Add comprehensive SEO meta tags to your home page and at least one other page.",
    "Create a sitemap.xml in the static/ directory listing all your routes.",
    "Create a robots.txt in static/ that allows all crawlers.",
    "Push your code to a GitHub repository.",
    "Deploy to Vercel or Netlify following the steps above.",
    "Test the live deployment: check all routes, forms, and data loading.",
    "Share your deployed URL with the community and celebrate!",
  ]);

  heading(doc, "Summary");
  bullet(doc, "pnpm build creates an optimized production build with tree-shaking and code splitting.");
  bullet(doc, "Adapters configure your app for different hosting platforms (Node.js, static, Vercel, Netlify).");
  bullet(doc, "Environment variables are split into private (server-only) and public (browser-safe) categories.");
  bullet(doc, "SEO requires proper meta tags, Open Graph data, structured data, and semantic HTML.");
  bullet(doc, "Vercel provides zero-config deployment for SvelteKit with automatic adapter detection.");
  bullet(doc, "Netlify requires the adapter-netlify package and a netlify.toml configuration file.");

  sectionDivider(doc);

  heading(doc, "Congratulations!");
  para(doc, "You have completed all 8 modules of the Revolution Trading Pros Web Development Course. You now have the knowledge and skills to build, style, and deploy modern web applications with SvelteKit 5.");
  para(doc, "Here is a summary of what you have learned:");
  bullet(doc, "Module 1: Development environment setup with Node.js, pnpm, VS Code, and Git.");
  bullet(doc, "Module 2: HTML5 semantics, CSS Flexbox/Grid, scoped styles, and responsive design.");
  bullet(doc, "Module 3: Modern JavaScript including arrow functions, array methods, async/await, and modules.");
  bullet(doc, "Module 4: Svelte 5 runes ($state, $derived, $effect, $props), snippets, and control flow.");
  bullet(doc, "Module 5: SvelteKit routing, layouts, server-side data loading, and dynamic routes.");
  bullet(doc, "Module 6: Form actions, server-side validation, progressive enhancement.");
  bullet(doc, "Module 7: Advanced styling, Svelte transitions, GSAP animations, and ScrollTrigger.");
  bullet(doc, "Module 8: Production builds, adapters, environment variables, SEO, and deployment.");
  para(doc, "Keep building, keep learning, and share what you create. The web development community is welcoming and always eager to see new projects. Good luck on your journey!");

  addPageNumbers(doc);
  doc.end();
  console.log("  -> module-08-deployment.pdf done");
}

// ─── MAIN ───

async function main() {
  console.log("=== Generating PDF files ===\n");

  generateTradingSecrets();
  generateModule01();
  generateModule02();
  generateModule03();
  generateModule04();
  generateModule05();
  generateModule06();
  generateModule07();
  generateModule08();

  console.log("\n=== All PDFs generated in static/pdfs/ ===");
}

main().catch((err) => {
  console.error("Error generating PDFs:", err);
  process.exit(1);
});

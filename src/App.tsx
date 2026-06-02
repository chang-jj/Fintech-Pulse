/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect, MouseEvent } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Bookmark,
  BookmarkCheck,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Coins,
  Cpu,
  CreditCard,
  ExternalLink,
  HelpCircle,
  Landmark,
  Layers,
  RefreshCw,
  Search,
  ShieldAlert,
  Sliders,
  TrendingUp,
  TrendingDown,
  Info
} from "lucide-react";

// Categorization Enums for strong typing
enum FintechCategory {
  ALL = "All Sectors",
  PAYMENTS = "Payments",
  CRYPTO = "Crypto",
  WALLETS = "Digital Wallets",
  EQUITIES = "Equities",
  FINANCE = "Finance",
}

interface Article {
  id: string;
  category: FintechCategory;
  title: string;
  author: string;
  date: string;
  readTime: string;
  excerpt: string;
  content: string[];
  tags: string[];
  riskFactor: "Low" | "Medium" | "High";
  growthPotential: "Conservative" | "Moderate" | "Aggressive";
  catalysts: string[];
  impactScore: number; // Out of 100
  sentiment: "Bullish" | "Bearish" | "Neutral";
}

// Highly realistic fintech articles with real industry dynamics
const ARTICLES_DATA: Article[] = [
  {
    id: "art-01",
    category: FintechCategory.PAYMENTS,
    title: "The Interchange Squeeze: How the Credit Card Competition Act Could Upend Loyalty Programs",
    author: "Elena Rostov, Senior Payments Analyst",
    date: "June 2, 2026",
    readTime: "6 min read",
    excerpt: "As legislative pressure mounts in Congress, card networks prepare for a post-routing-duopoly world. We analyze the merchant routing shifts and the danger of loyalty collapse.",
    content: [
      "The Credit Card Competition Act (CCCA) is sent to reshape the bedrock of the US consumer credit economy. By requiring large banks to offer at least two routing options for credit transactions—one of which must not be Visa or Mastercard—merchants stand to potentially claw back over $15 billion annually in interchange fees.",
      "However, payments infrastructure operates on delicate dynamics. Interchange fees directly fund the premium cashback and travel points systems that consumers heavily rely upon. If Visa and Mastercard's pricing power is blunted by secondary networks like Discover or Shazam, the economic engine driving credit rewards could seize up, forcing a massive migration back to debit or digital wallets.",
      "For fintech platforms, this presents a dual threat and opportunity. While payment gateways must immediately build multi-routing fallback modules, alternative network protocols (such as RTP/FedNow or stablecon-based rails) gain an unprecedented wedge into traditional retail terminals."
    ],
    tags: ["CCCA", "Interchange", "Visa", "Mastercard", "Regulation"],
    riskFactor: "Medium",
    growthPotential: "Moderate",
    catalysts: [
      "Senate committee hearings scheduled for late Q3.",
      "Independent grocery chains trialing proprietary debit-routing platforms.",
      "Major card issuers preparing rewards contract renegotiations."
    ],
    impactScore: 88,
    sentiment: "Bearish"
  },
  {
    id: "art-02",
    category: FintechCategory.CRYPTO,
    title: "Stablecoin Velocity: Assessing the Shift from Crypto-native Pools to Global Merchant Rails",
    author: "Marcus Vance, Head of Digital Assets",
    date: "June 1, 2026",
    readTime: "8 min read",
    excerpt: "With monthly transaction volumes exceeding traditional corporate settlement pools, USD stablecoins are no longer just speculative dry powder. Here is where the real cash is settling.",
    content: [
      "USD-pegged stablecoins (USDT & USDC) have completed their transition from speculative trading buffers to high-velocity settlement instruments. In early 2026, on-chain stablecoin settlement volumes breached an annualized run rate of $11 trillion, rivaling Visa's core transaction volume.",
      "The driver of this growth is not DeFi speculation, but B2B cross-border payments. Importing and exporting merchants in fast-growth economies are increasingly bypassing the SWIFT network's 3-day delays and correspondent bank margins in favor of immediate, 24/7 stablecoin rails on high-throughput networks (L2s).",
      "Traditional payment service providers (PSPs) are quickly adapting. Acquiring giants like Stripe and Adyen have embedded stablecoin auto-settlement modules, transforming what once was a parallel financial system into a high-utility plug-in for global e-commerce."
    ],
    tags: ["Stablecoins", "USDC", "USDT", "Cross-Border Settlement", "Stripe"],
    riskFactor: "High",
    growthPotential: "Aggressive",
    catalysts: [
      "Standard Chartered implementing direct USDC settlement channels in APAC.",
      "Stripe expanding 'Pay with Crypto' to 45 additional nations.",
      "The EU MiCA framework enforcing rigorous backing reserves rules."
    ],
    impactScore: 92,
    sentiment: "Bullish"
  },
  {
    id: "art-03",
    category: FintechCategory.WALLETS,
    title: "Super-Apps or Smart Proxies? The Future of Wallets in Europe Under PSD3 and Wero",
    author: "Sophie Dubois, European Financial Services Strategy",
    date: "May 28, 2026",
    readTime: "5 min read",
    excerpt: "As the European Payments Initiative (EPI) scales its account-to-account platform Wero, we evaluate Apple Pay's dominance and the strategic shifts of merchants.",
    content: [
      "Europe's digital wallet architecture is undergoing a stark bifurcation. On one side are the tech conglomerates utilizing hardware and OS locks to capture high-margin terminal share (Apple Pay, Google Wallet). On the other is Wero, the commercial banking collective backed by European governments aiming to construct a sovereign, account-to-account (A2A) alternative.",
      "PSD3's new open-banking provisions are acting as a catalyst. By clarifying SCA (Strong Customer Authentication) requirements and lowering developer barriers to account access, European banks can now bypass legacy card networks entirely.",
      "Merchants are the key battleground. By offering lower processing costs (typically under 0.20% for A2A compared to 1.5% for credit cards), Wero hopes to incentivize merchants to display its QR codes at physical points-of-sale, though displacing the slick biometric tap-to-pay of mobile wallets remains a monumental hurdle."
    ],
    tags: ["Wero", "PSD3", "Open Banking", "A2A Payments", "Apple Pay"],
    riskFactor: "Low",
    growthPotential: "Moderate",
    catalysts: [
      "Wero completing national deployment alongside 16 major banks.",
      "Regulatory mandates restricting Apple's exclusive NFC chip API access.",
      "Lufthansa in talks to integrate Direct-Debit A2A checkouts."
    ],
    impactScore: 74,
    sentiment: "Neutral"
  },
  {
    id: "art-04",
    category: FintechCategory.EQUITIES,
    title: "Valuation Divergence: Legacy Merchant Processors vs. API-First Payment Providers",
    author: "Richard Chen, Senior Equity Analyst",
    date: "May 25, 2026",
    readTime: "7 min read",
    excerpt: "Comparing the P/E compressions of veteran merchant aggregators like FIS and Fiserv against Adyen's premium multiples. Has API-driven flexibility permanently won the stack?",
    content: [
      "For decades, the payments industry was dominated by massive, consolidated merchant acquiring engines. These conglomerates integrated millions of retail terminals and processed huge volumes, but were built on a precarious stack of legacy mainframes and acquisitions.",
      "Q1 2026 earnings highlight a stark valuation divergence. Legacy processors are trading near historical lows of 9-11x forward earnings, while API-first orchestration layers (Adyen, Stripe) sustain multiples above 35x. The market has realized that transaction volume is no longer a protective moat—platform flexibility is.",
      "The rise of software-led payments (ISVs) means that platforms like Shopify, Toast, and Mindbody act as the true gatekeepers of merchant relationships. Legacy processors who failed to build embedded-finance modules are being relegated to low-margin commoditized rails, while modern aggregators extract premium monetization on value-added services."
    ],
    tags: ["Adyen", "Fiserv", "FIS", "Shopify", "Embedded Finance"],
    riskFactor: "Low",
    growthPotential: "Conservative",
    catalysts: [
      "Adyen expanding multi-license merchant bank services in North America.",
      "Fiserv pivoting resources to their Clover POS platform expansion.",
      "Embedded SaaS-checkout modules grabbing 60% of small business market."
    ],
    impactScore: 81,
    sentiment: "Bullish"
  },
  {
    id: "art-05",
    category: FintechCategory.FINANCE,
    title: "High-Yield Arbitrage: How Neobanks are Utilizing Reverse Repo to Challenge Wall Street",
    author: "David Kessler, Macro Strategist",
    date: "May 20, 2026",
    readTime: "5 min read",
    excerpt: "With interest rates stabilizing near 5%, consumer fintech apps are using wholesale-style Treasury pipelines to offer high yields without risking credit underwriting.",
    content: [
      "Neobanks and digital investment brokers (Wealthfront, Robinhood, Wise) are achieving record deposits. By partnering with specialist banking-as-a-service (BaaS) entities, they route retail consumer deposits directly to high-yield Treasury bills and Federal Reserve reverse repo pools.",
      "This mechanism bypasses the costly branches, real estate, and massive overheads of traditional commercial banking. While regional banks struggle to maintain deposits at 0.5% interest, digital challengers are easily passing through yields up to 4.5% - 5.0% while skimming a low-risk, capital-light transactional spread.",
      "This asset-light model forces a deep question: Is the classic deposit-to-credit bank model structurally obsolete for consumers? Without credit default risk on their balance sheets, fintechs can maintain pristine solvency frameworks, though they remain heavily reliant on Fed rate cuts."
    ],
    tags: ["Neobanks", "Yield Arbitrage", "Treasuries", "Robinhood", "BaaS"],
    riskFactor: "Medium",
    growthPotential: "Moderate",
    catalysts: [
      "Regional bank deposit outflows reaching positive digital flow equilibrium.",
      "BaaS regulatory audits tightening third-party programmatic ledger controls.",
      "Federal Reserve hinting at stable-rate thresholds for next 3 quarters."
    ],
    impactScore: 85,
    sentiment: "Bullish"
  }
];

// Interactive Market Chart Mock Data representing realistic values and histories
interface ChartDataPoint {
  date: string;
  crypto: number;      // Stablecoin / Bitcoin Index (base 100)
  payments: number;    // Visa / Adyen Index (base 100)
  wallets: number;     // Block / PayPal Index (base 100)
  equities: number;    // Fintech Equity Index (base 100)
  volume: number;      // Billions of USD Global Rail volume
}

const CHART_HISTORY: Record<string, ChartDataPoint[]> = {
  "1D": Array.from({ length: 12 }, (_, i) => ({
    date: `${i * 2 + 1}:00`,
    crypto: 124.5 + Math.sin(i * 0.8) * 1.5 + (i * 0.1),
    payments: 98.2 + Math.cos(i * 0.5) * 0.8,
    wallets: 86.4 + Math.sin(i * 0.3) * 1.2,
    equities: 110.8 + Math.cos(i * 0.7) * 1.1 + (i * 0.15),
    volume: 120 + i * 8 + Math.random() * 5
  })),
  "1W": [
    { date: "Mon", crypto: 121.2, payments: 97.4, wallets: 84.1, equities: 108.4, volume: 410 },
    { date: "Tue", crypto: 123.5, payments: 96.9, wallets: 85.3, equities: 107.9, volume: 425 },
    { date: "Wed", crypto: 122.1, payments: 98.1, wallets: 84.8, equities: 109.1, volume: 430 },
    { date: "Thu", crypto: 125.8, payments: 99.3, wallets: 86.6, equities: 111.4, volume: 452 },
    { date: "Fri", crypto: 124.2, payments: 98.0, wallets: 85.9, equities: 110.5, volume: 440 },
    { date: "Sat", crypto: 126.9, payments: 98.5, wallets: 87.2, equities: 112.1, volume: 380 },
    { date: "Sun", crypto: 125.4, payments: 98.2, wallets: 86.4, equities: 110.8, volume: 395 }
  ],
  "1M": [
    { date: "Week 1", crypto: 115.2, payments: 94.2, wallets: 81.3, equities: 102.5, volume: 1650 },
    { date: "Week 2", crypto: 119.4, payments: 95.8, wallets: 83.1, equities: 104.9, volume: 1720 },
    { date: "Week 3", crypto: 121.8, payments: 96.3, wallets: 85.0, equities: 108.2, volume: 1810 },
    { date: "Week 4", crypto: 125.4, payments: 98.2, wallets: 86.4, equities: 110.8, volume: 1890 }
  ],
  "1Y": [
    { date: "Q1 '25", crypto: 95.0, payments: 88.0, wallets: 75.2, equities: 90.5, volume: 5120 },
    { date: "Q2 '25", crypto: 102.4, payments: 91.2, wallets: 78.4, equities: 96.2, volume: 5400 },
    { date: "Q3 '25", crypto: 108.9, payments: 93.5, wallets: 80.9, equities: 99.8, volume: 5650 },
    { date: "Q4 '25", crypto: 116.5, payments: 95.0, wallets: 82.1, equities: 104.3, volume: 5900 },
    { date: "Q1 '26", crypto: 125.4, payments: 98.2, wallets: 86.4, equities: 110.8, volume: 6310 }
  ]
};

// Details for the Interactive Market Grid tickers (updates dynamically with soft mock ticks)
interface AssetTicker {
  symbol: string;
  name: string;
  price: string;
  change: string;
  isPositive: boolean;
  history: number[];
}

// Payment Rails flow visualizer options
enum PaymentRailType {
  CREDIT_CARD = "Credit Card Routing (Legacy)",
  RTP_FEDNOW = "RTP & FedNow Instant (A2A)",
  STABLECOIN = "Stablecoin blockchain settle"
}

interface RailNode {
  name: string;
  description: string;
  fee: string;
  latency: string;
  role: string;
}

const RAIL_FLOWS: Record<PaymentRailType, RailNode[]> = {
  [PaymentRailType.CREDIT_CARD]: [
    { name: "Customer Auth", description: "Enters biometric credential or credit card at checkout.", fee: "$0.00", latency: "100ms", role: "Trigger" },
    { name: "Gateway (Stripe / Adyen)", description: "Encrypts details, formats request, and redirects payload.", fee: "$0.10 flat rate", latency: "250ms", role: "Orchestration" },
    { name: "Acquiring Bank Processor", description: "Processes merchant's merchant-account side of authorization.", fee: "0.2% - 0.4% surcharge", latency: "300ms", role: "Merchant Settlement Hub" },
    { name: "Card Networks (Visa / MC)", description: "Checks network routing protocols, handles interchange billing.", fee: "1.6% - 2.8% Interchange fee", latency: "150ms", role: "Routing Ring" },
    { name: "Issuing Bank (Chase / Citi)", description: "Checks user spending limit, credits balance, settles payment.", fee: "$0.00", latency: "200ms", role: "User Custodian" },
    { name: "Merchant Settlement", description: "Funds finally land in merchant cash ledger, taking 2 to 3 days.", fee: "$0.00", latency: "48h to 72h delay", role: "Destination" }
  ],
  [PaymentRailType.RTP_FEDNOW]: [
    { name: "Customer Authentication", description: "Biometric validation via Neobank/Banking portal link.", fee: "$0.00", latency: "200ms", role: "Direct Payee" },
    { name: "Sovereign RTP Router", description: "Account-to-Account immediate query check against positive balance.", fee: "$0.04 flat rate fee", latency: "400ms", role: "State Trust Router" },
    { name: "Immediate Liquidity Release", description: "Instant dual ledger debit/credit matching in milliseconds.", fee: "$0.00", latency: "350ms", role: "Direct Settlement" },
    { name: "Merchant Business Vault", description: "Ledger status updates instantly. Funds available immediately.", fee: "$0.00", latency: "2.5 seconds total", role: "Ultimate Destination" }
  ],
  [PaymentRailType.STABLECOIN]: [
    { name: "Client Browser Web3 Signature", description: "Confirms non-custodial cryptographic transfer approval.", fee: "$0.00", latency: "150ms", role: "User Private Key" },
    { name: "DEX or smart engine routing", description: "Direct ERC20 safe transfer mapping on ultra-low gas layer-2 rails.", fee: "Pool Gas (~$0.01 to $0.05)", latency: "1.2s confirmation", role: "Dynamic Ledger Contract" },
    { name: "Merchant Multi-sig Account", description: "Immediate balance credit with high security validation.", fee: "$0.00", latency: "12 seconds average", role: "Destination Vault" }
  ]
};

export default function App() {
  // Navigation & Filtering state
  const [selectedCategory, setSelectedCategory] = useState<FintechCategory>(FintechCategory.ALL);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [savedArticles, setSavedArticles] = useState<string[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  // Chart interaction state
  const [chartAsset, setChartAsset] = useState<"crypto" | "payments" | "wallets" | "equities">("payments");
  const [chartTimeframe, setChartTimeframe] = useState<string>("1W");
  const [hoveredPoint, setHoveredPoint] = useState<ChartDataPoint | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Flow simulator state
  const [selectedRail, setSelectedRail] = useState<PaymentRailType>(PaymentRailType.CREDIT_CARD);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  // Calculator state variables
  const [monthlyVolume, setMonthlyVolume] = useState<number>(350000); // USD
  const [avgTicketSize, setAvgTicketSize] = useState<number>(85); // USD
  const [customCCRate, setCustomCCRate] = useState<number>(2.4); // Percentage
  const [customRTPRate, setCustomRTPRate] = useState<number>(0.2); // flat rate or low A2A %

  // Dynamic live-updating tickers (simulates micro-movements on interval)
  const [tickers, setTickers] = useState<AssetTicker[]>([
    { symbol: "$PYMT", name: "Apex Payments Index", price: "284.15", change: "+1.85", isPositive: true, history: [280, 281, 280.5, 283, 282, 284.15] },
    { symbol: "$USDC", name: "USD Settlement Velocity", price: "4,192.40", change: "+3.24", isPositive: true, history: [4120, 4150, 4130, 4180, 4160, 4192.4] },
    { symbol: "V", name: "Visa Inc.", price: "278.41", change: "-0.42", isPositive: false, history: [280, 279, 279.5, 278, 278.9, 278.41] },
    { symbol: "ADYEN", name: "Adyen NV", price: "1,524.00", change: "+4.12", isPositive: true, history: [1490, 1505, 1500, 1520, 1515, 1524] },
    { symbol: "SQ", name: "Block (Square)", price: "72.35", change: "+0.95", isPositive: true, history: [71, 71.8, 71.2, 72.5, 72.1, 72.35] }
  ]);

  // Periodic visual price fluctuation simulator
  useEffect(() => {
    const timer = setInterval(() => {
      setTickers((prev) =>
        prev.map((t) => {
          if (t.symbol === "$USDC") return t; // Stablecoin is static or volume index
          const currentPrice = parseFloat(t.price.replace(/,/g, ""));
          const pct = (Math.random() - 0.48) * 0.002; // soft upward drift
          const nextPrice = currentPrice * (1 + pct);
          const rawDiff = nextPrice - currentPrice;
          const nextChangeRaw = parseFloat(t.change) + rawDiff;
          const isPos = nextChangeRaw >= 0;

          return {
            ...t,
            price: nextPrice.toFixed(2),
            change: (isPos ? "+" : "") + nextChangeRaw.toFixed(2),
            isPositive: isPos,
            history: [...t.history.slice(1), nextPrice]
          };
        })
      );
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  // Filtered news listing
  const filteredArticles = useMemo(() => {
    return ARTICLES_DATA.filter((article) => {
      const matchesCategory = selectedCategory === FintechCategory.ALL || article.category === selectedCategory;
      const matchesSearch =
        searchQuery === "" ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Read saved bookmarks from dynamic array
  const toggleBookmark = (id: string, e: MouseEvent) => {
    e.stopPropagation();
    setSavedArticles((prev) =>
      prev.includes(id) ? prev.filter((artId) => artId !== id) : [...prev, id]
    );
  };

  // Calculator custom outputs
  const calculatorSavings = useMemo(() => {
    const transactionCount = monthlyVolume / avgTicketSize;
    
    // Traditional Card overhead
    const avgCCPercentageFee = (customCCRate / 100) * monthlyVolume;
    const avgCCFlatFee = 0.30 * transactionCount; // standard 30c gate cut
    const totalCC = avgCCPercentageFee + avgCCFlatFee;

    // RTP / Instant routing overhead
    const avgRTPPercentageFee = (0.1 / 100) * monthlyVolume; // 0.1% network max
    const avgRTPFlatFee = customRTPRate * transactionCount; // customizable standard flat rate
    const totalRTP = avgRTPPercentageFee + avgRTPFlatFee;

    const monthlyDeduct = Math.max(0, totalCC - totalRTP);
    return {
      ccCost: totalCC,
      rtpCost: totalRTP,
      monthly: monthlyDeduct,
      annual: monthlyDeduct * 12,
      savingPercentage: totalCC > 0 ? ((totalCC - totalRTP) / totalCC) * 100 : 0
    };
  }, [monthlyVolume, avgTicketSize, customCCRate, customRTPRate]);

  // Dynamic Chart coordinate calculations
  const chartPoints = CHART_HISTORY[chartTimeframe] || CHART_HISTORY["1W"];
  
  // Quick calculation variables for the dynamic chart layout
  const chartDims = { width: 680, height: 280, paddingLeft: 45, paddingRight: 15, paddingTop: 20, paddingBottom: 30 };
  const yMin = useMemo(() => {
    const values = chartPoints.map((p) => p[chartAsset]);
    return Math.max(0, Math.min(...values) - 10);
  }, [chartAsset, chartPoints]);

  const yMax = useMemo(() => {
    const values = chartPoints.map((p) => p[chartAsset]);
    return Math.max(...values) + 10;
  }, [chartAsset, chartPoints]);

  const svgCoordinates = useMemo(() => {
    const pointsCount = chartPoints.length;
    const { width, height, paddingLeft, paddingRight, paddingTop, paddingBottom } = chartDims;
    
    const usableWidth = width - paddingLeft - paddingRight;
    const usableHeight = height - paddingTop - paddingBottom;

    return chartPoints.map((p, idx) => {
      // X axis step mapping
      const x = paddingLeft + (idx / (pointsCount - 1)) * usableWidth;
      // Y axis value scaling
      const val = p[chartAsset];
      const y = height - paddingBottom - ((val - yMin) / (yMax - yMin)) * usableHeight;
      return { x, y, point: p };
    });
  }, [chartAsset, chartPoints, yMin, yMax, chartDims]);

  // Render direct line path
  const linePath = useMemo(() => {
    if (svgCoordinates.length === 0) return "";
    return svgCoordinates.map((c, i) => `${i === 0 ? "M" : "L"} ${c.x} ${c.y}`).join(" ");
  }, [svgCoordinates]);

  // Render direct gradient area filling path below line
  const areaPath = useMemo(() => {
    if (svgCoordinates.length === 0) return "";
    const firstPoint = svgCoordinates[0];
    const lastPoint = svgCoordinates[svgCoordinates.length - 1];
    const bottomY = chartDims.height - chartDims.paddingBottom;
    return `${linePath} L ${lastPoint.x} ${bottomY} L ${firstPoint.x} ${bottomY} Z`;
  }, [svgCoordinates, linePath, chartDims]);

  return (
    <div className="min-h-screen bg-[#05070A] text-slate-100 antialiased selection:bg-blue-950 selection:text-blue-300" id="fintech-portal-root">
      
      {/* Dynamic Upper Ticker Ribbon */}
      <div className="bg-[#05070A] text-slate-350 py-2.5 border-b border-slate-900 text-xs tracking-wider font-mono select-none overflow-hidden" id="ticker-ribbon">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-slate-500">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse inline-block"></span>
            <span>LIVE FINTECH INDEX INDEXES:</span>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-6 overflow-x-auto no-scrollbar scroll-smooth">
            {tickers.map((ticker) => (
              <div key={ticker.symbol} className="flex items-center space-x-2 shrink-0 transition-all duration-300" id={`ticker-${ticker.symbol}`}>
                <span className="text-slate-500 font-semibold">{ticker.symbol}</span>
                <span className="text-white font-medium">{ticker.price}</span>
                <span className={`flex items-center text-[10px] px-1 font-bold rounded ${ticker.isPositive ? "text-emerald-400" : "text-rose-400"}`}>
                  {ticker.isPositive ? <ArrowUpRight className="w-3 h-3 inline mr-0.5" /> : <ArrowDownRight className="w-3 h-3 inline mr-0.5" />}
                  {ticker.change}%
                </span>
                {/* Micro mini-bar sparklines */}
                <div className="w-10 h-3 flex items-end space-x-0.5 opacity-40">
                  {ticker.history.map((h, hidx) => {
                    const minH = Math.min(...ticker.history);
                    const maxH = Math.max(...ticker.history);
                    const ratio = maxH - minH > 0 ? (h - minH) / (maxH - minH) : 0.5;
                    const blockHeight = Math.max(1, Math.round(ratio * 12));
                    return (
                      <span
                        key={hidx}
                        className={`w-1 rounded-sm ${ticker.isPositive ? "bg-emerald-400" : "bg-rose-400"}`}
                        style={{ height: `${blockHeight}px` }}
                      ></span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modern High-End Editorial Header with Liquidglass effect */}
      <header 
        className={`sticky z-40 transition-all duration-500 ease-in-out ${
          isScrolled 
            ? "top-0 left-0 right-0 w-full bg-[#05070a]/75 backdrop-blur-2xl border-b border-white/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.8)] py-0" 
            : "top-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4"
        }`} 
        id="main-navigation-header"
      >
        <div className={`transition-all duration-500 ease-in-out relative ${
          isScrolled 
            ? "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-0 bg-transparent" 
            : "rounded-2xl sm:rounded-3xl border border-white/[0.08] bg-[#0b0e17]/35 backdrop-blur-md sm:backdrop-blur-xl shadow-[0_16px_48px_rgba(0,0,0,0.5),inset_0_1.5px_1.5px_0_rgba(255,255,255,0.08)] shadow-blue-900/5 hover:border-white/15 hover:shadow-blue-950/10 group overflow-hidden"
        }`}>
          {!isScrolled && (
            <>
              {/* Soft color flow inside the glass capsule */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/[0.03] via-indigo-500/[0.03] to-emerald-500/[0.03] rounded-2xl sm:rounded-3xl pointer-events-none"></div>
              
              {/* Micro neon top glare */}
              <div className="absolute top-[1px] left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent blur-[0.5px] pointer-events-none"></div>
              
              {/* Glass gloss/reflection shimmer */}
              <div className="absolute -inset-x-full top-0 bottom-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent transform -skew-x-12 transition-transform duration-1000 group-hover:translate-x-full pointer-events-none"></div>
            </>
          )}

          <div className="flex items-center justify-between h-20 relative z-10 px-4 sm:px-6 md:px-8">
            {/* Elegant Typography Branding */}
            <div className="flex items-center space-x-3" id="brand-logo-container">
              <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 border border-white/10 text-white p-2.5 rounded-xl shadow-lg shadow-blue-500/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white font-sans flex items-center leading-none">
                  FINTECH <span className="text-blue-500 font-medium ml-1">PULSE</span>
                </h1>
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-mono mt-1 font-semibold">Payments & Equities Intelligence</p>
              </div>
            </div>

            {/* Quick Interactive Searchbar inside header */}
            <div className="hidden md:flex items-center flex-1 max-w-md mx-8 relative" id="header-search-container">
              <Search className="absolute left-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search regulations, issuers, or networks..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white/[0.03] border border-white/[0.06] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/[0.05] focus:border-blue-500/40 text-white placeholder-slate-500 transition-all font-sans"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Status Metrics or Platform indicators */}
            <div className="flex items-center space-x-4 text-xs font-mono" id="header-action-container">
              <div className="text-right hidden sm:block">
                <span className="text-slate-500 block">UPDATED DAILY</span>
                <span className="text-slate-300 font-medium flex items-center justify-end">
                  <Clock className="w-3.5 h-3.5 text-slate-500 mr-1" />
                  UTC 13:08
                </span>
              </div>
              <div className="bg-white/[0.03] border border-white/[0.06] px-3.5 py-2.5 rounded-xl text-slate-300 font-medium hover:bg-white/[0.07] hover:border-white/10 transition-colors cursor-pointer flex items-center" id="saved-articles-counter">
                <Bookmark className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
                <span>Bookmarks ({savedArticles.length})</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Master Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12" id="main-content-layout">
        
        {/* HERO EDITORIAL FEATURE UNIT */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl hover:border-slate-705 transition-all" id="hero-editorial-section">
          {/* Main feature content column */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6" id="hero-feature-column">
            <div>
              <div className="flex items-center space-x-2 text-blue-400 font-mono text-xs font-bold uppercase tracking-wider mb-3">
                <span className="px-2 py-0.5 bg-blue-950/40 rounded border border-blue-900/30">Featured Analytics</span>
                <span>•</span>
                <span>TOP STORY OF THE DAY</span>
              </div>
              
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight hover:text-blue-450 transition-colors">
                The Decoupling of Traditional Payments: How Real-Time Account Rails (FedNow) Rewrites Retail Margins
              </h2>
              
              <p className="text-slate-400 mt-4 text-base sm:text-lg leading-relaxed font-sans">
                For six decades, credit cards operated as the ultimate merchant loyalty tool. Now, instant local settlement rails and stablecoin velocity threaten Visa and Mastercard's processing stronghold.
              </p>
            </div>

            {/* Micro details panel */}
            <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-slate-800 text-slate-350 rounded-full flex items-center justify-center font-bold font-serif shadow-sm">
                  JD
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-205 text-slate-200">Julien Deon</p>
                  <p className="text-xs text-slate-500">Chief Fintech Strategist</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-xs font-mono text-slate-500">
                <span className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-1" /> June 2, 2026</span>
                <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1" /> 10 mins read</span>
              </div>

              <button 
                onClick={() => setSelectedArticle(ARTICLES_DATA[0])}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-xl transition-all duration-300 flex items-center shadow-md text-sm group"
                id="read-hero-article-btn"
              >
                Read Deep-Dive Analysis
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Graphical decorative column / Analytical Highlights Summary */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-6 sm:p-8 text-white flex flex-col justify-between relative overflow-hidden group" id="hero-analytical-sidebar">
            {/* Ambient Background Glow Grid */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.1),transparent_40%)] pointer-events-none"></div>
            
            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono tracking-widest text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded uppercase font-bold">
                  Daily Pulse Index
                </span>
                <TrendingUp className="w-5 h-5 text-blue-400" />
              </div>

              <div>
                <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-2 font-semibold">Today's Market Synthesis</h3>
                <p className="text-sm text-slate-350 leading-relaxed font-sans">
                  The payments routing infrastructure framework is experiencing its largest legislative strain in a generation. At the same time, liquid non-bank deposits seek record high stablecoin reserves yield pipelines.
                </p>
              </div>

              <div className="space-y-3.5 bg-[#05070A]/55 p-4 rounded-xl border border-slate-800 font-mono text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Stablecoin Market Velocity Index</span>
                  <span className="text-emerald-400 font-semibold flex items-center">
                    <ArrowUpRight className="w-3 h-3 mr-0.5" /> +15.4% YoY
                  </span>
                </div>
                <div className="flex justify-between items-center border-t border-slate-800/80 pt-2.5">
                  <span className="text-slate-400">ACH / Instant RTP Volume Index</span>
                  <span className="text-emerald-400 font-semibold flex items-center">
                    <ArrowUpRight className="w-3 h-3 mr-0.5" /> +28.1% YTD
                  </span>
                </div>
                <div className="flex justify-between items-center border-t border-slate-800/80 pt-2.5">
                  <span className="text-slate-400">Card Interchange Fee Pressure Gauge</span>
                  <span className="text-rose-400 font-semibold flex items-center">
                    <ArrowDownRight className="w-3 h-3 mr-0.5" /> -4.2% MoM
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800 relative z-10 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Apex Analyst Sentiment:</span>
              <span className="text-emerald-400 font-bold flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> MODERATELY BULLISH
              </span>
            </div>
          </div>
        </section>


        {/* INTERACTIVE MARKET PORTFOLIO TERMINAL & CHART CHART WIDGET */}
        <section className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden" id="interactive-charts-portal">
          <div className="border-b border-slate-800 bg-slate-950 p-5 sm:px-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-slate-900 text-white rounded-lg border border-slate-800">
                <Layers className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h3 className="font-extrabold text-white tracking-tight">Interactive Fintech Market Index</h3>
                <p className="text-xs text-slate-450 font-sans">Toggle indices to visualize daily momentum, sector volume, and rolling baseline records</p>
              </div>
            </div>

            {/* Timeframe selector controls */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 font-mono text-xs">
              {["1D", "1W", "1M", "1Y"].map((tf) => (
                <button
                  key={tf}
                  onClick={() => {
                    setChartTimeframe(tf);
                    setHoveredIndex(null);
                    setHoveredPoint(null);
                  }}
                  className={`px-3 py-1.5 rounded-lg font-bold uppercase transition-all ${
                    chartTimeframe === tf ? "bg-blue-600 text-white shadow-sm font-extrabold" : "text-slate-450 hover:text-white"
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Chart Left column Selector Sidebars */}
            <div className="lg:col-span-3 border-r border-slate-800 p-4 space-y-2 bg-slate-950/40">
              <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500 font-bold block px-2.5 mb-2">SELECT INDEX GRAPH</span>
              
              {[
                { key: "payments", name: "Core Payments Rail", sub: "Visa, Mastercard, Adyen Tracker", color: "bg-indigo-950/40 border-indigo-500/30 text-indigo-300", icon: CreditCard, val: "98.2" },
                { key: "crypto", name: "Crypto Stablecoin Velocity", sub: "USDC, USDT, Layer-2 Settlement", color: "bg-emerald-950/40 border-emerald-500/30 text-emerald-300", icon: Coins, val: "125.4" },
                { key: "wallets", name: "Digital Wallet Dominance", sub: "PayPal, Apple Pay, Clover Index", color: "bg-amber-950/40 border-amber-500/30 text-amber-300", icon: Landmark, val: "86.4" },
                { key: "equities", name: "Integrated Fintech Equities", sub: "Sector ETF Benchmark", color: "bg-blue-950/40 border-blue-500/30 text-blue-300", icon: Cpu, val: "110.8" }
              ].map((asset) => {
                const IconComp = asset.icon;
                const isSelected = chartAsset === asset.key;
                return (
                  <button
                    key={asset.key}
                    onClick={() => {
                      setChartAsset(asset.key as any);
                      setHoveredIndex(null);
                      setHoveredPoint(null);
                    }}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 flex items-center justify-between ${
                      isSelected 
                        ? `${asset.color} shadow-sm font-semibold scale-[1.01] ring-1 ring-blue-500/20` 
                        : "bg-slate-900/60 border-slate-800 hover:border-slate-705 hover:bg-slate-800 text-slate-350 select-none"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${isSelected ? "bg-slate-900 shadow-sm text-white" : "bg-slate-800 text-slate-450"}`}>
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold font-sans tracking-tight block text-slate-200">{asset.name}</p>
                        <p className="text-[10px] text-slate-500 font-mono mt-0.5 leading-none">{asset.sub}</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-200">{asset.val}</span>
                  </button>
                );
              })}

              {/* Dynamic stats preview box inside sidebar */}
              <div className="mt-4 p-4 rounded-xl bg-slate-950 text-slate-300 font-mono text-xs space-y-2.5 border border-slate-800/80">
                <div className="flex justify-between">
                  <span className="text-slate-500">Baseline Target:</span>
                  <span>100.0</span>
                </div>
                <div className="flex justify-between border-t border-slate-800/80 pt-2">
                  <span className="text-slate-505 text-slate-500">Current Level:</span>
                  <span className="text-emerald-450 text-emerald-400 font-bold">
                    {chartPoints[chartPoints.length - 1][chartAsset].toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-slate-800/80 pt-2">
                  <span className="text-slate-500">Est. Daily Volume:</span>
                  <span>${chartPoints[chartPoints.length - 1].volume}B</span>
                </div>
              </div>
            </div>

            {/* Interactive Render Area Grid */}
            <div className="lg:col-span-9 p-6 flex flex-col justify-between" id="chart-viewport-column">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-xs uppercase font-mono tracking-widest text-slate-500 font-bold">Chart Vector Line</h4>
                  <p className="text-sm font-extrabold text-slate-250 text-slate-200 font-sans tracking-tight">
                    {chartAsset.charAt(0).toUpperCase() + chartAsset.slice(1)} Performance Rating Trend
                  </p>
                </div>
                
                {/* Dynamically display point detail values on hover */}
                <div className="text-right bg-slate-950 border border-slate-850 rounded-xl px-4 py-2 font-mono text-xs shadow-sm">
                  {hoveredPoint ? (
                    <div>
                      <span className="text-slate-505 text-slate-550 text-slate-500 mr-2">{hoveredPoint.date} Index:</span>
                      <span className="text-white font-extrabold text-sm">{hoveredPoint[chartAsset].toFixed(2)}</span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">Vol: ${hoveredPoint.volume}B</span>
                    </div>
                  ) : (
                    <div className="text-slate-450 flex items-center">
                      <Info className="w-3.5 h-3.5 mr-1 text-slate-500" />
                      <span>Hover chart to scan timeline</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Responsive Custom Vector SVG Canvas Chart */}
              <div className="relative w-full overflow-hidden bg-slate-950/60 rounded-2xl border border-slate-800/80 p-2 select-none h-72">
                <svg
                  viewBox={`0 0 ${chartDims.width} ${chartDims.height}`}
                  className="w-full h-full"
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const scaleX = chartDims.width / rect.width;
                    const mouseX = (e.clientX - rect.left) * scaleX;
                    
                    // Fine matching x index from list coordinate array mapping
                    let closestIdx = 0;
                    let minDistance = Infinity;
                    svgCoordinates.forEach((coord, i) => {
                      const dist = Math.abs(coord.x - mouseX);
                      if (dist < minDistance) {
                        minDistance = dist;
                        closestIdx = i;
                      }
                    });
                    
                    setHoveredIndex(closestIdx);
                    setHoveredPoint(svgCoordinates[closestIdx].point);
                  }}
                  onMouseLeave={() => {
                    setHoveredIndex(null);
                    setHoveredPoint(null);
                  }}
                >
                  <defs>
                    <linearGradient id="chartGlowOpacity" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Guideline indicators */}
                  {Array.from({ length: 5 }).map((_, step) => {
                    const h = chartDims.height - chartDims.paddingBottom;
                    const t = chartDims.paddingTop;
                    const y = t + (step / 4) * (h - t);
                    const val = yMax - (step / 4) * (yMax - yMin);
                    return (
                      <g key={step} className="opacity-40">
                        <line
                          x1={chartDims.paddingLeft}
                          y1={y}
                          x2={chartDims.width - chartDims.paddingRight}
                          y2={y}
                          className="stroke-slate-800 stroke-1 stroke-dasharray-[4,4]"
                          strokeDasharray="4 4"
                        />
                        <text
                          x={chartDims.paddingLeft - 8}
                          y={y + 3}
                          textAnchor="end"
                          className="fill-slate-500 font-mono text-[9px] select-none pointer-events-none"
                        >
                          {val.toFixed(0)}
                        </text>
                      </g>
                    );
                  })}

                  {/* Shaded Area Zone */}
                  <path d={areaPath} fill="url(#chartGlowOpacity)" className="transition-all duration-300" />

                  {/* Dynamic Trend Core Vector Line */}
                  <path
                    d={linePath}
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-all duration-300"
                  />

                  {/* Custom vertical focus line crosshair and marker */}
                  {hoveredIndex !== null && (
                    <g>
                      <line
                        x1={svgCoordinates[hoveredIndex].x}
                        y1={chartDims.paddingTop}
                        x2={svgCoordinates[hoveredIndex].x}
                        y2={chartDims.height - chartDims.paddingBottom}
                        className="stroke-slate-700 stroke-1 stroke-dasharray-[2,2]"
                        strokeDasharray="2 2"
                      />
                      <circle
                        cx={svgCoordinates[hoveredIndex].x}
                        cy={svgCoordinates[hoveredIndex].y}
                        r="6"
                        fill="#3B82F6"
                        className="stroke-slate-900 stroke-2"
                      />
                    </g>
                  )}

                  {/* Horizontal Timeline label coordinates */}
                  {svgCoordinates.map((c, i) => {
                    // Filter or condense coordinates to prevent overcrowding
                    const shouldDisplay = chartTimeframe === "1D" ? i % 2 === 0 : true;
                    if (!shouldDisplay) return null;
                    return (
                      <text
                        key={i}
                        x={c.x}
                        y={chartDims.height - 10}
                        textAnchor="middle"
                        className="fill-slate-500 font-mono text-[9px] select-none pointer-events-none"
                      >
                        {c.point.date}
                      </text>
                    );
                  })}
                </svg>
              </div>

              {/* Chart footer insights summary block */}
              <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between flex-wrap gap-4 text-xs">
                <span className="flex items-center text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block mr-2 shadow-sm"></span>
                  Rolling 30D Growth Benchmark:
                  <span className="text-emerald-405 text-emerald-400 font-bold ml-1.5">+8.42% overall gain</span>
                </span>
                
                <span className="text-slate-500 font-mono block">Data refreshed every 4.5 seconds internally. No external feed delay.</span>
              </div>
            </div>
          </div>
        </section>


        {/* DAILY ANALYTICAL REPORTS & REGULATORY DOSSIER */}
        <section className="space-y-6" id="reports-and-news-section">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-blue-450 text-blue-400 font-bold bg-blue-950/40 px-2.5 py-0.5 rounded border border-blue-900/30">Editorial Intel</span>
              <h3 className="text-2xl font-extrabold text-white tracking-tight mt-1">Deep-Dive Intelligence & Daily Reports</h3>
              <p className="text-sm text-slate-450 font-sans">Comprehensive strategic evaluations, regulatory assessments, and fintech growth perspectives</p>
            </div>

            {/* In-view category toolbar controller */}
            <div className="flex flex-wrap items-center gap-1.5" id="category-selector-pills">
              {Object.values(FintechCategory).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 text-xs rounded-xl font-bold border transition-all ${
                    selectedCategory === cat
                      ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                      : "bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Results check indicator */}
          {filteredArticles.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 p-12 text-center rounded-2xl animate-fade-in" id="no-articles-view">
              <Bookmark className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-lg font-bold text-slate-300">No analytical articles match your active criteria</p>
              <p className="text-sm text-slate-500 mt-2">Try clearing your search query or picking a broader category sector above</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory(FintechCategory.ALL);
                }}
                className="mt-4 inline-flex items-center text-sm font-semibold text-blue-400 hover:text-blue-300 bg-blue-950/40 border border-blue-900/30 px-4 py-2 rounded-xl"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="editorial-grid">
              {filteredArticles.map((article) => {
                const isFavorite = savedArticles.includes(article.id);
                return (
                  <article
                    key={article.id}
                    onClick={() => setSelectedArticle(article)}
                    className="bg-[#0c0f1e]/85 border border-slate-800 rounded-3xl p-6 hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)] hover:border-blue-900/40 cursor-pointer flex flex-col justify-between space-y-4 hover:scale-[1.01] transition-all relative group"
                    id={`article-card-${article.id}`}
                  >
                    <div>
                      {/* Meta header block */}
                      <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                        <span className="text-blue-400 font-bold bg-blue-950/40 px-2 py-0.5 rounded border border-blue-900/30 uppercase tracking-wider text-[10px]">
                          {article.category}
                        </span>
                        
                        <div className="flex items-center space-x-2">
                          <span className="flex items-center"><Clock className="w-3 h-3 mr-0.5 text-slate-500 animate-pulse" /> {article.readTime}</span>
                          <button
                            onClick={(e) => toggleBookmark(article.id, e)}
                            className="text-slate-505 text-slate-500 hover:text-slate-250 hover:bg-slate-800 p-1 rounded-md transition-colors"
                            title="Bookmark this post"
                          >
                            {isFavorite ? <BookmarkCheck className="w-3.5 h-3.5 text-blue-400" /> : <Bookmark className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      {/* Card main text */}
                      <h4 className="text-lg font-extrabold text-white group-hover:text-blue-400 transition-colors tracking-tight line-clamp-2 mt-3.5 leading-snug">
                        {article.title}
                      </h4>
                      
                      <p className="text-slate-400 mt-2 text-xs leading-relaxed line-clamp-3 font-sans">
                        {article.excerpt}
                      </p>
                    </div>

                    {/* Meta indicator metric tags */}
                    <div className="pt-4 border-t border-slate-800 flex items-center justify-between" id="article-card-indicators">
                      <div className="flex flex-wrap gap-1">
                        {article.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="text-[9px] bg-slate-900/70 border border-slate-800 text-slate-400 px-2 py-0.5 rounded-md font-mono">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Score metric block */}
                      <div className="text-right flex items-center space-x-2">
                        <div className="font-mono text-[10px] leading-tight text-slate-500">
                          <span>IMPACT</span>
                          <span className="block text-slate-300 font-bold text-xs">{article.impactScore}/100</span>
                        </div>
                        <div className={`w-3.5 h-3.5 rounded-full ${
                          article.sentiment === "Bullish" ? "bg-emerald-500" : article.sentiment === "Bearish" ? "bg-rose-500" : "bg-slate-650 text-slate-500"
                        }`} title={`Analyst bias: ${article.sentiment}`} />
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>


        {/* SYSTEM RAILS INTERACTIVE TRANSACTION FLOWMAP (Deep Educational Feature) */}
        <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-8 relative overflow-hidden border border-slate-800 shadow-2xl" id="transaction-flowmap-section">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.06),transparent_50%))] pointer-events-none"></div>
          
          {/* Section meta intro */}
          <div className="max-w-2xl space-y-2 relative z-10">
            <span className="text-[10px] uppercase font-mono tracking-widest text-blue-400 font-bold border border-blue-500/30 px-2 py-0.5 rounded bg-blue-950/40">
              Fintech Step-by-Step Flowchart Map
            </span>
            <h3 className="text-2xl font-extrabold tracking-tight">Interactive Financial Rails Flowchart Blueprint</h3>
            <p className="text-sm text-slate-400 font-sans leading-relaxed">
              Help yourself visually understand how credit cards settle versus real-time banking account networks (FedNow) and stablecoin blockchains. Click to dissect fee margins and speed bottlenecks.
            </p>
          </div>

          {/* Interactive Toggle Pill controls */}
          <div className="flex flex-wrap gap-2.5 relative z-10">
            {Object.keys(RAIL_FLOWS).map((flowKey) => (
              <button
                key={flowKey}
                onClick={() => {
                  setSelectedRail(flowKey as any);
                  setHoveredNode(null);
                }}
                className={`px-4.5 py-2.5 rounded-xl font-bold text-xs border transition-all ${
                  selectedRail === flowKey
                    ? "bg-blue-600 border-blue-500/50 text-white shadow-md ring-2 ring-blue-500/10"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                {flowKey}
              </button>
            ))}
          </div>

          {/* Node map horizontal visual pipeline */}
          <div className="relative z-10" id="rails-flowchart-map">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {RAIL_FLOWS[selectedRail].map((node, nidx) => {
                const isHovered = hoveredNode === nidx;
                return (
                  <div
                    key={nidx}
                    onMouseEnter={() => setHoveredNode(nidx)}
                    onMouseLeave={() => setHoveredNode(null)}
                    className={`p-4.5 rounded-xl transition-all duration-300 border flex flex-col justify-between shrink-0 select-none cursor-pointer ${
                      isHovered 
                        ? "bg-slate-800/80 border-blue-500 shadow-lg scale-[1.03] ring-1 ring-blue-500/20" 
                        : "bg-slate-950/80 border-slate-850 hover:border-slate-700"
                    }`}
                  >
                    <div>
                      {/* Step index pill */}
                      <span className="text-[9px] font-mono font-extrabold text-slate-500 block mb-1">NODE CRITICAL STEP 0{nidx + 1}</span>
                      <h5 className={`text-sm font-bold tracking-tight mb-1.5 transition-colors ${isHovered ? "text-blue-400" : "text-white"}`}>
                        {node.name}
                      </h5>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">{node.description}</p>
                    </div>

                    <div className="mt-4 pt-3.5 border-t border-slate-900 text-[10px] font-mono text-slate-450 space-y-1">
                      <div className="flex justify-between">
                        <span>Latency:</span>
                        <span className="text-white font-semibold">{node.latency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Friction Fee:</span>
                        <span className="text-blue-400 font-semibold">{node.fee}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Flow insights synopsis box */}
          <div className="p-4 bg-slate-950 border border-slate-855 rounded-xl font-mono text-xs text-slate-450 flex flex-wrap items-center justify-between gap-4 border-slate-800/80">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse inline-block shadow-[0_0_8px_rgba(59,130,246,0.6)]"></span>
              <span className="text-white font-medium">FLOW SYNOPSIS:</span>
              <span>
                {selectedRail === PaymentRailType.CREDIT_CARD && "Legacy credit auth features 6 middle segments taking 48 hours for deposit payouts."}
                {selectedRail === PaymentRailType.RTP_FEDNOW && "Instant A2A triggers direct central ledger debit settlement in real time for flat cents."}
                {selectedRail === PaymentRailType.STABLECOIN && "Blockchain base layer bypasses centralized core banks, handling immediate validation."}
              </span>
            </div>
            
            <button
              onClick={() => setSelectedArticle(ARTICLES_DATA[selectedRail === PaymentRailType.CREDIT_CARD ? 0 : selectedRail === PaymentRailType.RTP_FEDNOW ? 2 : 1])}
              className="text-blue-400 hover:text-blue-305 hover:text-blue-300 font-bold inline-flex items-center transition-colors hover:underline"
            >
              Related Article
              <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
            </button>
          </div>
        </section>


        {/* SAVING CALCULATOR SECTION */}
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 shadow-2xl" id="savings-calculator-section">
          {/* Left panel parameters */}
          <div className="lg:col-span-5 space-y-5">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-blue-400 font-bold bg-blue-950/40 px-2.5 py-0.5 rounded border border-blue-900/30">
                Calculator
              </span>
              <h3 className="text-xl font-extrabold text-white tracking-tight mt-1">Interchange Impact Calculator</h3>
              <p className="text-sm text-slate-400 font-sans leading-relaxed">
                Determine your annual margin leakage caused by legacy credit card merchant networks, and quantify immediate RTP routing savings.
              </p>
            </div>

            {/* Inputs list */}
            <div className="space-y-4 font-mono text-xs">
              <div className="space-y-1.5">
                <label className="text-slate-400 uppercase tracking-wider block">Monthly Settlement Volume (USD)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3.5 text-slate-550 font-bold">$</span>
                  <input
                    type="range"
                    min="10000"
                    max="5000000"
                    step="10000"
                    className="w-full accent-blue-500 mt-1 h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer"
                    value={monthlyVolume}
                    onChange={(e) => setMonthlyVolume(Number(e.target.value))}
                  />
                  <div className="flex justify-between items-center text-xs mt-1 text-slate-450 bg-slate-950 p-2.5 rounded-lg border border-slate-850 font-bold">
                    <span>Min: $10,000</span>
                    <span className="text-white">${monthlyVolume.toLocaleString()} USD</span>
                    <span>Max: $5M</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400 uppercase tracking-wider block">Average Transaction Value (Ticket Size)</label>
                <input
                  type="range"
                  min="5"
                  max="1000"
                  className="w-full accent-blue-500 mt-1 h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer"
                  value={avgTicketSize}
                  onChange={(e) => setAvgTicketSize(Number(e.target.value))}
                />
                <div className="flex justify-between items-center text-xs mt-1 text-slate-450 bg-slate-950 p-2.5 rounded-lg border border-slate-850 font-bold">
                  <span>Min: $5</span>
                  <span className="text-white">${avgTicketSize} USD</span>
                  <span>Max: $1,000</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 bg-slate-950 p-3 rounded-xl border border-slate-850">
                  <label className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold">Typical CC Surcharge Rate</label>
                  <div className="flex items-center space-x-1">
                    <input
                      type="number"
                      step="0.1"
                      min="1.0"
                      max="5.0"
                      className="w-full bg-transparent font-extrabold text-sm text-white focus:outline-none"
                      value={customCCRate}
                      onChange={(e) => setCustomCCRate(parseFloat(e.target.value) || 2.4)}
                    />
                    <span className="text-slate-505 text-slate-500">%</span>
                  </div>
                </div>

                <div className="space-y-1 bg-slate-955 bg-slate-950 p-3 rounded-xl border border-slate-850">
                  <label className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold">Estimated RTP Flat Fee</label>
                  <div className="flex items-center space-x-1">
                    <span className="text-slate-500">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      max="1.00"
                      className="w-full bg-transparent font-extrabold text-sm text-white focus:outline-none"
                      value={customRTPRate}
                      onChange={(e) => setCustomRTPRate(parseFloat(e.target.value) || 0.04)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right panel projections */}
          <div className="lg:col-span-7 bg-slate-950 text-white rounded-3xl p-5 sm:p-7 flex flex-col justify-between space-y-6 relative overflow-hidden border border-slate-850" id="calculator-output-sidebar">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.06),transparent_50%pointer-events-none)]"></div>
            
            <div className="space-y-5 relative z-10">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#10B981] font-bold border border-emerald-500/30 px-2 py-0.5 rounded bg-emerald-950/40">
                Calculated Projection Analysis
              </span>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                  <p className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">Legacy Interchange Expense</p>
                  <p className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                    ${calculatorSavings.ccCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    <span className="text-xs text-slate-500 block font-mono font-medium mt-0.5">Monthly leakage</span>
                  </p>
                </div>

                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                  <p className="text-[10px] font-mono tracking-widest text-blue-400 uppercase">Direct A2A Index Expense</p>
                  <p className="text-xl sm:text-2xl font-extrabold text-blue-400 mt-1">
                    ${calculatorSavings.rtpCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    <span className="text-xs text-emerald-500/55 block font-mono font-medium mt-0.5">With direct routing</span>
                  </p>
                </div>
              </div>

              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-mono text-slate-500 uppercase tracking-widest leading-none">Net Annual Savings Margin Recaptured</p>
                  <p className="text-2xl sm:text-4.5xl font-black text-white mt-1.5 tracking-tight font-sans">
                    ${calculatorSavings.annual.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    <span className="text-xs text-blue-400 font-mono font-bold block sm:inline sm:ml-2">
                       ({calculatorSavings.savingPercentage.toFixed(1)}% savings)
                    </span>
                  </p>
                </div>
                <div className="bg-blue-500/10 text-blue-400 p-3 rounded-lg border border-blue-500/20">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-905 border-slate-900 relative z-10 flex items-center justify-between text-[11px] font-mono text-slate-500 font-medium">
              <span>Financial Routing Model:</span>
              <span>RTP network fees are capped at $0.04 to $0.15 depending on bank nodes.</span>
            </div>
          </div>
        </section>


        {/* DETAILED ARTICLE EXPANDED DRAWER/MODAL POPUP OVERLAY */}
        {selectedArticle && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6" id="article-detail-modal">
            <div className="bg-slate-900 rounded-3xl max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-800 flex flex-col animate-fade-in animate-duration-200">
              
              {/* Header section with interactive close controller */}
              <div className="sticky top-0 bg-slate-900 border-b border-slate-800 p-5 flex items-center justify-between z-10">
                <span className="text-[10px] uppercase font-mono tracking-widest text-blue-400 font-bold bg-blue-955/40 px-2.5 py-0.5 rounded border border-blue-900/30">
                  {selectedArticle.category} Report Dossier
                </span>
                
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  id="close-article-modal-btn"
                >
                  <span className="font-mono text-xs font-extrabold uppercase border border-slate-700 px-2.5 py-1 rounded">CLOSE (ESC)</span>
                </button>
              </div>

              {/* Body Content flow wrapper styling */}
              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight tracking-tight">
                    {selectedArticle.title}
                  </h3>
                  
                  <div className="flex flex-wrap items-center space-x-4 text-xs font-mono text-slate-500 mt-4">
                    <span className="text-slate-300 font-semibold">{selectedArticle.author}</span>
                    <span>•</span>
                    <span>{selectedArticle.date}</span>
                    <span>•</span>
                    <span>{selectedArticle.readTime}</span>
                  </div>
                </div>

                <div className="space-y-4 text-slate-305 text-slate-300 text-sm sm:text-base leading-relaxed font-sans">
                  {selectedArticle.content.map((paragraph, pIdx) => (
                    <p key={pIdx}>{paragraph}</p>
                  ))}
                </div>

                {/* Technical sidebars metrics panels */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-slate-800 font-mono text-xs">
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-850 space-y-2">
                    <h5 className="font-bold text-slate-300 uppercase tracking-widest flex items-center">
                      <ShieldAlert className="w-3.5 h-3.5 mr-1.5 text-rose-500" /> Regulation Risk Matrix
                    </h5>
                    <div className="flex justify-between pt-1">
                      <span className="text-slate-500">Risk Profile:</span>
                      <span className={`font-bold ${
                        selectedArticle.riskFactor === "High" ? "text-rose-500" : selectedArticle.riskFactor === "Medium" ? "text-amber-500" : "text-emerald-500"
                      }`}>{selectedArticle.riskFactor}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Yield Potential:</span>
                      <span className="text-slate-300 font-bold">{selectedArticle.growthPotential}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">System Impact Score:</span>
                      <span className="text-white font-extrabold">{selectedArticle.impactScore}/100</span>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-955 bg-slate-950 text-slate-300 border border-slate-850 rounded-xl space-y-2">
                    <h5 className="font-bold text-white uppercase tracking-widest">Macro Catalysts To Watch</h5>
                    <ul className="space-y-1 list-disc list-inside text-[11px] text-slate-400">
                      {selectedArticle.catalysts.map((cat, cIdx) => (
                        <li key={cIdx}>{cat}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Sticky bottom modal actions block */}
              <div className="bg-[#0c0f1e] p-5 border-t border-slate-800 flex items-center justify-between rounded-b-3xl">
                <button
                  onClick={(e) => toggleBookmark(selectedArticle.id, e)}
                  className={`px-4 py-2 text-xs rounded-lg font-mono font-bold flex items-center border transition-all ${
                    savedArticles.includes(selectedArticle.id)
                      ? "bg-blue-500/10 border-blue-500/40 text-blue-450 text-blue-400"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5 mr-1.5" />
                  {savedArticles.includes(selectedArticle.id) ? "BOOKMARKED" : "SAVE TO BOOKMARKS"}
                </button>

                <div className="text-xs text-slate-500 font-mono">
                  Read complete index reports in our paid print bundle monthly
                </div>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-[#05070a] text-slate-500 border-t border-slate-900 py-12 mt-20" id="main-landing-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3 md:col-span-1">
              <div className="text-white font-extrabold tracking-tight text-lg flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
                FINTECH <span className="text-blue-500 font-medium ml-1">PULSE</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-sans mt-2">
                Next-generation daily coverage, analysis charts, and institutional blueprints for payments, cryptocurrencies, stablecoin transfer velocities, and equity performance.
              </p>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <span className="text-white uppercase tracking-widest font-bold">PLATFORM SECTORS</span>
              <ul className="space-y-2 text-slate-400">
                <li><a onClick={() => setSelectedCategory(FintechCategory.PAYMENTS)} className="hover:text-blue-400 hover:underline cursor-pointer transition-colors">Payments Routing</a></li>
                <li><a onClick={() => setSelectedCategory(FintechCategory.CRYPTO)} className="hover:text-blue-400 hover:underline cursor-pointer transition-colors">Digital Blockchains</a></li>
                <li><a onClick={() => setSelectedCategory(FintechCategory.WALLETS)} className="hover:text-blue-400 hover:underline cursor-pointer transition-colors">Digital Wallets & A2A</a></li>
                <li><a onClick={() => setSelectedCategory(FintechCategory.EQUITIES)} className="hover:text-blue-400 hover:underline cursor-pointer transition-colors">Fintech Equities</a></li>
              </ul>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <span className="text-white uppercase tracking-widest font-bold">EDUCATIONAL UTILITIES</span>
              <ul className="space-y-2 text-slate-400">
                <li><a onClick={() => { setSelectedRail(PaymentRailType.CREDIT_CARD); const el = document.getElementById("rails-flowchart-map"); el?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-blue-400 hover:underline cursor-pointer transition-colors">Credit Authorization Route</a></li>
                <li><a onClick={() => { setSelectedRail(PaymentRailType.RTP_FEDNOW); const el = document.getElementById("rails-flowchart-map"); el?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-blue-400 hover:underline cursor-pointer transition-colors">Account-To-Account Flow</a></li>
                <li><a onClick={() => { setSelectedRail(PaymentRailType.STABLECOIN); const el = document.getElementById("rails-flowchart-map"); el?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-blue-400 hover:underline cursor-pointer transition-colors">Stablecoins Settle Protocol</a></li>
                <li><a className="hover:text-slate-300 transition-colors cursor-pointer">Whitepapers & Blueprints</a></li>
              </ul>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <span className="text-white uppercase tracking-widest font-bold">RESOURCES</span>
              <ul className="space-y-2 text-slate-405 text-slate-400">
                <li><a className="hover:text-blue-400 hover:underline transition-colors cursor-pointer">Research Index Dossiers</a></li>
                <li><a className="hover:text-blue-400 hover:underline transition-colors cursor-pointer">Developer API Guides</a></li>
                <li><a className="hover:text-blue-400 hover:underline transition-colors cursor-pointer">Security Compliance Standards</a></li>
                <li><a className="hover:text-blue-400 hover:underline transition-colors cursor-pointer">Platform Status Intelligence</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-900 mt-10 pt-6 flex flex-wrap items-center justify-between text-xs text-slate-600 font-mono">
            <span>© 2026 Fintech Pulse Insights. All Rights Reserved.</span>
            <span>Real-time indices are mock indicators for visual study and simulation purposes.</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

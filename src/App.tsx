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
  Info,
  Share2,
  Twitter,
  Linkedin,
  Copy,
  Check
} from "lucide-react";

// Categorization Enums for strong typing
enum FintechCategory {
  ALL = "All Sectors",
  PAYMENTS = "Payments",
  CRYPTO = "Crypto",
  WALLETS = "Digital Wallets",
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
    tags: ["CCCA", "Interchange", "Visa", "Mastercard", "Regulation", "A2A Payments", "Open Banking"],
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
    tags: ["Stablecoins", "USDC", "USDT", "Cross-Border Settlement", "Stripe", "Embedded Finance", "Regulation"],
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
    tags: ["Wero", "PSD3", "Open Banking", "A2A Payments", "Apple Pay", "Regulation"],
    riskFactor: "Low",
    growthPotential: "Moderate",
    catalysts: [
      "Wero completing national deployment alongside 16 major banks.",
      "Regulatory mandates restricting Apple's exclusive NFC chip API access.",
      "Lufthansa in talks to integrate Direct-Debit A2A checkouts."
    ],
    impactScore: 74,
    sentiment: "Neutral"
  }
];

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
  const [activeShareId, setActiveShareId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Close share dropdown on document click
  useEffect(() => {
    const handleDocumentClick = () => {
      setActiveShareId(null);
    };
    document.addEventListener("click", handleDocumentClick);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  // Flow simulator state
  const [selectedRail, setSelectedRail] = useState<PaymentRailType>(PaymentRailType.CREDIT_CARD);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  // Calculator state variables
  const [monthlyVolume, setMonthlyVolume] = useState<number>(350000); // USD
  const [avgTicketSize, setAvgTicketSize] = useState<number>(85); // USD
  const [customCCRate, setCustomCCRate] = useState<number>(2.4); // Percentage
  const [customRTPRate, setCustomRTPRate] = useState<number>(0.2); // flat rate or low A2A %

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

  // Recommended articles for detailed modal (matching >= 2 tags)
  const recommendedArticles = useMemo(() => {
    if (!selectedArticle) return [];
    return ARTICLES_DATA.filter((article) => {
      if (article.id === selectedArticle.id) return false;
      const currentTags = selectedArticle.tags || [];
      const articleTags = article.tags || [];
      const sharedCount = currentTags.filter((tag) => articleTags.includes(tag)).length;
      return sharedCount >= 2;
    });
  }, [selectedArticle]);

  // Scroll modal scrollable container to top on selection change
  useEffect(() => {
    if (selectedArticle) {
      const scrollBox = document.getElementById("article-modal-scrollable-content");
      if (scrollBox) {
        scrollBox.scrollTop = 0;
      }
    }
  }, [selectedArticle]);

  // Read saved bookmarks from dynamic array
  const toggleBookmark = (id: string, e: MouseEvent) => {
    e.stopPropagation();
    setSavedArticles((prev) =>
      prev.includes(id) ? prev.filter((artId) => artId !== id) : [...prev, id]
    );
  };

  const handleShareClick = (id: string, e: MouseEvent) => {
    e.stopPropagation();
    setActiveShareId((prev) => (prev === id ? null : id));
  };

  const handleCopyLink = (article: Article, e: MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}${window.location.pathname}?article=${article.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopiedId(article.id);
      setTimeout(() => setCopiedId(null), 2000);
    }).catch((err) => {
      console.error("Could not copy link:", err);
    });
  };

  const handleShareSocial = (article: Article, platform: "twitter" | "linkedin", e: MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}${window.location.pathname}?article=${article.id}`;
    const text = `Fintech Pulse dossier: "${article.title}"`;
    let url = "";
    if (platform === "twitter") {
      url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
    } else if (platform === "linkedin") {
      url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    }
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
    setActiveShareId(null);
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

  return (
    <div className="min-h-screen bg-[#05070A] text-slate-100 antialiased selection:bg-blue-950 selection:text-blue-300" id="fintech-portal-root">

      {/* Modern High-End Editorial Header with Liquidglass effect */}
      <header 
        className={`sticky transition-all duration-500 ease-in-out z-40 ${
          isScrolled 
            ? "top-0 left-0 right-0 w-full py-0" 
            : "top-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4"
        }`} 
        id="main-navigation-header"
      >
        <div className={`transition-all duration-500 ease-in-out relative group overflow-hidden ${
          isScrolled 
            ? "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-0 bg-[#05070a]/80 backdrop-blur-3xl border-b border-white/[0.08] shadow-[0_12px_45px_rgba(0,0,0,0.8)]" 
            : "rounded-2xl sm:rounded-3xl border border-white/[0.08] bg-[#0b0e17]/35 backdrop-blur-md sm:backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1.5px_1.5px_0_rgba(255,255,255,0.08)] shadow-blue-900/5 hover:border-white/15 hover:shadow-blue-950/10"
        }`}>
          {/* Shifting background liquid color flow and glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/[0.05] via-indigo-500/[0.03] to-emerald-500/[0.05] pointer-events-none"></div>
          
          {/* Micro neon top glare */}
          <div className="absolute top-[1px] left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent blur-[0.5px] pointer-events-none"></div>
          
          {/* Gel-like gloss glow reflection layer */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(120,119,198,0.12),transparent_70%)] pointer-events-none"></div>

          {/* Shimmer transition reflection bar */}
          <div className="absolute -inset-x-full top-0 bottom-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent transform -skew-x-12 transition-transform duration-1000 group-hover:translate-x-full pointer-events-none"></div>

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
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-mono mt-1 font-semibold">Payments & Blockchains Intelligence</p>
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
                  Today's Briefing
                </span>
                <BookOpen className="w-5 h-5 text-blue-400" />
              </div>

              <div>
                <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-2 font-semibold">Today's Market Synthesis</h3>
                <p className="text-sm text-slate-300 leading-relaxed font-sans">
                  The payments routing infrastructure framework is experiencing its largest legislative strain in a generation. At the same time, liquid non-bank deposits seek secure digital wallet and stablecoin velocity pipelines.
                </p>
              </div>

              <div className="space-y-3.5 bg-[#05070A]/55 p-4 rounded-xl border border-slate-800 font-mono text-xs">
                <div className="space-y-1">
                  <div className="flex items-center font-bold space-x-1.5 text-blue-400">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                    <span>Stablecoin Velocities Shift</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans leading-normal pl-3">
                    Merchant volume shifts from speculative pools to cross-border utility channels.
                  </p>
                </div>
                <div className="space-y-1 border-t border-slate-800/80 pt-2.5">
                  <div className="flex items-center font-bold space-x-1.5 text-blue-400">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                    <span>Sovereign A2A Expansion</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans leading-normal pl-3">
                    Wero continues direct bank account integrations across Europe to rival card networks.
                  </p>
                </div>
                <div className="space-y-1 border-t border-slate-800/80 pt-2.5">
                  <div className="flex items-center font-bold space-x-1.5 text-blue-400">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                    <span>Interchange Margin Pressures</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans leading-normal pl-3">
                    Under CCCA legislative pressure, card processors plan secondary routing alternatives.
                  </p>
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
                        
                        <div className="flex items-center space-x-1.5 relative">
                          <span className="flex items-center mr-1 text-[11px]"><Clock className="w-3 h-3 mr-0.5 text-slate-500 animate-pulse" /> {article.readTime}</span>
                          
                          {/* Share button with dropdown */}
                          <div className="relative">
                            <button
                              onClick={(e) => handleShareClick(article.id, e)}
                              className={`text-slate-500 hover:text-white p-1 hover:bg-slate-800 rounded-md transition-colors relative flex items-center justify-center ${activeShareId === article.id ? 'text-white bg-slate-800' : ''}`}
                              title="Share this article"
                              id={`share-btn-${article.id}`}
                            >
                              <Share2 className="w-3.5 h-3.5" />
                            </button>

                            {/* Share Dropdown Overlay */}
                            {activeShareId === article.id && (
                              <div 
                                onClick={(e) => e.stopPropagation()} 
                                className="absolute right-0 top-7 w-48 bg-slate-950/95 backdrop-blur-md rounded-xl border border-slate-800 p-1.5 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.6)] z-30 animate-fade-in text-xs font-sans text-slate-300 pointer-events-auto"
                                id={`share-dropdown-${article.id}`}
                              >
                                <div className="px-2 py-1.5 border-b border-slate-900 mb-1 text-[10px] text-slate-500 font-mono uppercase tracking-wider">
                                  Share Dossier
                                </div>
                                <button
                                  onClick={(e) => handleShareSocial(article, "twitter", e)}
                                  className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-white/[0.05] hover:text-white transition-all flex items-center space-x-2"
                                >
                                  <Twitter className="w-3.5 h-3.5 text-sky-400" />
                                  <span>Share on X</span>
                                </button>
                                <button
                                  onClick={(e) => handleShareSocial(article, "linkedin", e)}
                                  className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-white/[0.05] hover:text-white transition-all flex items-center space-x-2"
                                >
                                  <Linkedin className="w-3.5 h-3.5 text-blue-400" />
                                  <span>Share on LinkedIn</span>
                                </button>
                                <button
                                  onClick={(e) => handleCopyLink(article, e)}
                                  className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-white/[0.05] hover:text-white transition-all flex items-center justify-between"
                                >
                                  <div className="flex items-center space-x-2 font-sans">
                                    {copiedId === article.id ? (
                                      <Check className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                                    ) : (
                                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                                    )}
                                    <span>{copiedId === article.id ? "Copied Link!" : "Copy Link"}</span>
                                  </div>
                                </button>
                              </div>
                            )}
                          </div>

                          <button
                            onClick={(e) => toggleBookmark(article.id, e)}
                            className="text-slate-505 text-slate-500 hover:text-white hover:bg-slate-800 p-1 rounded-md transition-colors"
                            title="Bookmark this post"
                            id={`bookmark-btn-${article.id}`}
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
            <div id="article-modal-scrollable-content" className="bg-slate-900 rounded-3xl max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-800 flex flex-col animate-fade-in animate-duration-200">
              
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

                <div className="space-y-4 text-slate-350 text-slate-300 text-sm sm:text-base leading-relaxed font-sans">
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

                  <div className="p-4 bg-slate-950 text-slate-300 border border-slate-850 rounded-xl space-y-2">
                    <h5 className="font-bold text-white uppercase tracking-widest">Macro Catalysts To Watch</h5>
                    <ul className="space-y-1 list-disc list-inside text-[11px] text-slate-400">
                      {selectedArticle.catalysts.map((cat, cIdx) => (
                        <li key={cIdx}>{cat}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Recommended For You Section */}
                <div className="pt-6 border-t border-slate-800 space-y-4" id="recommended-dossiers-section">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider font-mono flex items-center">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 animate-pulse inline-block"></span>
                        Recommended For You
                      </h4>
                      <p className="text-[11px] text-slate-500 font-sans mt-0.5">Report dossiers linked by shared thematic policy pillars</p>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-2.5 py-1 rounded border border-slate-850" id="recommended-matches-count">
                      {recommendedArticles.length} {recommendedArticles.length === 1 ? "match" : "matches"} found
                    </span>
                  </div>

                  {recommendedArticles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="recommended-articles-grid">
                      {recommendedArticles.map((recArticle) => {
                        const sharedTags = selectedArticle.tags.filter(tag => recArticle.tags.includes(tag));
                        return (
                          <div 
                            key={recArticle.id}
                            id={`recommended-card-${recArticle.id}`}
                            onClick={() => setSelectedArticle(recArticle)}
                            className="bg-slate-950/40 hover:bg-slate-950/90 border border-slate-850 hover:border-blue-500/40 rounded-2xl p-4 transition-all duration-300 cursor-pointer group flex flex-col justify-between space-y-3 shadow-md hover:shadow-blue-500/5 select-none"
                          >
                            <div className="space-y-1.5">
                              <div className="flex justify-between items-center text-[10px] font-mono">
                                <span className="text-blue-500 font-bold uppercase tracking-wider">{recArticle.category}</span>
                                <span className="text-slate-500">{recArticle.readTime}</span>
                              </div>
                              <h5 className="text-sm font-bold text-slate-200 group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                                {recArticle.title}
                              </h5>
                            </div>

                            <div className="pt-2 border-t border-slate-900/60 flex items-center justify-between text-[9px] font-mono">
                              <div className="flex flex-wrap gap-1 max-w-[70%]">
                                {sharedTags.slice(0, 2).map((tag, tIdx) => (
                                  <span key={tIdx} className="text-blue-400 bg-blue-950/30 px-1.5 py-0.5 rounded text-[8px] tracking-tight">
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                              <span className="text-slate-500 shrink-0">
                                {sharedTags.length} shared {sharedTags.length === 1 ? "tag" : "tags"}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="bg-slate-950/20 border border-dashed border-slate-850 rounded-2xl p-6 text-center" id="no-recommendations-placeholder">
                      <p className="text-xs text-slate-500 font-sans">No other dossiers match the required thematic policy indicators at this time.</p>
                    </div>
                  )}
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
                Next-generation daily coverage, analysis charts, and institutional blueprints for payments, cryptocurrencies, and stablecoin transfer velocities.
              </p>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <span className="text-white uppercase tracking-widest font-bold">PLATFORM SECTORS</span>
              <ul className="space-y-2 text-slate-400">
                <li><a onClick={() => setSelectedCategory(FintechCategory.PAYMENTS)} className="hover:text-blue-400 hover:underline cursor-pointer transition-colors">Payments Routing</a></li>
                <li><a onClick={() => setSelectedCategory(FintechCategory.CRYPTO)} className="hover:text-blue-400 hover:underline cursor-pointer transition-colors">Digital Blockchains</a></li>
                <li><a onClick={() => setSelectedCategory(FintechCategory.WALLETS)} className="hover:text-blue-400 hover:underline cursor-pointer transition-colors">Digital Wallets & A2A</a></li>
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

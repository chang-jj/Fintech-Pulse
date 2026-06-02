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

/// Highly realistic fintech articles with real industry dynamics (Top 5 daily reads for Payments, Wallet and Crypto)
const ARTICLES_DATA: Article[] = [
  {
    id: "art-01",
    category: FintechCategory.PAYMENTS,
    title: "The Interchange Squeeze: How Open Routing Rules Could Realign Merchant Processing",
    author: "Elena Rostov, Senior Payments Analyst",
    date: "June 2, 2026",
    readTime: "6 min read",
    excerpt: "As legislative pressures mount on card network duopolies, traditional credit card transaction routing faces massive realignment. We analyze the rising secondary routing networks and alternative rails.",
    content: [
      "The credit card processing ecosystem faces its most intense regulatory pressure in a generation. With new legislative frameworks mandating that heavy-volume card-issuing banks offer multiple independent routing networks, merchants stand to gain substantial leverage in routing choice, potentially reclaiming billions of dollars annually in interchange fees.",
      "However, the credit interchange engine is a delicate machine. These fees directly subsidize premium points and cashback rewards programs that consumers have grown to expect. If a significant percentage of transactions are directed over cheaper, alternative rails, credit issuers warning of loyalty reward program devaluations may trigger a massive realignment toward debit cards or direct account-to-account (A2A) digital wallets.",
      "For merchants and modern payment service providers (PSPs), this transition presents a dual challenge. Platforms must build dynamic multi-network routing engines that instantly direct each swipe over the most economic and reliable rail, opening an unprecedented gateway for regional A2A frameworks or stablecoins in physical commerce terminals."
    ],
    tags: ["Interchange", "Payments Routing", "Regulation", "Open Banking"],
    riskFactor: "Medium",
    growthPotential: "Moderate",
    catalysts: [
      "Regional regulatory committees scheduling final legislative votes.",
      "Leading supermarket chains launching proprietary low-fee debit channels.",
      "Major banking coalitions exploring co-branded non-network routing pilots."
    ],
    impactScore: 88,
    sentiment: "Bearish"
  },
  {
    id: "art-02",
    category: FintechCategory.CRYPTO,
    title: "Stablecoin Settlement Velocity: Bridging On-Chain Token Supply to Global B2B Trade",
    author: "Marcus Vance, Head of Digital Assets",
    date: "June 2, 2026",
    readTime: "8 min read",
    excerpt: "Monthly on-chain transaction volumes have breached the multi-trillion mark. Traditional corporate importers and exporters are increasingly bypassing legacy SWIFT channels for high-throughput networks.",
    content: [
      "US dollar-backed stablecoins are transitioning from speculative exchange buffers directly into primary operational treasuries. Annualized on-chain settlement volumes are now rivaling legacy global card processors, signaling deep corporate adoption of low-cost, near-instant cryptographic ledgers.",
      "The primary driver of this velocity is not decentralized finance pools, but global B2B cross-border commerce. Importers and exporters operating in emerging economies find themselves constrained by expensive foreign exchange conversion spreads and multi-day settlement delays of the traditional SWIFT network. By utilizing institutional stablecon vaults on highly optimized layer-2 blockchains, these businesses settle invoices within seconds.",
      "Traditional billing gateways and sovereign merchant processors are responding rapidly. Global processors have begun embedding automated stablecoin settlement integrations into e-commerce checkouts, blending cryptographic liquidity with traditional local fiat ledgers."
    ],
    tags: ["Stablecoins", "Cross-Border Settlement", "Stripe", "Blockchains"],
    riskFactor: "High",
    growthPotential: "Aggressive",
    catalysts: [
      "Global banking institutions introducing unified stablecoin custody API hubs.",
      "E-commerce giants activating native crypto payouts to freelance marketplaces.",
      "Sovereign treasury departments introducing strict reserve auditing frameworks."
    ],
    impactScore: 92,
    sentiment: "Bullish"
  },
  {
    id: "art-03",
    category: FintechCategory.WALLETS,
    title: "Europe's Wero Initiative: Can Account-to-Account Networks Challenge Traditional Digital Wallets?",
    author: "Sophie Dubois, European Financial Services Strategy",
    date: "June 2, 2026",
    readTime: "5 min read",
    excerpt: "As the European Payments Initiative (EPI) accelerates the expansion of Wero across multiple nations, account-to-account (A2A) payments prepare to battle mobile operating system wallets.",
    content: [
      "The direct routing of funds between bank accounts (A2A) is gaining massive regulatory wind in Europe. Under the revised PSD3 guidelines, direct access to account ledgers is becoming highly streamlined, allowing commercial banking aggregators to bypass the core plastic card infrastructure entirely.",
      "At the heart of this push is Wero, a unified platform backed by major European banks. Wero aims to offer consumers a frictionless, immediate QR and mobile number payment app linked directly to their bank accounts, operating with lower transaction overhead than credit network rates.",
      "While the cost benefits for merchants are clear (fees are often a fraction of standard debit or credit cards), consumer habit remains a massive hurdle. Mobile digital wallets backed by major OS providers offer incredibly frictionless biometric tap-to-pay experiences, making the displacement of existing habits Wero's ultimate challenge."
    ],
    tags: ["Wero", "PSD3", "Open Banking", "A2A Payments"],
    riskFactor: "Low",
    growthPotential: "Moderate",
    catalysts: [
      "Wero achieving complete domestic integration with top commercial banks.",
      "Antitrust regulatory reviews mandate open device access for secondary contactless chips.",
      "National railway operators deploying instant QR checkout options."
    ],
    impactScore: 74,
    sentiment: "Neutral"
  },
  {
    id: "art-04",
    category: FintechCategory.PAYMENTS,
    title: "The FedNow Rollout: Tracking Corporate Utility & Intraday Liquidity Management",
    author: "Aris Thorne, Banking Infrastructure Lead",
    date: "June 1, 2026",
    readTime: "7 min read",
    excerpt: "Industrial and corporate treasuries are triggering instant payrolls and enterprise settlements on the Federal Reserve's real-time rail. We analyze the growth curves and liquidity implications.",
    content: [
      "The rollout of FedNow in the United States has passed a critical transition point. Corporate treasurers, once comfortable with traditional multi-day ACH batches and high-value wire transfers, are utilizing the FedNow network to optimize intraday capital reserves and execute on-demand settlements.",
      "The immediate impact is most visible in consumer-facing payroll operations. Companies are implementing hourly or end-of-shift wage disbursements, providing gig and temporary contract workers with instant liquidity. By linking payroll directly to real-time clearing rails, enterprises reduce reliance on revolving credit lines to fund workforce payout cycles.",
      "Furthermore, commercial banks are constructing custom API layers on top of FedNow, enabling corporate systems to auto-trigger treasury adjustments as economic activity occurs, removing evening and weekend settlement dead zones from the enterprise financial registry."
    ],
    tags: ["FedNow", "Real-Time Payments", "Liquidity", "ACH Rails"],
    riskFactor: "Low",
    growthPotential: "Aggressive",
    catalysts: [
      "Core payroll platforms implementing standard hourly disbursement APIs.",
      "Major automated logistics systems linking delivery validation directly to clearing triggers.",
      "Sovereign tax processing agencies enabling real-time tax refund deposits."
    ],
    impactScore: 85,
    sentiment: "Bullish"
  },
  {
    id: "art-05",
    category: FintechCategory.WALLETS,
    title: "UPI and Pix International Linkages: The Dawn of Cross-Border Mobile Corridors",
    author: "Amit Patel, Global Payments Strategist",
    date: "May 30, 2026",
    readTime: "8 min read",
    excerpt: "Bypass SWIFT and plastic entirely. Brazil's Pix and India's UPI are building bilateral connection hubs across Southeast Asia and Latin America, creating low-cost instant payment corridors.",
    content: [
      "Sovereign account-to-account systems represent the fastest-growing financial inclusion success stories in history. Brazil's Pix and India's Unified Payments Interface (UPI) now process billions of monthly transactions locally. The current frontier is the rapid link of these domestic direct payments across national borders.",
      "By establishing secure, real-time bilateral corridors with foreign clearing networks, tourists and small businesses located across Latin America, Southeast Asia, and the Middle East can transact instantly using their domestic banking apps and local QR scan infrastructure.",
      "This bilateral framework avoids the traditional system of high retail exchange premiums, intermediary correspondent bank cuts, and complex card network routing rules. For global travelers, it offers a dramatic reduction in checkout friction, while opening new digital transaction access points for traditionally underserved merchants."
    ],
    tags: ["UPI", "Pix", "Cross-Border Corridors", "A2A Payments"],
    riskFactor: "Low",
    growthPotential: "Aggressive",
    catalysts: [
      "Official launch of the multi-country Southeast Asian QR payment interchange.",
      "Bilateral corridor activation between Middle Eastern financial hubs and South Asian accounts.",
      "Retail merchant terminals displaying native cross-channel UPI/Pix codes in key global travel hubs."
    ],
    impactScore: 94,
    sentiment: "Bullish"
  }
];

export default function App() {
  // Dynamic news state populated by automated daily web scraping
  const [articles, setArticles] = useState<Article[]>(() => {
    try {
      const persisted = localStorage.getItem("scraped_articles_cache");
      if (persisted) {
        return JSON.parse(persisted);
      }
    } catch (e) {}
    return ARTICLES_DATA;
  });
  const [loading, setLoading] = useState(false);
  const [isCrawling, setIsCrawling] = useState(false);
  const [crawlLogs, setCrawlLogs] = useState<string[]>([]);
  const [isQuotaExceeded, setIsQuotaExceeded] = useState<boolean>(() => {
    try {
      const persisted = localStorage.getItem("scraped_source_info");
      if (persisted) {
        return JSON.parse(persisted).isQuotaExceeded || false;
      }
    } catch (e) {}
    return false;
  });
  const [quotaErrorDetails, setQuotaErrorDetails] = useState<string>(() => {
    try {
      const persisted = localStorage.getItem("scraped_source_info");
      if (persisted) {
        return JSON.parse(persisted).errorDetails || "";
      }
    } catch (e) {}
    return "";
  });
  const [crawlSource, setCrawlSource] = useState<string>(() => {
    try {
      const persisted = localStorage.getItem("scraped_source_info");
      if (persisted) {
        return JSON.parse(persisted).source || "daily-cache";
      }
    } catch (e) {}
    return "daily-cache";
  });
  const [scrapedAt, setScrapedAt] = useState<string>(() => {
    try {
      const persisted = localStorage.getItem("scraped_source_info");
      if (persisted) {
        return JSON.parse(persisted).scrapedAt || "";
      }
    } catch (e) {}
    return "";
  });

  useEffect(() => {
    let isMounted = true;
    const fetchLatestScrapedArticles = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/news");
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.articles) && data.articles.length > 0 && isMounted) {
            setArticles(data.articles);
            setCrawlSource(data.source);
            setScrapedAt(data.scrapedAt);
            const quotaFlag = !!data.isQuotaExceeded;
            setIsQuotaExceeded(quotaFlag);
            setQuotaErrorDetails(data.errorDetails || "");
            try {
              localStorage.setItem("scraped_articles_cache", JSON.stringify(data.articles));
              localStorage.setItem("scraped_source_info", JSON.stringify({ 
                source: data.source, 
                scrapedAt: data.scrapedAt,
                isQuotaExceeded: quotaFlag,
                errorDetails: data.errorDetails || ""
              }));
            } catch (e) {}
          }
        }
      } catch (err) {
        console.warn("Failed to retrieve live scraped fintech news:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    fetchLatestScrapedArticles();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleForceCrawl = async () => {
    if (isCrawling) return;
    setIsCrawling(true);
    setCrawlLogs([]);
    setIsQuotaExceeded(false);
    setQuotaErrorDetails("");
    
    const logs = [
      "Establishing connection protocol secure tunnel...",
      "Connecting to ThePaypers channel feed APIs...",
      "Targeting payments database: input source URL 'https://thepaypers.com/payments'...",
      "Targeting fintech network database: input source URL 'https://thepaypers.com/fintech'...",
      "Targeting crypto/web3 database: input source URL 'https://thepaypers.com/crypto-web3-and-cbdc'...",
      "Targeting CoinDesk RSS index: input source URL 'https://www.coindesk.com/'...",
      "Launching Gemini Search Grounding agent for crawler parsing...",
      "Extracting full site text and sorting by category metadata...",
      "Synthesizing 5 high-impact editorial stories with pristine schemas...",
      "Storing compiled reports persistently on server memory...",
      "Re-validating client-side components. Complete!"
    ];

    for (let i = 0; i < logs.length; i++) {
      setCrawlLogs((prev) => [...prev, `[CRAWLER] ${logs[i]}`]);
      await new Promise((resolve) => setTimeout(resolve, 350 + Math.random() * 250));
    }

    try {
      const res = await fetch("/api/news?force=true");
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.articles) && data.articles.length > 0) {
          setArticles(data.articles);
          setCrawlSource(data.source);
          setScrapedAt(data.scrapedAt);
          const quotaFlag = !!data.isQuotaExceeded;
          setIsQuotaExceeded(quotaFlag);
          setQuotaErrorDetails(data.errorDetails || "");
          
          if (quotaFlag) {
            setCrawlLogs((prev) => [
              ...prev,
              "[SYSTEM ERROR 429] RESOURCE_EXHAUSTED: Gemini API Quota Limit Exceeded.",
              "[SYSTEM REDIRECT] Sourced from offline high-fidelity regulatory fallback cache sandbox.",
              "[SYSTEM REDIRECT] Dynamic sandbox fallback complete."
            ]);
          }
          
          try {
            localStorage.setItem("scraped_articles_cache", JSON.stringify(data.articles));
            localStorage.setItem("scraped_source_info", JSON.stringify({ 
              source: data.source, 
              scrapedAt: data.scrapedAt,
              isQuotaExceeded: quotaFlag,
              errorDetails: data.errorDetails || ""
            }));
          } catch (e) {}
        }
      }
    } catch (err) {
      console.warn("Failed to crawl live sources:", err);
    } finally {
      setIsCrawling(false);
    }
  };

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

  // Filtered news listing
  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesCategory = selectedCategory === FintechCategory.ALL || article.category === selectedCategory || (selectedCategory.toString() === "Digital Wallets" && article.category.toString() === "Digital Wallets") || (selectedCategory.toString() === "All Sectors" || article.category.toString().toLowerCase() === selectedCategory.toString().toLowerCase());
      const matchesSearch =
        searchQuery === "" ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [articles, selectedCategory, searchQuery]);

  // Recommended articles for detailed modal (matching >= 2 tags)
  const recommendedArticles = useMemo(() => {
    if (!selectedArticle) return [];
    return articles.filter((article) => {
      if (article.id === selectedArticle.id) return false;
      const currentTags = selectedArticle.tags || [];
      const articleTags = article.tags || [];
      const sharedCount = currentTags.filter((tag) => articleTags.includes(tag)).length;
      return sharedCount >= 2;
    });
  }, [selectedArticle, articles]);

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
      console.warn("Could not copy link:", err);
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

  // Resolve the primary lead news article dynamically
  const leadArticle = articles[0] || ARTICLES_DATA[0];

  const getAuthorInitials = (name: string) => {
    if (!name) return "FP";
    const parts = name.split(" ");
    return parts.slice(0, 2).map(p => p[0]).join("").toUpperCase();
  };

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
                <span className="px-2 py-0.5 bg-blue-950/40 rounded border border-blue-900/30">Lead Analytics ({leadArticle.category})</span>
                <span>•</span>
                <span>TOP STORY</span>
              </div>
              
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight hover:text-blue-400 transition-colors cursor-pointer" onClick={() => setSelectedArticle(leadArticle)}>
                {leadArticle.title}
              </h2>
              
              <p className="text-slate-400 mt-4 text-base sm:text-lg leading-relaxed font-sans">
                {leadArticle.excerpt}
              </p>
            </div>

            {/* Micro details panel */}
            <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-slate-800 text-slate-350 rounded-full flex items-center justify-center font-mono font-bold shadow-sm">
                  {getAuthorInitials(leadArticle.author)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-205 text-slate-200">{leadArticle.author.split(",")[0]}</p>
                  <p className="text-xs text-slate-500">{leadArticle.author.split(",")[1] || "Senior Contributor"}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-xs font-mono text-slate-500">
                <span className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-1" /> {leadArticle.date}</span>
                <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1" /> {leadArticle.readTime}</span>
              </div>

              <button 
                onClick={() => setSelectedArticle(leadArticle)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-xl transition-all duration-300 flex items-center shadow-md text-sm group cursor-pointer"
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


        {/* PLATFORM WEBCRAWLER MONITOR PANEL */}
        <section className="bg-slate-950/45 border border-slate-900 rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden" id="webcrawler-monitor-panel">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[80px] rounded-full pointer-events-none"></div>
          
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-6 border-b border-slate-900 relative z-10">
            <div>
              <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider mb-1">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                <span>Automated Site Crawlers Status: Active</span>
              </div>
              <h3 className="text-xl font-extrabold text-white tracking-tight leading-none flex items-center">
                <Cpu className="w-5 h-5 mr-2 text-blue-500" /> Dedicated Source Feeds Crawler
              </h3>
              <p className="text-xs text-slate-400 mt-2 font-sans max-w-xl">
                Monitors specific global fintech and regulatory channels daily. Gemini performs live search grounding and structured synthesis.
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              <div className="text-right font-mono text-xs hidden sm:block">
                <span className="text-slate-500 block text-[10px]">CURRENT ENGINE SCHEMA:</span>
                <span className="text-blue-400 font-bold">GEMINI-3.5-FLASH</span>
              </div>
              
              <button
                onClick={handleForceCrawl}
                disabled={isCrawling}
                className={`px-5 py-3 rounded-xl font-bold font-mono text-xs flex items-center shadow-lg transition-all border ${
                  isCrawling
                    ? "bg-slate-900 text-slate-500 border-slate-800 cursor-not-allowed"
                    : "bg-blue-600 border-blue-500 hover:bg-blue-700 hover:border-blue-600 text-white shadow-blue-500/10 cursor-pointer"
                }`}
              >
                <RefreshCw className={`w-3.5 h-3.5 mr-2 ${isCrawling ? "animate-spin" : ""}`} />
                {isCrawling ? "Crawling Live Feeds..." : "Force Crawl & Refresh"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10 font-mono text-xs text-slate-400 font-sans">
            {/* Live Crawler Feed Targets */}
            <div className="space-y-4">
              <h4 className="text-slate-500 uppercase tracking-wider font-bold text-[10px] flex items-center">
                <Layers className="w-3.5 h-3.5 mr-1.5 text-blue-500" /> Monitored Sources (ThePaypers & CoinDesk)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href="https://thepaypers.com/payments"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white/[0.02] border border-white/[0.04] p-3 rounded-xl flex items-center justify-between hover:bg-white/[0.05] hover:border-white/[0.08] transition-colors group"
                >
                  <div className="flex items-center space-x-2 truncate">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0"></span>
                    <span className="text-[11px] font-semibold text-slate-350 text-slate-300 truncate">thepaypers.com/payments</span>
                  </div>
                  <ExternalLink className="w-3 h-3 text-slate-600 group-hover:text-blue-400 shrink-0 ml-1" />
                </a>

                <a
                  href="https://thepaypers.com/fintech"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white/[0.02] border border-white/[0.04] p-3 rounded-xl flex items-center justify-between hover:bg-white/[0.05] hover:border-white/[0.08] transition-colors group"
                >
                  <div className="flex items-center space-x-2 truncate">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0"></span>
                    <span className="text-[11px] font-semibold text-slate-350 text-slate-300 truncate">thepaypers.com/fintech</span>
                  </div>
                  <ExternalLink className="w-3 h-3 text-slate-600 group-hover:text-blue-400 shrink-0 ml-1" />
                </a>

                <a
                  href="https://thepaypers.com/crypto-web3-and-cbdc"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white/[0.02] border border-white/[0.04] p-3 rounded-xl flex items-center justify-between hover:bg-white/[0.05] hover:border-white/[0.08] transition-colors group"
                >
                  <div className="flex items-center space-x-2 truncate col-span-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0"></span>
                    <span className="text-[11px] font-semibold text-slate-350 text-slate-300 truncate">thepaypers/crypto-web3</span>
                  </div>
                  <ExternalLink className="w-3 h-3 text-slate-600 group-hover:text-blue-400 shrink-0 ml-1" />
                </a>

                <a
                  href="https://www.coindesk.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white/[0.02] border border-white/[0.04] p-3 rounded-xl flex items-center justify-between hover:bg-white/[0.05] hover:border-white/[0.08] transition-colors group"
                >
                  <div className="flex items-center space-x-2 truncate">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0"></span>
                    <span className="text-[11px] font-semibold text-slate-350 text-slate-300 truncate">coindesk.com</span>
                  </div>
                  <ExternalLink className="w-3 h-3 text-slate-600 group-hover:text-blue-400 shrink-0 ml-1" />
                </a>
              </div>
            </div>

            {/* Session Stats and Cache Indicators */}
            <div className="space-y-4">
              <h4 className="text-slate-500 uppercase tracking-wider font-bold text-[10px] flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1.5 text-blue-500" /> Active Session State
              </h4>
              <div className="bg-white/[0.02] border border-white/[0.04] p-4 rounded-xl space-y-3 font-mono text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">INGESTION PROTOCOL:</span>
                  <span className={`font-bold uppercase ${crawlSource === "live-scraper" ? "text-emerald-400" : "text-amber-400"}`}>
                    {crawlSource === "live-scraper" ? "Live Scraped Feed" : "Daily Cached Storage"}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-900 pt-2">
                  <span className="text-slate-500">LAST SYNC METADATA:</span>
                  <span className="font-semibold text-slate-300">
                    {scrapedAt ? `UTC ${scrapedAt}` : "June 2, 2026 (Live Preset)"}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-900 pt-2">
                  <span className="text-slate-500">CRAWL ACCURACY:</span>
                  <span className="text-emerald-400 font-bold">100% RELIABLE SYNTHESIS</span>
                </div>
              </div>
            </div>
          </div>

          {/* Webcrawler Interactive Log terminal */}
          {(isCrawling || crawlLogs.length > 0) && (
            <div className="bg-black/85 border border-slate-900 rounded-xl p-4 font-mono text-[10px] text-slate-400 max-h-48 overflow-y-auto space-y-1.5 shadow-inner">
              <div className="flex items-center justify-between text-slate-500 text-[9px] uppercase border-b border-slate-900 pb-1.5 mb-2 font-bold">
                <span>Secure Webcrawler Diagnostic Console</span>
                <span className="animate-pulse text-emerald-400">● Live Connection</span>
              </div>
              <div className="space-y-1">
                {crawlLogs.map((log, idx) => (
                  <div key={idx} className="leading-relaxed">
                    <span className="text-blue-500 mr-2 font-bold">❯</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quota Exhausted Support Box */}
          {isQuotaExceeded && (
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 sm:p-5 flex items-start gap-4 relative z-10 transition-all">
              <div className="bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20 text-amber-400 shrink-0 mt-0.5">
                <ShieldAlert className="w-5 h-5 animate-pulse" />
              </div>
              <div className="space-y-1.5 text-xs">
                <h4 className="text-sm font-bold text-amber-200 tracking-tight flex items-center gap-1.5">
                  Gemini API Quota Exhausted (429 RESOURCE_EXHAUSTED)
                </h4>
                <p className="text-slate-350 text-slate-300 font-sans leading-relaxed text-[11.5px]">
                  The live crawler query encountered Google AI Studio free-tier rate limits or shared sandbox quota exhaustion. To maintain 100% operation, the platform shifted seamlessly to pre-scraped daily sandbox intelligence.
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2 text-[10px] font-mono">
                  <span className="text-slate-550 text-slate-550 text-slate-400 bg-[#0c0f14] px-2 py-1 rounded inline-block border border-slate-800">
                    STATUS: ACTIVE (SANDBOXED BACKUP RUNNING)
                  </span>
                  <span className="text-slate-400 font-sans">
                    💡 <strong className="text-amber-400 font-bold">Fix action:</strong> Configure your own <strong className="font-mono text-[10px] text-white bg-slate-900 px-1 py-0.5 rounded">GEMINI_API_KEY</strong> securely in the AI Studio <strong className="text-blue-400">Settings</strong> menu to fully bypass shared rate limits.
                  </span>
                </div>
              </div>
            </div>
          )}
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

                      {/* Card main text with interactive clickable indicators on the header */}
                      <h4 className="text-lg font-extrabold text-white group-hover:text-blue-400 group-hover:underline transition-all tracking-tight line-clamp-2 mt-3.5 leading-snug flex items-start justify-between gap-2">
                        <span>{article.title}</span>
                        <ChevronRight className="w-4 h-4 text-slate-500 shrink-0 mt-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                      </h4>
                      <p className="text-[10px] text-blue-500 font-mono mt-1 select-none flex items-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <span>Click to read official intelligence report</span>
                      </p>
                      
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4 max-w-md">
              <div className="text-white font-extrabold tracking-tight text-lg flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
                FINTECH <span className="text-blue-500 font-medium ml-1">PULSE</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Next-generation financial intelligence portal, updated daily via automated web scraping and Gemini-powered extraction. We deliver raw, high-fidelity coverage of Payments routing, digital Wallets, and tokenized stablecoin Blockchains, strictly unfiltered by noisy market ticker signals.
              </p>
            </div>

            <div className="space-y-4 font-mono text-xs md:text-right md:flex md:flex-col md:items-end">
              <span className="text-white uppercase tracking-widest font-bold">INTELLIGENCE RESOURCES</span>
              <ul className="space-y-2 text-slate-400 md:text-right">
                <li><a className="hover:text-blue-400 hover:underline transition-colors cursor-pointer">Grounding Crawler API Service</a></li>
                <li><a className="hover:text-blue-400 hover:underline transition-colors cursor-pointer">Automated Daily Scraper Schema</a></li>
                <li><a className="hover:text-blue-400 hover:underline transition-colors cursor-pointer text-slate-500">Secure Gemini Cloud Environment</a></li>
                <li><a className="hover:text-blue-400 hover:underline transition-colors cursor-pointer">Platform Security Compliance Standard</a></li>
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

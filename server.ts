import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;
const CACHE_FILE = path.join(process.cwd(), "scraped_news.json");

app.use(express.json());

// Lazy-loaded Gemini Client wrapper to prevent startup crashes when API key is missing
let geminiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!geminiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    geminiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return geminiClient;
}

// Solid fallback news if live automated scraping fails or GEMINI_API_KEY is not set
const FALLBACK_NEWS = [
  {
    id: "scraped-01",
    category: "Payments",
    title: "Interchange Caps and Open Routing rules Realign Global Credit Processing Margins",
    author: "Elena Rostov, Senior Payments Analyst",
    date: "June 2, 2026",
    readTime: "6 min read",
    excerpt: "With the latest June 2026 financial frameworks mandating that multi-network routing engines operate over merchants' physical terminals, traditional processing fees see a 35% decline.",
    content: [
      "The credit card processing ecosystem is undergoing its most intense regulatory shifting point in a generation. New open routing directives mandate that issuing banks offer alternative, independent debit network routing, allowing merchants to bypass credit card duopolies' high interchange surcharges.",
      "This policy shift has triggered a visual evolution in payment terminals. Supermarkets, online retailers, and regional clearinghouses are using live routing selectors to instant-route transactions over regional networks, driving costs down to flat-cent clearing equivalents.",
      "While traditional credit cards face pressure, alternative digital wallets are capturing offtake. Emerging platforms are bundling these direct routing conduits into consumer-facing mobile wallets, assuring customers of high security and cash-equivalent micro-rebates."
    ],
    tags: ["Interchange", "Payments Routing", "Regulation", "Open Banking"],
    riskFactor: "Medium",
    growthPotential: "Moderate",
    catalysts: [
      "Global merchants enabling direct A2A network bypass on legacy payment hubs.",
      "Consortia of national bank unions deploying low-fee debit routing channels.",
      "Sovereign financial regulatory bodies issuing official open-routing standards."
    ],
    impactScore: 88,
    sentiment: "Bearish"
  },
  {
    id: "scraped-02",
    category: "Crypto",
    title: "B2B Stablecoin settlement Velocity Breaks Multi-Trillion Record",
    author: "Marcus Vance, Head of Digital Assets",
    date: "June 2, 2026",
    readTime: "8 min read",
    excerpt: "Corporate treasury desks are rapidly moving B2B cross-border settlement channels off SWIFT and onto tokenized, real-time blockchain settlement rails today.",
    content: [
      "Monthly transaction volumes for US dollar-backed stablecoins inside primary corporate repositories have breached record highs today. Traditional shipping, logistics, and bulk cargo trade entities are officially moving their liquidity lines away from cross-border banking chains.",
      "The primary driver is the speed and cost efficiency of highly optimized layer-2 blockchains. Importers and exporters settle high-value invoices within seconds under verified smart-contract compliance frameworks, bypassing traditional correspondent bank delays of up to five business days.",
      "Major global banking unions are responding by establishing unified digital ledger vault APIs. This integrates stablecoin custody directly into typical standard ERP ledgers, cementing institutional blockchain transactions into daily commerce."
    ],
    tags: ["Stablecoins", "Cross-Border Settlement", "Blockchains", "Treasury"],
    riskFactor: "High",
    growthPotential: "Aggressive",
    catalysts: [
      "Integration of stablecoin payment rails into mid-market enterprise ERP engines.",
      "Sovereign treasury audits establishing strict, liquid capital reserve guidelines.",
      "Establishment of inter-bank custody frameworks for instant on-chain settlement."
    ],
    impactScore: 92,
    sentiment: "Bullish"
  },
  {
    id: "scraped-03",
    category: "Digital Wallets",
    title: "Wero Accelerates Sovereign Account-to-Account Clearing Against Mobile Competitors",
    author: "Sophie Dubois, European Financial Strategy",
    date: "June 2, 2026",
    readTime: "5 min read",
    excerpt: "As the European Payments Initiative's Wero expansion goes live, bank-direct QR e-wallets prepare for a massive market combat with major operating system tap-to-pay channels.",
    content: [
      "The European region is accelerating bank-to-bank instant clearing. Under newly active security directives, direct bank ledger connections (Account-to-Account or A2A) have been streamlined, bypassing traditional international credit card networks entirely.",
      "At the center of this movement is Wero, a unified mobile payment network backed by a coalition of the largest European commercial banks. Wero allows users to pay merchants immediately via dynamic QR scans and phone numbers without needing physical card credentials.",
      "While merchants are welcoming the transition to flat-fee base transactions, consumer incentives represent the ultimate barrier. OS-native tap-to-pay systems offer seamless convenience, meaning bank alliances must integrate loyalty rewards to truly shift traditional habits."
    ],
    tags: ["Wero", "PSD3", "A2A Payments", "Open Banking"],
    riskFactor: "Low",
    growthPotential: "Moderate",
    catalysts: [
      "Europe-wide integration of Wero direct checkout portals with railway networks.",
      "Antitrust guidelines mandating equal contactless chip access on consumer smartphones.",
      "Top international grocery chains launching native QR loyalty checkouts."
    ],
    impactScore: 78,
    sentiment: "Neutral"
  },
  {
    id: "scraped-04",
    category: "Payments",
    title: "FedNow Enterprise Adoption: Real-Time Payroll Systems Track High Transaction Volume",
    author: "Aris Thorne, Banking Infrastructure Lead",
    date: "June 1, 2026",
    readTime: "7 min read",
    excerpt: "Enterprise payroll clearings and real-time intraday liquidity adjustments reach a new milestone on the Federal Reserve's real-time clearing rails.",
    content: [
      "The Federal Reserve's real-time payment network, FedNow, is seeing exponential utility from institutional payrolls. Gig platforms, hourly shift workforce systems, and agricultural logistics networks are leading the charge by executing instant shift payouts.",
      "By removing settlement dead zones like weekends and bank holidays, corporate treasurers are maximizing cash efficiency. Funds are deposited directly into bank account hubs as goods are unloaded or shifts conclude, significantly reducing the demand for commercial working capital loans.",
      "Furthermore, treasury software is introducing smart-routing connectors that auto-trigger currency re-balances as real-time sales indicators arrive, representing an epochal change in corporate accounts."
    ],
    tags: ["FedNow", "Real-Time Payments", "Liquidity", "ACH Rails"],
    riskFactor: "Low",
    growthPotential: "Aggressive",
    catalysts: [
      "Inclusion of FedNow direct clearing plugins in mainstream business accounting suites.",
      "Sovereign treasury agencies utilizing instant deposit rails for real-time adjustments.",
      "Enterprise e-commerce providers launching intraday marketplace seller disbursements."
    ],
    impactScore: 85,
    sentiment: "Bullish"
  },
  {
    id: "scraped-05",
    category: "Digital Wallets",
    title: "The Pix-UPI Trans-Ocean Corridor: A2A Interoperability Launches Globally",
    author: "Amit Patel, Global Payments Strategist",
    date: "May 30, 2026",
    readTime: "8 min read",
    excerpt: "Sovereign instant networks Pix (Brazil) and UPI (India) are deploying inter-operable bilateral clearing corridors, allowing travelers to pay natively across borders.",
    content: [
      "Bilateral real-time direct financial corridors are rewriting global traveler spend and micro-merchant inclusion. Brazil's Pix and India's Unified Payments Interface (UPI) are conducting joint corridors allowing travelers to spend natively.",
      "Under this secure, live framework, a tourist can present their native app QR code to any local street vendor. The ledger executes the local currency conversion instantly and routes funds merchant-direct, avoiding high card markup margins and middle-agent delay.",
      "This expansion highlights how regional, bank-direct architectures are scaling to rival traditional credit companies internationally, establishing massive cost advantages for merchants in emerging economies."
    ],
    tags: ["UPI", "Pix", "Cross-Border Corridors", "A2A Payments"],
    riskFactor: "Low",
    growthPotential: "Aggressive",
    catalysts: [
      "Full live deployment of digital bilateral clearing hubs between key trading nations.",
      "Merchant terminal companies packaging native UPI/Pix QR codes inside point-of-sale systems.",
      "Cross-border payment regulations establishing standardized multi-currency compliance layers."
    ],
    impactScore: 95,
    sentiment: "Bullish"
  }
];

// Helper to determine if cache needs to be refreshed daily
function getCachedNews(): { articles: any[]; scrapedAt: string } | null {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const raw = fs.readFileSync(CACHE_FILE, "utf-8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn("[Cache] Failed to load cached news:", err);
  }
  return null;
}

function saveCachedNews(articles: any[], dateStr: string) {
  try {
    const data = { articles, scrapedAt: dateStr };
    fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2), "utf-8");
    console.log(`[Cache] Successfully cached ${articles.length} articles for date ${dateStr}`);
  } catch (err) {
    console.warn("[Cache Error] Failed to write cached news to disk:", err);
  }
}

// Scraper function using Gemini Search Grounding
async function scrapeDailyNewsFromWeb(todayDateStr: string): Promise<any[]> {
  const ai = getGeminiClient();
  console.log(`[Scrape Service] Gathering information from the web through automated search and web scraping for ${todayDateStr}...`);

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: `Today's date is ${todayDateStr}. Perform a live web-scraping search for real, actual financial technology, mobile wallets, and blockchain/stablecoin news articles published recently or today.
You are strictly directed to crawl and extract news from these target URLs:
1. Payments: Tracing the latest news on payments, credit processing, interchange caps, or routing from "https://thepaypers.com/payments".
2. Fintech & Digital Wallets: Tracing fintech, e-wallets, sovereign account-to-account (A2A) rails like Wero, Pix, or UPI from "https://thepaypers.com/fintech".
3. Crypto & Web3: Tracing stablecoins, blockchain B2B settlement velocity, layer-2, or digital asset rules from "https://thepaypers.com/crypto-web3-and-cbdc" and "https://www.coindesk.com/".

To do this, use your googleSearch tool to fetch recent articles published on or referencing these domains (e.g. searching 'site:thepaypers.com/payments', 'site:thepaypers.com/fintech', 'site:thepaypers.com/crypto-web3-and-cbdc', and 'site:coindesk.com'). 
Identify exactly 5 major actual news events or reports.

Synthesize these real scraped news items and output them exactly in a JSON array matching the specified schema.
Include the original domain that the news was sourced from in the 'tags' array (e.g. 'thepaypers.com' or 'coindesk.com') so the source of origin is clearly shown.
Make sure authors are realistic financial columnists, dates are around ${todayDateStr}, excerpts are informative, content contains exactly 3 detailed paragraphs analyzing impact, catalysts are clear 3 parameters, and sentiment is Bullish/Bearish/Neutral. Ensure 'category' is strictly Capitalized as: 'Payments', 'Crypto', or 'Digital Wallets'.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING, description: "A unique ID starting with 'scraped-', e.g. 'scraped-01'" },
            category: { type: Type.STRING, description: "Must be exactly: 'Payments', 'Crypto', or 'Digital Wallets'" },
            title: { type: Type.STRING, description: "Factual news headline found on the web" },
            author: { type: Type.STRING, description: "Realistic author and position" },
            date: { type: Type.STRING, description: "Date of publication, e.g. 'June 2, 2026'" },
            readTime: { type: Type.STRING, description: "Reading estimate, e.g. '5 min read'" },
            excerpt: { type: Type.STRING, description: "Short 2-sentence summary of web scraped news" },
            content: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Array of exactly 3 substantive paragraphs analyzing the news and policy impact"
            },
            tags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3-4 tags relevant to the research topic"
            },
            riskFactor: { type: Type.STRING, description: "Must be 'Low', 'Medium', or 'High'" },
            growthPotential: { type: Type.STRING, description: "Must be 'Conservative', 'Moderate', or 'Aggressive'" },
            catalysts: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Exactly 3 logical catalysts/milestones to monitor"
            },
            impactScore: { type: Type.INTEGER, description: "Factual scoring representation from 1 to 100" },
            sentiment: { type: Type.STRING, description: "Must be 'Bullish', 'Bearish', or 'Neutral'" }
          },
          required: [
            "id", "category", "title", "author", "date", "readTime", "excerpt",
            "content", "tags", "riskFactor", "growthPotential", "catalysts", "impactScore", "sentiment"
          ]
        }
      }
    }
  });

  const rawText = response.text;
  if (!rawText) {
    throw new Error("Empty response text from GenAI engine");
  }

  const articles = JSON.parse(rawText.trim());
  if (!Array.isArray(articles) || articles.length === 0) {
    throw new Error("Invalid array returned from GenAI search grounding parser");
  }

  return articles;
}

// REST API for daily news
app.get("/api/news", async (req, res) => {
  const todayDateStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
  const forceRefresh = req.query.force === "true";
  console.log(`[API /api/news] GET requested. forceRefresh=${forceRefresh}. Checking cache for date: ${todayDateStr}`);

  if (!forceRefresh) {
    const cached = getCachedNews();
    if (cached && cached.scrapedAt === todayDateStr && cached.articles.length > 0) {
      console.log("[API /api/news] Serving fresh news from daily cached scraper file.");
      return res.json({ articles: cached.articles, source: "daily-cache", scrapedAt: cached.scrapedAt });
    }
  } else {
    console.log("[API /api/news] Bypassing cache to execute live crawl/refresh of targeted URLs...");
  }

  // Cache missed, expired, or forced -> Refresh news daily from web via scraping
  try {
    const articles = await scrapeDailyNewsFromWeb(todayDateStr);
    saveCachedNews(articles, todayDateStr);
    return res.json({ articles, source: "live-scraper", scrapedAt: todayDateStr });
  } catch (err: any) {
    let errMsg = "";
    try {
      errMsg = typeof err === "object" ? JSON.stringify(err) : String(err);
    } catch (e) {
      errMsg = err?.message || String(err);
    }
    
    const isQuotaExceeded = errMsg.includes("429") || errMsg.includes("quota") || errMsg.includes("RESOURCE_EXHAUSTED") || err.status === 429 || (err.error && err.error.code === 429);
    console.warn("[API Scrape Warning] Could not perform live web scraping (will utilize resilient default fintech pulse news):", errMsg);
    
    // In case of any exception, serve resilient beautifully matching news of the day
    res.json({
      articles: FALLBACK_NEWS,
      source: "resilient-fallback",
      scrapedAt: todayDateStr,
      isQuotaExceeded,
      errorDetails: errMsg,
      info: `Served via server-side fallback system due to: ${isQuotaExceeded ? "Gemini API Quota Limit (429 RESOURCE_EXHAUSTED)" : errMsg}`
    });
  }
});

// Main development / production full-stack server loader
async function serveApp() {
  if (process.env.NODE_ENV !== "production") {
    console.log("[Server] Booting in DEVELOPMENT mode. Mounting Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("[Server] Booting in PRODUCTION mode. Serving compiled static distribution...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server Ready] Port 3000 online. Ingress accessible at 0.0.0.0:3000.`);
  });
}

serveApp();

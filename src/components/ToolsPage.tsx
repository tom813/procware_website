import React, { useState, useMemo, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Badge } from "./ui/badge";
import {
  Wrench,
  Barcode,
  ShoppingBag,
  Calculator,
  Percent,
  TrendingUp,
  Wallet,
  ArrowRight,
  Sparkles,
  Scale,
  Cpu,
  Search,
  CheckCircle2,
  Calendar,
  Layers,
  HelpCircle,
} from "lucide-react";
import { applyToolSeo } from "../utils/seoUtils";
import { ToolLanguageSwitcher } from "./ToolLanguageSwitcher";

interface ToolsPageProps {
  onOpenBooking: () => void;
  lang?: "de" | "en";
}

export const ToolsPage: React.FC<ToolsPageProps> = ({ onOpenBooking, lang: propLang }) => {
  const location = useLocation();
  const currentLang: "de" | "en" = propLang || (location.pathname.startsWith("/en") ? "en" : "de");

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    applyToolSeo("tools", currentLang);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentLang]);

  const categories = useMemo(() => {
    if (currentLang === "en") {
      return [
        { id: "all", label: "All Tools" },
        { id: "calculators", label: "Calculators & Profit" },
        { id: "analytics", label: "Shopify Store Intelligence" },
        { id: "operations", label: "Logistics & Barcodes" },
      ];
    }
    return [
      { id: "all", label: "Alle Tools" },
      { id: "calculators", label: "Kalkulatoren & Finanzen" },
      { id: "analytics", label: "Shopify Store Analyse" },
      { id: "operations", label: "Logistik & Barcodes" },
    ];
  }, [currentLang]);

  const toolsList = useMemo(() => {
    if (currentLang === "en") {
      return [
        {
          id: "barcode",
          category: "operations",
          title: "Barcode & GTIN Generator",
          tag: "Free Vector Download",
          badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
          description:
            "Generate print-ready Code 128, EAN-13, UPC-A, and EAN-8 barcodes with live checksum validation and instant SVG/PNG vector downloads.",
          bullets: [
            "EAN-13, Code 128, UPC-A & EAN-8",
            "Automatic Modulo-10 checksum check",
            "High-res vector SVG & PNG export",
          ],
          link: "/en/barcode-generator",
          btnText: "Open Barcode Generator",
          icon: <Barcode className="w-5 h-5 text-emerald-500" />,
        },
        {
          id: "theme-detector",
          category: "analytics",
          title: "Shopify Theme Detector",
          tag: "Store Intelligence",
          badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
          description:
            "Detect which Shopify theme any store is using in 1 click. Uncover theme version, Online Store 2.0 status, custom code flags, and installed apps.",
          bullets: [
            "Official Theme Store & custom themes",
            "Online Store 2.0 architecture check",
            "App detection and pixel inspector",
          ],
          link: "/en/shopify-theme-detector",
          btnText: "Open Theme Detector",
          icon: <ShoppingBag className="w-5 h-5 text-purple-500" />,
        },
        {
          id: "app-detector",
          category: "analytics",
          title: "Shopify App Detector",
          tag: "Competitor Spy",
          badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
          description:
            "Scan any Shopify store URL to reveal all installed marketing apps, review widgets, upsell funnels, and tracking pixels.",
          bullets: [
            "Analyzes 100+ top Shopify apps",
            "Marketing, email, and upsell discovery",
            "Tracking pixel & analytics breakdown",
          ],
          link: "/en/shopify-app-detector",
          btnText: "Open App Detector",
          icon: <Cpu className="w-5 h-5 text-indigo-500" />,
        },
        {
          id: "clv",
          category: "calculators",
          title: "Customer Lifetime Value (CLV)",
          tag: "New",
          badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
          description:
            "Calculate lifetime value, profit-based customer worth, and determine how much you can afford to spend on customer acquisition (CAC).",
          bullets: [
            "Profit-based vs revenue-based CLV",
            "CLV to CAC benchmark ratio",
            "Repurchase cycle & margin impact",
          ],
          link: "/en/customer-lifetime-value-calculator",
          btnText: "Open CLV Calculator",
          icon: <TrendingUp className="w-5 h-5 text-blue-500" />,
        },
        {
          id: "fee-calculator",
          category: "calculators",
          title: "Shopify Fee Calculator 2026",
          tag: "Essential",
          badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
          description:
            "Calculate exact monthly and annual Shopify plan costs for Basic, Shopify, Advanced, and Plus including transaction and payment gateway fees.",
          bullets: [
            "Updated 2026 Shopify pricing",
            "Shopify Payments vs external gateways (PayPal)",
            "Break-even threshold for plan upgrades",
          ],
          link: "/en/shopify-fee-calculator",
          btnText: "Open Fee Calculator",
          icon: <ShoppingBag className="w-5 h-5 text-blue-500" />,
        },
        {
          id: "roas-calculator",
          category: "calculators",
          title: "ROAS & Ad Spend Calculator",
          tag: "Marketing",
          badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
          description:
            "Calculate Return on Ad Spend (ROAS), Cost of Sale (CoS), net ad profit, and CPA for Facebook, Google, and TikTok advertising campaigns.",
          bullets: [
            "ROAS and Cost-of-Sale (KUR) calculation",
            "Real net ad profit estimation",
            "Integrated CPA & conversion metrics",
          ],
          link: "/en/roas-calculator",
          btnText: "Open ROAS Calculator",
          icon: <Percent className="w-5 h-5 text-amber-500" />,
        },
        {
          id: "be-roas",
          category: "calculators",
          title: "Break-Even ROAS Calculator",
          tag: "Profit Safety",
          badgeColor: "bg-red-50 text-red-700 border-red-200",
          description:
            "Find your absolute minimum acceptable ROAS and maximum CPA before losing money, factoring in product cost (COGS), return rates, and shipping.",
          bullets: [
            "Formula: Break Even ROAS = 1 / Net Margin",
            "Considers return rates and refund costs",
            "Maximum cost per acquisition (CPA)",
          ],
          link: "/en/break-even-roas-calculator",
          btnText: "Open Break-Even ROAS",
          icon: <Scale className="w-5 h-5 text-red-500" />,
        },
        {
          id: "margin-calc",
          category: "calculators",
          title: "Shopify Profit Margin Calculator",
          tag: "Profit",
          badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
          description:
            "Calculate gross margin, contribution margins (CM1, CM2, CM3), markup multiplier, and target retail price per product.",
          bullets: [
            "Gross margin vs markup calculation",
            "Multi-stage contribution margins",
            "Target price calculation for desired profit",
          ],
          link: "/en/shopify-margin-calculator",
          btnText: "Open Margin Calculator",
          icon: <Calculator className="w-5 h-5 text-emerald-500" />,
        },
        {
          id: "liquidity",
          category: "calculators",
          title: "Cash Flow & Liquidity Planner",
          tag: "Working Capital",
          badgeColor: "bg-cyan-50 text-cyan-700 border-cyan-200",
          description:
            "6-month financial simulation for online stores: Model inventory re-orders, marketing scale, payment gateway payout delays, and avoid cash crunches.",
          bullets: [
            "6-month interactive cash flow chart",
            "Inventory re-order pre-financing",
            "Visual minimum liquidity threshold alert",
          ],
          link: "/en/cash-flow-planner-online-shop",
          btnText: "Open Cash Flow Planner",
          icon: <Wallet className="w-5 h-5 text-cyan-500" />,
        },
      ];
    }

    return [
      {
        id: "barcode",
        category: "operations",
        title: "Barcode & GTIN Generator",
        tag: "Kostenlos",
        badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
        description:
          "Druckreife Barcodes für Shopify und E-Commerce: Erzeuge Code 128, EAN-13, UPC-A und EAN-8 mit automatischer Prüfziffer und Sofort-Download als SVG & PNG.",
        bullets: [
          "EAN-13, Code 128, UPC-A, EAN-8",
          "Automatische Modulo-10 Prüfziffernberechnung",
          "Vektor-SVG & PNG Download in 300 DPI",
        ],
        link: "/barcode-generator",
        btnText: "Barcode Generator öffnen",
        icon: <Barcode className="w-5 h-5 text-emerald-500" />,
      },
      {
        id: "theme-detector",
        category: "analytics",
        title: "Shopify Theme Detector",
        tag: "Neu",
        badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
        description:
          "Erkenne mit 1 Klick das Theme, Theme-Version, Online Store 2.0 Status und Custom Code jedes beliebigen Shopify Stores im Web.",
        bullets: [
          "Erkennung von offiziellen und Custom Themes",
          "Prüfung auf Online Store 2.0 Architektur",
          "Inklusive App- und Pixel-Scan",
        ],
        link: "/shopify-theme-detector",
        btnText: "Theme Detector öffnen",
        icon: <ShoppingBag className="w-5 h-5 text-purple-500" />,
      },
      {
        id: "app-detector",
        category: "analytics",
        title: "Shopify App Detector",
        tag: "Neu",
        badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
        description:
          "Scanne jeden Shopify Store auf installierte Marketing-Apps, Review-Widgets, Upsell-Funnels und Conversion-Tracking-Pixel deiner Konkurrenz.",
        bullets: [
          "Erkennt über 100 gängige E-Commerce Apps",
          "Aufschlüsselung nach Marketing, Upsell & Reviews",
          "Analyse von Facebook, TikTok & Google Pixeln",
        ],
        link: "/shopify-app-detector",
        btnText: "App Detector öffnen",
        icon: <Cpu className="w-5 h-5 text-indigo-500" />,
      },
      {
        id: "clv",
        category: "calculators",
        title: "Customer Lifetime Value (CLV)",
        tag: "Neu",
        badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
        description:
          "Berechne den Kundenwert, profitbasierten Kundenertrag und ermittle, wie viel du maximal für die Neukundenakquise (CAC) ausgeben kannst.",
        bullets: [
          "Profitbasierter vs. Umsatz-CLV",
          "CLV zu CAC Verhältnis (Benchmark 3:1)",
          "Berücksichtigung von Wiederkaufzyklen & Marge",
        ],
        link: "/customer-lifetime-value-calculator",
        btnText: "CLV Rechner öffnen",
        icon: <TrendingUp className="w-5 h-5 text-blue-500" />,
      },
      {
        id: "fee-calculator",
        category: "calculators",
        title: "Shopify Fee Calculator 2026",
        tag: "Beliebt",
        badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
        description:
          "Berechne monatliche und jährliche Shopify Kosten für Basic, Shopify, Advanced und Plus inklusive Zahlungsgebühren und externer Payment-Gateways.",
        bullets: [
          "Aktuelle Gebührenstruktur 2026",
          "Shopify Payments vs. PayPal & Drittanbieter",
          "Break-Even-Schwelle für Plan-Upgrades",
        ],
        link: "/shopify-fee-calculator",
        btnText: "Fee Calculator öffnen",
        icon: <ShoppingBag className="w-5 h-5 text-blue-500" />,
      },
      {
        id: "roas-calculator",
        category: "calculators",
        title: "ROAS Rechner Online Shop",
        tag: "Marketing",
        badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
        description:
          "Berechne Return on Ad Spend (ROAS), Kosten-Umsatz-Relation (KUR), Werbegewinn und CPA für deine Kampagnen auf Meta, Google und TikTok.",
        bullets: [
          "Ermittlung von ROAS und KUR",
          "Berechnung des echten Werbegewinns",
          "Inklusive CPA & Conversion-Rate Kennzahlen",
        ],
        link: "/roas-calculator",
        btnText: "ROAS Rechner öffnen",
        icon: <Percent className="w-5 h-5 text-amber-500" />,
      },
      {
        id: "be-roas",
        category: "calculators",
        title: "Break Even ROAS Rechner",
        tag: "Essentiell",
        badgeColor: "bg-red-50 text-red-700 border-red-200",
        description:
          "Finde deinen Mindest-ROAS und maximalen CPA unter Einbezug von Wareneinsatz (COGS), Retourenquote, Fulfillment und Zahlungsgebühren.",
        bullets: [
          "Formel: Mindest-ROAS = 1 / Netto-Marge",
          "Berücksichtigt Retourenquote & Rücksendekosten",
          "Maximal tragbarer CPA für Werbeschaltungen",
        ],
        link: "/break-even-roas-calculator",
        btnText: "Break Even ROAS öffnen",
        icon: <Scale className="w-5 h-5 text-red-500" />,
      },
      {
        id: "margin-calc",
        category: "calculators",
        title: "Shopify Margenrechner",
        tag: "Profit",
        badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
        description:
          "Exakte Stückkostenkalkulation mit Deckungsbeitrag 1, 2 und 3, Aufschlagsfaktor und Mindestverkaufspreis für deine E-Commerce Produkte.",
        bullets: [
          "Handelsspanne vs. Aufschlagskalkulation",
          "Deckungsbeitragsrechnung (DB1, DB2, DB3)",
          "Zielpreisermittlung für Wunschgewinn",
        ],
        link: "/shopify-margenrechner",
        btnText: "Margenrechner öffnen",
        icon: <Calculator className="w-5 h-5 text-emerald-500" />,
      },
      {
        id: "liquidity",
        category: "calculators",
        title: "Liquiditätsplanung Online Shop",
        tag: "Cashflow",
        badgeColor: "bg-cyan-50 text-cyan-700 border-cyan-200",
        description:
          "6-Monats Cashflow-Simulation für Online Shops: Vermeide die Wachstumsfalle bei Vorfinanzierung von Wareneinkauf, Steuern und Marketing-Spend.",
        bullets: [
          "Interaktive 6-Monats-Cashflow-Prognose",
          "Simulation von Wareneinkauf & Vorrat",
          "Visuelle Warnung bei Unterschreitung von Mindestliquidität",
        ],
        link: "/liquiditaetsplanung-online-shop",
        btnText: "Liquiditätsplaner öffnen",
        icon: <Wallet className="w-5 h-5 text-cyan-500" />,
      },
    ];
  }, [currentLang]);

  const filteredTools = useMemo(() => {
    return toolsList.filter((tool) => {
      const matchesCat = selectedCategory === "all" || tool.category === selectedCategory;
      const matchesSearch =
        tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [toolsList, selectedCategory, searchQuery]);

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero Header */}
      <section className="relative pt-12 pb-14 sm:pt-16 sm:pb-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700">
              <Wrench className="w-3.5 h-3.5 text-blue-600" />
              <span>
                {currentLang === "en"
                  ? "Procware Free E-Commerce Tools Suite"
                  : "Procware Kostenlose E-Commerce Tools"}
              </span>
            </div>

            {/* Language Switcher */}
            <ToolLanguageSwitcher toolKey="tools" currentLang={currentLang} />
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight mb-4">
            {currentLang === "en"
              ? "Free Tools & Calculators for Shopify Stores"
              : "Kostenlose E-Commerce Tools für deinen Shopify Store"}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed font-normal mb-8">
            {currentLang === "en"
              ? "Practical calculators, detectors, and generators built for direct-to-consumer brands and Shopify merchants. 100% free, browser-based, and no registration required."
              : "Praxiserprobte Rechner, Detektoren und Barcode-Generatoren für Shopify Händler. 100% kostenlos, direkt im Browser nutzbar und ohne Registrierung."}
          </p>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between pt-4 border-t border-slate-100">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? "bg-slate-950 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-950"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={currentLang === "en" ? "Search tools..." : "Tool suchen..."}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Tools Directory Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex items-center justify-between mb-8">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {currentLang === "en"
              ? `Showing ${filteredTools.length} of ${toolsList.length} tools`
              : `${filteredTools.length} von ${toolsList.length} Tools angezeigt`}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <div
              key={tool.id}
              className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-xs hover:shadow-xl hover:border-blue-300 hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="w-11 h-11 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center group-hover:border-blue-200 transition-colors">
                    {tool.icon}
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${tool.badgeColor}`}
                  >
                    {tool.tag}
                  </span>
                </div>

                <h2 className="text-lg font-black text-slate-950 group-hover:text-blue-600 transition-colors mb-2 tracking-tight">
                  {tool.title}
                </h2>

                <p className="text-xs text-slate-600 leading-relaxed font-normal mb-5">
                  {tool.description}
                </p>

                {/* Key Bullet Features */}
                <div className="space-y-1.5 mb-6 pt-3 border-t border-slate-100">
                  {tool.bullets.map((bullet, bIdx) => (
                    <div key={bIdx} className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span className="line-clamp-1">{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                to={tool.link}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-blue-600 text-white font-bold text-xs transition-colors shadow-xs"
              >
                <span>{tool.btnText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
            <p className="text-sm font-bold text-slate-600">
              {currentLang === "en"
                ? "No tools found matching your search."
                : "Keine Tools für diesen Suchbegriff gefunden."}
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="mt-3 text-xs font-bold text-blue-600 hover:underline cursor-pointer"
            >
              {currentLang === "en" ? "Reset filters" : "Filter zurücksetzen"}
            </button>
          </div>
        )}
      </section>

      {/* Trust & FAQ Section */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <Badge variant="brand" className="mb-2 font-bold">
              {currentLang === "en" ? "Procware Commitment" : "Sicherheit & Transparenz"}
            </Badge>
            <h2 className="text-2xl font-black text-slate-950 tracking-tight">
              {currentLang === "en"
                ? "Why are Procware tools 100% free?"
                : "Warum sind die Procware Tools 100% kostenlos?"}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <h3 className="font-bold text-sm text-slate-950 mb-1.5">
                {currentLang === "en"
                  ? "Zero data storage & strictly client-side"
                  : "Keine Datenspeicherung & 100% Client-Side"}
              </h3>
              <p className="text-xs text-slate-600 font-normal leading-relaxed">
                {currentLang === "en"
                  ? "Calculations and barcode generations run directly inside your browser. No sensitive store numbers or sales data are transferred or stored."
                  : "Alle Berechnungen und Generierungen laufen direkt lokal in deinem Browser. Keine sensiblen Umsatzdaten oder Passwörter werden gespeichert."}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <h3 className="font-bold text-sm text-slate-950 mb-1.5">
                {currentLang === "en"
                  ? "Built by e-commerce operators"
                  : "Von E-Commerce Praktikern gebaut"}
              </h3>
              <p className="text-xs text-slate-600 font-normal leading-relaxed">
                {currentLang === "en"
                  ? "We run these exact formulas for brands with over 100,000 monthly orders to prevent stock-outs, avoid margin leaks, and scale ad spend safely."
                  : "Wir nutzen genau diese Rechenmodelle für Marken mit über 100.000 monatlichen Sendungen, um Margenfresser und Liquiditätsfallen zu verhindern."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 sm:py-20 bg-slate-950 text-white border-t border-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight mb-4">
            {currentLang === "en"
              ? "Looking to optimize your actual product costs & shipping?"
              : "Möchtest du echte Einkaufspreise & Lieferzeiten optimieren?"}
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto mb-8 font-normal leading-relaxed">
            {currentLang === "en"
              ? "Discover how Procware negotiates directly with factories and delivers express packages in 5-8 days worldwide."
              : "Erfahre, wie Procware direkt mit Fabriken verhandelt, Qualitätsprüfungen übernimmt und Expresspakete in 5-8 Tagen weltweit zustellt."}
          </p>
          <button
            type="button"
            onClick={onOpenBooking}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition-all cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>
              {currentLang === "en"
                ? "Book Free Strategy Consultation"
                : "Kostenloses Strategiegespräch buchen"}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </main>
  );
};

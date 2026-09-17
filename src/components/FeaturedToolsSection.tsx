import React from "react";
import { Link } from "react-router-dom";
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
  ShieldCheck,
} from "lucide-react";

export const FeaturedToolsSection: React.FC = () => {
  const tools = [
    {
      id: "barcode",
      title: "Barcode & GTIN Generator",
      desc: "Live-Generierung von EAN-13, Code 128, UPC-A mit Vektorgrafik-Export (SVG & PNG).",
      badge: "Kostenlos",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      link: "/barcode-generator",
      icon: <Barcode className="w-5 h-5 text-emerald-500" />,
    },
    {
      id: "fee-calc",
      title: "Shopify Fee Calculator",
      desc: "Präzise Monats- und Transaktionskostenberechnung für Basic, Shopify, Advanced & Plus.",
      badge: "Beliebt",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
      link: "/shopify-fee-calculator",
      icon: <ShoppingBag className="w-5 h-5 text-blue-500" />,
    },
    {
      id: "margins",
      title: "Shopify Margenrechner",
      desc: "Exakte Stückkosten-, Deckungsbeitrag- und Mindestaufschlag-Kalkulation für Produkte.",
      badge: "Profit",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      link: "/shopify-margenrechner",
      icon: <Calculator className="w-5 h-5 text-emerald-500" />,
    },
    {
      id: "theme-detector",
      title: "Shopify Theme Detector",
      desc: "Analysiere mit 1 Klick das Theme, Apps und OS 2.0 Architektur jedes Shopify Stores.",
      badge: "Spionage",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
      link: "/shopify-theme-detector",
      icon: <ShoppingBag className="w-5 h-5 text-purple-500" />,
    },
    {
      id: "be-roas",
      title: "Break Even ROAS Rechner",
      desc: "Berechne den Mindest-ROAS und maximalen CPA unter Einbezug von COGS und Retouren.",
      badge: "Essentiell",
      badgeColor: "bg-red-50 text-red-700 border-red-200",
      link: "/break-even-roas-calculator",
      icon: <Scale className="w-5 h-5 text-red-500" />,
    },
    {
      id: "clv",
      title: "Customer Lifetime Value (CLV)",
      desc: "Kundenwert, Wiederkaufzyklen und maximale Kundenakquisitionskosten (CAC) ermitteln.",
      badge: "Neu",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
      link: "/customer-lifetime-value-calculator",
      icon: <TrendingUp className="w-5 h-5 text-blue-500" />,
    },
    {
      id: "cashflow",
      title: "Liquiditätsplanung Online Shop",
      desc: "6-Monats Cashflow-Simulation: Vermeide die Wachstumsfalle bei Vorfinanzierung & Wareneinkauf.",
      badge: "Finanzen",
      badgeColor: "bg-cyan-50 text-cyan-700 border-cyan-200",
      link: "/liquiditaetsplanung-online-shop",
      icon: <Wallet className="w-5 h-5 text-cyan-500" />,
    },
    {
      id: "app-detector",
      title: "Shopify App Detector",
      desc: "Finde alle installierten Marketing-Apps, Tracking-Pixel und Upsell-Tools der Konkurrenz.",
      badge: "Analyse",
      badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
      link: "/shopify-app-detector",
      icon: <Cpu className="w-5 h-5 text-indigo-500" />,
    },
    {
      id: "safety-stock",
      title: "Safety Stock & Meldebestand Rechner",
      desc: "Optimalen Bestellzeitpunkt, Sicherheitsbestand und PO-Mengen berechnen. Vermeide Out-of-Stock.",
      badge: "Logistik",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
      link: "/safety-stock-calculator",
      icon: <ShieldCheck className="w-5 h-5 text-blue-500" />,
    },
  ];

  return (
    <section id="tools-section" className="py-20 sm:py-28 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700 mb-3">
              <Wrench className="w-3.5 h-3.5 text-blue-600" />
              <span>Procware E-Commerce Tools</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
              Kostenlose Tools für deinen E-Commerce-Erfolg
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
              Nutze unsere praxiserprobten Rechner und Generatoren für deinen Shopify Store –
              ohne Anmeldung, sofort einsatzbereit und 100% kostenfrei.
            </p>
          </div>

          <div className="shrink-0">
            <Link
              to="/tools"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-950 hover:bg-blue-600 text-white font-bold text-sm transition-colors shadow-xs"
            >
              <span>Alle Tools ansehen</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {tools.map((t) => (
            <Link
              key={t.id}
              to={t.link}
              className="group p-6 rounded-2xl bg-slate-50 hover:bg-white border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-center group-hover:border-blue-200 transition-colors">
                    {t.icon}
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase border ${t.badgeColor}`}
                  >
                    {t.badge}
                  </span>
                </div>

                <h3 className="text-base font-black text-slate-950 group-hover:text-blue-600 transition-colors mb-2 tracking-tight leading-snug">
                  {t.title}
                </h3>

                <p className="text-xs text-slate-500 leading-relaxed font-normal">
                  {t.desc}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-slate-400 group-hover:text-blue-600 transition-colors">
                <span>Jetzt nutzen</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

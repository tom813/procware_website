import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { Badge } from "./ui/badge";
import {
  Search,
  BookOpen,
  Play,
  Clock,
  ArrowRight,
  Sparkles,
  Calendar,
  CheckCircle2,
  Filter,
} from "lucide-react";
import { BLOG_ARTICLES } from "../data/procwareData";

interface WissenPageProps {
  onOpenBooking: () => void;
}

export const WissenPage: React.FC<WissenPageProps> = ({ onOpenBooking }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Alle");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    const originalTitle = document.title;
    document.title = "Procware Wissen: Praxis-Guides zu Sourcing, Fulfillment, GPSR & Zoll";

    let metaDesc = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const originalDesc = metaDesc?.getAttribute("content") || "";
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute(
      "content",
      "Fundiertes Praxiswissen für Shopify-Händler: 18 Guides zu Sourcing, 100% deutschem Fulfillment, Zollreform 2026, GPSR-Sicherheitsgesetzen und E-Commerce-Wachstum."
    );

    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const originalCanonical = canonical?.getAttribute("href") || "";
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", "https://procware.de/wissen");

    return () => {
      document.title = originalTitle;
      if (metaDesc) metaDesc.setAttribute("content", originalDesc);
      if (canonical && originalCanonical) canonical.setAttribute("href", originalCanonical);
    };
  }, []);

  // Extract all unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(BLOG_ARTICLES.map((a) => a.category)));
    return ["Alle", ...cats];
  }, []);

  // Filter articles based on search & category
  const filteredArticles = useMemo(() => {
    return BLOG_ARTICLES.filter((art) => {
      const matchesCategory =
        selectedCategory === "Alle" || art.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        art.title.toLowerCase().includes(q) ||
        art.excerpt.toLowerCase().includes(q) ||
        art.content.toLowerCase().includes(q) ||
        art.category.toLowerCase().includes(q) ||
        (art.keyTakeaways &&
          art.keyTakeaways.some((k) => k.toLowerCase().includes(q)));
      return matchesCategory && matchesQuery;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="pt-24 pb-20 bg-white min-h-screen">
      {/* Header Banner */}
      <section className="bg-slate-50 border-b border-slate-200 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200/70 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4">
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              <span>E-Commerce Know-How & 18 Praxis-Guides</span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.1]">
              Procware <span className="text-blue-600">Wissen</span>
            </h1>
            <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              Fundiertes Praxiswissen für Shopify-Händler und E-Commerce Brands. Erfahre alles
              über EU-Zollbestimmungen ab 2026, GPSR-Sicherheitsgesetze, Barcode-Integration,
              100% deutsches Fulfillment und weltweites Sourcing.
            </p>
          </div>

          {/* Search & Filter Controls */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Themen durchsuchen (z.B. GPSR, Zoll, GTIN)..."
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-300 rounded-2xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                >
                  Löschen
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase mr-1">
                <Filter className="w-3.5 h-3.5" />
                <span>Kategorie:</span>
              </div>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-slate-950 text-white shadow-xs"
                      : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {filteredArticles.length === 0 ? (
          <div className="py-20 text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-950 mb-2">
              Keine Artikel gefunden
            </h3>
            <p className="text-sm text-slate-600 mb-6">
              Zu deinen Suchbegriffen wurden leider keine Beiträge gefunden. Probiere es mit anderen Stichworten wie „GPSR“, „Zoll“ oder „Barcode“.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("Alle");
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-950 text-white text-xs font-bold hover:bg-blue-600 transition-colors cursor-pointer"
            >
              Filter zurücksetzen
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((art) => (
              <Link
                key={art.id}
                to={`/wissen/${art.slug}`}
                className="flex flex-col bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl hover:border-slate-400 transition-all duration-300 group cursor-pointer text-left no-underline"
              >
                {/* Visual Header */}
                <div className="relative aspect-video bg-slate-950 overflow-hidden">
                  {art.imageUrl ? (
                    <img
                      src={art.imageUrl}
                      alt={art.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-linear-to-br from-slate-900 to-slate-800 flex items-center justify-center relative p-6">
                      <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                        <BookOpen className="w-7 h-7" />
                      </div>
                    </div>
                  )}

                  {/* Video Play Overlay */}
                  {art.youtubeId && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/15 transition-colors">
                      <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-white ml-0.5" />
                      </div>
                    </div>
                  )}

                  <div className="absolute top-3 left-3">
                    <Badge
                      variant="secondary"
                      className="text-xs font-bold bg-white/95 text-slate-950 border border-slate-200 shadow-xs"
                    >
                      {art.category}
                    </Badge>
                  </div>

                  <div className="absolute bottom-3 right-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-xs text-white text-[11px] font-bold border border-white/10 shadow-xs">
                      {art.youtubeId ? (
                        <>
                          <Play className="w-3 h-3 fill-blue-400 text-blue-400" />
                          <span>Video & Guide</span>
                        </>
                      ) : (
                        <>
                          <BookOpen className="w-3 h-3 text-blue-400" />
                          <span>Praxis-Guide</span>
                        </>
                      )}
                    </span>
                  </div>
                </div>

                {/* Text Content */}
                <div className="p-6 flex flex-col flex-1 justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-xs text-slate-400 font-bold uppercase tracking-wider mb-3">
                      <span>{art.date}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {art.readTime}
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-slate-950 group-hover:text-blue-600 transition-colors line-clamp-2 mb-3 leading-snug tracking-tight">
                      {art.title}
                    </h3>

                    <p className="text-sm text-slate-600 leading-relaxed line-clamp-3 mb-6 font-normal">
                      {art.excerpt}
                    </p>

                    {/* Key takeaways bullet preview */}
                    {art.keyTakeaways && (
                      <div className="mb-4 pt-3 border-t border-slate-100">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                          Kernpunkte:
                        </span>
                        <ul className="space-y-1 text-xs text-slate-600">
                          {art.keyTakeaways.slice(0, 2).map((k, idx) => (
                            <li key={idx} className="flex items-start gap-1.5 line-clamp-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                              <span>{k}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-wider">
                    <span>{art.youtubeId ? "Guide & Video ansehen" : "Vollständigen Guide lesen"}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Bottom Consultation Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="rounded-3xl bg-slate-950 text-white p-8 sm:p-12 shadow-xl border border-slate-900 text-center relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-blue-300">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Persönliche Beratung</span>
            </span>

            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Fragen zu Fulfillment, Zoll oder GPSR?
            </h2>

            <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
              Buche jetzt dein kostenloses Erstgespräch mit unserem deutschsprachigen Team.
              Wir prüfen deine Produkte, besprechen dein deutsches Fulfillment und kalkulieren deine Ersparnis.
            </p>

            <div className="pt-3">
              <a
                href="https://calendly.com/team-procware/new-meeting"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 text-sm sm:text-base font-bold px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-600/25 transition-all cursor-pointer group"
              >
                <Calendar className="w-4 h-4" />
                <span>Kostenloses Erstgespräch buchen</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};


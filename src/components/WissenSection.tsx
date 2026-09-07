import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "./ui/badge";
import { Play, Clock, ArrowRight, BookOpen } from "lucide-react";
import { BLOG_ARTICLES } from "../data/procwareData";

interface WissenSectionProps {
  onSelectArticle?: (slug: string) => void;
}

export const WissenSection: React.FC<WissenSectionProps> = ({ onSelectArticle }) => {
  return (
    <section id="wissen" className="py-20 sm:py-28 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <Badge variant="brand" className="mb-3 font-bold">
            E-Commerce Know-How
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
            Procware Wissen
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            Hier findest du praxisnahe Guides zum Thema „Einkauf aus China“, neue EU-Zollbestimmungen,
            GPSR-Sicherheitsgesetze und Barcodes für skalierende Shopify-Stores.
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {BLOG_ARTICLES.slice(0, 6).map((art) => (
            <Link
              key={art.id}
              to={`/wissen/${art.slug}`}
              onClick={() => onSelectArticle && onSelectArticle(art.slug)}
              className="flex flex-col bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl hover:border-slate-400 transition-all duration-300 cursor-pointer group text-left no-underline"
            >
              {/* Header Visual */}
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
                  <Badge variant="secondary" className="text-xs font-bold bg-white/95 text-slate-950 border border-slate-200 shadow-xs">
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

              {/* Text Body */}
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

                  <h3 className="text-lg font-black text-slate-950 group-hover:text-blue-600 transition-colors line-clamp-2 mb-3 leading-snug tracking-tight">
                    {art.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3 mb-6 font-normal">
                    {art.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-wider">
                  <span>{art.youtubeId ? "Artikel & Video ansehen" : "Guide lesen"}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Call-To-Action to full Wissen page */}
        <div className="mt-12 text-center">
          <Link
            to="/wissen"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-slate-950 hover:bg-blue-600 text-white text-sm font-bold shadow-md transition-all group cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-blue-400" />
            <span>Alle 18 Artikel & Guides in Procware Wissen anzeigen</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

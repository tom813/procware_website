import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "./ui/badge";
import {
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle2,
  Share2,
  Sparkles,
  ArrowRight,
  BookOpen,
  Check,
  Tag,
  Play,
} from "lucide-react";
import { BlogArticle } from "../types";
import { BLOG_ARTICLES } from "../data/procwareData";

interface BlogArticlePageProps {
  article: BlogArticle;
  onBack: () => void;
  onSelectArticle: (slug: string) => void;
  onOpenBooking: () => void;
}

export const BlogArticlePage: React.FC<BlogArticlePageProps> = ({
  article,
  onBack,
  onSelectArticle,
  onOpenBooking,
}) => {
  const [copied, setCopied] = useState(false);

  // SEO Management & Meta Tags
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    // 1. Page Title
    const originalTitle = document.title;
    document.title = `${article.title} | Procware Wissen`;

    // 2. Meta Description
    let metaDesc = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const originalDesc = metaDesc?.getAttribute("content") || "";
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", article.excerpt);

    // 3. Canonical Link (crucial for SEO preservation: point to https://procware.de/wissen/slug)
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const originalCanonical = canonical?.getAttribute("href") || "";
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    const fullCanonicalUrl = `https://procware.de/wissen/${article.slug}`;
    canonical.setAttribute("href", fullCanonicalUrl);

    // 4. OpenGraph Tags
    let ogTitle = document.querySelector<HTMLMetaElement>('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement("meta");
      ogTitle.setAttribute("property", "og:title");
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute("content", `${article.title} | Procware Wissen`);

    let ogDesc = document.querySelector<HTMLMetaElement>('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement("meta");
      ogDesc.setAttribute("property", "og:description");
      document.head.appendChild(ogDesc);
    }
    ogDesc.setAttribute("content", article.excerpt);

    let ogUrl = document.querySelector<HTMLMetaElement>('meta[property="og:url"]');
    if (!ogUrl) {
      ogUrl = document.createElement("meta");
      ogUrl.setAttribute("property", "og:url");
      document.head.appendChild(ogUrl);
    }
    ogUrl.setAttribute("content", fullCanonicalUrl);

    // 5. JSON-LD Structured Data for Article / BlogPosting
    const schemaScript = document.createElement("script");
    schemaScript.type = "application/ld+json";
    schemaScript.id = "article-jsonld";
    schemaScript.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": article.title,
      "description": article.excerpt,
      "url": fullCanonicalUrl,
      "datePublished": article.date,
      "author": {
        "@type": "Organization",
        "name": "Procware",
        "url": "https://procware.de"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Procware",
        "logo": {
          "@type": "ImageObject",
          "url": "https://procware.de/wp-content/uploads/2025/06/procware-logo.svg"
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": fullCanonicalUrl
      }
    });
    document.head.appendChild(schemaScript);

    return () => {
      document.title = originalTitle;
      if (metaDesc) metaDesc.setAttribute("content", originalDesc);
      if (canonical && originalCanonical) {
        canonical.setAttribute("href", originalCanonical);
      }
      const existingScript = document.getElementById("article-jsonld");
      if (existingScript) existingScript.remove();
    };
  }, [article]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const otherArticles = BLOG_ARTICLES.filter((a) => a.slug !== article.slug).slice(0, 4);

  return (
    <div className="min-h-screen bg-white text-slate-900 pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation / Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <Link
            to="/wissen"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-950 transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Zurück zur Übersicht (18 Guides)</span>
          </Link>

          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Link to="/" className="hover:text-slate-900">
              Startseite
            </Link>
            <span>/</span>
            <Link to="/wissen" className="hover:text-slate-900">
              Wissen
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold truncate max-w-[220px]">
              {article.title}
            </span>
          </div>
        </div>

        {/* Article Header */}
        <header className="space-y-4 mb-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="brand" className="font-bold">
                {article.category}
              </Badge>
              <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {article.date}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {article.readTime}
              </span>
            </div>

            {/* Share / Copy Link Button */}
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:text-slate-900 hover:border-slate-300 transition-colors cursor-pointer"
              title="Link kopieren"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Link kopiert!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Teilen</span>
                </>
              )}
            </button>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-[1.15]">
            {article.title}
          </h1>

          <p className="text-base sm:text-xl text-slate-600 font-normal leading-relaxed">
            {article.excerpt}
          </p>
        </header>

        {/* Visual / Video Embed Section */}
        {article.youtubeId ? (
          <div className="mb-12 rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl aspect-video relative">
            <iframe
              className="w-full h-full border-0"
              src={`https://www.youtube-nocookie.com/embed/${article.youtubeId}?rel=0&modestbranding=1`}
              title={article.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : article.imageUrl ? (
          <div className="mb-12 rounded-3xl overflow-hidden bg-slate-950 border border-slate-200 shadow-xl aspect-video relative">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>
        ) : null}

        {/* Key Takeaways Box */}
        {article.keyTakeaways && article.keyTakeaways.length > 0 && (
          <div className="mb-12 bg-blue-50/60 border border-blue-200/80 rounded-3xl p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-black text-slate-950">
                Das Wichtigste auf einen Blick
              </h3>
            </div>
            <ul className="space-y-3">
              {article.keyTakeaways.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-slate-800 leading-relaxed font-medium">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Article Content: Renders HTML from WordPress or Paragraphs */}
        {article.htmlContent ? (
          <div
            className="article-content mb-16"
            dangerouslySetInnerHTML={{ __html: article.htmlContent }}
          />
        ) : (
          <article className="space-y-6 text-slate-700 leading-relaxed text-base sm:text-lg font-normal mb-16">
            {article.paragraphs ? (
              article.paragraphs.map((p, idx) => (
                <p key={idx} className="leading-relaxed">
                  {p}
                </p>
              ))
            ) : (
              <p className="leading-relaxed">{article.content}</p>
            )}
          </article>
        )}

        {/* Article Bottom Call to Action */}
        <div className="bg-slate-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-800 mb-16 text-center space-y-5">
          <Badge variant="secondary" className="bg-white/10 text-white border-white/15">
            Sourcing & 100% Deutsches Fulfillment
          </Badge>
          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Möchtest du dein Sourcing & Fulfillment profitabel aufstellen?
          </h3>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Unser deutschsprachiges Team unterstützt dich bei der Beschaffung, Qualitätsprüfung,
            EU-Konformität sowie Lagerung & Same-Day-Versand aus unserem deutschen Logistikzentrum.
          </p>
          <div className="pt-2">
            <a
              href="https://calendly.com/team-procware/new-meeting"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base shadow-lg shadow-blue-600/25 transition-all duration-200 cursor-pointer"
            >
              <span>Kostenloses Erstgespräch buchen</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Other Articles Section */}
        <div className="pt-10 border-t border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-black text-slate-950">
              Weitere Artikel & Guides
            </h3>
            <Link
              to="/wissen"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>Alle 18 Artikel ansehen</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {otherArticles.map((other) => (
              <div
                key={other.id}
                onClick={() => onSelectArticle(other.slug)}
                className="overflow-hidden bg-slate-50 border border-slate-200 rounded-2xl hover:border-slate-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                {other.imageUrl && (
                  <div className="aspect-video w-full relative overflow-hidden bg-slate-900">
                    <img
                      src={other.imageUrl}
                      alt={other.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                      loading="lazy"
                    />
                    {other.youtubeId && (
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-sm">
                          <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                        </div>
                      </div>
                    )}
                    <div className="absolute top-2.5 left-2.5">
                      <Badge variant="secondary" className="text-[11px] font-bold bg-white/95 text-slate-950 border border-slate-200 shadow-xs">
                        {other.category}
                      </Badge>
                    </div>
                  </div>
                )}
                <div className="p-5 flex flex-col flex-1 justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-2 font-semibold">
                      <span>{other.readTime}</span>
                    </div>
                    <h4 className="text-base font-black text-slate-950 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                      {other.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-2">
                      {other.excerpt}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-blue-600">
                    <span>{other.youtubeId ? "Video & Guide ansehen" : "Guide lesen"}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

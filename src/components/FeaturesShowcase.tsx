import React, { useState } from "react";
import { Badge } from "./ui/badge";
import {
  CheckCircle2,
  MessageSquare,
  PackageSearch,
  Truck,
  ArrowRight,
  Calendar,
} from "lucide-react";
import { FEATURES, PROCWARE_LOGO } from "../data/procwareData";
import { ProductSampleCard } from "./ProductSampleCard";

export const FeaturesShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const getFeatureIcon = (idx: number) => {
    switch (idx) {
      case 0:
        return <PackageSearch className="w-5 h-5 text-blue-600" />;
      case 1:
        return <MessageSquare className="w-5 h-5 text-blue-600" />;
      case 2:
        return <Truck className="w-5 h-5 text-blue-600" />;
      default:
        return <PackageSearch className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <section id="features" className="py-20 sm:py-28 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <Badge variant="brand" className="mb-3 font-bold">
            Plattform Features
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
            Leistungsstarke Funktionen für deinen E-Commerce-Erfolg
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            Alles, was du für die professionelle Beschaffung, Qualitätskontrolle und automatisierte
            Logistik benötigst – vereint in einem intuitiven System.
          </p>
        </div>

        {/* Feature Selector Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {FEATURES.map((feature, idx) => (
            <button
              key={feature.id}
              onClick={() => setActiveTab(idx)}
              className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl font-bold text-sm tracking-tight transition-all duration-200 cursor-pointer border ${
                activeTab === idx
                  ? "bg-slate-950 text-white border-slate-950 shadow-md scale-[1.02]"
                  : "bg-slate-100/80 text-slate-700 border-slate-200 hover:bg-slate-200 hover:text-slate-950"
              }`}
            >
              <span
                className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                  activeTab === idx ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-800"
                }`}
              >
                {feature.stepNumber}
              </span>
              <span>{feature.title}</span>
            </button>
          ))}
        </div>

        {/* Active Feature Showcase Block */}
        <div>
          {FEATURES.map((feature, idx) => {
            if (idx !== activeTab) return null;

            return (
              <div
                key={feature.id}
                className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs transition-all animate-in fade-in duration-300"
              >
                {/* Text & Bullets Column */}
                <div className="lg:col-span-6 space-y-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-900">
                      {getFeatureIcon(idx)}
                      <span>Schritt {feature.stepNumber}</span>
                    </div>
                    {feature.tag && (
                      <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-xs font-extrabold">
                        {feature.tag}
                      </span>
                    )}
                    {feature.highlightBadge && (
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                        {feature.highlightBadge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
                    {feature.title}
                  </h3>

                  <p className="text-base text-slate-600 leading-relaxed font-normal">
                    {feature.description}
                  </p>

                  <div className="space-y-3 pt-2">
                    {feature.bullets.map((bullet, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                        <span className="text-sm font-semibold text-slate-800">
                          {bullet}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 flex flex-wrap items-center gap-4">
                    <a
                      href="https://calendly.com/team-procware/new-meeting"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-950 hover:bg-blue-600 text-white font-bold text-sm shadow-md transition-colors"
                    >
                      <Calendar className="w-4 h-4 text-blue-400" />
                      <span>Termin buchen</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* Software Frame Column or Standalone Product Card for Step 3 */}
                <div className="lg:col-span-6 flex items-center justify-center">
                  {idx === 2 ? (
                    <ProductSampleCard className="w-full shadow-md border-slate-200" />
                  ) : (
                    <div className="w-full relative rounded-3xl overflow-hidden border border-slate-200/90 bg-white shadow-xl shadow-slate-200/50 p-2 sm:p-3 group">
                      {/* Software Top App Bar with Procware Wide Logo */}
                      <div className="flex items-center justify-between px-3 py-2.5 bg-slate-50 border border-slate-200/80 rounded-2xl mb-3">
                        <div className="flex items-center gap-3">
                          {/* macOS Window Controls */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="w-2.5 h-2.5 rounded-full bg-rose-400/80" />
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                          </div>
                          {/* Authentic Wide Procware Logo in Software Top-Left */}
                          <div className="h-5 flex items-center pl-2 border-l border-slate-200">
                            <img
                              src={PROCWARE_LOGO}
                              alt="Procware"
                              className="h-4.5 w-auto object-contain"
                              loading="lazy"
                            />
                          </div>
                        </div>

                        {/* Right status badge */}
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Shopify Sync aktiv</span>
                          </span>
                        </div>
                      </div>

                      {/* Clean Visual / Sourcing Display */}
                      <div className="relative rounded-2xl overflow-hidden bg-slate-950/5 flex items-center justify-center">
                        <img
                          src={feature.imageUrl}
                          alt={feature.imageAlt}
                          className="w-full h-auto max-h-[420px] object-cover rounded-xl transition-all duration-300 group-hover:scale-[1.01]"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      {/* Bottom Info Bar */}
                      <div className="mt-3 pt-2 flex items-center justify-between text-xs text-slate-500 font-medium px-2">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                          <span className="font-semibold text-slate-700">
                            Offizielle Shopify Partner App &amp; Logistik
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono font-bold">
                          {feature.stepNumber} / 03
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

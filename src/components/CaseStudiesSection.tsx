import React from "react";
import { Badge } from "./ui/badge";
import { Store, Building2, Calendar, TrendingUp, CheckCircle2 } from "lucide-react";
import { CASE_STUDIES } from "../data/procwareData";

export const CaseStudiesSection: React.FC = () => {
  return (
    <section id="case-studies" className="py-20 sm:py-28 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <Badge variant="brand" className="mb-3 font-bold">
            Erfolgsgeschichten
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
            Case Studies
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            Einblicke in die Praxis: Wie E-Commerce-Marken und Agenturen mit Procware Skalierungsengpässe
            überwinden und ihre Einkaufsmargen sichern.
          </p>
        </div>

        {/* Case Studies Grid - Unlinked, purely informative showcase cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {CASE_STUDIES.map((cs) => (
            <div
              key={cs.id}
              className="flex flex-col bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs"
            >
              {/* Image Banner */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <img
                  src={cs.imageUrl}
                  alt={cs.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary" className="bg-white/95 backdrop-blur-md text-xs font-bold text-slate-900 shadow-xs border border-slate-200">
                    {cs.category === "Online Shop" ? (
                      <Store className="w-3.5 h-3.5 mr-1 text-blue-600" />
                    ) : (
                      <Building2 className="w-3.5 h-3.5 mr-1 text-blue-600" />
                    )}
                    {cs.category}
                  </Badge>
                </div>
                <div className="absolute bottom-4 right-4">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md text-white text-[11px] font-bold">
                    <Calendar className="w-3 h-3" />
                    {cs.date}
                  </span>
                </div>
              </div>

              {/* Content Box */}
              <div className="p-6 sm:p-8 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-950 mb-3 tracking-tight">
                    {cs.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6 font-normal">
                    {cs.summary}
                  </p>

                  {/* Key Stats Pill Row */}
                  <div className="grid grid-cols-2 gap-2.5">
                    {cs.keyStats.map((stat, sIdx) => (
                      <div key={sIdx} className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                        <div className="text-xs text-slate-500 font-semibold">{stat.label}</div>
                        <div className="text-base font-black text-slate-950 mt-0.5">{stat.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold">
                  <span className="flex items-center gap-1.5 text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Verifiziertes Kundenprojekt</span>
                  </span>
                  <span>{cs.brandName}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

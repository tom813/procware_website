import React from "react";
import { ArrowRight, ShieldCheck, Sparkles, Calendar } from "lucide-react";

export const ValueBanner: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-600 text-xs font-bold uppercase tracking-wider mb-6">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Verlässliche Beschaffung & Fulfillment-Infrastruktur</span>
        </div>

        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.15] max-w-4xl mx-auto">
          Procware verbindet deinen Store mit{" "}
          <span className="text-blue-600">
            geprüften Lieferanten
          </span>
          , sichert optimale Konditionen und garantiert reibungsloses Fulfillment.
        </h2>

        <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
          Schluss mit unzuverlässigen Einzel-Agenten und intransparenten Aufschlägen. Als dein
          spezialisierter Partner bündeln wir Sourcing, Qualitätskontrolle,
          100% deutsches Fulfillment (Lagerung, Pick & Pack & Retouren) und weltweiten Express-Versand in einer nahtlosen Plattform.
        </p>

        <div className="mt-10 flex justify-center">
          <a
            href="https://calendly.com/team-procware/new-meeting"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-2xl px-9 py-4 text-base font-bold bg-slate-950 hover:bg-blue-600 text-white shadow-xl shadow-slate-950/10 hover:shadow-blue-600/25 transition-all duration-200 cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-blue-400" />
            <span>Jetzt kostenloses Erstgespräch buchen</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

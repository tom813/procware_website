import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "./ui/badge";
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  Truck,
  CheckCircle2,
  Calendar,
  Wrench,
  Sparkles,
  Package,
  Clock,
  RotateCcw,
  Plane,
} from "lucide-react";
import { PROCWARE_LOGO } from "../data/procwareData";

interface HeroSectionProps {
  onOpenBooking: () => void;
  onOpenRegister?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenBooking,
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-white pt-10 pb-16 md:pt-16 md:pb-24 border-b border-slate-200">
      {/* Subtle light background patterns */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-blue-100/40 blur-3xl rounded-full" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Eyebrow Chip */}
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs mb-6">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-ping" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Procware
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-xs font-black uppercase tracking-wider text-blue-600">
              Sourcing & Fulfillment Partner
            </span>
          </div>

          {/* Main Hero Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-950 tracking-tight max-w-5xl leading-[1.08]">
            Procware – Dein <span className="text-blue-600">Wettbewerbsvorteil</span> im E-Commerce.
          </h1>

          {/* Subheading */}
          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl font-normal leading-relaxed">
            Verbinde deinen Shopify-Shop mit Procware und profitiere von transparenten Konditionen,
            zuverlässigem Sourcing, 1-3 Tagen Lieferzeit aus Deutschland, 6-14 Tagen aus China und automatisiertem Express-Versand.
          </p>

          {/* Primary Call to Action Buttons */}
          <div className="mt-9 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <a
              href="https://calendly.com/team-procware/new-meeting"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-base font-black px-9 py-4 rounded-2xl bg-slate-950 hover:bg-blue-600 text-white shadow-xl shadow-slate-950/10 hover:shadow-blue-600/25 transition-all duration-200 cursor-pointer group"
            >
              <Calendar className="w-5 h-5 text-blue-400" />
              <span>Termin buchen</span>
              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </a>
            <Link
              to="/tools"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-base border border-slate-300 bg-white hover:bg-slate-50 text-slate-900 px-8 py-4 rounded-2xl font-bold shadow-xs hover:border-slate-400 transition-colors group"
            >
              <Wrench className="w-4 h-4 text-blue-600" />
              <span>Kostenlose E-Com Tools</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-[10px] font-black text-blue-700 uppercase">
                Gratis
              </span>
            </Link>
          </div>

          {/* Value Badges Under CTAs */}
          <div className="mt-9 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600 font-bold">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>0 € Kosten bis zur ersten Bestellung</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>1-3 Tage (DE) &amp; 6-14 Tage (China)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>50.000+ monatliche Bestellungen</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>100% 5-Sterne Trustpilot</span>
            </div>
          </div>
        </div>

        {/* 3 Metric Stat Highlights */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Card 1: 1-3 Tage aus Deutschland */}
          <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-blue-200 hover:shadow-md transition-all">
            <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 mb-4">
              <Truck className="w-6 h-6" />
            </div>
            <div className="text-4xl sm:text-5xl font-black text-slate-950 tracking-tight flex items-baseline gap-1.5">
              <span>1 - 3</span>
              <span className="text-xl font-black text-blue-600">Tage</span>
            </div>
            <div className="mt-3 text-base font-extrabold text-slate-900">
              Aus Deutschland
            </div>
            <div className="mt-1.5 text-xs text-slate-500 leading-relaxed font-medium">
              Deutsches Fulfillment, blitzschnelle Lagerung, Pick &amp; Pack und Retourenservice direkt vor Ort.
            </div>
          </div>

          {/* Card 2: 6-14 Tage aus China (New Card, dropping 100% deutsches fulfillment) */}
          <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-amber-200 hover:shadow-md transition-all">
            <div className="p-3 rounded-2xl bg-amber-50 text-amber-600 mb-4">
              <Plane className="w-6 h-6" />
            </div>
            <div className="text-4xl sm:text-5xl font-black text-slate-950 tracking-tight flex items-baseline gap-1.5">
              <span>6 - 14</span>
              <span className="text-xl font-black text-amber-600">Tage</span>
            </div>
            <div className="mt-3 text-base font-extrabold text-slate-900">
              Aus China
            </div>
            <div className="mt-1.5 text-xs text-slate-500 leading-relaxed font-medium">
              Direktversand ab Hersteller per Express-Flugfracht inklusive zollfreier DDP-Zustellung direkt an Endkunden.
            </div>
          </div>

          {/* Card 3: 50.000 monatliche Bestellungen */}
          <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-emerald-200 hover:shadow-md transition-all">
            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 mb-4">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="text-4xl sm:text-5xl font-black text-slate-950 tracking-tight flex items-baseline gap-1">
              <span>50.000</span>
              <span className="text-2xl font-black text-blue-600">+</span>
            </div>
            <div className="mt-3 text-base font-extrabold text-slate-900">
              Monatliche Bestellungen
            </div>
            <div className="mt-1.5 text-xs text-slate-500 leading-relaxed font-medium">
              Vollautomatisiertes Packing, Labeling und Tracking ohne manuelle Arbeit.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

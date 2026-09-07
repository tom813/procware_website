import React from "react";
import { Badge } from "./ui/badge";
import { ArrowRight, Link2, MessageSquare, Zap, ExternalLink, Calendar } from "lucide-react";
import { HOW_IT_WORKS_STEPS } from "../data/procwareData";

export const HowItWorks: React.FC = () => {
  const getStepIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Link2 className="w-5 h-5 text-blue-600" />;
      case 1:
        return <MessageSquare className="w-5 h-5 text-blue-600" />;
      case 2:
        return <Zap className="w-5 h-5 text-blue-600" />;
      default:
        return <ArrowRight className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <section id="how-it-works" className="py-20 sm:py-28 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <Badge variant="brand" className="mb-3 font-bold">
            In 3 Schritten startklar
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
            So funktioniert’s mit Procware
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            Über unsere Plattform wird der gesamte Beschaffungs- und Versandprozess automatisiert.
            Sobald dein Shop verbunden ist, koordinieren wir Beschaffung, Angebot und Fulfillment,
            um dir Zeit zu sparen und deinen Fokus auf das Wachstum deines Shops zu richten.
          </p>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {HOW_IT_WORKS_STEPS.map((step, idx) => (
            <div
              key={step.number}
              className="relative flex flex-col justify-between p-8 rounded-3xl bg-white border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300 group"
            >
              {/* Step number badge */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-4xl sm:text-5xl font-black text-slate-300 group-hover:text-blue-600 transition-colors">
                  {step.number}
                </span>
                <div className="w-11 h-11 rounded-2xl bg-blue-50 flex items-center justify-center">
                  {getStepIcon(idx)}
                </div>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-950 mb-3 group-hover:text-blue-600 transition-colors tracking-tight">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6 font-normal">
                  {step.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Schritt {idx + 1} von 3
                </span>
                <a
                  href="https://calendly.com/team-procware/new-meeting"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>{step.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Platform Walkthrough Graphic */}
        <div className="mt-16 bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <Badge variant="secondary" className="text-xs font-bold uppercase tracking-wider">
                Plattform Rundgang
              </Badge>
              <h3 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
                Alles an einem zentralen Ort steuern
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                Behalte Produktanfragen, transparente Angebote, Bestellstatus und Bestände in Echtzeit
                im Blick. Keine unübersichtlichen Excel-Tabellen oder WhatsApp-Chats mit unzuverlässigen
                Agenten mehr.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <a
                  href="https://calendly.com/team-procware/new-meeting"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-950 hover:bg-blue-600 text-white font-bold text-sm shadow-sm transition-colors"
                >
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <span>Termin buchen</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="https://apps.shopify.com/ltp-ludwig-trading-plattform"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-3 text-sm font-bold rounded-xl border border-slate-300 text-slate-800 hover:bg-slate-50 transition-colors"
                >
                  <span>Zur Procware Shopify App</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 p-2 shadow-md">
                <img
                  src="https://procware.de/wp-content/uploads/2025/06/rundgang.png"
                  alt="Procware Plattform Rundgang Dashboard"
                  className="w-full h-auto object-cover rounded-xl"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

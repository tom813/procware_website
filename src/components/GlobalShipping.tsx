import React, { useState } from "react";
import { Badge } from "./ui/badge";
import { Globe, Plane, Clock, ShieldCheck, Search } from "lucide-react";
import { COUNTRIES } from "../data/procwareData";

export const GlobalShipping: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCountries = COUNTRIES.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section id="shipping" className="py-20 sm:py-28 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <Badge variant="brand" className="mb-3 font-bold">
            Weltweite Logistik
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
            Versende nach Europa und die Welt mit Procware
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            Schneller Express-Flugtransport direkt aus den Beschaffungszentren in China,
            inklusive vollständiger Zollabfertigung und lückenloser Sendungsverfolgung bis zur Haustür.
          </p>
        </div>

        {/* Professional Global Logistics World Map */}
        <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 p-6 sm:p-10 text-white shadow-2xl">
          {/* Subtle background radar glow */}
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Grid: Left Column (Text & Benefits) | Right Column (Centered World Map Visual) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center relative z-10">
            {/* Left Column: In über 50 Länder zuverlässig liefern */}
            <div className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider border border-blue-500/30">
                <Plane className="w-3.5 h-3.5" />
                <span>Internationales Fulfillment Netzwerk</span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                In über 50 Länder zuverlässig liefern
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                Deine Kunden erwarten verlässliche Lieferzeiten. Mit Procware erreichen Bestellungen
                Deutschland, Österreich und die Schweiz im Schnitt innerhalb von 5 bis 8 Werktagen –
                inklusive lückenloser Sendungsverfolgung und vorverzollter DDP-Abwicklung.
              </p>

              {/* Bullet highlights */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-xs sm:text-sm font-medium text-slate-200">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 border border-blue-500/40">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <span>5-8 Werktage D-A-CH Express-Lieferung</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm font-medium text-slate-200">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 border border-emerald-500/40">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <span>100% Inklusive DDP Zollabfertigung (ohne Nachzahlungen)</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm font-medium text-slate-200">
                  <div className="w-6 h-6 rounded-full bg-sky-500/20 flex items-center justify-center shrink-0 border border-sky-500/40">
                    <Globe className="w-3.5 h-3.5 text-sky-400" />
                  </div>
                  <span>Letzte Meile: DHL, Hermes, DPD &amp; Post</span>
                </div>
              </div>
            </div>

            {/* Right Column: World Map, centered to the right */}
            <div className="lg:col-span-7 flex items-center justify-center lg:justify-end">
              <div className="relative w-full h-[300px] sm:h-[380px] lg:h-[420px] rounded-2xl overflow-hidden bg-slate-900/60 border border-slate-800/80 p-2 sm:p-3 flex items-center justify-center shadow-inner group">
                <img
                  src="/images/world_map_procware.svg"
                  alt="Procware Weltkarte für globale Logistik und Expressversand"
                  className="w-full h-full object-contain object-center select-none transition-transform duration-500 group-hover:scale-[1.02]"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar inside Map Card */}
          <div className="relative z-10 mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400 shrink-0" />
              <span className="text-slate-200">5-8 Werktage D-A-CH Express</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-slate-200">100% Inklusive DDP Zollabfertigung</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-sky-400 shrink-0" />
              <span className="text-slate-200">Lokale Zustellung: DHL, Hermes, DPD, Post</span>
            </div>
          </div>
        </div>

        {/* Interactive Country / Flag Grid with Search */}
        <div className="mt-16">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <h4 className="text-xl font-black text-slate-950 tracking-tight">
              Unterstützte Zielländer & Richtzeiten
            </h4>
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Land suchen (z. B. Schweiz)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-sm font-medium border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-slate-50 text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {filteredCountries.map((country) => (
              <div
                key={country.name}
                className="flex items-center gap-3 p-3.5 rounded-2xl border border-slate-200 bg-slate-50/80 hover:bg-white hover:border-slate-300 hover:shadow-sm transition-all"
              >
                <img
                  src={country.flagUrl}
                  alt={`Flagge von ${country.name}`}
                  className="w-7 h-7 rounded-full object-cover shrink-0 shadow-xs border border-slate-200"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = "none";
                    if (target.nextElementSibling) {
                      (target.nextElementSibling as HTMLElement).style.display = "flex";
                    }
                  }}
                />
                <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-700 text-[10px] font-black items-center justify-center shrink-0 border border-blue-200 hidden">
                  {country.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {country.name}
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    {country.deliveryDays}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filteredCountries.length === 0 && (
            <div className="text-center py-8 text-slate-400 text-sm">
              Kein Land mit "{searchTerm}" gefunden. Procware liefert auf Anfrage in über 50 Länder weltweit!
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

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

        {/* World Map Graphic from procware.de */}
        <div className="relative rounded-3xl overflow-hidden border border-slate-900 bg-slate-950 p-6 sm:p-10 text-white shadow-2xl">
          <div className="relative z-10 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-4 border border-blue-500/30">
              <Plane className="w-3.5 h-3.5" />
              <span>Internationales Fulfillment Netzwerk</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              In über 50 Länder zuverlässig liefern
            </h3>
            <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              Deine Kunden erwarten verlässliche Lieferzeiten. Mit Procware erreichen Bestellungen
              Deutschland, Österreich und die Schweiz im Schnitt innerhalb von 5 bis 8 Werktagen.
            </p>
          </div>

          <div className="mt-8 sm:mt-0 sm:absolute sm:right-6 sm:bottom-6 sm:max-w-xl opacity-95">
            <img
              src="https://procware.de/wp-content/uploads/2024/05/map.png"
              alt="Procware Weltkarte Versandnetzwerk"
              className="w-full h-auto object-contain max-h-[320px]"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Quick Metrics Bar inside Map Card */}
          <div className="relative z-10 mt-10 pt-6 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-semibold">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <span className="text-slate-200">5-8 Werktage D-A-CH</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-200">Inklusive Zollabwicklung (DDP)</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-sky-400" />
              <span className="text-slate-200">Lokale Zustellung via DHL / Hermes</span>
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
                />
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

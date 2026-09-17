import React from "react";
import {
  Star,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Award,
} from "lucide-react";

interface RealReviewItem {
  id: string;
  author: string;
  role: string;
  headline: string;
  text: string[];
  rating: number;
  date: string;
  verified: boolean;
}

const REAL_TRUSTPILOT_REVIEWS: RealReviewItem[] = [
  {
    id: "tp-real-1",
    author: "Verifizierter Händler",
    role: "E-Commerce Brand (Dropshipping & Brandshipping)",
    headline: "Top Service, Top Beratung alles Top!",
    text: [
      "Procware hat uns wirklich in allen Bereichen rund um Versand, Kontakte und Preisverhandlungen enorm unterstützt. Wir sind absolut zufrieden und können sie wirklich jeder Brand weiterempfehlen – egal ob Dropshipping oder Brandshipping. Für jede Situation gibt es hier passende Lösungen.",
      "Besonders schätzen wir, dass die Jungs auch in Notfällen sofort zur Stelle sind. Tom hat sich zum Beispiel einmal sogar um 00:00 Uhr noch Zeit für unser Anliegen genommen und ist direkt mit uns in einen Call gegangen. Das ist definitiv nicht selbstverständlich und wissen wir sehr zu schätzen.",
      "Man merkt einfach, dass sie genau wissen, was sie tun. Gleichzeitig sprechen sie auch klare Empfehlungen aus, wenn sie etwas nicht für sinnvoll halten. Alles läuft rechtlich sauber und EU-konform ab – und genau das ist für uns ein sehr wichtiger Punkt.",
      "Wir freuen uns auf die weitere Zusammenarbeit und besonders auf Q4. Die regelmäßigen Calls sind jedes Mal extrem hilfreich. Hier werden nicht einfach nur Tipps gegeben, sondern aktiv gemeinsam nach Lösungen gesucht. Dadurch hat man wirklich das Gefühl, dass sie mit einem im selben Boot sitzen.",
    ],
    rating: 5,
    date: "Verifizierte Bewertung auf Trustpilot",
    verified: true,
  },
  {
    id: "tp-real-2",
    author: "Verifizierter Händler",
    role: "Langjähriger E-Commerce Kunde",
    headline: "Wir nutzen Procware bereits seit knapp einem Jahr",
    text: [
      "Sehr zufrieden bisher. Übersichtliche Oberfläche und 1A Support bei Rückfragen. Wir benötigen dadurch kein externes WaWi mehr (für Bedarfsplanung) und auch das Sourcing ist implementiert.",
    ],
    rating: 5,
    date: "Verifizierte Bewertung auf Trustpilot",
    verified: true,
  },
];

export const TrustpilotReviewsSection: React.FC = () => {
  return (
    <section className="py-20 sm:py-24 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trustpilot Top Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Offiziell & Verifiziert auf Trustpilot</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
              Echte Kundenstimmen auf Trustpilot
            </h2>
            <p className="mt-3 text-base text-slate-600 font-normal leading-relaxed">
              Erfahre direkt von E-Commerce Brands, wie sie mit Procware ihren Versand optimieren,
              Preise verhandeln und ihr WaWi ablösen.
            </p>
          </div>

          {/* Trustpilot Score Badge Box */}
          <div className="flex flex-col items-start md:items-end shrink-0">
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-4 shadow-xs">
              {/* Trustpilot Green Star */}
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-[#00b67a] text-white font-black shadow-xs">
                <Star className="w-6 h-6 fill-white text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-5 h-5 rounded-xs bg-[#00b67a] flex items-center justify-center"
                    >
                      <Star className="w-3 h-3 fill-white text-white" />
                    </div>
                  ))}
                </div>
                <div className="mt-1.5 flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <span className="font-black text-slate-950">100% 5-Sterne</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-emerald-700 font-bold">5.0 von 5 Sternen</span>
                </div>
              </div>
            </div>

            <a
              href="https://de.trustpilot.com/review/procware.de"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-emerald-700 transition-colors"
            >
              <span>Originalbewertungen auf Trustpilot ansehen</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Real Reviews Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main detailed review (Longer) */}
          <div className="lg:col-span-7 flex flex-col justify-between bg-slate-50/80 border border-slate-200 rounded-3xl p-6 sm:p-9 shadow-xs hover:shadow-md transition-all">
            <div>
              {/* Stars + Header */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-5 h-5 rounded-xs bg-[#00b67a] flex items-center justify-center"
                    >
                      <Star className="w-3 h-3 fill-white text-white" />
                    </div>
                  ))}
                </div>

                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-black text-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verifizierte Erfahrung</span>
                </span>
              </div>

              {/* Review Title */}
              <h3 className="text-xl sm:text-2xl font-black text-slate-950 mb-4 tracking-tight">
                "{REAL_TRUSTPILOT_REVIEWS[0].headline}"
              </h3>

              {/* Review Body */}
              <div className="space-y-3 text-sm text-slate-700 leading-relaxed font-normal">
                {REAL_TRUSTPILOT_REVIEWS[0].text.map((paragraph, pIdx) => (
                  <p key={pIdx}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Author Footer */}
            <div className="mt-8 pt-5 border-t border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-slate-950">
                  {REAL_TRUSTPILOT_REVIEWS[0].author}
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  {REAL_TRUSTPILOT_REVIEWS[0].role}
                </div>
              </div>

              <a
                href="https://de.trustpilot.com/review/procware.de"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:underline"
              >
                <span>Trustpilot.com</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Secondary review + Trust stats (Right column) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Second Real Review */}
            <div className="bg-slate-50/80 border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs hover:shadow-md transition-all">
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-5 h-5 rounded-xs bg-[#00b67a] flex items-center justify-center"
                    >
                      <Star className="w-3 h-3 fill-white text-white" />
                    </div>
                  ))}
                </div>

                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-800">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Verifiziert</span>
                </span>
              </div>

              <h3 className="text-lg font-black text-slate-950 mb-3 tracking-tight">
                "{REAL_TRUSTPILOT_REVIEWS[1].headline}"
              </h3>

              <div className="space-y-2 text-sm text-slate-700 leading-relaxed font-normal">
                {REAL_TRUSTPILOT_REVIEWS[1].text.map((paragraph, pIdx) => (
                  <p key={pIdx}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-slate-950">
                    {REAL_TRUSTPILOT_REVIEWS[1].author}
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    {REAL_TRUSTPILOT_REVIEWS[1].role}
                  </div>
                </div>

                <span className="text-[11px] font-bold text-slate-400">
                  100% 5-Sterne
                </span>
              </div>
            </div>

            {/* Trustpilot Highlight Callout */}
            <div className="rounded-3xl bg-emerald-950 text-white p-6 sm:p-7 border border-emerald-900 shadow-lg space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-black uppercase tracking-wider">
                <Award className="w-4 h-4" />
                <span>100% 5-Sterne-Bewertungen</span>
              </div>
              <h4 className="text-xl font-black tracking-tight text-white">
                Verlässliche Partnerschaft für dein E-Commerce Wachstum
              </h4>
              <p className="text-xs text-emerald-100/80 leading-relaxed">
                Keine versteckten Gebühren, persönlicher Ansprechpartner in Deutschland und
                aktive Unterstützung bei Preisverhandlungen direkt mit Herstellern.
              </p>
              <div className="pt-2">
                <a
                  href="https://de.trustpilot.com/review/procware.de"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00b67a] hover:bg-[#00a870] text-white font-bold text-xs shadow-md transition-all"
                >
                  <Star className="w-3.5 h-3.5 fill-white" />
                  <span>Auf Trustpilot ansehen</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Proof Metrics */}
        <div className="mt-12 pt-8 border-t border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="text-2xl font-black text-slate-950">100%</div>
            <div className="text-xs font-semibold text-slate-600 mt-1">5-Sterne auf Trustpilot</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="text-2xl font-black text-slate-950">1 - 3 Tage</div>
            <div className="text-xs font-semibold text-slate-600 mt-1">Express D-A-CH &amp; EU</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="text-2xl font-black text-slate-950">Persönlich</div>
            <div className="text-xs font-semibold text-slate-600 mt-1">1A Support & Notfall-Calls</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="text-2xl font-black text-slate-950">100%</div>
            <div className="text-xs font-semibold text-slate-600 mt-1">EU- & GPSR-konform</div>
          </div>
        </div>
      </div>
    </section>
  );
};

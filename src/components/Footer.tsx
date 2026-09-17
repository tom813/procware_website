import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PROCWARE_LOGO } from "../data/procwareData";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Mail, ArrowRight, ExternalLink, Calendar } from "lucide-react";

interface FooterProps {
  onOpenLogin: () => void;
  onOpenBooking: () => void;
  onNavigateHome?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenLogin,
  onOpenBooking,
  onNavigateHome,
}) => {
  const [legalModalType, setLegalModalType] = useState<"impressum" | "datenschutz" | null>(null);

  return (
    <footer className="bg-slate-950 text-white pt-20 pb-12 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-slate-800/80">
          {/* Brand Info (Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={PROCWARE_LOGO}
                alt="Procware"
                className="h-8 w-auto object-contain brightness-0 invert"
              />
            </div>

            <p className="text-sm text-slate-400 max-w-sm leading-relaxed font-normal">
              Procware ist die All-in-One E-Commerce Plattform für intelligentes Sourcing,
              transparente Konditionen und automatisiertes weltweites Fulfillment für Shopify Stores.
            </p>

            <div className="pt-2">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Unternehmen
              </div>
              <p className="text-xs text-slate-300 font-medium">
                Ein Produkt der <strong>Ludwig Trading GmbH</strong> und <strong>Scalarsoft GmbH</strong>.
              </p>
            </div>

            <div className="pt-2 flex items-center gap-2 text-sm text-slate-300 font-semibold">
              <Mail className="w-4 h-4 text-blue-400" />
              <a
                href="mailto:team@procware.io"
                className="hover:text-white hover:underline transition-colors"
              >
                team@procware.io
              </a>
            </div>
          </div>

          {/* Col 2: Leistungen */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">
              Leistungen
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400 font-medium">
              <li>
                <Link to="/leistungen/sourcing" className="hover:text-white transition-colors">
                  Sourcing & Einkauf
                </Link>
              </li>
              <li>
                <Link to="/leistungen/packaging" className="hover:text-white transition-colors">
                  Individuelles Packaging
                </Link>
              </li>
              <li>
                <Link to="/leistungen/compliance" className="hover:text-white transition-colors">
                  EPR & GPSR Abmahnschutz
                </Link>
              </li>
              <li>
                <Link to="/leistungen/dropshipping" className="hover:text-white transition-colors">
                  Express Dropshipping
                </Link>
              </li>
              <li>
                <Link to="/leistungen/bulk-orders" className="hover:text-white transition-colors">
                  100% Deutsches Fulfillment
                </Link>
              </li>
              <li>
                <Link to="/leistungen/returns" className="hover:text-white transition-colors">
                  Retourenlager & Aufbereitung
                </Link>
              </li>
              <li>
                <Link to="/leistungen/multishop" className="hover:text-white transition-colors">
                  Multi-Store Verwaltung
                </Link>
              </li>
              <li>
                <Link to="/leistungen/agencies" className="hover:text-white transition-colors">
                  Agentur-Partnerprogramm
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Plattform & Ressourcen */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">
              Plattform
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400 font-medium">
              <li>
                <a
                  href="https://apps.shopify.com/ltp-ludwig-trading-plattform"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>Shopify App Store</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://docs.procware.de/books/onboarding"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>Dokumentation & Onboarding</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <Link
                  to="/barcode-generator"
                  className="hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Barcode & GTIN Generator</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/80 text-[10px] font-bold">
                    Neu
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/shopify-theme-detector"
                  className="hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Shopify Theme Detector</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/80 text-[10px] font-bold">
                    Neu
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/shopify-app-detector"
                  className="hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Shopify App Detector</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-purple-950 text-purple-300 border border-purple-800/80 text-[10px] font-bold">
                    Neu
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/shopify-fee-calculator"
                  className="hover:text-white transition-colors"
                >
                  Shopify Fee Calculator
                </Link>
              </li>
              <li>
                <Link
                  to="/roas-calculator"
                  className="hover:text-white transition-colors"
                >
                  ROAS Calculator
                </Link>
              </li>
              <li>
                <Link
                  to="/break-even-roas-calculator"
                  className="hover:text-white transition-colors"
                >
                  Break Even ROAS Rechner
                </Link>
              </li>
              <li>
                <Link
                  to="/shopify-margenrechner"
                  className="hover:text-white transition-colors"
                >
                  Shopify Margenrechner
                </Link>
              </li>
              <li>
                <Link
                  to="/liquiditaetsplanung-online-shop"
                  className="hover:text-white transition-colors"
                >
                  Liquiditätsplanung Online Shop
                </Link>
              </li>
              <li>
                <Link
                  to="/customer-lifetime-value-calculator"
                  className="hover:text-white transition-colors"
                >
                  CLV Calculator
                </Link>
              </li>
              <li>
                <Link
                  to="/safety-stock-calculator"
                  className="hover:text-white transition-colors"
                >
                  Safety Stock & Meldebestand
                </Link>
              </li>
              <li>
                <Link
                  to="/tools"
                  className="hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Kostenlose E-Com Tools</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-blue-900/60 text-[10px] font-bold text-blue-300">
                    Gratis
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/wissen"
                  className="hover:text-white transition-colors"
                >
                  Procware Wissen & Guides
                </Link>
              </li>
              <li>
                <button
                  onClick={onOpenLogin}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Procware App Login
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Socials & Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">
              Socials & Kontakt
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400 font-medium">
              <li>
                <a
                  href="#testimonials"
                  onClick={() => onNavigateHome && onNavigateHome()}
                  className="hover:text-white transition-colors"
                >
                  Video-Kundenstimmen
                </a>
              </li>
              <li>
                <a
                  href="https://www.tiktok.com/@procware"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  TikTok
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/procware/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/@Procware"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  YouTube
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/p/Procware-61577957822498/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Facebook
                </a>
              </li>
              <li className="pt-2">
                <a
                  href="https://calendly.com/team-procware/new-meeting"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer uppercase tracking-wider"
                >
                  <span>Termin vereinbaren</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4 font-medium">
          <p>© {new Date().getFullYear()} Procware. Alle Rechte vorbehalten.</p>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setLegalModalType("impressum")}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Impressum
            </button>
            <button
              onClick={() => setLegalModalType("datenschutz")}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Datenschutz
            </button>
            <a
              href="https://procware.de"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300 transition-colors"
            >
              procware.de
            </a>
          </div>
        </div>
      </div>

      {/* Legal Dialogs */}
      <Dialog
        open={!!legalModalType}
        onOpenChange={(open) => !open && setLegalModalType(null)}
      >
        <DialogContent className="max-w-lg text-slate-900 rounded-3xl border-slate-200">
          {legalModalType === "impressum" ? (
            <div className="space-y-4 text-xs leading-relaxed">
              <DialogTitle className="text-xl font-black text-slate-950 tracking-tight">
                Impressum
              </DialogTitle>
              <div className="space-y-2 text-slate-600 font-normal">
                <p>
                  <strong>Procware</strong> ist ein gemeinsames Produkt der:
                </p>
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <p className="font-bold text-slate-900">Ludwig Trading GmbH</p>
                  <p>In Kooperation mit:</p>
                  <p className="font-bold text-slate-900">Scalarsoft GmbH</p>
                </div>
                <p>
                  <strong>Kontakt:</strong>
                  <br />
                  E-Mail: team@procware.io
                  <br />
                  Web: https://procware.de
                </p>
                <p>
                  <strong>Haftungshinweis:</strong>
                  <br />
                  Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte
                  externer Links. Für den Inhalt der verlinkten Seiten sind ausschließlich deren
                  Betreiber verantwortlich.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-xs leading-relaxed">
              <DialogTitle className="text-xl font-black text-slate-950 tracking-tight">
                Datenschutzerklärung
              </DialogTitle>
              <div className="space-y-2 text-slate-600 font-normal">
                <p>
                  Der Schutz deiner persönlichen Daten ist uns ein besonderes Anliegen. Wir verarbeiten
                  deine Daten ausschließlich auf Grundlage der gesetzlichen Bestimmungen (DSGVO, TMG).
                </p>
                <p>
                  <strong>1. Erhebung und Verarbeitung personenbezogener Daten:</strong>
                  <br />
                  Wenn du per Formular oder E-Mail Kontakt mit uns aufnimmst, werden deine angegebenen
                  Daten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns
                  gespeichert.
                </p>
                <p>
                  <strong>2. Deine Rechte:</strong>
                  <br />
                  Dir stehen bezüglich deiner bei uns gespeicherten Daten grundsätzlich die Rechte auf
                  Auskunft, Berichtigung, Löschung, Einschränkung und Datenübertragbarkeit zu.
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </footer>
  );
};

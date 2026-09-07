import React, { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Search,
  Package,
  Globe,
  Warehouse,
  RotateCcw,
  Layers,
  Users,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Calendar,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Clock,
  HelpCircle,
} from "lucide-react";
import { SERVICES_DETAILED, ServiceDetail } from "../data/servicesDetailedData";
import { SERVICES } from "../data/procwareData";

interface ServiceSubPageProps {
  onOpenBooking: () => void;
}

export const ServiceSubPage: React.FC<ServiceSubPageProps> = ({ onOpenBooking }) => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const service: ServiceDetail = SERVICES_DETAILED[slug || "sourcing"] || SERVICES_DETAILED["sourcing"];

  useEffect(() => {
    document.title = `${service.title} | Procware E-Commerce Leistungen`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", service.metaDescription);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [service]);

  const getServiceIcon = (iconName: string, sizeClass = "w-6 h-6") => {
    switch (iconName) {
      case "Search":
        return <Search className={`${sizeClass} text-blue-600`} />;
      case "Package":
        return <Package className={`${sizeClass} text-blue-600`} />;
      case "Globe":
        return <Globe className={`${sizeClass} text-blue-600`} />;
      case "Warehouse":
        return <Warehouse className={`${sizeClass} text-blue-600`} />;
      case "RotateCcw":
        return <RotateCcw className={`${sizeClass} text-blue-600`} />;
      case "Layers":
        return <Layers className={`${sizeClass} text-blue-600`} />;
      case "Users":
        return <Users className={`${sizeClass} text-blue-600`} />;
      case "ShieldCheck":
        return <ShieldCheck className={`${sizeClass} text-blue-600`} />;
      default:
        return <Sparkles className={`${sizeClass} text-blue-600`} />;
    }
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Breadcrumb Navigation */}
      <div className="bg-slate-50 border-b border-slate-200 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Link to="/" className="hover:text-slate-900 transition-colors">
              Startseite
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <a href="/#services" className="hover:text-slate-900 transition-colors">
              Leistungen
            </a>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-bold">{service.shortTitle}</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-12 pb-16 sm:pt-16 sm:pb-24 bg-gradient-to-b from-slate-50 via-white to-white overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-10 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center border border-blue-200">
                {getServiceIcon(service.iconName, "w-6 h-6")}
              </div>
              <Badge variant="brand" className="font-bold text-xs py-1 px-3">
                {service.badge}
              </Badge>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight mb-4">
              {service.title}
            </h1>

            <p className="text-lg sm:text-xl font-medium text-slate-700 leading-relaxed mb-6">
              {service.subtitle}
            </p>

            <p className="text-base text-slate-600 leading-relaxed font-normal mb-8 max-w-2xl">
              {service.heroText}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onOpenBooking}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-950 hover:bg-blue-600 text-white font-bold text-sm shadow-md transition-colors cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-blue-400" />
                <span>Kostenloses Beratungsgespräch buchen</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="https://calendly.com/team-procware/new-meeting"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-sm transition-colors"
              >
                <span>Direkttermin wählen</span>
              </a>
            </div>
          </div>

          {/* Key Stats Strip */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {service.keyStats.map((stat, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-blue-200 transition-colors"
              >
                <div className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-xs text-slate-500 font-bold mt-1 uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Highlights & Benefits */}
      <section className="py-16 sm:py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <Badge variant="brand" className="mb-3 font-bold">
              Deine Vorteile
            </Badge>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
              Warum Marken {service.shortTitle} mit Procware umsetzen
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 font-normal">
              Entwickelt von E-Commerce-Praktikern für maximale Skalierbarkeit, Planbarkeit und Margensicherheit.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {service.highlights.map((item, idx) => (
              <div
                key={idx}
                className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                      0{idx + 1}
                    </div>
                    {item.stat && (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                        {item.stat}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-black text-slate-950 mb-2.5 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Step by Step Process */}
      <section className="py-16 sm:py-24 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <Badge variant="brand" className="mb-3 font-bold">
              Ablauf
            </Badge>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
              So läuft die Umsetzung bei Procware ab
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 font-normal">
              Einfach, strukturiert und voll integriert in deinen bestehenden Shopify Workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {service.process.map((step, idx) => (
              <div
                key={idx}
                className="relative p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-slate-950 text-white flex items-center justify-center font-black text-sm mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-base font-black text-slate-950 mb-2 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions for this Service */}
      {service.faqs && service.faqs.length > 0 && (
        <section className="py-16 sm:py-24 bg-slate-50 border-t border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Badge variant="brand" className="mb-3 font-bold">
                FAQ
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                Häufige Fragen zu {service.shortTitle}
              </h2>
            </div>

            <div className="space-y-4">
              {service.faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs"
                >
                  <div className="flex items-start gap-3">
                    <HelpCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-base font-bold text-slate-950 mb-2">
                        {faq.q}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed font-normal">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Switcher: Explore Other Services */}
      <section className="py-14 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h3 className="text-lg font-black text-slate-950 tracking-tight">
                Weitere Procware Leistungen entdecken
              </h3>
              <p className="text-xs text-slate-500 font-normal">
                Kombiniere mehrere Services für maximale Synergien und Skalierung.
              </p>
            </div>
            <a
              href="/#services"
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Alle Leistungen im Überblick <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {SERVICES.filter((s) => s.id !== service.id).map((other) => (
              <Link
                key={other.id}
                to={`/leistungen/${other.id}`}
                className="p-4 rounded-xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200 hover:border-blue-300 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center mb-2.5 group-hover:border-blue-300 transition-colors">
                    {getServiceIcon(other.iconName, "w-4 h-4")}
                  </div>
                  <div className="text-xs font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {other.title.split("&")[0].trim()}
                  </div>
                  <div className="text-[11px] text-slate-500 font-normal line-clamp-1 mt-0.5">
                    {other.description}
                  </div>
                </div>
                <div className="pt-2 text-[10px] font-bold text-slate-400 group-hover:text-blue-600 flex items-center gap-1 mt-2">
                  <span>Mehr erfahren</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 sm:py-20 bg-slate-950 text-white border-t border-slate-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="brand" className="mb-4 font-bold bg-blue-900/60 text-blue-300 border-blue-700">
            Jetzt starten
          </Badge>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight mb-4">
            Bereit, {service.shortTitle} auf das nächste Level zu heben?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto mb-8 font-normal">
            Lass uns in einem kurzen, unverbindlichen Gespräch analysieren, wie Procware deine Marge,
            Lieferzeiten und Kundenbewertungen sofort verbessern kann.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              type="button"
              onClick={onOpenBooking}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition-all cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Jetzt kostenloses Erstgespräch buchen</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

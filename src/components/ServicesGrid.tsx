import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "./ui/badge";
import {
  Search,
  Package,
  Globe,
  Warehouse,
  RotateCcw,
  Layers,
  Users,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { SERVICES } from "../data/procwareData";

export const ServicesGrid: React.FC = () => {
  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case "Search":
        return <Search className="w-6 h-6 text-blue-600" />;
      case "Package":
        return <Package className="w-6 h-6 text-blue-600" />;
      case "Globe":
        return <Globe className="w-6 h-6 text-blue-600" />;
      case "Warehouse":
        return <Warehouse className="w-6 h-6 text-blue-600" />;
      case "RotateCcw":
        return <RotateCcw className="w-6 h-6 text-blue-600" />;
      case "Layers":
        return <Layers className="w-6 h-6 text-blue-600" />;
      case "Users":
        return <Users className="w-6 h-6 text-blue-600" />;
      case "ShieldCheck":
        return <ShieldCheck className="w-6 h-6 text-blue-600" />;
      default:
        return <Search className="w-6 h-6 text-blue-600" />;
    }
  };

  return (
    <section id="services" className="py-20 sm:py-28 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <Badge variant="brand" className="mb-3 font-bold">
            Unsere Leistungen
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
            Unsere Vorteile für deinen E-Commerce-Erfolg
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            Maßgeschneiderte Beschaffungs- und Fulfillment-Lösungen, die dir helfen,
            Warenkosten zu optimieren, Kundenzufriedenheit zu steigern und stabil zu wachsen.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((service) => (
            <Link
              key={service.id}
              to={`/leistungen/${service.id}`}
              className="relative flex flex-col justify-between p-7 rounded-3xl bg-white border border-slate-200 shadow-xs hover:shadow-xl hover:border-slate-400 hover:-translate-y-1 transition-all duration-300 group"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                    {getServiceIcon(service.iconName)}
                  </div>
                  {service.badge && (
                    <Badge variant="brand" className="text-[11px] font-bold">
                      {service.badge}
                    </Badge>
                  )}
                </div>

                <h3 className="text-lg font-black text-slate-950 mb-2 group-hover:text-blue-600 transition-colors leading-snug tracking-tight">
                  {service.title}
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed mb-6 font-normal">
                  {service.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-400 group-hover:text-blue-600 transition-colors uppercase tracking-wider">
                <span>Details lesen</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

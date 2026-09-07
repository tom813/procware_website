import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  Package,
  Search,
  Globe,
  Warehouse,
  RotateCcw,
  Layers,
  Users,
  ShieldCheck,
  Calendar,
  Sparkles,
  ExternalLink,
  Wrench,
  ShoppingBag,
} from "lucide-react";
import { PROCWARE_LOGO, PROCWARE_ICON, SERVICES } from "../data/procwareData";

interface HeaderProps {
  onOpenBooking: () => void;
  onOpenLogin: () => void;
  onOpenRegister?: () => void;
  onNavigateHome?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenBooking,
  onOpenLogin,
  onNavigateHome,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case "Search":
        return <Search className="w-4 h-4 text-blue-600" />;
      case "Package":
        return <Package className="w-4 h-4 text-blue-600" />;
      case "Globe":
        return <Globe className="w-4 h-4 text-blue-600" />;
      case "Warehouse":
        return <Warehouse className="w-4 h-4 text-blue-600" />;
      case "RotateCcw":
        return <RotateCcw className="w-4 h-4 text-blue-600" />;
      case "Layers":
        return <Layers className="w-4 h-4 text-blue-600" />;
      case "Users":
        return <Users className="w-4 h-4 text-blue-600" />;
      case "ShieldCheck":
        return <ShieldCheck className="w-4 h-4 text-blue-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-blue-600" />;
    }
  };

  const navigate = useNavigate();
  const location = useLocation();

  const handleHomeClick = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (location.pathname !== "/") {
      navigate("/");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (onNavigateHome) {
      onNavigateHome();
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all duration-200 shadow-xs">
      {/* Top Notification Bar */}
      <div className="bg-slate-950 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between font-medium">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="font-bold text-white tracking-tight">Procware Sourcing & Fulfillment:</span>
            <span className="hidden sm:inline text-slate-300">
              0 € bis zur 1. Order • Maßgeschneiderte Konditionen & deutsches Team
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="mailto:team@procware.io"
              className="hover:text-white font-medium transition-colors hidden md:inline"
            >
              team@procware.io
            </a>
            <a
              href="https://calendly.com/team-procware/new-meeting"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Termin buchen</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" onClick={handleHomeClick} className="flex items-center gap-3 group">
            <img
              src={PROCWARE_LOGO}
              alt="Procware"
              className="h-6 sm:h-7 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation - Streamlined to essential sections */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {/* Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setServicesDropdownOpen(true)}
              onMouseLeave={() => setServicesDropdownOpen(false)}
            >
              <button
                className="flex items-center gap-1 px-3.5 py-2 text-sm font-bold text-slate-700 hover:text-slate-950 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
              >
                <span>Leistungen</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    servicesDropdownOpen ? "rotate-180 text-blue-600" : "text-slate-400"
                  }`}
                />
              </button>

              {/* Mega Menu Dropdown */}
              {servicesDropdownOpen && (
                <div className="absolute left-0 top-full pt-2 w-[540px] z-50">
                  <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-2xl grid grid-cols-2 gap-3">
                    {SERVICES.map((srv) => (
                      <Link
                        key={srv.id}
                        to={`/leistungen/${srv.id}`}
                        onClick={() => {
                          setServicesDropdownOpen(false);
                        }}
                        className="flex items-start gap-3 p-2.5 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all group"
                      >
                        <div className="p-2 rounded-xl bg-blue-50 group-hover:bg-blue-100 transition-colors shrink-0 mt-0.5">
                          {getServiceIcon(srv.iconName)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                              {srv.title.split("&")[0].trim()}
                            </span>
                            {srv.badge && (
                              <Badge variant="brand" className="text-[10px] px-1.5 py-0 font-bold">
                                {srv.badge}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5 font-normal">
                            {srv.description}
                          </p>
                        </div>
                      </Link>
                    ))}
                    <div className="col-span-2 pt-3 mt-1 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 px-1 font-medium">
                      <span>Full-Service Sourcing & Fulfillment aus einer Hand</span>
                      <a
                        href="#services"
                        onClick={() => {
                          setServicesDropdownOpen(false);
                          if (onNavigateHome) onNavigateHome();
                        }}
                        className="font-extrabold text-blue-600 hover:underline flex items-center gap-1"
                      >
                        Alle Leistungen <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/tools"
              className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-bold text-slate-700 hover:text-slate-950 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Wrench className="w-3.5 h-3.5 text-blue-600" />
              <span>Tools</span>
              <span className="px-1.5 py-0.5 rounded-full bg-blue-100 text-[10px] font-black text-blue-700 uppercase tracking-wider">
                Gratis
              </span>
            </Link>

            <Link
              to="/wissen"
              className="px-3.5 py-2 text-sm font-bold text-slate-700 hover:text-slate-950 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Wissen
            </Link>

            <a
              href="https://apps.shopify.com/ltp-ludwig-trading-plattform"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-bold text-slate-700 hover:text-slate-950 rounded-lg hover:bg-slate-100 transition-colors group"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />
              <span>Shopify App</span>
              <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-slate-700 transition-colors" />
            </a>

            <a
              href="/#faq"
              onClick={() => onNavigateHome && onNavigateHome()}
              className="px-3.5 py-2 text-sm font-bold text-slate-700 hover:text-slate-950 rounded-lg hover:bg-slate-100 transition-colors"
            >
              FAQ
            </a>
          </nav>

          {/* Action CTAs - Main CTA is Termin buchen (Calendly) */}
          <div className="hidden lg:flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onOpenLogin}
              className="font-bold text-slate-800 hover:text-slate-950"
            >
              Login
            </Button>
            <a
              href="https://calendly.com/team-procware/new-meeting"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-blue-600 text-white font-bold text-sm shadow-sm transition-all duration-200 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-blue-400" />
              <span>Termin buchen</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <a
              href="https://calendly.com/team-procware/new-meeting"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
            >
              <span>Termin buchen</span>
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400"
              aria-label="Menü öffnen"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-4 pb-6 shadow-xl animate-in slide-in-from-top-4 duration-200">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <Link
              to="/"
              onClick={(e) => {
                handleHomeClick(e);
                setMobileMenuOpen(false);
              }}
              className="cursor-pointer"
            >
              <img
                src={PROCWARE_LOGO}
                alt="Procware"
                className="h-6 w-auto object-contain"
              />
            </Link>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Menü
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <a
              href="#services"
              onClick={() => {
                setMobileMenuOpen(false);
                if (onNavigateHome) onNavigateHome();
              }}
              className="px-3 py-2.5 rounded-lg text-base font-semibold text-slate-900 hover:bg-slate-100"
            >
              Leistungen & Sourcing
            </a>
            <Link
              to="/tools"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg text-base font-semibold text-slate-900 hover:bg-slate-100 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-blue-600" />
                <span>Kostenlose Tools</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-[10px] font-black text-blue-700 uppercase">
                Gratis
              </span>
            </Link>
            <Link
              to="/wissen"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg text-base font-semibold text-slate-900 hover:bg-slate-100"
            >
              Procware Wissen & Guides
            </Link>
            <a
              href="https://apps.shopify.com/ltp-ludwig-trading-plattform"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg text-base font-semibold text-slate-900 hover:bg-slate-100 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-emerald-600" />
                <span>Offizielle Shopify App</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
            <a
              href="/#faq"
              onClick={() => {
                setMobileMenuOpen(false);
                if (onNavigateHome) onNavigateHome();
              }}
              className="px-3 py-2.5 rounded-lg text-base font-semibold text-slate-900 hover:bg-slate-100"
            >
              FAQ
            </a>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col gap-3">
            <a
              href="https://calendly.com/team-procware/new-meeting"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-md shadow-blue-600/20"
            >
              <Calendar className="w-4 h-4" />
              <span>Kostenloses Erstgespräch buchen</span>
            </a>
            <Button
              variant="outline"
              className="w-full justify-center font-bold"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLogin();
              }}
            >
              Procware Login
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

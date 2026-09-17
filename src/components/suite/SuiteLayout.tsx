import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  TrendingUp,
  Tag,
  BarChart3,
  Barcode,
  ShoppingBag,
  Cpu,
  Calculator,
  Percent,
  Scale,
  Wallet,
  ShieldCheck,
  LogOut,
  User as UserIcon,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Menu,
  X,
  Lock,
  ArrowRight,
  Store,
  Layers,
  Flame,
  Globe,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { PROCWARE_LOGO, PROCWARE_ICON } from "../../data/procwareData";

interface SuiteLayoutProps {
  children: React.ReactNode;
  activeModule: string;
}

export const SuiteLayout: React.FC<SuiteLayoutProps> = ({ children, activeModule }) => {
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // The 3 Top Intelligence Suite Tools
  const intelligenceTools = [
    {
      id: "sales-tracker",
      title: "Shopify Sales Tracker",
      subtitle: "Umsatz- & Bestandschätzer",
      path: "/suite/sales-tracker",
      icon: <BarChart3 className="w-4 h-4 text-blue-600" />,
    },
    {
      id: "trending-products",
      title: "Trending Products",
      subtitle: "Wachstumsraten vor Sättigung",
      path: "/suite/trending-products",
      icon: <Flame className="w-4 h-4 text-amber-500" />,
    },
    {
      id: "price-tracker",
      title: "Competitor Price Tracker",
      subtitle: "Preis-Diffs & Alerts",
      path: "/suite/price-tracker",
      icon: <Tag className="w-4 h-4 text-emerald-600" />,
    },
  ];

  // The 10 Free Tools (Integrated seamlessly within the Suite)
  const freeTools = [
    {
      id: "barcode",
      title: "Barcode & GTIN Generator",
      path: "/suite/barcode-generator",
      icon: <Barcode className="w-4 h-4 text-slate-500" />,
    },
    {
      id: "theme-detector",
      title: "Shopify Theme Detector",
      path: "/suite/shopify-theme-detector",
      icon: <ShoppingBag className="w-4 h-4 text-slate-500" />,
    },
    {
      id: "app-detector",
      title: "Shopify App Detector",
      path: "/suite/shopify-app-detector",
      icon: <Cpu className="w-4 h-4 text-slate-500" />,
    },
    {
      id: "clv",
      title: "Customer Lifetime Value (CLV)",
      path: "/suite/customer-lifetime-value-calculator",
      icon: <TrendingUp className="w-4 h-4 text-slate-500" />,
    },
    {
      id: "fee-calculator",
      title: "Shopify Fee Calculator 2026",
      path: "/suite/shopify-fee-calculator",
      icon: <ShoppingBag className="w-4 h-4 text-slate-500" />,
    },
    {
      id: "roas",
      title: "ROAS & Ad Spend Rechner",
      path: "/suite/roas-calculator",
      icon: <Percent className="w-4 h-4 text-slate-500" />,
    },
    {
      id: "be-roas",
      title: "Break-Even ROAS Rechner",
      path: "/suite/break-even-roas-calculator",
      icon: <Scale className="w-4 h-4 text-slate-500" />,
    },
    {
      id: "margin",
      title: "Shopify Margenrechner",
      path: "/suite/shopify-margin-calculator",
      icon: <Calculator className="w-4 h-4 text-slate-500" />,
    },
    {
      id: "liquidity",
      title: "Liquiditätsplanung Online Shop",
      path: "/suite/cash-flow-planner-online-shop",
      icon: <Wallet className="w-4 h-4 text-slate-500" />,
    },
    {
      id: "safety-stock",
      title: "Safety Stock & Meldebestand",
      path: "/suite/safety-stock-calculator",
      icon: <ShieldCheck className="w-4 h-4 text-slate-500" />,
    },
  ];

  const isRestrictedModule = ["sales-tracker", "trending-products", "price-tracker"].includes(activeModule);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 lg:translate-x-0 lg:static shrink-0 ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={PROCWARE_LOGO} alt="Procware" className="h-6 w-auto" />
            <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-wider border border-blue-200">
              Suite
            </span>
          </Link>
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 lg:hidden cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Status Card in Sidebar */}
        <div className="px-4 pt-4 pb-2">
          {isAuthenticated ? (
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  {user?.name?.charAt(0).toUpperCase() || "H"}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {user?.name || "E-Com Händler"}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">{user?.email}</div>
                </div>
              </div>
              <button
                onClick={logout}
                title="Abmelden"
                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div className="min-w-0 pr-2">
                <div className="text-xs font-bold text-slate-900">Gast-Zugang</div>
                <div className="text-[10px] text-slate-500">Kostenloser Account</div>
              </div>
              <button
                onClick={() => openAuthModal("login", location.pathname)}
                className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Einloggen
              </button>
            </div>
          )}
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-5">
          {/* Section 1: Top 3 Intelligence Tools */}
          <div>
            <div className="space-y-1">
              {intelligenceTools.map((tool) => {
                const isActive = activeModule === tool.id;
                return (
                  <Link
                    key={tool.id}
                    to={tool.path}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={`flex items-center justify-between p-2.5 rounded-2xl text-xs font-bold transition-all ${
                      isActive
                        ? "bg-slate-950 text-white shadow-xs"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`p-1.5 rounded-xl ${
                          isActive ? "bg-white/10" : "bg-slate-100"
                        }`}
                      >
                        {tool.icon}
                      </div>
                      <div className="truncate">
                        <div className="truncate">{tool.title}</div>
                        <div
                          className={`text-[10px] font-normal truncate ${
                            isActive ? "text-slate-300" : "text-slate-500"
                          }`}
                        >
                          {tool.subtitle}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Section 2: The 10 Free Tools */}
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 px-2 mb-2">
              Kostenlose Tools
            </div>
            <div className="space-y-0.5">
              {freeTools.map((tool) => {
                const isActive = activeModule === tool.id;
                return (
                  <Link
                    key={tool.id}
                    to={tool.path}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={`flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold transition-colors group ${
                      isActive
                        ? "bg-blue-50 text-blue-700 font-bold border border-blue-200"
                        : "text-slate-600 hover:text-slate-950 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {tool.icon}
                      <span className="truncate">{tool.title}</span>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 transition-colors ${
                      isActive ? "text-blue-600" : "text-slate-300 group-hover:text-slate-600"
                    }`} />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-100 text-xs bg-slate-50/50 space-y-2">
          <a
            href="https://app.procware.de"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between text-blue-700 hover:text-blue-900 font-bold"
          >
            <div className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              <span>Procware (app.procware.de)</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <Link
            to="/tools"
            className="flex items-center justify-between text-slate-600 hover:text-blue-600 font-bold"
          >
            <span>Öffentliche Tool-Übersicht</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar for mobile header toggle & status */}
        <div className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between lg:justify-end">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 lg:hidden flex items-center gap-2 text-xs font-bold cursor-pointer"
          >
            <Menu className="w-4 h-4" />
            <span>Suite Navigation</span>
          </button>

          <div className="flex items-center gap-3">
            <a
              href="https://calendly.com/team-procware/new-meeting"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors"
            >
              <span>Sourcing anfragen</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Active Module Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {isRestrictedModule && !isAuthenticated ? (
            <div className="max-w-md mx-auto my-12 bg-white rounded-3xl border border-slate-200 shadow-xl p-8 text-center">
              <div className="w-16 h-16 rounded-3xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-blue-600" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Procware Ecom Suite</span>
              </div>
              <h2 className="text-2xl font-black text-slate-950 tracking-tight">
                Kostenloser Account erforderlich
              </h2>
              <p className="text-sm text-slate-600 mt-2 font-normal leading-relaxed">
                Dieses Tool erfordert einen kostenlosen Account zur Speicherung deiner persönlichen Watchlist und Zeitreihen-Snapshots.
              </p>

              <div className="space-y-2.5 mt-6">
                <button
                  onClick={() => openAuthModal("register", location.pathname)}
                  className="w-full py-3 px-5 rounded-2xl bg-slate-950 hover:bg-blue-600 text-white font-bold text-sm shadow-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Kostenlos registrieren</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => openAuthModal("login", location.pathname)}
                  className="w-full py-2.5 px-4 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-sm transition-colors cursor-pointer"
                >
                  Bereits registriert? Einloggen
                </button>
              </div>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
};

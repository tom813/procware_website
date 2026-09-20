import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import {
  Calendar,
  Clock,
  CheckCircle2,
  Lock,
  Mail,
  Store,
  User as UserIcon,
  ExternalLink,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Tag,
  BarChart3,
  ShieldCheck,
  AlertCircle,
  Flame,
} from "lucide-react";
import { PROCWARE_ICON } from "../data/procwareData";
import { useAuth } from "../context/AuthContext";

interface ModalsProps {
  isBookingOpen: boolean;
  onCloseBooking: () => void;
  isLoginOpen: boolean;
  onCloseLogin: () => void;
  isRegisterOpen: boolean;
  onCloseRegister: () => void;
  initialMode?: "login" | "register";
}

export const Modals: React.FC<ModalsProps> = ({
  isBookingOpen,
  onCloseBooking,
  isLoginOpen,
  onCloseLogin,
  isRegisterOpen,
  onCloseRegister,
  initialMode = "register",
}) => {
  const navigate = useNavigate();
  const { login, register, redirectUrl } = useAuth();

  // Booking Form State
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [bookingName, setBookingName] = useState("");
  const [bookingEmail, setBookingEmail] = useState("");
  const [bookingShopUrl, setBookingShopUrl] = useState("");
  const [bookingVolume, setBookingVolume] = useState("500-2.000 Orders / Monat");

  // Auth Mode State
  const [activeAuthTab, setActiveAuthTab] = useState<"login" | "register">(initialMode);
  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authShopUrl, setAuthShopUrl] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    if (isRegisterOpen) setActiveAuthTab("register");
    else if (isLoginOpen) setActiveAuthTab("login");
  }, [isRegisterOpen, isLoginOpen]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSubmitted(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: bookingName,
          email: bookingEmail,
          shopUrl: bookingShopUrl,
          source: `Erstgespräch Buchung (${bookingVolume})`,
        }),
      });
    } catch (err) {
      console.warn("Lead save error:", err);
    }
  };

  const getDestinationPath = () => {
    if (redirectUrl && redirectUrl !== "/") {
      return redirectUrl;
    }
    const cur = location.pathname;
    if (cur && cur.startsWith("/suite")) {
      return cur;
    }
    if (cur && cur !== "/" && cur !== "/login") {
      return cur;
    }
    return "/suite";
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);

    try {
      if (activeAuthTab === "register") {
        const res = await register(authName, authEmail, authPassword, authShopUrl);
        if (!res.success) {
          setAuthError(res.error || "Registrierung fehlgeschlagen.");
          setAuthLoading(false);
          return;
        }
      } else {
        const res = await login(authEmail, authPassword);
        if (!res.success) {
          setAuthError(res.error || "Anmeldung fehlgeschlagen.");
          setAuthLoading(false);
          return;
        }
      }

      const targetPath = getDestinationPath();
      onCloseLogin();
      onCloseRegister();
      navigate(targetPath);
    } catch (err: any) {
      setAuthError(err.message || "Ein Fehler ist aufgetreten.");
    } finally {
      setAuthLoading(false);
    }
  };

  const isAuthOpen = isLoginOpen || isRegisterOpen;
  const handleCloseAuth = () => {
    onCloseLogin();
    onCloseRegister();
    setAuthError("");
  };

  return (
    <>
      {/* 1. Meeting Booking Dialog */}
      <Dialog open={isBookingOpen} onOpenChange={(open) => !open && onCloseBooking()}>
        <DialogContent className="max-w-lg rounded-3xl border-slate-200">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-2.5 rounded-2xl bg-blue-50 text-blue-600">
                <Calendar className="w-5 h-5" />
              </span>
              <DialogTitle className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                Kostenloses Erstgespräch buchen
              </DialogTitle>
            </div>
            <DialogDescription className="text-slate-600 font-normal">
              Besprich deine aktuellen Produkte, Lieferzeiten und Sourcing-Potenziale direkt mit unserem
              deutschen Partner-Team.
            </DialogDescription>
          </DialogHeader>

          {bookingSubmitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-black text-slate-950 tracking-tight">
                Vielen Dank, {bookingName || "E-Commerce Kollege"}!
              </h4>
              <p className="text-sm text-slate-600 max-w-sm mx-auto font-normal">
                Wir haben deine Anfrage erhalten. Wir prüfen deine Daten und melden uns innerhalb von 24 Stunden per Mail (<strong>{bookingEmail}</strong>).
              </p>
              <div className="pt-2">
                <Button variant="brand" className="font-bold" onClick={onCloseBooking}>
                  Fenster schließen
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleBookingSubmit} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                  Vollständiger Name *
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Max Mustermann"
                    value={bookingName}
                    onChange={(e) => setBookingName(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-2xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                  Geschäftliche E-Mail *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="max@meinshop.de"
                    value={bookingEmail}
                    onChange={(e) => setBookingEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-2xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                  Shop-URL oder Domain (Optional)
                </label>
                <div className="relative">
                  <Store className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="meinshop.de"
                    value={bookingShopUrl}
                    onChange={(e) => setBookingShopUrl(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-2xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                  Aktuelles Bestellvolumen
                </label>
                <select
                  value={bookingVolume}
                  onChange={(e) => setBookingVolume(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white font-medium"
                >
                  <option>Vor dem Start / Neuaufbau</option>
                  <option>100 - 500 Orders / Monat</option>
                  <option>500 - 2.000 Orders / Monat</option>
                  <option>2.000 - 10.000 Orders / Monat</option>
                  <option>10.000+ Orders / Monat (Enterprise)</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <Button type="button" variant="outline" className="font-bold" onClick={onCloseBooking}>
                  Abbrechen
                </Button>
                <Button type="submit" variant="brand" className="font-bold">
                  Terminanfrage absenden
                </Button>
              </div>

              <div className="text-center pt-2">
                <a
                  href="https://calendly.com/team-procware/new-meeting"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-500 hover:text-blue-600 inline-flex items-center gap-1 font-bold"
                >
                  <span>Oder direkt über unseren Calendly Kalender buchen</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* 2. Unified Ecom Suite Auth Modal (Login / Register / Google OAuth) */}
      <Dialog open={isAuthOpen} onOpenChange={(open) => !open && handleCloseAuth()}>
        <DialogContent className="max-w-md rounded-3xl border-slate-200 p-6 sm:p-7">
          {/* Header */}
          <div className="text-center">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6 text-blue-600" />
            </div>
            <DialogTitle className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
              Procware Ecom Suite
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 mt-1 font-medium">
              E-Commerce Intelligence Suite: Sales-Tracker, Trend-Finder & Preis-Checker
            </DialogDescription>
          </div>

          {/* Feature Highlight Pill */}
          <div className="mt-3 p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-700">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>3 Pro Tools & 10 Free Tools</span>
            </div>
            <span className="text-[11px] font-bold text-blue-600">100% Kostenlos</span>
          </div>

          {(
            <>
              {/* Tab Switcher: Register vs Login */}
              <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl mt-4 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => {
                    setActiveAuthTab("register");
                    setAuthError("");
                  }}
                  className={`py-2 rounded-lg transition-all ${
                    activeAuthTab === "register"
                      ? "bg-white text-slate-950 shadow-xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Kostenlos registrieren
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveAuthTab("login");
                    setAuthError("");
                  }}
                  className={`py-2 rounded-lg transition-all ${
                    activeAuthTab === "login"
                      ? "bg-white text-slate-950 shadow-xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Bereits Mitglied? Login
                </button>
              </div>

              {/* Error Message */}
              {authError && (
                <div className="mt-3 p-3 bg-red-50 text-red-700 rounded-xl text-xs flex items-center gap-2 border border-red-200">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              {/* Email / Password Form */}
              <form onSubmit={handleAuthSubmit} className="space-y-3">
                {activeAuthTab === "register" && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                      Vollständiger Name *
                    </label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder="Max Mustermann"
                        value={authName}
                        onChange={(e) => setAuthName(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 rounded-2xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none font-medium"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                    E-Mail Adresse *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="name@deinshop.de"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 rounded-2xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                    Passwort *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      minLength={12}
                      placeholder="Mindestens 12 Zeichen"
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 rounded-2xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none font-medium"
                    />
                  </div>
                  {activeAuthTab === "register" && (
                    <p className="mt-1 text-[11px] text-slate-500">Mindestens 12 Zeichen.</p>
                  )}
                </div>

                {activeAuthTab === "register" && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                      Shopify Store Domain / URL (Optional)
                    </label>
                    <div className="relative">
                      <Store className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="mein-shop.myshopify.com"
                        value={authShopUrl}
                        onChange={(e) => setAuthShopUrl(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 rounded-2xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none font-medium"
                      />
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  variant="brand"
                  disabled={authLoading}
                  className="w-full font-bold py-2.5 mt-2 cursor-pointer"
                >
                  {authLoading ? (
                    "Bitte warten..."
                  ) : activeAuthTab === "register" ? (
                    <span className="flex items-center justify-center gap-1.5">
                      <span>Kostenlos Zugang freischalten</span>
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  ) : (
                    "In die Ecom Suite einloggen"
                  )}
                </Button>

                <div className="text-center pt-2 text-[11px] text-slate-500 font-medium">
                  🔒 DSGVO-konform • Sofortiger Zugriff auf alle 3 Intelligence Module
                </div>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

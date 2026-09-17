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
  Key,
  Settings,
  ArrowLeft,
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
  const { login, register, loginWithGoogle, redirectUrl, googleClientId, saveGoogleClientId } = useAuth();

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

  // Google OAuth Config / Bypass State
  const [showGoogleConfig, setShowGoogleConfig] = useState(false);
  const [customClientId, setCustomClientId] = useState("");
  const [manualGoogleEmail, setManualGoogleEmail] = useState("");
  const [manualGoogleName, setManualGoogleName] = useState("");

  useEffect(() => {
    if (googleClientId) {
      setCustomClientId(googleClientId);
    }
  }, [googleClientId]);

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

  const handleGoogleSignIn = async () => {
    setAuthError("");
    setAuthLoading(true);
    try {
      const res = await loginWithGoogle();
      setAuthLoading(false);
      if (res.success) {
        const targetPath = getDestinationPath();
        onCloseLogin();
        onCloseRegister();
        navigate(targetPath);
      } else if (res.requiresClientId) {
        setShowGoogleConfig(true);
        setAuthError("");
      } else if (res.error) {
        setAuthError(res.error);
      }
    } catch (err: any) {
      setAuthError(err.message || "Google-Authentifizierung fehlgeschlagen.");
      setAuthLoading(false);
    }
  };

  const handleSaveAndLoginGoogle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customClientId.trim()) {
      setAuthError("Bitte gib eine gültige Google Client-ID ein.");
      return;
    }
    setAuthError("");
    setAuthLoading(true);
    saveGoogleClientId(customClientId.trim());
    try {
      const res = await loginWithGoogle({ clientIdOverride: customClientId.trim() });
      setAuthLoading(false);
      if (res.success) {
        setShowGoogleConfig(false);
        const targetPath = getDestinationPath();
        onCloseLogin();
        onCloseRegister();
        navigate(targetPath);
      } else if (res.error) {
        setAuthError(res.error);
      }
    } catch (err: any) {
      setAuthError(err.message || "Google-Authentifizierung fehlgeschlagen.");
      setAuthLoading(false);
    }
  };

  const handleManualGoogleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualGoogleEmail.trim() || !manualGoogleEmail.includes("@")) {
      setAuthError("Bitte gib deine Google E-Mail-Adresse ein.");
      return;
    }
    setAuthError("");
    setAuthLoading(true);
    try {
      const res = await loginWithGoogle({
        manualEmail: manualGoogleEmail.trim(),
        manualName: manualGoogleName.trim() || undefined,
      });
      setAuthLoading(false);
      if (res.success) {
        setShowGoogleConfig(false);
        const targetPath = getDestinationPath();
        onCloseLogin();
        onCloseRegister();
        navigate(targetPath);
      } else if (res.error) {
        setAuthError(res.error);
      }
    } catch (err: any) {
      setAuthError(err.message || "Anmeldung fehlgeschlagen.");
      setAuthLoading(false);
    }
  };

  const isAuthOpen = isLoginOpen || isRegisterOpen;
  const handleCloseAuth = () => {
    onCloseLogin();
    onCloseRegister();
    setAuthError("");
    setShowGoogleConfig(false);
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

          {showGoogleConfig ? (
            /* Google OAuth Configuration & Direct Account Sign-In */
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowGoogleConfig(false);
                    setAuthError("");
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Zurück zum Login</span>
                </button>
                <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                  Google OAuth 2.0
                </span>
              </div>

              <div>
                <h4 className="text-base font-black text-slate-950 tracking-tight">
                  Google 1-Klick Login einrichten
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Damit der Browser das offizielle Google-Popup für dein echtes Google-Konto öffnen kann, trage deine Google Cloud OAuth Client-ID ein.
                </p>
              </div>

              {authError && (
                <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs flex items-center gap-2 border border-red-200">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              {/* Option 1: Official Client ID */}
              <form onSubmit={handleSaveAndLoginGoogle} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <div className="flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-blue-600" />
                    <span>Option 1: Google Client-ID (Echter OAuth Login)</span>
                  </div>
                </div>
                <input
                  type="text"
                  placeholder="z.B. 123456789-xyz.apps.googleusercontent.com"
                  value={customClientId}
                  onChange={(e) => setCustomClientId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white font-mono"
                />
                <Button
                  type="submit"
                  variant="brand"
                  disabled={authLoading}
                  className="w-full text-xs font-bold py-2 cursor-pointer"
                >
                  {authLoading ? "Verbinde..." : "Client-ID speichern & mit Google anmelden"}
                </Button>

                <div className="text-[11px] text-slate-500 space-y-1 pt-1">
                  <p className="font-semibold text-slate-700">So erstellst du die Client-ID in der Google Cloud Console:</p>
                  <ol className="list-decimal pl-4 space-y-0.5 text-slate-600">
                    <li>
                      Öffne{" "}
                      <a
                        href="https://console.cloud.google.com/apis/credentials"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 font-bold hover:underline inline-flex items-center gap-0.5"
                      >
                        Google Cloud Console &gt; Anmeldedaten <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </li>
                    <li>Klicke auf <strong>Anmeldedaten erstellen &gt; OAuth-Client-ID</strong> (Typ: Webanwendung).</li>
                    <li>
                      Autorisierter JavaScript-Ursprung:{" "}
                      <code className="bg-slate-200 px-1 py-0.5 rounded text-[10px] select-all font-mono">
                        {typeof window !== "undefined" ? window.location.origin : ""}
                      </code>
                    </li>
                    <li>Client-ID kopieren und hier eintragen (wird im Browser gespeichert).</li>
                  </ol>
                </div>
              </form>

              {/* Option 2: Direct Custom Account Test */}
              <form onSubmit={handleManualGoogleLogin} className="p-3.5 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-2.5">
                <div className="text-xs font-bold text-emerald-950 flex items-center justify-between">
                  <span>Option 2: Schnelltest mit eigener E-Mail</span>
                  <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-100 px-1.5 py-0.5 rounded">
                    Ohne Setup
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-normal">
                  Melde dich sofort mit deiner eigenen Wunsch-Adresse an (kein vorgegebener Dummy-Account mehr):
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Deine Google E-Mail"
                    value={manualGoogleEmail}
                    onChange={(e) => setManualGoogleEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-emerald-200 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Dein Name (optional)"
                    value={manualGoogleName}
                    onChange={(e) => setManualGoogleName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-emerald-200 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white"
                  />
                </div>
                <Button
                  type="submit"
                  variant="outline"
                  disabled={authLoading}
                  className="w-full text-xs font-bold py-2 border-emerald-300 text-emerald-800 hover:bg-emerald-100 cursor-pointer"
                >
                  Als dieser Google-Account anmelden
                </Button>
              </form>
            </div>
          ) : (
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

              {/* Google OAuth Button */}
              <div className="mt-4">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={authLoading}
                  className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 font-bold text-xs text-slate-800 transition-colors shadow-xs cursor-pointer disabled:opacity-75 disabled:cursor-wait"
                >
                  {authLoading ? (
                    <div className="w-4 h-4 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin" />
                  ) : (
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                  )}
                  <span>
                    {authLoading
                      ? "Google Anmeldung läuft..."
                      : activeAuthTab === "register"
                      ? "Mit Google registrieren (1-Klick)"
                      : "Mit Google anmelden"}
                  </span>
                </button>

                <div className="flex items-center justify-center mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowGoogleConfig(true);
                      setAuthError("");
                    }}
                    className="text-[11px] text-slate-400 hover:text-blue-600 font-medium inline-flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Settings className="w-3 h-3" />
                    <span>Google Client-ID einrichten / verwalten</span>
                  </button>
                </div>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase">
                    <span className="bg-white px-2 text-slate-400 font-bold">Oder mit E-Mail</span>
                  </div>
                </div>
              </div>

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
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Passwort *
                    </label>
                    {activeAuthTab === "login" && (
                      <span className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer">
                        Passwort vergessen?
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 rounded-2xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none font-medium"
                    />
                  </div>
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

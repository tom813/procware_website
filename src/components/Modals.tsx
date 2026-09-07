import React, { useState } from "react";
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
  User,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { PROCWARE_ICON } from "../data/procwareData";

interface ModalsProps {
  isBookingOpen: boolean;
  onCloseBooking: () => void;
  isLoginOpen: boolean;
  onCloseLogin: () => void;
  isRegisterOpen: boolean;
  onCloseRegister: () => void;
}

export const Modals: React.FC<ModalsProps> = ({
  isBookingOpen,
  onCloseBooking,
  isLoginOpen,
  onCloseLogin,
  isRegisterOpen,
  onCloseRegister,
}) => {
  // Booking Form State
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [bookingName, setBookingName] = useState("");
  const [bookingEmail, setBookingEmail] = useState("");
  const [bookingShopUrl, setBookingShopUrl] = useState("");
  const [bookingVolume, setBookingVolume] = useState("500-2.000 Orders / Monat");

  // Login Form State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Register Form State
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regShopUrl, setRegShopUrl] = useState("");
  const [regSuccess, setRegSuccess] = useState(false);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSubmitted(true);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginSuccess(true);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegSuccess(true);
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
                Wir haben deine Terminanfrage erhalten. Unser Team meldet sich umgehend unter{" "}
                <strong>{bookingEmail}</strong> mit passenden Kalender-Vorschlägen.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  variant="outline"
                  className="font-bold"
                  onClick={() => {
                    setBookingSubmitted(false);
                    onCloseBooking();
                  }}
                >
                  Fenster schließen
                </Button>
                <a
                  href="https://calendly.com/team-procware/new-meeting"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold shadow-sm"
                >
                  <span>Direkt zu Calendly</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleBookingSubmit} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                  Dein Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
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
                  E-Mail Adresse *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="name@deinshop.de"
                    value={bookingEmail}
                    onChange={(e) => setBookingEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-2xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                  Shop-URL (optional)
                </label>
                <div className="relative">
                  <Store className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="https://mein-shop.de"
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

      {/* 2. Login Dialog */}
      <Dialog open={isLoginOpen} onOpenChange={(open) => !open && onCloseLogin()}>
        <DialogContent className="max-w-md rounded-3xl border-slate-200">
          <div className="text-center pb-2">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
              <img src={PROCWARE_ICON} alt="Procware Logo" className="w-8 h-8 object-contain" />
            </div>
            <DialogTitle className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
              Procware Login
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 mt-1 font-medium">
              Melde dich in deinem Händler-Dashboard an
            </DialogDescription>
          </div>

          {loginSuccess ? (
            <div className="py-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-900">
                Willkommen zurück! Weiterleitung zur Procware Plattform...
              </p>
              <a
                href="https://app.procware.de/login"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline uppercase tracking-wider"
              >
                <span>Zum Live-System app.procware.de</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ) : (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                  E-Mail Adresse
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="name@deinshop.de"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-2xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none font-medium"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Passwort
                  </label>
                  <a href="#" className="text-[11px] font-bold text-blue-600 hover:underline">
                    Passwort vergessen?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-2xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none font-medium"
                  />
                </div>
              </div>

              <Button type="submit" variant="brand" className="w-full font-bold">
                Anmelden
              </Button>

              <div className="pt-2 text-center text-xs text-slate-500 font-medium">
                Noch kein Konto?{" "}
                <a
                  href="https://calendly.com/team-procware/new-meeting"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-blue-600 hover:underline cursor-pointer"
                >
                  Jetzt Beratungstermin buchen
                </a>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* 3. Register Dialog (Fallback) */}
      <Dialog open={isRegisterOpen} onOpenChange={(open) => !open && onCloseRegister()}>
        <DialogContent className="max-w-md rounded-3xl border-slate-200">
          <div className="text-center pb-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6 text-blue-600" />
            </div>
            <DialogTitle className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
              Procware Startgespräch
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 mt-1 font-medium">
              Lerne unsere Plattform kennen – 0 € Fixkosten bis zur ersten Bestellung.
            </DialogDescription>
          </div>

          {regSuccess ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-950 tracking-tight">
                Anfrage erfolgreich erhalten!
              </h4>
              <p className="text-xs text-slate-600 font-medium">
                Wir haben deine Anfrage registriert und senden dir alle weiteren Informationen an <strong>{regEmail}</strong>.
              </p>
              <a
                href="https://calendly.com/team-procware/new-meeting"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-slate-950 text-white font-bold text-sm"
              >
                <span>Direkt Termin im Kalender wählen</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                  Vollständiger Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Max Mustermann"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                  Geschäftliche E-Mail *
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@deinshop.de"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                  Shopify Store Domain / Name
                </label>
                <input
                  type="text"
                  placeholder="mein-shop.myshopify.com"
                  value={regShopUrl}
                  onChange={(e) => setRegShopUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none font-medium"
                />
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-[11px] text-slate-600 font-medium space-y-0.5">
                <div>✓ Keine Einrichtungsgebühr</div>
                <div>✓ Transparente B2B Konditionen</div>
                <div>✓ Inklusive Shopify App Direktanbindung</div>
              </div>

              <Button type="submit" variant="brand" className="w-full font-bold">
                Anfrage senden
              </Button>

              <div className="pt-2 text-center text-xs text-slate-500 font-medium">
                Oder direkt einen Termin buchen?{" "}
                <a
                  href="https://calendly.com/team-procware/new-meeting"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-blue-600 hover:underline cursor-pointer"
                >
                  Hier Calendly öffnen
                </a>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

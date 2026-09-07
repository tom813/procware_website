import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { ValueBanner } from "./components/ValueBanner";
import { FeaturesShowcase } from "./components/FeaturesShowcase";
import { TestimonialsSection } from "./components/TestimonialsSection";
import { TrustpilotReviewsSection } from "./components/TrustpilotReviewsSection";
import { HowItWorks } from "./components/HowItWorks";
import { GlobalShipping } from "./components/GlobalShipping";
import { ServicesGrid } from "./components/ServicesGrid";
import { ShopifyAppSection } from "./components/ShopifyAppSection";
import { CaseStudiesSection } from "./components/CaseStudiesSection";
import { FeaturedToolsSection } from "./components/FeaturedToolsSection";
import { ServiceSubPage } from "./components/ServiceSubPage";
import { WissenSection } from "./components/WissenSection";
import { FaqSection } from "./components/FaqSection";
import { Footer } from "./components/Footer";
import { Modals } from "./components/Modals";
import { BlogArticlePage } from "./components/BlogArticlePage";
import { WissenPage } from "./components/WissenPage";
import { ToolsPage } from "./components/ToolsPage";
import { BarcodeGeneratorPage } from "./components/BarcodeGeneratorPage";
import { ShopifyThemeDetectorPage } from "./components/ShopifyThemeDetectorPage";
import { ShopifyAppDetectorPage } from "./components/ShopifyAppDetectorPage";
import { CustomerLifetimeValueCalculatorPage } from "./components/CustomerLifetimeValueCalculatorPage";
import { ShopifyFeeCalculatorPage } from "./components/ShopifyFeeCalculatorPage";
import { RoasCalculatorPage } from "./components/RoasCalculatorPage";
import { BreakEvenRoasCalculatorPage } from "./components/BreakEvenRoasCalculatorPage";
import { ShopifyMargenrechnerPage } from "./components/ShopifyMargenrechnerPage";
import { LiquiditaetsplanungPage } from "./components/LiquiditaetsplanungPage";
import { BLOG_ARTICLES } from "./data/procwareData";
import { Calendar, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

// Blog Article Route Page
function BlogArticleView({ onOpenBooking }: { onOpenBooking: () => void }) {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const article = BLOG_ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 pt-32 pb-20">
        <h2 className="text-3xl font-black text-slate-950 mb-3">Artikel nicht gefunden</h2>
        <p className="text-slate-600 mb-8 max-w-md">
          Der angeforderte Blog-Artikel konnte nicht gefunden werden oder wurde verschoben.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-8 py-3.5 rounded-2xl bg-slate-950 text-white font-bold text-sm hover:bg-blue-600 transition-colors cursor-pointer"
        >
          Zurück zur Startseite
        </button>
      </div>
    );
  }

  return (
    <BlogArticlePage
      article={article}
      onBack={() => navigate("/wissen")}
      onSelectArticle={(newSlug) => navigate(`/wissen/${newSlug}`)}
      onOpenBooking={onOpenBooking}
    />
  );
}

// Main Landing Page Component
function LandingPage({
  onOpenBooking,
  onOpenRegister,
}: {
  onOpenBooking: () => void;
  onOpenRegister: () => void;
}) {
  const navigate = useNavigate();

  return (
    <main>
      {/* 1. Hero Section with Video Showcase */}
      <HeroSection onOpenBooking={onOpenBooking} />

      {/* 2. Value Banner - Intermediary & Quality Model */}
      <ValueBanner />

      {/* 3. Platform Features with Original Screenshots */}
      <FeaturesShowcase />

      {/* 4. Customer Video Testimonials (Direct from Procware - both visible at once) */}
      <TestimonialsSection />

      {/* 4b. Trustpilot Reviews (Verified social proof & star ratings) */}
      <TrustpilotReviewsSection />

      {/* 5. How it Works (3 Steps) */}
      <HowItWorks />

      {/* 5. Global Shipping & 50+ Countries */}
      <GlobalShipping />

      {/* 6. Services & Advantages Grid */}
      <ServicesGrid />

      {/* 7. Official Shopify Native App */}
      <ShopifyAppSection />

      {/* 8. Free E-Commerce Tools & Calculators Showcase */}
      <FeaturedToolsSection />

      {/* 9. Procware Wissen (Guides with individual URLs) */}
      <WissenSection onSelectArticle={(slug) => navigate(`/wissen/${slug}`)} />

      {/* 10. FAQ Accordion */}
      <FaqSection onOpenBooking={onOpenBooking} />

      {/* 12. Bottom Call-To-Action (Prioritizing "Termin buchen") */}
      <section className="py-20 sm:py-28 bg-slate-50 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-slate-950 text-white p-8 sm:p-14 shadow-2xl border border-slate-900 text-center">
            {/* Subtle glow decoration */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-xs font-bold text-blue-300 border border-white/10 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Jetzt risikolos starten</span>
              </span>

              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                Bereit für deinen <span className="text-blue-500">Wettbewerbsvorteil</span> im E-Commerce?
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                Verbinde deinen Shopify Store mit Procware, profitiere von geprüftem Sourcing,
                transparenten Konditionen und automatisiertem weltweiten Express-Fulfillment.
              </p>

              <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="https://calendly.com/team-procware/new-meeting"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-base font-bold px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-600/25 transition-all cursor-pointer group"
                >
                  <Calendar className="w-5 h-5 text-white" />
                  <span>Kostenloses Erstgespräch buchen</span>
                  <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

              <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-semibold uppercase tracking-wider">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>0 € bis zur 1. Bestellung</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Keine Vertragslaufzeit</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Deutsches Support-Team</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function MainApp() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-600 selection:text-white antialiased font-sans">
      <ScrollToTop />

      {/* Header Navigation */}
      <Header
        onOpenBooking={() => setIsBookingOpen(true)}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenRegister={() => setIsRegisterOpen(true)}
      />

      <Routes>
        <Route
          path="/"
          element={
            <LandingPage
              onOpenBooking={() => setIsBookingOpen(true)}
              onOpenRegister={() => setIsRegisterOpen(true)}
            />
          }
        />
        <Route
          path="/wissen"
          element={
            <WissenPage onOpenBooking={() => setIsBookingOpen(true)} />
          }
        />
        <Route
          path="/wissen/:slug"
          element={
            <BlogArticleView onOpenBooking={() => setIsBookingOpen(true)} />
          }
        />
        <Route
          path="/blog"
          element={
            <WissenPage onOpenBooking={() => setIsBookingOpen(true)} />
          }
        />
        <Route
          path="/blog/:slug"
          element={
            <BlogArticleView onOpenBooking={() => setIsBookingOpen(true)} />
          }
        />
        {/* Leistungen Subpages */}
        <Route
          path="/leistungen"
          element={
            <ServiceSubPage onOpenBooking={() => setIsBookingOpen(true)} />
          }
        />
        <Route
          path="/leistungen/:slug"
          element={
            <ServiceSubPage onOpenBooking={() => setIsBookingOpen(true)} />
          }
        />
        <Route
          path="/services/:slug"
          element={
            <ServiceSubPage onOpenBooking={() => setIsBookingOpen(true)} />
          }
        />
        <Route
          path="/tools"
          element={
            <ToolsPage onOpenBooking={() => setIsBookingOpen(true)} />
          }
        />
        <Route
          path="/barcode-generator"
          element={
            <BarcodeGeneratorPage onOpenBooking={() => setIsBookingOpen(true)} />
          }
        />
        <Route
          path="/ean-generator"
          element={
            <BarcodeGeneratorPage onOpenBooking={() => setIsBookingOpen(true)} />
          }
        />
        <Route
          path="/gtin-generator"
          element={
            <BarcodeGeneratorPage onOpenBooking={() => setIsBookingOpen(true)} />
          }
        />
        <Route
          path="/shopify-theme-detector"
          element={
            <ShopifyThemeDetectorPage onOpenBooking={() => setIsBookingOpen(true)} />
          }
        />
        <Route
          path="/theme-detector"
          element={
            <ShopifyThemeDetectorPage onOpenBooking={() => setIsBookingOpen(true)} />
          }
        />
        <Route
          path="/shopify-theme-finder"
          element={
            <ShopifyThemeDetectorPage onOpenBooking={() => setIsBookingOpen(true)} />
          }
        />
        <Route
          path="/shopify-app-detector"
          element={
            <ShopifyAppDetectorPage onOpenBooking={() => setIsBookingOpen(true)} />
          }
        />
        <Route
          path="/app-detector"
          element={
            <ShopifyAppDetectorPage onOpenBooking={() => setIsBookingOpen(true)} />
          }
        />
        <Route
          path="/shopify-app-finder"
          element={
            <ShopifyAppDetectorPage onOpenBooking={() => setIsBookingOpen(true)} />
          }
        />
        {/* 1. Customer Lifetime Value Calculator */}
        <Route
          path="/customer-lifetime-value-calculator"
          element={
            <CustomerLifetimeValueCalculatorPage onOpenBooking={() => setIsBookingOpen(true)} />
          }
        />
        <Route
          path="/clv-calculator"
          element={
            <CustomerLifetimeValueCalculatorPage onOpenBooking={() => setIsBookingOpen(true)} />
          }
        />
        <Route
          path="/clv-rechner"
          element={
            <CustomerLifetimeValueCalculatorPage onOpenBooking={() => setIsBookingOpen(true)} />
          }
        />

        {/* 2. Shopify Fee Calculator */}
        <Route
          path="/shopify-fee-calculator"
          element={
            <ShopifyFeeCalculatorPage onOpenBooking={() => setIsBookingOpen(true)} />
          }
        />
        <Route
          path="/shopify-gebuehren-rechner"
          element={
            <ShopifyFeeCalculatorPage onOpenBooking={() => setIsBookingOpen(true)} />
          }
        />
        <Route
          path="/shopify-gebuehrenrechner"
          element={
            <ShopifyFeeCalculatorPage onOpenBooking={() => setIsBookingOpen(true)} />
          }
        />

        {/* 3. ROAS Calculator */}
        <Route
          path="/roas-calculator"
          element={
            <RoasCalculatorPage onOpenBooking={() => setIsBookingOpen(true)} />
          }
        />
        <Route
          path="/roas-rechner"
          element={
            <RoasCalculatorPage onOpenBooking={() => setIsBookingOpen(true)} />
          }
        />

        {/* 4. Break Even ROAS Calculator */}
        <Route
          path="/break-even-roas-calculator"
          element={
            <BreakEvenRoasCalculatorPage onOpenBooking={() => setIsBookingOpen(true)} />
          }
        />
        <Route
          path="/break-even-roas-rechner"
          element={
            <BreakEvenRoasCalculatorPage onOpenBooking={() => setIsBookingOpen(true)} />
          }
        />

        {/* 5. Margenrechner (Shopify) */}
        <Route
          path="/shopify-margenrechner"
          element={
            <ShopifyMargenrechnerPage onOpenBooking={() => setIsBookingOpen(true)} />
          }
        />
        <Route
          path="/margenrechner-shopify"
          element={
            <ShopifyMargenrechnerPage onOpenBooking={() => setIsBookingOpen(true)} />
          }
        />
        <Route
          path="/margenrechner"
          element={
            <ShopifyMargenrechnerPage onOpenBooking={() => setIsBookingOpen(true)} />
          }
        />

        {/* 6. Liquiditätsplanung für Online Shops */}
        <Route
          path="/liquiditaetsplanung-online-shop"
          element={
            <LiquiditaetsplanungPage onOpenBooking={() => setIsBookingOpen(true)} />
          }
        />
        <Route
          path="/liquiditaetsrechner"
          element={
            <LiquiditaetsplanungPage onOpenBooking={() => setIsBookingOpen(true)} />
          }
        />
        <Route
          path="/liquiditaetsplanung"
          element={
            <LiquiditaetsplanungPage onOpenBooking={() => setIsBookingOpen(true)} />
          }
        />
        <Route
          path="/cashflow-rechner-shopify"
          element={
            <LiquiditaetsplanungPage onOpenBooking={() => setIsBookingOpen(true)} />
          }
        />

        {/* English Tool Routes */}
        <Route
          path="/en/tools"
          element={
            <ToolsPage onOpenBooking={() => setIsBookingOpen(true)} lang="en" />
          }
        />
        <Route
          path="/en/barcode-generator"
          element={
            <BarcodeGeneratorPage onOpenBooking={() => setIsBookingOpen(true)} lang="en" />
          }
        />
        <Route
          path="/en/ean-generator"
          element={
            <BarcodeGeneratorPage onOpenBooking={() => setIsBookingOpen(true)} lang="en" />
          }
        />
        <Route
          path="/en/gtin-generator"
          element={
            <BarcodeGeneratorPage onOpenBooking={() => setIsBookingOpen(true)} lang="en" />
          }
        />
        <Route
          path="/en/shopify-theme-detector"
          element={
            <ShopifyThemeDetectorPage onOpenBooking={() => setIsBookingOpen(true)} lang="en" />
          }
        />
        <Route
          path="/en/theme-detector"
          element={
            <ShopifyThemeDetectorPage onOpenBooking={() => setIsBookingOpen(true)} lang="en" />
          }
        />
        <Route
          path="/en/shopify-app-detector"
          element={
            <ShopifyAppDetectorPage onOpenBooking={() => setIsBookingOpen(true)} lang="en" />
          }
        />
        <Route
          path="/en/app-detector"
          element={
            <ShopifyAppDetectorPage onOpenBooking={() => setIsBookingOpen(true)} lang="en" />
          }
        />
        <Route
          path="/en/customer-lifetime-value-calculator"
          element={
            <CustomerLifetimeValueCalculatorPage onOpenBooking={() => setIsBookingOpen(true)} lang="en" />
          }
        />
        <Route
          path="/en/clv-calculator"
          element={
            <CustomerLifetimeValueCalculatorPage onOpenBooking={() => setIsBookingOpen(true)} lang="en" />
          }
        />
        <Route
          path="/en/shopify-fee-calculator"
          element={
            <ShopifyFeeCalculatorPage onOpenBooking={() => setIsBookingOpen(true)} lang="en" />
          }
        />
        <Route
          path="/en/roas-calculator"
          element={
            <RoasCalculatorPage onOpenBooking={() => setIsBookingOpen(true)} lang="en" />
          }
        />
        <Route
          path="/en/break-even-roas-calculator"
          element={
            <BreakEvenRoasCalculatorPage onOpenBooking={() => setIsBookingOpen(true)} lang="en" />
          }
        />
        <Route
          path="/en/shopify-margin-calculator"
          element={
            <ShopifyMargenrechnerPage onOpenBooking={() => setIsBookingOpen(true)} lang="en" />
          }
        />
        <Route
          path="/en/margin-calculator"
          element={
            <ShopifyMargenrechnerPage onOpenBooking={() => setIsBookingOpen(true)} lang="en" />
          }
        />
        <Route
          path="/en/cash-flow-planner-online-shop"
          element={
            <LiquiditaetsplanungPage onOpenBooking={() => setIsBookingOpen(true)} lang="en" />
          }
        />
        <Route
          path="/en/liquiditaetsplanung-online-shop"
          element={
            <LiquiditaetsplanungPage onOpenBooking={() => setIsBookingOpen(true)} lang="en" />
          }
        />
        <Route
          path="*"
          element={
            <LandingPage
              onOpenBooking={() => setIsBookingOpen(true)}
              onOpenRegister={() => setIsRegisterOpen(true)}
            />
          }
        />
      </Routes>

      {/* Footer */}
      <Footer
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenBooking={() => setIsBookingOpen(true)}
        onNavigateHome={() => navigate("/")}
      />

      {/* Modals & Dialogs */}
      <Modals
        isBookingOpen={isBookingOpen}
        onCloseBooking={() => setIsBookingOpen(false)}
        isLoginOpen={isLoginOpen}
        onCloseLogin={() => setIsLoginOpen(false)}
        isRegisterOpen={isRegisterOpen}
        onCloseRegister={() => setIsRegisterOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <MainApp />
    </BrowserRouter>
  );
}

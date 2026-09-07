import React, { useState } from "react";
import { Badge } from "./ui/badge";
import {
  Star,
  Play,
  CheckCircle2,
  TrendingUp,
  Clock,
  Volume2,
  Calendar,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { TESTIMONIALS } from "../data/procwareData";

export const TestimonialsSection: React.FC = () => {
  // Store which videos are currently playing independently so both can be watched
  const [playingVideos, setPlayingVideos] = useState<Record<string, boolean>>({});

  const handleStartPlay = (id: string) => {
    setPlayingVideos((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <section
      id="testimonials"
      className="py-20 sm:py-28 bg-gradient-to-b from-slate-50 via-white to-slate-50 border-t border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <Badge variant="brand" className="mb-3 font-bold">
            Kundenstimmen & Video-Erfahrungen
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
            Was erfolgreiche E-Commerce-Marken über Procware sagen
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            Echte Einblicke statt anonymer Bewertungen: Erfahre direkt von Store-Gründern und
            Shopify-Händlern, wie Procware ihr Sourcing, Qualitätsmanagement und Fulfillment skaliert hat.
          </p>
        </div>

        {/* Both Video Testimonials Side-by-Side (No switch, both visible at once) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 max-w-6xl mx-auto">
          {TESTIMONIALS.map((testimonial) => {
            const isPlaying = !!playingVideos[testimonial.id];

            return (
              <div
                key={testimonial.id}
                className="flex flex-col bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-lg shadow-slate-200/50 hover:border-slate-300 transition-all duration-300"
              >
                {/* Video Player Container */}
                <div className="relative aspect-video w-full bg-slate-950 overflow-hidden group">
                  {isPlaying && testimonial.wistiaId ? (
                    <iframe
                      src={`https://fast.wistia.net/embed/iframe/${testimonial.wistiaId}?autoplay=1&videoFoam=true`}
                      title={testimonial.headline}
                      allow="autoplay; fullscreen"
                      allowFullScreen
                      className="w-full h-full border-0"
                    />
                  ) : (
                    <div
                      onClick={() => handleStartPlay(testimonial.id)}
                      className="relative w-full h-full cursor-pointer select-none"
                    >
                      {/* Poster Image */}
                      <img
                        src={testimonial.posterUrl}
                        alt={`Video Testimonial: ${testimonial.authorName}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />

                      {/* Dark gradient overlay for contrast */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/30 group-hover:via-black/35 transition-colors" />

                      {/* Top Badges */}
                      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-bold border border-white/10">
                          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                          <span>Video-Erfahrungsbericht</span>
                        </span>
                        {testimonial.videoDuration && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-xs font-mono font-bold">
                            <Clock className="w-3.5 h-3.5 text-slate-300" />
                            <span>{testimonial.videoDuration}</span>
                          </span>
                        )}
                      </div>

                      {/* Central Play Button with Pulsing Ring */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative flex items-center justify-center">
                          <span className="absolute w-20 h-20 rounded-full bg-blue-600/30 animate-ping duration-1000" />
                          <button
                            type="button"
                            aria-label={`Video von ${testimonial.authorName} abspielen`}
                            className="relative flex items-center justify-center w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-blue-600 text-white shadow-2xl shadow-blue-600/50 group-hover:scale-110 group-hover:bg-blue-500 transition-all duration-200 cursor-pointer"
                          >
                            <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-white ml-1" />
                          </button>
                        </div>
                      </div>

                      {/* Bottom Info Bar inside Video */}
                      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white pointer-events-none">
                        <div className="text-xs font-bold text-slate-200 drop-shadow-sm flex items-center gap-1.5">
                          <Volume2 className="w-3.5 h-3.5 text-blue-400" />
                          <span>Hier klicken zum Abspielen</span>
                        </div>
                        {testimonial.orders && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-blue-300 bg-blue-950/80 px-2 py-0.5 rounded-lg border border-blue-800/60">
                            <TrendingUp className="w-3 h-3 text-blue-400" />
                            {testimonial.orders}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="p-6 sm:p-8 flex flex-col flex-1 justify-between bg-white">
                  <div>
                    {/* Stars and Verification */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1">
                        {[...Array(testimonial.rating || 5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 fill-amber-400 text-amber-400"
                          />
                        ))}
                        <span className="ml-1.5 text-xs font-black text-slate-900">
                          5.0
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Verifizierter Kunde</span>
                      </span>
                    </div>

                    {/* Testimonial Headline */}
                    <h3 className="text-lg sm:text-xl font-black text-slate-950 tracking-tight leading-snug mb-3">
                      „{testimonial.headline}“
                    </h3>

                    {/* Quote Text */}
                    <p className="text-sm text-slate-600 leading-relaxed font-normal mb-6">
                      {testimonial.quote}
                    </p>
                  </div>

                  {/* Customer Footer Card */}
                  <div className="pt-5 border-t border-slate-100 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-black text-sm">
                        {testimonial.authorName
                          ? testimonial.authorName.charAt(0)
                          : "P"}
                      </div>
                      <div>
                        <div className="text-sm font-black text-slate-950">
                          {testimonial.authorName}
                        </div>
                        <div className="text-xs text-slate-500 font-medium">
                          {testimonial.authorRole}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="inline-block px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
                        {testimonial.duration}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Trust Anchor */}
        <div className="mt-12 text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-4 sm:gap-8 px-6 py-3 rounded-2xl bg-white border border-slate-200 shadow-xs text-xs font-bold text-slate-700">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              100% verifizierte Video-Kundeninterviews
            </span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Über 30.000 monatliche Sendungen über Procware
            </span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <a
              href="https://calendly.com/team-procware/new-meeting"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 font-black flex items-center gap-1 hover:underline"
            >
              <Calendar className="w-3.5 h-3.5" />
              Jetzt unverbindlich beraten lassen
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

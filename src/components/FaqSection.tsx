import React from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { HelpCircle, ArrowRight, MessageCircle } from "lucide-react";
import { FAQS } from "../data/procwareData";

interface FaqSectionProps {
  onOpenBooking: () => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ onOpenBooking }) => {
  return (
    <section id="faq" className="py-24 bg-slate-50/70 border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Badge variant="brand" className="mb-3 font-black">
            Häufige Fragen
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tighter">
            Häufig gestellte Fragen (FAQ)
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 font-medium">
            Hier findest du Antworten auf die wichtigsten Fragen rund um Sourcing,
            Kosten, Branding und Fulfillment mit Procware.
          </p>
        </div>

        {/* Shadcn Accordion */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs">
          <Accordion type="single" collapsible defaultValue="faq-1" className="w-full">
            {FAQS.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger className="text-base sm:text-lg font-black text-slate-950 tracking-tight">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm sm:text-base leading-relaxed text-slate-600 font-normal">
                    {faq.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

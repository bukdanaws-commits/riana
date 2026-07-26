"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, MessageSquareQuote } from "lucide-react";
import { useFaqs } from "@/lib/admin-store";
import type { FAQItem } from "@/data/event";

const CATEGORIES: FAQItem["category"][] = ["Pendaftaran", "Teknis", "Hari-H", "Rekor MURI"];

export function FAQ() {
  const FAQS = useFaqs();
  const [activeCategory, setActiveCategory] = useState<FAQItem["category"] | "all">("all");

  const filtered =
    activeCategory === "all" ? FAQS : FAQS.filter((f) => f.category === activeCategory);

  return (
    <section id="faq" className="relative py-4 lg:py-6 bg-brand-tech overflow-hidden">
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-magenta/20/40 blur-3xl -z-10" />

      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-magenta/15 border border-magenta/25 mb-4">
            <HelpCircle className="h-3.5 w-3.5 text-magenta-light" />
            <span className="text-xs font-bold text-magenta-light tracking-wide uppercase">Frequently Asked</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-cream mb-3" style={{ fontFamily: "var(--font-display)" }}>
            Pertanyaan <span className="text-gradient-brand">Umum</span>
          </h2>
          <p className="text-base text-cream/70">
            Jawaban untuk pertanyaan yang paling sering ditanyakan calon peserta.
          </p>
        </motion.div>

        {/* Category filter */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
          <CategoryPill
            active={activeCategory === "all"}
            onClick={() => setActiveCategory("all")}
            label="Semua"
            count={FAQS.length}
          />
          {CATEGORIES.map((c) => (
            <CategoryPill
              key={c}
              active={activeCategory === c}
              onClick={() => setActiveCategory(c)}
              label={c}
              count={FAQS.filter((f) => f.category === c).length}
            />
          ))}
        </div>

        {/* Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          key={activeCategory}
        >
          <Accordion type="single" collapsible className="space-y-3">
            {filtered.map((faq, i) => (
              <AccordionItem
                key={`${activeCategory}-${i}`}
                value={`item-${i}`}
                className="rounded-2xl bg-purple-dark border-2 border-magenta/15 px-4 sm:px-5 shadow-sm overflow-hidden data-[state=open]:border-magenta/30 data-[state=open]:shadow-glow-pink transition-all"
              >
                <AccordionTrigger className="text-left hover:no-underline py-5 group">
                  <div className="flex items-start gap-3 pr-2">
                    <div className="flex-shrink-0 h-7 w-7 rounded-lg bg-magenta/15 group-data-[state=open]:bg-brand-gradient flex items-center justify-center transition-colors">
                      <MessageSquareQuote className="h-4 w-4 text-magenta-light group-data-[state=open]:text-white transition-colors" />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-widest font-bold text-magenta-light mb-0.5">
                        {faq.category}
                      </div>
                      <div className="font-bold text-cream text-sm sm:text-base leading-snug">
                        {faq.question}
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-sm text-cream/70 leading-relaxed pb-5 pl-10 pr-2">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        {/* Help CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-2 p-5 rounded-2xl bg-gradient-to-r from-pink-50 to-pink-50 border border-magenta/20 text-center"
        >
          <p className="text-sm text-cream/80">
            Masih ada pertanyaan? Tim kami siap membantu via WhatsApp{" "}
            <a
              href="https://wa.me/6281320999969"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-magenta-light hover:underline"
            >
              0813-2099-9969
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function CategoryPill({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all border-2 ${
        active
          ? "bg-brand-gradient text-white border-transparent shadow-glow-pink"
          : "bg-magenta text-white border-magenta hover:bg-magenta-deep"
      }`}
    >
      {label}
      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
        active ? "bg-purpleblack/40" : "bg-purpleblack"
      }`}>
        {count}
      </span>
    </button>
  );
}

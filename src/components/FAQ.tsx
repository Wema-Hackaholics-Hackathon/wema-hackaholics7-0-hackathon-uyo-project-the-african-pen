/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: "Is La Plume free to join?",
      answer: "Yes, you can register and practice core Blitz theory drills with our Trial Cohort. Advanced features require a Premium Pass."
    },
    {
      question: "When does Cohort 1 start?",
      answer: "Cohort 1 officially kicks off on Monday. Registration closes soon to preserve small learning groups."
    },
    {
      question: "What exams does La Plume prepare me for?",
      answer: "La Plume is specifically engineered for WAEC French, JAMB French, NECO French, and general conversational confidence."
    },
    {
      question: "Do I need to be fluent already to join?",
      answer: "No! We welcome absolute beginners (A1 level) as well as advanced students looking to lock down their A1 grades."
    },
    {
      question: "What if I miss a day of the bootcamp?",
      answer: "No worries! You can use 'Streak Freezes' and review recorded lessons at any time, ensuring you never fall behind."
    },
    {
      question: "Is there a certificate at the end?",
      answer: "Yes, premium users receive a beautiful, verified French Proficiency Certificate detailing their performance sub-criteria."
    },
    {
      question: "Which African countries are eligible?",
      answer: "Our platform is fully optimized for students in Nigeria, Ghana, Kenya, Sierra Leone, and Liberia."
    },
    {
      question: "How is La Plume different from past question booklets?",
      answer: "Instead of passive text, La Plume provides active gamification, immediate interactive feedback, real-time leaderboards, and native audio oral practice."
    }
  ];

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="w-full py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4">
        
        {/* Title */}
        <div className="text-center mb-12">
          <span className="bg-blue-50 text-brand-blue border border-blue-100 uppercase font-mono font-black tracking-wider text-[10px] px-3 py-1 rounded-full inline-block mb-3">FAQ</span>
          <h2 className="font-display text-3xl font-extrabold text-brand-blue tracking-tight">
            Frequently asked questions
          </h2>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={idx} 
                className="border border-slate-100 rounded-2xl bg-slate-50/30 hover:bg-slate-50 transition-all overflow-hidden"
              >
                <button
                  onClick={() => handleToggle(idx)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 font-display font-extrabold text-slate-800 text-sm md:text-base focus:outline-hidden cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-brand-blue shrink-0" />
                    {faq.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 text-xs md:text-sm text-slate-500 leading-relaxed border-t border-slate-100/50 pt-3 bg-white font-medium animate-slide-up">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

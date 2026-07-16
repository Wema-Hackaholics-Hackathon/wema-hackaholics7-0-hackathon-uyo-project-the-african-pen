/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { GraduationCap, ArrowRight, Heart, Send, MessageSquare } from "lucide-react";

interface FooterProps {
  setCurrentView: (view: string) => void;
  openSignupModal: () => void;
}

export default function Footer({ setCurrentView, openSignupModal }: FooterProps) {
  return (
    <footer className="w-full bg-brand-blue text-white pt-16 pb-8">
      
      {/* CTA Footer Banner Section */}
      <div className="max-w-4xl mx-auto px-4 text-center mb-16 border-b border-white/10 pb-16">
        <h3 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight mb-3 uppercase max-w-3xl mx-auto leading-tight">
          Your WAEC French result is decided before you enter the exam hall.
        </h3>
        <p className="text-slate-300 text-sm md:text-base mb-8 font-medium">
          The preparation starts here.
        </p>
        <button
          id="footer-cta-btn"
          onClick={openSignupModal}
          className="bg-brand-yellow hover:bg-amber-400 text-brand-blue font-black text-sm md:text-base px-8 py-4.5 rounded-2xl shadow-xl transition-all hover:scale-103 inline-flex items-center gap-2 cursor-pointer"
        >
          Join Cohort ~ Register Free 🚀
        </button>
        <p className="text-slate-400 text-[10px] md:text-xs mt-3">
          No credit card required.
        </p>
      </div>

      {/* Footer Navigation Columns */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 text-sm">
        
        {/* Col 1 */}
        <div>
          <h4 className="font-display font-bold text-brand-yellow mb-4 uppercase tracking-wider text-xs">Apprendre</h4>
          <ul className="space-y-2.5 text-slate-300">
            <li><button onClick={() => setCurrentView("quiz")} className="hover:text-white transition-all">Syllabus WAEC</button></li>
            <li><button onClick={() => setCurrentView("blitz")} className="hover:text-white transition-all">Le Blitz</button></li>
            <li><button onClick={() => setCurrentView("chat")} className="hover:text-white transition-all">AI Tutor</button></li>
            <li><button onClick={() => setCurrentView("validation")} className="hover:text-white transition-all">Vocabulaire</button></li>
          </ul>
        </div>

        {/* Col 2 */}
        <div>
          <h4 className="font-display font-bold text-brand-yellow mb-4 uppercase tracking-wider text-xs">LaPlume</h4>
          <ul className="space-y-2.5 text-slate-300">
            <li><button onClick={() => setCurrentView("landing")} className="hover:text-white transition-all">Notre Mission</button></li>
            <li><a href="#" className="hover:text-white transition-all">Blog</a></li>
            <li><a href="#" className="hover:text-white transition-all">Impact</a></li>
            <li><a href="#" className="hover:text-white transition-all">Carrières</a></li>
          </ul>
        </div>

        {/* Col 3 */}
        <div>
          <h4 className="font-display font-bold text-brand-yellow mb-4 uppercase tracking-wider text-xs">Légal</h4>
          <ul className="space-y-2.5 text-slate-300">
            <li><a href="#" className="hover:text-white transition-all">Confidentialité</a></li>
            <li><a href="#" className="hover:text-white transition-all">Conditions</a></li>
            <li><a href="#" className="hover:text-white transition-all">Remboursement</a></li>
          </ul>
        </div>

        {/* Col 4 */}
        <div>
          <h4 className="font-display font-bold text-brand-yellow mb-4 uppercase tracking-wider text-xs">Support</h4>
          <ul className="space-y-2.5 text-slate-300">
            <li><a href="#" className="hover:text-white transition-all">Centre d'aide</a></li>
            <li><a href="#" className="hover:text-white transition-all">Contact</a></li>
            <li><a href="https://wa.me/#" className="hover:text-white transition-all flex items-center gap-1.5">WhatsApp</a></li>
          </ul>
        </div>

      </div>

      {/* Brand & Credit Footer Line */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <div className="bg-white/10 p-1.5 rounded-lg text-white">
            <GraduationCap className="w-4 h-4" />
          </div>
          <span className="font-bold text-white text-sm">La Plume</span>
        </div>



        <div>
          <span>&copy; {new Date().getFullYear()} La Plume. Tous droits réservés.</span>
        </div>
      </div>

    </footer>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { GraduationCap, LogIn, ChevronDown, Sparkles, Menu, X } from "lucide-react";

interface HeaderProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  openSignupModal: () => void;
}

export default function Header({ currentView, setCurrentView, openSignupModal }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (view: string) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
  };

  const scrollLandingSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  const goToLandingAndScroll = (sectionId: string) => {
    handleNavClick("landing");
    window.setTimeout(() => scrollLandingSection(sectionId), 120);
  };

  const isPublicPage = ["landing", "signup", "login"].includes(currentView);

  const landingNavLinks = [
    { id: "nav-how-it-works", label: "How it Works", section: "how-it-works" },
    { id: "nav-pricing", label: "Pricing", section: "pricing" },
    { id: "nav-faq", label: "FAQ", section: "faq" }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs flex flex-col">
      {/* Yellow Announcement Strip */}
      <div className="w-full bg-[#FFD214] text-[#002B5B] py-1.5 px-4 text-center text-[10px] md:text-xs font-bold font-sans flex items-center justify-center gap-1">
        <span>📢 Cohorte 1 est ouverte. Places limitées. Inscrivez-vous aujourd'hui ➔</span>
      </div>

      <div className="max-w-7xl w-full mx-auto flex items-center justify-between px-4 md:px-8 py-2.5">
        {/* Brand Logo */}
        <div 
          onClick={() => handleNavClick("landing")} 
          className="flex items-center gap-2 cursor-pointer group"
          id="brand-logo"
        >
          <div className="bg-brand-blue p-1.5 md:p-2 rounded-xl text-white group-hover:bg-brand-blue-light transition-all shadow-md">
            <GraduationCap className="w-4.5 h-4.5 md:w-5.5 md:h-5.5" />
          </div>
          <div className="flex flex-col justify-center">
            <span className="font-display font-bold text-base md:text-xl tracking-tight text-brand-blue block leading-none">
              La Plume
            </span>
            <span className="text-[8px] md:text-[9px] uppercase tracking-widest font-mono text-amber-500 font-bold block mt-0.5 leading-none">
              French Prep
            </span>
          </div>
        </div>

        {/* Navigation - Centered Desktop Link Grid */}
        <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 text-xs xl:text-sm font-semibold text-slate-600 tracking-tight">
          {isPublicPage ? (
            <>
              <button
                id="nav-home"
                onClick={() => handleNavClick("landing")}
                className="px-2.5 py-1.5 xl:px-3 xl:py-2 rounded-lg transition-all hover:bg-slate-50 hover:text-brand-blue"
              >
                Accueil
              </button>
              <button
                id="nav-how-it-works"
                onClick={() => goToLandingAndScroll("how-it-works")}
                className="px-2.5 py-1.5 xl:px-3 xl:py-2 rounded-lg transition-all hover:bg-slate-50 hover:text-brand-blue"
              >
                How it Works
              </button>
              <button
                id="nav-features"
                onClick={() => goToLandingAndScroll("features")}
                className="px-2.5 py-1.5 xl:px-3 xl:py-2 rounded-lg transition-all hover:bg-slate-50 hover:text-brand-blue"
              >
                Features
              </button>
              <button
                id="nav-pricing"
                onClick={() => goToLandingAndScroll("pricing")}
                className="px-2.5 py-1.5 xl:px-3 xl:py-2 rounded-lg transition-all hover:bg-slate-50 hover:text-brand-blue"
              >
                Pricing
              </button>
              <button
                id="nav-faq"
                onClick={() => goToLandingAndScroll("faq")}
                className="px-2.5 py-1.5 xl:px-3 xl:py-2 rounded-lg transition-all hover:bg-slate-50 hover:text-brand-blue"
              >
                FAQ
              </button>
            </>
          ) : (
            <>
              <button
                id="nav-home"
                onClick={() => handleNavClick("landing")}
                className={`px-2.5 py-1.5 xl:px-3 xl:py-2 rounded-lg transition-all ${
                  currentView === "landing"
                    ? "bg-slate-50 text-brand-blue font-bold"
                    : "hover:bg-slate-50 hover:text-brand-blue"
                }`}
              >
                Accueil
              </button>
              <button
                id="nav-dashboard"
                onClick={() => handleNavClick("dashboard")}
                className={`px-2.5 py-1.5 xl:px-3 xl:py-2 rounded-lg transition-all ${
                  currentView === "dashboard"
                    ? "bg-slate-50 text-brand-blue font-bold"
                    : "hover:bg-slate-50 hover:text-brand-blue"
                }`}
              >
                Tableau de Bord
              </button>

              <button
                id="nav-parcours"
                onClick={() => handleNavClick("parcours")}
                className={`px-2.5 py-1.5 xl:px-3 xl:py-2 rounded-lg transition-all ${
                  currentView === "parcours"
                    ? "bg-slate-50 text-brand-blue font-bold"
                    : "hover:bg-slate-50 hover:text-brand-blue"
                }`}
              >
                Mon Parcours
              </button>

              <button
                id="nav-mes-cours"
                onClick={() => handleNavClick("mes-cours")}
                className={`px-2.5 py-1.5 xl:px-3 xl:py-2 rounded-lg transition-all ${
                  currentView === "mes-cours"
                    ? "bg-slate-50 text-brand-blue font-bold"
                    : "hover:bg-slate-50 hover:text-brand-blue"
                }`}
              >
                Mes Cours
              </button>

              <button
                id="nav-ranking"
                onClick={() => handleNavClick("ranking")}
                className={`px-2.5 py-1.5 xl:px-3 xl:py-2 rounded-lg transition-all ${
                  currentView === "ranking"
                    ? "bg-slate-50 text-brand-blue font-bold"
                    : "hover:bg-slate-50 hover:text-brand-blue"
                }`}
              >
                Classement
              </button>

              <button
                id="nav-quiz"
                onClick={() => handleNavClick("quiz")}
                className={`px-2.5 py-1.5 xl:px-3 xl:py-2 rounded-lg transition-all ${
                  currentView === "quiz"
                    ? "bg-slate-50 text-brand-blue font-bold"
                    : "hover:bg-slate-50 hover:text-brand-blue"
                }`}
              >
                Pratique Quiz
              </button>

              <button
                id="nav-validation"
                onClick={() => handleNavClick("validation")}
                className={`px-2.5 py-1.5 xl:px-3 xl:py-2 rounded-lg transition-all ${
                  currentView === "validation"
                    ? "bg-slate-50 text-brand-blue font-bold"
                    : "hover:bg-slate-50 hover:text-brand-blue"
                }`}
              >
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                  AI Validation
                </span>
              </button>

              <button
                id="nav-chat"
                onClick={() => handleNavClick("chat")}
                className={`px-2.5 py-1.5 xl:px-3 xl:py-2 rounded-lg transition-all ${
                  currentView === "chat"
                    ? "bg-slate-50 text-brand-blue font-bold"
                    : "hover:bg-slate-50 hover:text-brand-blue"
                }`}
              >
                Tuteur d'IA Direct
              </button>

              <button
                id="nav-plan-selection"
                onClick={() => handleNavClick("plan-selection")}
                className={`px-2.5 py-1.5 xl:px-3 xl:py-2 rounded-lg transition-all ${
                  currentView === "plan-selection"
                    ? "bg-slate-50 text-brand-blue font-bold"
                    : "hover:bg-slate-50 hover:text-brand-blue"
                }`}
              >
                Offres & Tarifs
              </button>

              <button
                id="nav-profile"
                onClick={() => handleNavClick("profile")}
                className={`px-2.5 py-1.5 xl:px-3 xl:py-2 rounded-lg transition-all ${
                  currentView === "profile"
                    ? "bg-slate-50 text-brand-blue font-bold"
                    : "hover:bg-slate-50 hover:text-brand-blue"
                }`}
              >
                Mon Profil
              </button>
            </>
          )}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 md:gap-2.5">
          <button
            id="btn-login"
            onClick={() => handleNavClick("login")}
            className="flex items-center gap-1 text-slate-700 hover:text-brand-blue font-semibold text-xs xl:text-sm px-2 py-1.5 xl:px-3 xl:py-2 rounded-lg transition-all hover:bg-slate-50"
          >
            <LogIn className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Se connecter</span>
          </button>

          <button
            id="btn-join-cohort"
            onClick={() => {
              openSignupModal();
              setMobileMenuOpen(false);
            }}
            className="bg-brand-blue hover:bg-brand-blue-light text-white text-[11px] md:text-xs xl:text-sm font-semibold px-3 py-1.5 md:px-4 md:py-2 rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            <span className="hidden xs:inline">Rejoindre cohorte 1</span>
            <span className="xs:hidden">Rejoindre</span>
          </button>

          {/* Hamburger Menu Toggle (Mobile) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-brand-blue focus:outline-hidden transition-all"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 pt-3 border-t border-slate-100 flex flex-col gap-1.5 animate-slide-down">
          {currentView === "landing" ? (
            <>
              <button
                onClick={() => handleNavClick("landing")}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all text-slate-600 hover:bg-slate-50 hover:text-brand-blue"
              >
                Home
              </button>
              <button
                onClick={() => scrollLandingSection("how-it-works")}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all text-slate-600 hover:bg-slate-50 hover:text-brand-blue"
              >
                How it Works
              </button>
              <button
                onClick={() => scrollLandingSection("features")}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all text-slate-600 hover:bg-slate-50 hover:text-brand-blue"
              >
                Features
              </button>
              <button
                onClick={() => scrollLandingSection("pricing")}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all text-slate-600 hover:bg-slate-50 hover:text-brand-blue"
              >
                Pricing
              </button>
              <button
                onClick={() => scrollLandingSection("faq")}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all text-slate-600 hover:bg-slate-50 hover:text-brand-blue"
              >
                FAQ
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleNavClick("landing")}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  currentView === "landing"
                    ? "bg-brand-blue/5 text-brand-blue"
                    : "text-slate-600 hover:bg-slate-50 hover:text-brand-blue"
                }`}
              >
                Accueil
              </button>

              <button
                onClick={() => handleNavClick("dashboard")}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  currentView === "dashboard"
                    ? "bg-brand-blue/5 text-brand-blue"
                    : "text-slate-600 hover:bg-slate-50 hover:text-brand-blue"
                }`}
              >
                Tableau de Bord
              </button>

              <button
                onClick={() => handleNavClick("parcours")}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  currentView === "parcours"
                    ? "bg-brand-blue/5 text-brand-blue"
                    : "text-slate-600 hover:bg-slate-50 hover:text-brand-blue"
                }`}
              >
                Mon Parcours
              </button>

              <button
                onClick={() => handleNavClick("mes-cours")}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  currentView === "mes-cours"
                    ? "bg-brand-blue/5 text-brand-blue"
                    : "text-slate-600 hover:bg-slate-50 hover:text-brand-blue"
                }`}
              >
                Mes Cours
              </button>

              <button
                onClick={() => handleNavClick("ranking")}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  currentView === "ranking"
                    ? "bg-brand-blue/5 text-brand-blue"
                    : "text-slate-600 hover:bg-slate-50 hover:text-brand-blue"
                }`}
              >
                Classement
              </button>

              <button
                onClick={() => handleNavClick("quiz")}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  currentView === "quiz"
                    ? "bg-brand-blue/5 text-brand-blue"
                    : "text-slate-600 hover:bg-slate-50 hover:text-brand-blue"
                }`}
              >
                Pratique Quiz
              </button>

              <button
                onClick={() => handleNavClick("validation")}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  currentView === "validation"
                    ? "bg-brand-blue/5 text-brand-blue"
                    : "text-slate-600 hover:bg-slate-50 hover:text-brand-blue"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  AI Validation
                </span>
              </button>

              <button
                onClick={() => handleNavClick("chat")}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  currentView === "chat"
                    ? "bg-brand-blue/5 text-brand-blue"
                    : "text-slate-600 hover:bg-slate-50 hover:text-brand-blue"
                }`}
              >
                Tuteur d'IA Direct
              </button>

              <button
                onClick={() => handleNavClick("plan-selection")}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  currentView === "plan-selection"
                    ? "bg-brand-blue/5 text-brand-blue"
                    : "text-slate-600 hover:bg-slate-50 hover:text-brand-blue"
                }`}
              >
                Offres & Tarifs
              </button>

              <button
                onClick={() => handleNavClick("profile")}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  currentView === "profile"
                    ? "bg-brand-blue/5 text-brand-blue"
                    : "text-slate-600 hover:bg-slate-50 hover:text-brand-blue"
                }`}
              >
                Mon Profil
              </button>
            </>
          )}

          {/* Mobile direct login link */}
          <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-100">
            <button
              onClick={() => handleNavClick("login")}
              className="w-full text-center py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 transition-all"
            >
              Se connecter
            </button>
            <button
              onClick={() => {
                openSignupModal();
                setMobileMenuOpen(false);
              }}
              className="w-full text-center py-2.5 rounded-xl text-xs font-bold text-white bg-brand-blue hover:bg-brand-blue-light transition-all shadow-xs"
            >
              Rejoindre
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
